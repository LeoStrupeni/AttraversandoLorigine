<?php

namespace App\Http\Controllers;

use App\Models\Balance_Opening;
use App\Models\Budget;
use App\Models\Budget_item;
use App\Models\Budgets_Types;
use App\Models\Client;
use App\Models\Service;
use App\Models\ServicePackage;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Dompdf\Options;
use Spatie\LaravelPdf\Enums\Format;

class BudgetController extends Controller
{
    public function index()
    {   
        if(Auth::check()){
            $val = $this->getloginrol();
            if ($val == false){
                return redirect()->route('logout');     
            }
            return view("budget");
        }
        return redirect()->route('login');
    }

    public function getDataTable(Request $request)
    {        
        $roluser = Session::get('user')['roles'][0];
        $permissions = Session::get('user')['permissions']['budgets'];

        $order = $request->order;
        $page = $request->page ?? 1;
        $limit = $request->limit ?? 10;
        $search = $request->search;

        $totales = Budget::count();

        $query = "SELECT C.*,
            DATE_FORMAT(C.fecha, '%d/%m/%Y') AS fecha_format, 
            CONCAT(CL.first_name, ' ', CL.last_names) AS client_name,
            U.name AS user_name,
            CONCAT('Presupuesto Nro. ', C.id, ' - Fecha: ', DATE_FORMAT(C.fecha, '%d/%m/%Y')) as budget_name
            FROM budgets C
            JOIN users U ON C.user_id = U.id
            JOIN clients CL ON C.client_id = CL.id
            WHERE ISNULL(C.deleted_at) ";

        if ($search != '' && isset($search)) {
            $query .= " AND (CONCAT(CL.first_name, ' ', CL.last_names) LIKE '%$search%' 
                OR U.name LIKE '%$search%'
                OR DATE_FORMAT(C.fecha, '%d/%m/%Y') LIKE '%$search%'
                OR C.id LIKE '%$search%'
                OR C.fecha LIKE '%$search%'
                OR C.estatus LIKE '%$search%'
                OR C.total_pesos LIKE '%$search%'
                OR C.total_dollars LIKE '%$search%'
                OR C.total_jus LIKE '%$search%'
                OR C.estatus LIKE '%$search%' ) ";
        }

        $filtrados = DB::select($query);

        $querylist = '';
        if ($order) {
            $querylist .= " ORDER BY $order ";
        } else {
            $querylist .= " ORDER BY C.id DESC ";
        }
        if ($limit) {
            $querylist .= " LIMIT " . $limit;
        }
        if ($page) {
            $querylist .= " OFFSET " . ($limit * $page - $limit);
        }

        $lista = DB::select($query . $querylist);

        $respuesta['totales'] = $totales;
        $respuesta['filtrados'] = count($filtrados);
        $respuesta['paginastotal'] = ceil(count($filtrados) / $limit);
        $respuesta['datos'] = $lista;

        if ($limit * $page > count($filtrados)) {
            $respuesta['infototal'] = 'Mostrando registros del ' . ($limit * $page - $limit + 1) . ' al ' . count($filtrados) . ' de un total de ' . count($filtrados);
        } else {
            $respuesta['infototal'] = 'Mostrando registros del ' . ($limit * $page - $limit + 1) . ' al ' . ($limit * $page) . ' de un total de ' . count($filtrados);
        }

        $respuesta['query'] = $query.$querylist;
        $respuesta['roluser'] = $roluser;
        $respuesta['permissions'] = $permissions;

