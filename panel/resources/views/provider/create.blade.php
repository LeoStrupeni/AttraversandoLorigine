<div class="modal fade" id="createprovider" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true" >
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Nuevo Proveedor</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form action="" method="POST" id="formnewprovider">
                    @csrf
                    <div class="mb-2">
                        <label for="first_name" class="form-label mb-0 ps-3 fw-bold">Nombre / Razon Social</label>
                        <input type="text" class="form-control validate" name="first_name" id="first_name" placeholder="" required value="{{ old('first_name') }}">
                    </div>
                    <div class="mb-2">
                        <label for="last_names" class="form-label mb-0 ps-3 fw-bold">Apellido</label>
                        <input type="text" class="form-control" name="last_names" id="last_names" placeholder="" value="{{ old('last_names') }}">
                    </div>
                    <div class="row">
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="type_doc" class="form-label mb-0 ps-3 fw-bold">Tipo Doc</label>
                                <select class="form-control validate" name="type_doc" style="width: 100%" required>
                                    <option value="1" selected>Dni</option>
                                    <option value="2">Cuil</option>
                                    <option value="3">Cuit</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="num_doc" class="form-label mb-0 ps-3 fw-bold">Num Doc</label>
                                <input type="text" class="form-control validate" name="num_doc" id="num_doc" placeholder="" required value="{{ old('num_doc') }}">
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-2">
                        <label for="email" class="form-label mb-0 ps-3 fw-bold">E-mail</label>
                        <input type="text" class="form-control" name="email" id="email" placeholder="" value="{{ old('email') }}">
                    </div>
                    <div class="row">
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="phone1" class="form-label mb-0 ps-3 fw-bold">Teléfono 1</label>
                                <input type="text" class="form-control validate" name="phone1" id="phone1" placeholder="" value="{{ old('phone1') }}">
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="phone2" class="form-label mb-0 ps-3 fw-bold">Teléfono 2</label>
                                <input type="text" class="form-control" name="phone2" id="phone2" placeholder="" value="{{ old('phone2') }}">
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="country" class="form-label mb-0 ps-3 fw-bold">País</label>
                                <select class="form-control" name="country" style="width: 100%">
                                    @foreach ($countries as $c)
                                        <option value="{{$c->country}}"@if ($c->country == 'Argentina') selected @endif>{{$c->country}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="state" class="form-label mb-0 ps-3 fw-bold">Provincia</label>
                                <input type="text" class="form-control" name="state" id="state" placeholder="" value="{{ old('state') }}">
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="city" class="form-label mb-0 ps-3 fw-bold">Ciudad</label>
                                <input type="text" class="form-control" name="city" id="city" placeholder="" value="{{ old('city') }}">
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="address_street" class="form-label mb-0 ps-3 fw-bold">Calle</label>
                                <input type="text" class="form-control" name="address_street" id="address_street" placeholder="" value="{{ old('address_street') }}">
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="address_nro" class="form-label mb-0 ps-3 fw-bold">Nro</label>
                                <input type="text" class="form-control" name="address_nro" id="address_nro" placeholder="" value="{{ old('address_nro') }}">
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="mb-2">
                                <label for="address_apartament" class="form-label mb-0 ps-3 fw-bold">Piso / Dpto</label>
                                <input type="text" class="form-control" name="address_apartament" id="address_apartament" placeholder="" value="{{ old('address_apartament') }}">
                            </div>
                        </div>
                    </div>
                    <div class="mb-2">
                        <label for="address_detail" class="form-label mb-0 ps-3 fw-bold">Descripcion</label>
                        <input type="text" class="form-control" name="address_detail" id="address_detail" value="{{ old('address_detail') }}">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-success" id="btn-create-provider">Guardar</button>
            </div>
        </div>
    </div>
</div>