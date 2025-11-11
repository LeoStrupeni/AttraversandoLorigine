<?php

namespace App\Http\Controllers;

use App\Models\Balance_Opening;
use App\Models\Budgets_Types;
use App\Models\Budgets_Types_items;
use App\Models\Service;
use App\Models\ServicePackage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class BudgetTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if(Auth::check()){
            $val = $this->getloginrol();
            if ($val == false){
                return redirect()->route('logout');     
            }
            return view("budget_types");
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

        $totales = Budgets_Types::count();

        $query = "SELECT C.*,
            U.name AS user_name
            FROM budgets_types C
            JOIN users U ON C.user_id = U.id
            WHERE ISNULL(C.deleted_at) ";

        if ($search != '' && isset($search)) {
            $query .= " AND (C.name LIKE '%$search%'
                OR U.name LIKE '%$search%'
                OR DATE_FORMAT(C.fecha, '%d/%m/%Y') LIKE '%$search%'
                OR C.id LIKE '%$search%'
                OR C.total_pesos LIKE '%$search%'
                OR C.total_dollars LIKE '%$search%'
                OR C.total_jus LIKE '%$search%' ) ";
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
            return view("budget_type.create", compact("services", "packages"));
        }
        return redirect()->route('login');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
                'name' => ['required'],
            ],
            [
                'name.required' => 'El Nombre es requerido.',
            ]
        );
    
        $id = Budgets_Types::insertGetId([
            'name' => $request->name,
            'user_id' => Auth::user()->id,
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
            Budgets_Types_items::create([
                'budgets_types_id' => $id,
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

        return redirect()->route('budget_type.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $budget_type = Budgets_Types::join('users', 'budgets_types.user_id', '=', 'users.id')
                ->where('budgets_types.id', $id)
                ->selectRaw("budgets_types.*, users.name as user_name")
                ->first();
        $budget_type_items = Budgets_Types_items::join('services', 'budgets_types_items.service_id', '=', 'services.id')
                ->where('budgets_types_id', $id)
                ->select('budgets_types_items.*', 'services.name as service_name')
                ->get();

        $cotizacion= json_decode(file_get_contents("https://dolarapi.com/v1/dolares/blue"), true)['venta'];
        $jus = Balance_Opening::where('type_money', 'jus')->where('status','activo')->where('type','cotizacion')->orderBy('id', 'desc')->first()->price;
        $compact = compact("budget_type", "budget_type_items", 'cotizacion', 'jus');
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

            $budget_type = Budgets_Types::join('users', 'budgets_types.user_id', '=', 'users.id')
                ->where('budgets_types.id', $id)
                ->selectRaw("budgets_types.*, users.name as user_name")
                ->first();
            $budget_type_items = Budgets_Types_items::join('services', 'budgets_types_items.service_id', '=', 'services.id')
                ->where('budgets_types_id', $id)
                ->select('budgets_types_items.*', 'services.name as service_name')
                ->get();

            $cotizacion= json_decode(file_get_contents("https://dolarapi.com/v1/dolares/blue"), true)['venta'];

            return view("budget_type.edit", compact("services", "packages", "budget_type", "budget_type_items", 'cotizacion'));
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
                'name' => ['required']
            ],
            [
                'name.required' => 'El nombre es requerido.',
            ]
        );
    
        Budgets_Types::find($id)->update([
            'name' => $request->name,
            'total_pesos' => str_replace(',', '.', str_replace('.', '', $request->subtotal_p)),
            'total_dollars' => str_replace(',', '.', str_replace('.', '', $request->subtotal_u)),
            'total_jus' => str_replace(',', '.', str_replace('.', '', $request->subtotal_j)),
            'observations' => $request->observations,
            'includes' => $request->includes,
            'not_includes' => $request->not_includes,
            'payment_methods' => $request->payment_methods,
            'clarifications' => $request->clarifications,
            'updated_at' => Carbon::now()
        ]);

        $servicios = json_decode($request->servicios, true);

        $itemsexist = array();
        foreach ($servicios as $servicio) {
            if($servicio["id_base"] !=0 ){array_push($itemsexist, $servicio["id_base"]);}            
        }
        Budgets_Types_items::where('budgets_types_id', $id)->whereNotIn('id', $itemsexist)->delete();

        foreach ($servicios as $servicio) {
            if($servicio["id_base"] ==0 ){
                Budgets_Types_items::create([
                    'budgets_types_id' => $id,
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

                Budgets_Types_items::find($servicio["id_base"])->update([
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
        return redirect()->route('budget_type.index');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Budgets_Types::find($id)->update([
            'deleted_at' => Carbon::now()
        ]);

        return redirect()->route('budget_type.index');
    }
}
