var controladorTiempo = 3000;
const formatter = new Intl.NumberFormat('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2});

$(document).ready(function() {
    callregister('/service_package/table',1,$('#table_limit').val(),$('#table_order').val(),'si')

    $('#services, #services_edit').select2( {
        theme: "bootstrap-5",
        width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
        placeholder: 'Seleccione una opcion',
        language: 'es'
    } );

    $('body').on('click','.create',function(){ 
        $('#name').val('');
        $('#description').val('');
        $('#createservice_package').modal('show')}
    );
    $('body').on('click','.update',function(){ 
        $('#formeditservice_package').attr('action',app_url+"/service_package/"+$(this).data('id'));

        form = document.getElementById("formeditservice_package");
        $( form.elements ).each(function( index ) {
            if($(this).attr('name') != '_method' && $(this).attr('name') != '_token'){
                $(this).val('');
            } 
        });

        $('#editservice_package').modal('show');

        $('#modal-body-edit-service_package-roller').removeClass('d-none');
        $('#modal-body-edit-service_package-error').addClass('d-none');
        $('#modal-body-edit-service_package').addClass('d-none');
        $('#modal-footer-edit-service_package').addClass('d-none');

        $.ajax({contenttype : 'application/json; charset=utf-8',
            url : $('meta[name="app_url"]').attr('content')+'/service_package/'+$(this).data('id')+'/edit',
            type : 'GET',
            done : function(response) { $('#modal-body-edit-service_package-error').removeClass('d-none'); },
            error : function(jqXHR,textStatus,errorThrown) { $('#modal-body-edit-service_package-error').removeClass('d-none'); },
            success : function(data) {
                $.each( data.service , function( index, value ) {
                    $( form.elements ).each(function( b ) {
                        if($(this).attr('name') == index){
                            $(this).val(value);
                        }
                    });
                });
                $.each( data.items , function( ) {
                    var temp = new Object();
                        temp["id"] = this.services_id;
                        temp["name"] = this.service_name;
                        temp["descripcion"] = this.observations;
                        temp["currency"] = this.type_money;
                        temp["price"] = this.price;
                        temp["posicion"] = posicion_edit;
                    servicios_agregados_edit[posicion_edit] = temp;
                    posicion_edit = posicion_edit+1;
                });
                $('#servicios_agregados_edit').val(JSON.stringify(servicios_agregados_edit));
                addItemsTable_edit();
                $('#modal-body-edit-service_package').removeClass('d-none');
                $('#modal-footer-edit-service_package').removeClass('d-none');
            }
        }).always(function() {
            $('#modal-body-edit-service_package-roller').addClass('d-none');
        });
    });
    $('body').on('click','.read',function(){ 
        form = document.getElementById("formshowservice_package");
        $( form.elements ).each(function( index ) {
            $(this).val('');
        });
        $('#showservice_package').modal('show');

        $('#modal-body-show-service_package-roller').removeClass('d-none');
        $('#modal-body-show-service_package-error').addClass('d-none');
        $('#modal-body-show-service_package').addClass('d-none');

        $.ajax({contenttype : 'application/json; charset=utf-8',
            url : $('meta[name="app_url"]').attr('content')+'/service_package/'+$(this).data('id')+'/edit',
            type : 'GET',
            done : function(response) { $('#modal-body-show-service_package-error').removeClass('d-none'); },
            error : function(jqXHR,textStatus,errorThrown) { $('#modal-body-show-service_package-error').removeClass('d-none'); },
            success : function(data) {

                $.each( data.service , function( index, value ) {
                    $( form.elements ).each(function( b ) {
                        if($(this).attr('name') == index){
                            $(this).val(value);
                        }
                    });
                });
                $('#service_packages-table-tbody_show').empty();
                index=1;
                $.each(data.items, function () {
                    var newRow = `<tr>
                        <td>${index}</td>
                        <td>${this.service_name}</td>
                        <td>${this.observations}</td>
                        <td>${this.type_money}</td>
                        <td>${formatter.format(this.price)}</td>
                    </tr>`;
                    index++;
                    $('#service_packages-table-tbody_show').append(newRow);
                });

                $('#modal-body-show-service_package').removeClass('d-none');
            }
        }).always(function() {
            $('#modal-body-show-service_package-roller').addClass('d-none');
        });
    });
    $('body').on('click','.delete',function(){ 
        rolid=$(this).data('id');
        Swal.fire({
            title: "Borrar Servicio",
            html: "Esta seguro que desea eliminar el paquete "+$(this).data('name')+"?<br>No podrá revertir el cambio.",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Borrar",
            cancelButtonText: `Cancelar`,
        }).then((result) => {
            if (result.value == true) {
                $('#formdestroy').attr('action',app_url+"/service_package/"+$(this).data('id'));
                $('#formdestroy').submit();
            }
        });
    });
    $('body').on('click',"#btn-create-service_package",function () {
        var error = 0
        form = document.getElementById("formnewservice_package");

        $( form.getElementsByClassName('validate') ).each(function( index ) {
            if($( this ).attr("name") == 'servicios'){
                if($( this ).val() == '{}'){
                    toastr["error"]("Debe agregar al menos un item.")
                    error++;
                }
            } else {
                if($( this ).val() == ''){
                    $( this ).css('box-shadow', 'inset 0px 0px 2px 2px red');
                    error++;
                } else {
                    $( this ).css('box-shadow', '');
                }
            }
        });

        if (error > 0) {
            toastr["error"]("Debe completar los datos correctamente.")
        } else {
            document.getElementById("formnewservice_package").submit();
        }
    });
    $('body').on('click',"#btn-update-service_package",function () {
        var error = 0

        var error = 0
        form = document.getElementById("formeditservice_package");

        $( form.getElementsByClassName('validate') ).each(function( index ) {
            if($( this ).attr("name") == 'servicios'){
                if($( this ).val() == '{}'){
                    toastr["error"]("Debe agregar al menos un item.")
                    error++;
                }
            } else {
                if($( this ).val() == ''){
                    $( this ).css('box-shadow', 'inset 0px 0px 2px 2px red');
                    error++;
                } else {
                    $( this ).css('box-shadow', '');
                }
            }
        });
        if (error > 0) {
            toastr["error"]("Debe completar los datos correctamente para editar el paquete.")
        } else {
            document.getElementById("formeditservice_package").submit();
        }
    });
    $('body').on('change',"#table_limit",function () {
        callregister('/service_package/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
    });
    $('body').on('click',".column_orden", function(){
        var name = $(this).data('name');
        orden = name+' ASC';

        if ($(this).hasClass('sorttable_sorted'))  { orden = name+' DESC';}

        $('#table_order').val(orden);
        if($('#table_filtrados').val() != $('#table_totales').val()){
            callregister('/service_package/table',1,$('#table_limit').val(),orden,'si')
        }
    });
    $('#table_search').on('change, keyup',function() {            
        if($('#table_filtrados').val() != $('#table_totales').val()){   
            clearInterval(controladorTiempo);
            controladorTiempo = setInterval(function(){
                callregister('/service_package/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
                clearInterval(controladorTiempo); //Limpio el intervalo
            }, 800); 
           
        } else {
            _this = this;
            // Show only matching TR, hide rest of them
            $.each($("#table_body tr"), function() {
                if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
                    $(this).hide();
                else
                    $(this).show();
            });
        }
    });
});

function tableregister(data, page, callpaginas, url_query){
    body='';
    bodysmall='';
    $.each(data.datos, function (key, val) {
        btn = `<div class="dropdown">
                <button class="btn btn-link dropdown-toggle-menu-body text-type1 py-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-ellipsis"></i>
                </button>
                <ul class="dropdown-menu" >`;
                    if( data.permissions.includes('read') ) {
                        btn += `<li><a href="javascript:void(0);" data-id="${val.id}" class="dropdown-item read">
                            <i class="flaticon-eye"></i> Ver
                        </a></li>`
                    }

                    if( data.permissions.includes('update') ) {
                        btn += `<li><a href="javascript:void(0);" data-id="${val.id}" class="dropdown-item update">
                            <i class="flaticon-upload"></i> Editar
                        </a></li>`
                    }

                    if ( data.permissions.includes('delete') ){
                        btn += `<li><a href="javascript:void(0);" data-id="${val.id}" class="dropdown-item delete" data-name="${val.name}">
                            <i class="flaticon-delete"></i> Eliminar
                        </a></li>`
                    }
        btn += `</ul></div>`;
        body += `<tr id="${val.id}">
            <td class="align-middle text-start">${val.name}</td>
            <td class="align-middle text-start">${val.observations ?? ''}</td>
            <td class="align-middle">${val.items_count}</td>
            <td class="align-middle">${btn}</td>
        </tr>`;

        bodysmall += `<div class="col-11 mb-3 mx-3">
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Nombre</div>
                <div class="col-6 border p-1 text-center">${val.name}<</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Observaciones</div>
                <div class="col-6 border p-1 text-center">${val.observations ?? ''}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small"># servicios</div>
                <div class="col-6 border p-1 text-center">${val.items_count}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small"></div>
                <div class="col-6 border p-0 text-center">${btn}</div>
            </div>
        </div>`;
    });
    $('#table_body').append(body);
    $('#table_small').append(bodysmall);
    $('#table_info').text(data.infototal);
    $('#table_filtrados').val(data.datos.length);
    $('#table_totales').val(data.totales);
    table_filtrados
    if(callpaginas=='si'){
        document.getElementById('table_pagination').innerHTML = createPagination(data.paginastotal, page, callpaginas, url_query);
    }

    dropdownElementList();
}

function getServiceDetails(element){
    getDetailsServices('services', element.value);
}

function getDetailsServices(tipo, valor) {
    $('.spinner-description').removeClass('d-none');
    $('#'+tipo+'-description').val('');
    $('#'+tipo+'-currency').val('');
    $('#'+tipo+'-price').val('');
    $.ajax({contenttype : 'application/json; charset=utf-8',
        data: { type : tipo, valor : valor},
        url : $('meta[name="app_url"]').attr('content')+'/getDetailsServices',
        type : 'POST',
        success : function(data) {
            if(tipo=='services'){
                $('#'+tipo+'-description').val(data.observations);
                $('#'+tipo+'-currency').val(data.type_money);
                $('#'+tipo+'-price').val(data.price);
            }else{
                $.each(data, function () {
                    $('#'+tipo+'-description').val(this.observations);
                    $('#'+tipo+'-currency').val(this.type_money);
                    $('#'+tipo+'-price').val(this.price);
                });
            }
            
        }
    }).always(function() {
        $('.spinner-description').addClass('d-none');

    });
}

var servicios_agregados = {}
var posicion = 0;

function addServiceTable(){
    var value = $('#services').find("option:selected").val();
    var name=$('#services').find("option:selected").text();
    var description = $('#services-description').val();
    var currency = $('#services-currency').val();
    var price = $('#services-price').val();

    var temp = new Object();
        temp["id"] = value;
        temp["name"] = name;
        temp["descripcion"] = description;
        temp["currency"] = currency;
        temp["price"] = price;
        temp["posicion"] = posicion;
    servicios_agregados[posicion] = temp;
    posicion = posicion+1;

    $('#servicios_agregados').val(JSON.stringify(servicios_agregados));
    addItemsTable();
}

function addItemsTable(){
    $('#services-table-tbody').empty();
    index=1;
    $.each(servicios_agregados, function () {
        var newRow = `<tr>
            <td>${index}</td>
            <td>${this.name}</td>
            <td>${this.descripcion}</td>
            <td>${this.currency}</td>
            <td>${formatter.format(this.price)}</td>
            <td>
                <a href="javascript:void(0)" class="text-danger" onclick="removeServiceTable(this, ${this.posicion})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </a>
            </td>
        </tr>`;
        index++;
        $('#services-table-tbody').append(newRow);
    });
}

function removeServiceTable(element, posicion){
    $(element).closest('tr').remove();
    delete servicios_agregados[posicion];
    $('#servicios_agregados').val(JSON.stringify(servicios_agregados));
    addItemsTable();
}

function getServiceDetails_edit(element){
    getDetailsServices_edit('services', element.value);
}

function getDetailsServices_edit(tipo, valor) {
    $('.spinner-description').removeClass('d-none');
    $('#'+tipo+'-description_edit').val('');
    $('#'+tipo+'-currency_edit').val('');
    $('#'+tipo+'-price_edit').val('');
    $.ajax({contenttype : 'application/json; charset=utf-8',
        data: { type : tipo, valor : valor},
        url : $('meta[name="app_url"]').attr('content')+'/getDetailsServices',
        type : 'POST',
        success : function(data) {
            if(tipo=='services'){
                $('#'+tipo+'-description_edit').val(data.observations);
                $('#'+tipo+'-currency_edit').val(data.type_money);
                $('#'+tipo+'-price_edit').val(data.price);
            }else{
                $.each(data, function () {
                    $('#'+tipo+'-description_edit').val(this.observations);
                    $('#'+tipo+'-currency_edit').val(this.type_money);
                    $('#'+tipo+'-price_edit').val(this.price);
                });
            }
            
        }
    }).always(function() {
        $('.spinner-description').addClass('d-none');

    });
}

var servicios_agregados_edit = {}
var posicion_edit = 0;

function addServiceTable_edit(){
    var value = $('#services_edit').find("option:selected").val();
    var name=$('#services_edit').find("option:selected").text();
    var description = $('#services-description_edit').val();
    var currency = $('#services-currency_edit').val();
    var price = $('#services-price_edit').val();

    var temp = new Object();
        temp["id"] = value;
        temp["name"] = name;
        temp["descripcion"] = description;
        temp["currency"] = currency;
        temp["price"] = price;
        temp["posicion"] = posicion_edit;
    servicios_agregados_edit[posicion_edit] = temp;
    posicion_edit = posicion_edit+1;

    $('#servicios_agregados_edit').val(JSON.stringify(servicios_agregados_edit));
    addItemsTable_edit();
}

function addItemsTable_edit(){
    $('#services-table-tbody_edit').empty();
    index=1;
    $.each(servicios_agregados_edit, function () {
        var newRow = `<tr>
            <td>${index}</td>
            <td>${this.name}</td>
            <td>${this.descripcion}</td>
            <td>${this.currency}</td>
            <td>${formatter.format(this.price)}</td>
            <td>
                <a href="javascript:void(0)" class="text-danger" onclick="removeServiceTable_edit(this, ${this.posicion})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </a>
            </td>
        </tr>`;
        index++;
        $('#services-table-tbody_edit').append(newRow);
    });
}

function removeServiceTable_edit(element, posicion){
    $(element).closest('tr').remove();
    delete servicios_agregados_edit[posicion];
    $('#servicios_agregados_edit').val(JSON.stringify(servicios_agregados_edit));
    addItemsTable_edit();
}