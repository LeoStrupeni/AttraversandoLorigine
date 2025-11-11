@extends('layout')

@section('link_by_page')
@endsection
@section('style_by_page')
<style>
    .cke_top {
        display: none !important;
    }
</style>
@endsection

@section('Content')
    <div class="container-fluid">
        <div class="row justify-content-center my-4">
            <div class="col-12 col-lg-10 bg-white rounded p-2">
                <div class="row align-items-center  justify-content-between">
                    <div class="col">
                        <h5 class="navbar-brand ps-2">Modelos de Presupuestos</h5>
                    </div>
                    <div class="col ps-0">
                        <button type="button" class="btn btn-type1 float-end ms-1 ¡" onclick="callregister('/budget_type/table',1,$('#table_limit').val(),$('#table_order').val(),'si')"><i class="fa-solid fa-arrows-rotate"></i></button>
                        @if (in_array('create',Session::get('user')['permissions']['budgets']))
                            <button type="button" class="btn btn-type1 float-end create"><i class="fa-solid fa-plus"></i></button>
                        @endif
                    </div>
                </div>
                
                <hr class="m-1" style="color: black;">

                @include('Layout.errors')
                @include('Layout.tables.filters')
                <div class="table-responsive">
                    <table class="table table-sm table-hover table-bordered text-center sortable" id="table">
                        <thead class="table-type1">
                            <tr>
                                <th class="column_orden" data-name="id">#</th>
                                <th class="column_orden" data-name="name">Nombre</th>
                                <th class="column_orden" data-name="user_name">Usuario</th>
                                <th class="column_orden" data-name="total_pesos">Total $</th>
                                <th class="column_orden" data-name="total_dollars">Total U$S</th>
                                <th class="column_orden" data-name="total_jus">Total JUS</th>
                                <th class="sorttable_nosort" style="width:3%;"></th>
                            </tr>
                        </thead>
                        <tbody id="table_body" class="table-group-divider">

                        </tbody>
                    </table>
                    @include('Layout.tables.roller')
                </div>
                @include('Layout.tables.small')
                @include('Layout.tables.info')
            </div>
        </div>
    </div>
    
    @include('budget_type.show')
    @include('destroyforms')
@endsection

@section('script_by_page')
    <script src="{{env('APP_URL')}}/assets/plugins/ckeditor_4.22.1_standard/ckeditor/ckeditor.js"></script>
    <script src="{{env('APP_URL')}}/assets/js/local/budget_type.js"></script>
    <script> var servicios_agregados = {}; var posicion = 0;</script>
@endsection