        return $respuesta;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if(Auth::check()){
            $val = $this->getloginrol();
            if ($val == false){
                return redirect()->route('logout');     
            }
            $services = Service::all();
            $packages = ServicePackage::all();
            $modelsBudget = Budgets_Types::all();
            $cotizacion= json_decode(file_get_contents("https://dolarapi.com/v1/dolares/blue"), true)['venta'];
            $jus = Balance_Opening::where('type_money', 'jus')->where('status','activo')->where('type','cotizacion')->orderBy('id', 'desc')->first()->price;
            return view("budget.create", compact("services", "packages", "modelsBudget",'cotizacion','jus'));
        }
        return redirect()->route('login');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
                'client_id' => ['required'],
                'fecha' => ['required'],
                'valid' => ['required'],
            ],
            [
                'fecha.required' => 'La fecha es requerida.',
                'client_id.required' => 'El cliente es requerido.',
                'valid.required' => 'La validez es requerida.',
            ]
        );
    
        $id = Budget::insertGetId([
            'client_id' => $request->client_id,
            'user_id' => Auth::user()->id,
            'fecha' => date('Y-m-d', strtotime($request->fecha)),
            'valid' => $request->valid,
            'total_pesos' => str_replace(',', '.', str_replace('.', '', $request->subtotal_p)),
            'total_dollars' => str_replace(',', '.', str_replace('.', '', $request->subtotal_u)),
            'total_jus' => str_replace(',', '.', str_replace('.', '', $request->subtotal_j)),
            'estatus' => 'abierto',
            'observations' => $request->observations,
            'includes' => $request->includes,
            'not_includes' => $request->not_includes,
            'payment_methods' => $request->payment_methods,
            'clarifications' => $request->clarifications,
            'created_at' => Carbon::now(),
        ]);

        $servicios = json_decode($request->servicios, true);

        foreach ($servicios as $servicio) {
            Budget_item::create([
                'budget_id' => $id,
                'service_id' => $servicio['id'],
                'fecha' => Carbon::now(),
                'type_money' => $servicio['currency'],
                'price' => str_replace(',', '.', str_replace('.', '', $servicio['price'])),
                'name' => $servicio['name'],
                'description' => $servicio['descripcion'],
                'position' => $servicio['posicion'],
                'created_at' => Carbon::now(),
            ]);
        }

        return redirect()->route('budget.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $budget = Budget::join('clients', 'budgets.client_id', '=', 'clients.id')
            ->join('users', 'budgets.user_id', '=', 'users.id')
            ->where('budgets.id', $id)
            ->selectRaw("budgets.*, DATE_FORMAT(budgets.fecha, '%m/%d/%Y') as fecha_format, CONCAT(clients.first_name, ' ', clients.last_names) as client_name, users.name as user_name")
            ->first();
        $budget_items = Budget_item::join('services', 'budget_items.service_id', '=', 'services.id')
            ->where('budget_id', $id)
            ->select('budget_items.*', 'services.name as service_name')
            ->get();

        $cotizacion= json_decode(file_get_contents("https://dolarapi.com/v1/dolares/blue"), true)['venta'];
        $jus = Balance_Opening::where('type_money', 'jus')->where('status','activo')->where('type','cotizacion')->orderBy('id', 'desc')->first()->price;
        $compact = compact("budget", "budget_items", 'cotizacion', 'jus');
        return $compact;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if(Auth::check()){
            $val = $this->getloginrol();
            if ($val == false){
                return redirect()->route('logout');     
            }
            $services = Service::all();
            $packages = ServicePackage::all();

            $budget = Budget::join('clients', 'budgets.client_id', '=', 'clients.id')
                ->join('users', 'budgets.user_id', '=', 'users.id')
                ->where('budgets.id', $id)
                ->selectRaw("budgets.*, DATE_FORMAT(budgets.fecha, '%m/%d/%Y') as fecha_format, CONCAT(clients.first_name, ' ', clients.last_names) as client_name, users.name as user_name")
                ->first();
            $budget_items = Budget_item::join('services', 'budget_items.service_id', '=', 'services.id')
                ->where('budget_id', $id)
                ->select('budget_items.*', 'services.name as service_name')
                ->get();

            $cotizacion= json_decode(file_get_contents("https://dolarapi.com/v1/dolares/blue"), true)['venta'];

            return view("budget.edit", compact("services", "packages", "budget", "budget_items", 'cotizacion'));
        }
        return redirect()->route('login');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {   // dd($request->all());
        $request->validate([
                'client_id' => ['required'],
                'fecha' => ['required'],
                'valid' => ['required'],
            ],
            [
                'fecha.required' => 'La fecha es requerida.',
                'client_id.required' => 'El cliente es requerido.',
                'valid.required' => 'La validez es requerida.',
            ]
        );
    
        Budget::find($id)->update([
            'client_id' => $request->client_id,
            'fecha' => date('Y-m-d', strtotime($request->fecha)),
            'valid' => $request->valid,
            'total_pesos' => str_replace(',', '.', str_replace('.', '', $request->subtotal_p)),
            'total_dollars' => str_replace(',', '.', str_replace('.', '', $request->subtotal_u)),
            'total_jus' => str_replace(',', '.', str_replace('.', '', $request->subtotal_j)),
            'observations' => $request->observations,
            'includes' => $request->includes,
            'not_includes' => $request->not_includes,
            'payment_methods' => $request->payment_methods,
            'clarifications' => $request->clarifications,
            'updated_at' => Carbon::now(),
        ]);

        $servicios = json_decode($request->servicios, true);

        $itemsexist = array();
        foreach ($servicios as $servicio) {
            if($servicio["id_base"] !=0 ){array_push($itemsexist, $servicio["id_base"]);}            
        }
        Budget_item::where('budget_id', $id)->whereNotIn('id', $itemsexist)->delete();

        foreach ($servicios as $servicio) {
            if($servicio["id_base"] ==0 ){
                Budget_item::create([
                    'budget_id' => $id,
                    'service_id' => $servicio['id'],
                    'fecha' => Carbon::now(),
                    'type_money' => $servicio['currency'],
                    'price' => str_replace(',', '.', str_replace('.', '', $servicio['price'])),
                    'name' => $servicio['name'],
                    'description' => $servicio['descripcion'],
                    'position' => $servicio['posicion'],
                    'created_at' => Carbon::now(),
                ]);
            } else {
                
                Budget_item::find($servicio["id_base"])->update([
                    'service_id' => $servicio['id'],
                    'type_money' => $servicio['currency'],
                    'price' => str_replace(',', '.', str_replace('.', '', $servicio['price'])),
                    'name' => $servicio['name'],
                    'description' => $servicio['descripcion'],
                    'position' => $servicio['posicion'],
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
        return redirect()->route('budget.index');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Budget::find($id)->update([
            'deleted_at' => Carbon::now()
        ]);

        return redirect()->route('budget.index');
    }

    public function getDataCliente($id)
    {
        $budgets = Budget::where([
            ['client_id',$id],
            ['estatus','abierto']
        ])
        ->selectRaw("id, CONCAT('Presupuesto Nro. ', id, ' - Fecha: ', DATE_FORMAT(fecha, '%d/%m/%Y')) as name, observations, total_pesos, total_dollars, total_jus")
        ->get();

        return $budgets;
    }

    public function getPdf($id)
    {
        $path = base_path('../public_html/assets/media/originales/Original_lignos_seguro.png');
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        $logobase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

        $path = base_path('../public_html/assets/media/originales/Original_lignos_seguro_pie.png');
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        $logopie64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

        $budget = Budget::find($id);
        $client = Client::find($budget->client_id);
        $budget_items = Budget_item::where('budget_id', $id)->get();

        // $options = new Options();
        // $options->setIsRemoteEnabled(true);

        return PDF::loadView('budget.pdf', ['budget' => $budget, 'client' => $client, 'budget_items' => $budget_items , 'logo' => $logobase64, 'logopie' => $logopie64])->setPaper('a4')->setOptions(['margin-bottom' => 0,'margin-top' => 0,'margin-left' => 0,'margin-right' => 0])->stream();
    }

    public function getPdf2($id)
    {
        $path = base_path('../public_html/assets/media/originales/Original_lignos_seguro.png');
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        $logobase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

        $path = base_path('../public_html/assets/media/originales/Original_lignos_seguro_pie.png');
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        $logopie64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

        $budget = Budget::find($id);
        $client = Client::find($budget->client_id);
        $budget_items = Budget_item::where('budget_id', $id)->get();

        return view('budget.pdf', ['budget' => $budget, 'client' => $client, 'budget_items' => $budget_items, 'logo' => $logobase64, 'logopie' => $logopie64]);
    }
}
