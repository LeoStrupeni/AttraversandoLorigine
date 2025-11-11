@extends('layout')

@section('link_by_page')
@endsection
@section('style_by_page')

<style>
    .cke_top {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
    }
    .cke_toolgroup{
        margin-bottom: 0 !important;
    }

</style>
@endsection

@section('Content')
    <div class="container-fluid">
        <div class="row justify-content-center my-4">
            <div class="col-12 col-lg-11 bg-white rounded p-2">
                <div class="row align-items-center  justify-content-between">
                    <div class="col-6">
                        <div class="navbar-brand ps-3 fs-5">Nuevo Modelo de Presupuesto</div>
                    </div>
                    <div class="col-5">
                        
                    </div>
                </div>
                
                <hr class="m-1" style="color: black;">

                @include('Layout.errors')

                <form action="/budget_type" method="POST" id="formnewbudget_type">
                    @csrf
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-2">
                                <label for="name" class="form-label mb-0 ps-3 fw-bold">Nombre</label>
                                <input type="text" class="form-control form-control-sm validate" name="name" id="nameC" required>
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="observations" class="form-label mb-0 ps-3 fw-bold">Observaciones</label>
                                <textarea class="form-control form-control-sm" name="observations" rows="2"></textarea>
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="payment_methods" class="form-label mb-0 ps-3 fw-bold">Formas de pago</label>
                                <textarea class="form-control form-control-sm" name="payment_methods" rows="1">Se abona el 50% del tramite al inicio y el 50% restante al finalizar las traducciones de los documentos.</textarea>
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="includes" class="form-label mb-0 ps-3 fw-bold">Incluye</label>
                                <textarea class="form-control form-control-sm" name="includes" rows="2">Solicitud de actas argentinas con sus legalizaciones y apostadillas.<br>Honorarios traducciones necesarias.<br>Honorarios profesionales.</textarea>
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="not_includes" class="form-label mb-0 ps-3 fw-bold">No incluye</label>
                                <textarea class="form-control form-control-sm" name="not_includes" rows="3">Tasas y sellados consulares.<br>Actualizacion y pedido de documentacion internaciones en caso de corresponder.<br>Rectificaciones administrativas o judiciales en caso de corresponder.</textarea>
                            </div>
                        </div>
                        
                        <div class="col-12" >
                            <div class="mb-2">
                                <label for="clarifications" class="form-label mb-0 ps-3 fw-bold">Aclaraciones</label>
                                <textarea class="form-control form-control-sm" name="clarifications" rows="5">Las carpetas se entregan con una vigencia menor a los 6 meses en caso de trámites para ser presentados en comune italiano, debiendo el cliente informar la fecha de viaje a Italia para poder cumplir con los plazos exigidos para su presentación.<br>El presente presupuesto no es vinculante para las partes, pudiendo variar su valor pasados los días de validez del mismo.<br>Salvo gastos extraordinarios que surjan con posterioridad a su aceptación, el presupuesto quedará fijado con el contrato de servicio a firmarse entre las partes en caso de contratación.</textarea>
                            </div>
                        </div>
                        
                        <div class="col m-3">
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li class="nav-item me-3" role="presentation">
                                    <button class="btn btn-type1" id="pills-paquete-tab" data-bs-toggle="pill" data-bs-target="#pills-paquete" type="button" role="tab" aria-controls="pills-paquete" aria-selected="false">
                                        <i class="fas fa-plus"></i> Paquete
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="btn btn-type1" id="pills-servicio-tab" data-bs-toggle="pill" data-bs-target="#pills-servicio" type="button" role="tab" aria-controls="pills-servicio" aria-selected="false">
                                        <i class="fas fa-plus"></i> Servicio
                                    </button>
                                </li>
                            </ul>
                            <div class="tab-content" id="pills-tabContent">
                                <div class="tab-pane fade" id="pills-paquete" role="tabpanel" aria-labelledby="pills-paquete-tab" tabindex="0">
                                    <div class="row border rounded p-2 mb-3">
                                        <div class="col-12 col-md-6">
                                            <div class="">
                                                <label for="paquetes" class="form-label mb-0 ps-3 fw-bold">Paquete</label>
                                                <select class="form-select form-select-sm" id="paquetes" onchange="getPaqueteDetails(this)"> 
                                                    <option value="" selected class="select-empty" style="color: #aaa;">Seleccione una opcion ...</option>
                                                    @foreach($packages as $package)
                                                        <option value="{{ $package->id }}">{{ $package->name }}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <div class="">
                                                <label for="paquetes-description" class="form-label mb-0 ps-3 fw-bold">
                                                    Descripcion
                                                    <span class="d-none spinner-description">
                                                        <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                                                    </span>
                                                </label>
                                                <div class="input-group mb-3">
                                                    <input type="text" readonly class="form-control form-control-sm" id="paquetes-description">
                                                    <button class="btn btn-type1 p-1" type="button" onclick="addPackagesTable()">
                                                        <i class="fas fa-plus"></i>
                                                    </button>
                                                </div>  
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="pills-servicio" role="tabpanel" aria-labelledby="pills-servicio-tab" tabindex="0">
                                    <div class="row border rounded p-2 mb-3">
                                        <div class="col-12 col-md-3">
                                            <div class="">
                                                <label for="services" class="form-label mb-0 ps-3 fw-bold">Servicio</label>
                                                <select class="form-select form-select-sm" id="services" onchange="getServiceDetails(this)"> 
                                                    <option value="" selected class="select-empty" style="color: #aaa;">Seleccione una opcion ...</option>
                                                    @foreach($services as $service)
                                                        <option value="{{ $service->id }}">{{ $service->name }}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-5">
                                            <div class="">
                                                <label for="services-description" class="form-label mb-0 ps-3 fw-bold">
                                                    Descripcion
                                                    <span class="d-none spinner-description">
                                                        <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                                                    </span>
                                                </label>
                                                <input type="text" class="form-control form-control-sm" id="services-description">
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-2 text-center">
                                            <div class="">
                                                <label for="services-currency" class="form-label mb-0 fw-bold">
                                                    Moneda
                                                </label>
                                                <select class="form-select form-select-sm" id="services-currency"> 
                                                    <option value="" selected class="select-empty" style="color: #aaa;">Seleccione una opcion ...</option>
                                                    <option value="peso">Pesos</option>
                                                    <option value="dolar">Dólar</option>
                                                    <option value="jus">JUS</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-2 text-center">
                                            <div class="">
                                                <label for="services-price" class="form-label mb-0 fw-bold">
                                                    Precio
                                                </label>
                                                <div class="input-group mb-3">
                                                    <input type="text" class="form-control form-control-sm text-end" id="services-price">
                                                    <button class="btn btn-type1 p-1" type="button" onclick="addServiceTable()">
                                                        <i class="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-sm table-hover align-middle text-center" id="table-services">
                                    <thead class="table-dark">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Servicio</th>
                                            <th scope="col">Descripcion</th>
                                            <th scope="col">Moneda</th>
                                            <th scope="col" style="width: 20%!important;">Precio</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="services-table-tbody">
                                    </tbody>
                                </table>
                            </div>
                        </div>                        
                    </div>
                    <input type="hidden" name="servicios" id="servicios_agregados" class="validate" value="{}">

                    <div class="row ">
                        <div class="col-12 mt-5">
                            <div class="row col-12 col-md-4 offset-md-8 mb-2">
                                <label class="col-4 col-form-label text-end text-nowrap">Sub-Total</label>
                                <div class="col-8">
                                    <div class="input-group">
                                        <span class="input-group-text" style="width: 56px!important;justify-content: center">$</span>
                                        <input type="text" name="subtotal_p" id="subtotal_p" class="form-control form-control-sm text-end" readonly style="background-color: #f7f8fa;border-color: rgb(226, 229, 236);">
                                    </div>
                                </div>
                            </div>
                            <div class="row col-12 col-md-8 offset-md-4 mb-2">
                                <label class="col-4 col-md-2 order-3 order-md-1 col-form-label text-end text-nowrap">Cotizacion</label>
                                <div class="col-8 col-md-4 order-4 order-md-2 ">
                                    <div class="input-group">
                                        <span class="input-group-text" style="width: 56px!important;justify-content: center">U$S</span>
                                        <input type="text" name="cotizacion_u" id="cotizacion_u" class="form-control form-control-sm text-end" onchange="subtotales();">
                                    </div>
                                </div>

                                <label class="col-4 col-md-2 order-1 order-md-3 col-form-label text-end text-nowrap">Sub-Total</label>
                                <div class="col-8 col-md-4 order-2 order-md-4">
                                    <div class="input-group">
                                        <span class="input-group-text" style="width: 56px!important;justify-content: center">U$S</span>
                                        <input type="text" name="subtotal_u" id="subtotal_u" class="form-control form-control-sm text-end" readonly style="background-color: #f7f8fa;border-color: rgb(226, 229, 236);">
                                    </div>
                                </div>
                            </div>

                            <div class="row col-12 col-md-8 offset-md-4 mb-2">
                                <label class="col-4 col-md-2 order-3 order-md-1 col-form-label text-end text-nowrap">Cotizacion</label>
                                <div class="col-8 col-md-4 order-4 order-md-2 ">
                                    <div class="input-group">
                                        <span class="input-group-text" style="width: 56px!important;justify-content: center">JUS</span>
                                        <input type="text" name="cotizacion_j" id="cotizacion_j" class="form-control form-control-sm text-end" value="{{number_format('103337.61', 2, ',', '.')}}" onchange="subtotales();">
                                    </div>
                                </div>

                                <label class="col-4 col-md-2 order-1 order-md-3 col-form-label text-end text-nowrap">Sub-Total</label>
                                <div class="col-8 col-md-4 order-2 order-md-4">
                                    <div class="input-group">
                                        <div class="input-group">
                                            <span class="input-group-text" style="width: 56px!important;justify-content: center">JUS</span>
                                            <input type="text" name="subtotal_j" id="subtotal_j" class="form-control form-control-sm text-end" readonly style="background-color: #f7f8fa;border-color: rgb(226, 229, 236);">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row col-12 col-md-4 offset-md-8 mb-2">
                                <label class="col-4 col-form-label text-end text-nowrap">Total</label>
                                <div class="col-8">
                                    <div class="input-group">
                                        <span class="input-group-text" style="width: 56px!important;justify-content: center">$</span>
                                        <input type="text" name="total_p" id="total_p" class="form-control form-control-sm text-end" readonly style="background-color: #f7f8fa;border-color: rgb(226, 229, 236);">
                                    </div>
                                </div>
                            </div>

                            <div class="row col-12 col-md-4 offset-md-8 mb-2">
                                <label class="col-4 col-form-label text-end text-nowrap">Total</label>
                                <div class="col-8">
                                    <div class="input-group">
                                        <span class="input-group-text" style="width: 56px!important;justify-content: center">U$S</span>
                                        <input type="text" name="total_s" id="total_u" class="form-control form-control-sm text-end" readonly style="background-color: #f7f8fa;border-color: rgb(226, 229, 236);">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row col-12 col-md-4 offset-md-8 mb-2">
                                <div class="col-8 offset-4">
                                    <button style="margin-top: 1rem; margin-bottom: 1rem;" class="btn btn-type1 w-100" id="btn-save-budget_type" type="button">
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                
            </div>
        </div>
    </div>
    
@endsection

@section('script_by_page')
    <script src="{{env('APP_URL')}}/assets/plugins/ckeditor_4.22.1_standard/ckeditor/ckeditor.js"></script>
    <script src="{{env('APP_URL')}}/assets/js/local/budget_type.js"></script>
    <script>
        var servicios_agregados = {}
        var posicion = 0;
        
        $(document).ready(function() {
            form = document.getElementById("formnewbudget_type");
            $( form.elements ).each(function( index ) {
                if(this.nodeName === "TEXTAREA") {
                    CKEDITOR.replace(this,{
                        language: 'es',
                        height: 80,
                    });
                }
            });

            $('#services, #paquetes').select2( {
                theme: "bootstrap-5",
                width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
                placeholder: 'Seleccione una opcion',
                language: 'es',
                dropdownCssClass: "no_ejecutar"
            } );
            
        });

    </script>
@endsection
