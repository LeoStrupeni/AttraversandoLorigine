var controladorTiempo = 3000;
var varsearch = '';
const formatter = new Intl.NumberFormat('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2});

$(document).ready(function() {

    if(window.location.pathname.includes("budget_type/create")){
        getdataselect(`/client/table`,'#client_id_c', null);
        $('#fechaC').datepicker("setDate", new Date());
        fetch('https://dolarapi.com/v1/dolares/blue').then(response => response.json()).then(data => {$('#cotizacion_u').val(formatter.format(data.venta));});
    } else if(window.location.pathname.includes("/edit")) {
        $('#fechaC').datepicker();
    } else {
        callregister('/budget_type/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
    } 
    
    $('body').on('click','.create',function(){ 
        window.location.href=app_url+"/budget_type/create";
    });
    $('body').on('click','.update',function(){ 
        window.location.href=app_url+"/budget_type/"+$(this).data('id')+"/edit";
    });
    $('body').on('click','.read',function(){ 
        form = document.getElementById("formshowbudget_type");
        $( form.elements ).each(function( index ) {
            $(this).val('');
        });
        $('#showbudget_type').modal('show');

        $('#print_budget_type_btn').attr('href', `/budget_type/pdf/${$(this).data('id')}`);

        $('#modal-body-show-budget_type-roller').removeClass('d-none');
        $('#modal-body-show-budget_type-error').addClass('d-none');
        $('#modal-body-show-budget_type').addClass('d-none');

        $.ajax({contenttype : 'application/json; charset=utf-8',
            url : $('meta[name="app_url"]').attr('content')+'/budget_type/'+$(this).data('id'),
            type : 'GET',
            done : function(response) { $('#modal-body-edit-budget_type-error').removeClass('d-none'); },
            error : function(jqXHR,textStatus,errorThrown) { $('#modal-body-edit-budget_type-error').removeClass('d-none'); },
            success : function(data) {
                $('#name_show').val(data.budget_type.name);
                $('#observations_show').val(data.budget_type.observations);
                $('#payment_methods_show').val(data.budget_type.payment_methods);
                $('#includes_show').val(data.budget_type.includes);
                $('#not_includes_show').val(data.budget_type.not_includes);
                $('#clarifications_show').val(data.budget_type.clarifications);
                $('#cotizacion_show_u').val(formatter.format(data.cotizacion));
                $('#cotizacion_show_j').val(formatter.format('103337.61'));
                $( form.elements ).each(function( index ) {
                    if(this.nodeName === "TEXTAREA") {
                        CKEDITOR.replace(this,{
                            language: 'es',
                            height: 80,
                            toolbarStartupExpanded : false
                        });
                    }
                });

                var subtotal_p = 0;
                var subtotal_j = 0;
                var subtotal_u = 0

                $('#table_show').empty();
                $.each(data.budget_type_items, function(index, item) {
                    $('#table_show').append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td class="text-start">${item.service_name}</td>
                            <td>${item.description}</td>
                            <td>${item.type_money}</td>
                            <td class="text-end">${formatter.format(item.price)}</td>
                        </tr>
                    `);
                    if(item.type_money=='peso') subtotal_p += parseFloat(item.price);
                    if(item.type_money=='dolar') subtotal_u += parseFloat(item.price);
                    if(item.type_money=='jus') subtotal_j += parseFloat(item.price);
                });


                $('#subtotal_show_p').val(formatter.format(subtotal_p));
                $('#subtotal_show_u').val(formatter.format(subtotal_u));
                $('#subtotal_show_j').val(formatter.format(subtotal_j));
                
                cotizacion_u = data.cotizacion;
                cotizacion_j = '103337.61';
            

                total_p = subtotal_p + (subtotal_u * cotizacion_u) + (subtotal_j * cotizacion_j);

                pesos_dolar = (subtotal_p == 0 ? 0 : (cotizacion_u == 0 ? 0 : (subtotal_p / cotizacion_u)));
                jus_a_dolar = (subtotal_j == 0 ? 0 :  (cotizacion_j == 0 ? 0 : ((subtotal_j * cotizacion_j) / cotizacion_u)))

                total_u = parseFloat(subtotal_u) + parseFloat(pesos_dolar) + parseFloat(jus_a_dolar);

                $('#total_show_p').val(formatter.format(total_p));
                $('#total_show_u').val(formatter.format(total_u));

                $('#modal-body-show-budget_type').removeClass('d-none');
            }
        }).always(function() {
            $('#modal-body-show-budget_type-roller').addClass('d-none');
        });
    });
    $('body').on('click','.delete',function(){ 
        rolid=$(this).data('id');
        Swal.fire({
            title: "Borrar Presupuesto",
            html: "Esta seguro que desea eliminar el modelo de presupuesto "+$(this).data('name')+"?<br>No podrá revertir el cambio.",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Borrar",
            cancelButtonText: `Cancelar`,
        }).then((result) => {
            if (result.dismiss != 'cancel') {
                $('#formdestroy').attr('action',app_url+"/budget_type/"+$(this).data('id'));
                $('#formdestroy').submit();
            }
        });
    });
    $('body').on('click',"#btn-create-budget_type",function () {
        var error = 0
        form = document.getElementById("formupdatebudget_type");

        $( form.getElementsByClassName('validate') ).each(function( index ) {
            if($( this ).val() == ''){
                $( this ).css('box-shadow', 'inset 0px 0px 2px 2px red');
                error++;
            } else {
                $( this ).css('box-shadow', '');
            }
        });

        if (error > 0) {
            toastr["error"]("Debe completar los datos correctamente.")
        } else {
            document.getElementById("formupdatebudget_type").submit();
        }
    });
    $('body').on('click',"#btn-update-budget_type",function () {
        var error = 0

        var error = 0
        form = document.getElementById("formeditbudget_type");

        $( form.getElementsByClassName('validate') ).each(function( index ) {
            if($( this ).val() == ''){
                $( this ).css('box-shadow', 'inset 0px 0px 2px 2px red');
                error++;
            } else {
                $( this ).css('box-shadow', '');
            }
        });
        if (error > 0) {
            toastr["error"]("Debe completar los datos correctamente para editar el budget_typee.")
        } else {
            document.getElementById("formeditbudget_type").submit();
        }
    });
    $('body').on('change',"#table_limit",function () {
        callregister('/budget_type/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
    });
    $('body').on('click',".column_orden", function(){
        var name = $(this).data('name');
        orden = name+' ASC';

        if ($(this).hasClass('sorttable_sorted'))  { orden = name+' DESC';}

        $('#table_order').val(orden);
        if($('#table_filtrados').val() != $('#table_totales').val()){
            callregister('/budget_type/table',1,$('#table_limit').val(),orden,'si')
        }
    });
    var controladorTiempo = 3000;
    $('#table_search').on('change, keyup',function() {            
        if($('#table_filtrados').val() != $('#table_totales').val()){   
            clearInterval(controladorTiempo);
            controladorTiempo = setInterval(function(){
                callregister('/budget_type/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
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
    bodysmall=''
    const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 2,maximumFractionDigits: 2,});

    $.each(data.datos, function (key, val) {
        btn = `<div class="dropdown">
            <button class="btn btn-link dropdown-toggle-menu-body text-type1 py-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-ellipsis"></i>
            </button>
            <ul class="dropdown-menu" >`;
                if( data.permissions.includes('read') ) {
                    btn += `<li><a href="javascript:void(0);" data-id="${val.id}" class="dropdown-item read">
                        <i class="flaticon-eye"></i> Ver
                    </a></li>
                    <li><a href="/budget_type/pdf/${val.id}" target="_blank" class="dropdown-item">
                        <i class="flaticon2-printer"></i> Imprimir
                    </a></li>
                    `
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
        btn += `</ul></div>`
        body += `<tr id="${val.id}">
            <td class="align-middle text-center"># ${val.id}</td>
            <td class="align-middle text-start">${val.name}</td>
            <td class="align-middle text-start">${val.user_name}</td>
            <td class="align-middle">${formatter.format(val.total_pesos)}</td>
            <td class="align-middle">${formatter.format(val.total_dollars)}</td>
            <td class="align-middle">${formatter.format(val.total_jus)}</td>
            <td class="align-middle">${btn}</td>
        </tr>`;
        
        bodysmall += `<div class="col-11 mb-3 mx-3">
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small"># Presupuesto</div>
                <div class="col-6 border p-1 text-center"># ${val.id}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Nombre</div>
                <div class="col-6 border p-1 text-center">${val.name}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Usuario</div>
                <div class="col-6 border p-1 text-center">${val.user_name}</div>
            </div> 
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Total $</div>
                <div class="col-6 border p-1 text-center">${val.total_pesos ?? ''}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Total U$S</div>
                <div class="col-6 border p-1 text-center">${val.total_dollars ?? ''}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Total JUS</div>
                <div class="col-6 border p-1 text-center">${val.total_jus ?? ''}</div>
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

function getdataselect(url_query,add_data, var_search){
    $('.spinner-data').removeClass('d-none');
    $.ajax({contenttype : 'application/json; charset=utf-8',
        data: {
            page	    : 1,
            limit 	    : 20,
            order 	    : null,
            search      : var_search
        },
        url : $('meta[name="app_url"]').attr('content')+url_query,
        type : 'POST',
        success : function(data) {
            $(add_data).empty();
            selects='<option value="" selected class="select-empty" style="color: #aaa;">Seleccione una opcion ...</option>';
            $.each(data.datos, function (key, val) {
                selects+=`<option value="${val.id}">${val.first_name} ${val.last_names}</option>`;
            });
            $(add_data).append(selects);
        }
    }).always(function() {
        $('.spinner-data').addClass('d-none');

        $( add_data ).select2( {
            theme: "bootstrap-5",
            width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
            placeholder: 'Seleccione una opcion',
            // dropdownParent: $('#createmovement'),
            language: 'es'
        } );
        // $(add_data).select2('open');
    });
}
$('body').on('keyup','.select2-search__field',function(){
    if ($(this).parent().parent().hasClass('no_ejecutar')) {
        return;
    }
    varsearch=this.value;
    clearInterval(controladorTiempo);
    controladorTiempo = setInterval(function () {
        $('#client_id_c').empty();
        url_query = `/client/table`;
        add_data='#client_id_c';
        getdataselect(url_query,add_data, varsearch);
        clearInterval(controladorTiempo); //Limpio el intervalo
    
    }, 400);
});


function getPaqueteDetails(element){
    getDetailsServices('paquetes', element.value);
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
                $('#'+tipo+'-currency').val(data.type_money).change();
                $('#'+tipo+'-price').val(data.price);
            }else{
                $('#paquetes-description').val(data.observations);
            }
            
        }
    }).always(function() {
        $('.spinner-description').addClass('d-none');
    });
}

function addPackagesTable(){
    Swal.fire({
        title: 'Cargando paquete',
        text: 'Aguarde un momento por favor',
        imageUrl: '/assets/media/Cargando.gif',
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: '',
        showConfirmButton: false
    }); 

    var value = $('#paquetes').find("option:selected").val();
    $.ajax({contenttype : 'application/json; charset=utf-8',
        url : $('meta[name="app_url"]').attr('content')+'/service_package/'+value+'/edit',
        success : function(data) {
            $.each( data.items , function( ) {
                var temp = new Object();
                    temp["id"] = this.services_id;
                    temp["name"] = this.service_name;
                    temp["descripcion"] = this.observations;
                    temp["currency"] = this.type_money;
                    temp["price"] = this.price;
                    temp["posicion"] = posicion;
                    temp["id_base"] = 0;
                servicios_agregados[posicion] = temp;
                posicion = posicion+1;
            });
        }
    }).always(function() {
        $('#servicios_agregados').val(JSON.stringify(servicios_agregados));
        addItemsTable();
        Swal.close();
    });
}

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
        temp["id_base"] = 0;
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
            <td class="text-center">${index}</td>
            <td class="text-start">${this.name}</td>
            <td class="text-start">
                <input class="form-control form-control-sm form-control form-control-sm-sm text-start" type="text" value="${this.descripcion}" onchange="updateServiceDescription(this, ${this.posicion})">
            </td>
            <td>
                <select class="form-select form-select-sm" onchange="updateServiceCurrency(this, ${this.posicion})"> 
                    <option value="peso" ${this.currency == 'peso' ? 'selected' : ''}>Pesos</option>
                    <option value="dolar" ${this.currency == 'dolar' ? 'selected' : ''}>Dólar</option>
                    <option value="jus" ${this.currency == 'jus' ? 'selected' : ''}>JUS</option>
                </select>
            </td>
            <td class="pe-3 text-center">
                <input class="form-control form-control-sm form-control form-control-sm-sm text-end" type="number" value="${this.price}" onchange="updateServicePrice(this, ${this.posicion})">
            </td>
            <td>
                <a href="javascript:void(0)" class="text-danger" onclick="removeServiceTable(this, ${this.posicion})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </a>
            </td>
        </tr>`;
        index++;
        $('#services-table-tbody').append(newRow);
    });
    subtotales();
}
function updateServiceDescription(element, posicion){
    var newValue = $(element).val();
    servicios_agregados[posicion].descripcion = newValue;
    $('#servicios_agregados').val(JSON.stringify(servicios_agregados));
}
function updateServicePrice(element, posicion){
    var newValue = $(element).val();
    servicios_agregados[posicion].price = newValue;
    $('#servicios_agregados').val(JSON.stringify(servicios_agregados));
    subtotales();
}
function updateServiceCurrency(element, posicion){
    var newValue = $(element).val();
    servicios_agregados[posicion].currency = newValue;
    $('#servicios_agregados').val(JSON.stringify(servicios_agregados));
    subtotales();
}

function removeServiceTable(element, posicion){
    $(element).closest('tr').remove();
    delete servicios_agregados[posicion];
    $('#servicios_agregados').val(JSON.stringify(servicios_agregados));
    addItemsTable();
}

function subtotales() {
    var subtotal_p = 0;
    var subtotal_j = 0;
    var subtotal_u = 0;

    $.each(servicios_agregados, function () {
        if(this.currency=='peso') subtotal_p += parseFloat(this.price);
        if(this.currency=='dolar') subtotal_u += parseFloat(this.price);
        if(this.currency=='jus') subtotal_j += parseFloat(this.price);
    });
    $('#subtotal_p').val(formatter.format(subtotal_p));
    $('#subtotal_u').val(formatter.format(subtotal_u));
    $('#subtotal_j').val(formatter.format(subtotal_j));
    
    cotizacion_u = $('#cotizacion_u').val().replace('.', '').replace(',', '.') == '' ? 0 : $('#cotizacion_u').val().replace('.', '').replace(',', '.');
    cotizacion_j = $('#cotizacion_j').val().replace('.', '').replace(',', '.') == '' ? 0 : $('#cotizacion_j').val().replace('.', '').replace(',', '.');
    if(subtotal_u > 0 ) {
        if(cotizacion_u == 0) {
            $('#total_p').val(formatter.format(0));
            toastr["error"]("Ingrese la cotizacion del dolar.")
            return;
        }

    }
    if(subtotal_j > 0 ) {
        if(cotizacion_j == 0) {
            $('#total_p').val(formatter.format(0));
            $('#total_u').val(formatter.format(0));
            toastr["error"]("Ingrese la cotizacion del JUS.")
            return;
        }
    }

    total_p = subtotal_p + (subtotal_u * cotizacion_u) + (subtotal_j * cotizacion_j);

    pesos_dolar = (subtotal_p == 0 ? 0 : (cotizacion_u == 0 ? 0 : (subtotal_p / cotizacion_u)));
    jus_a_dolar = (subtotal_j == 0 ? 0 :  (cotizacion_j == 0 ? 0 : ((subtotal_j * cotizacion_j) / cotizacion_u)))

    total_u = parseFloat(subtotal_u) + parseFloat(pesos_dolar) + parseFloat(jus_a_dolar);

    $('#total_p').val(formatter.format(total_p));
    $('#total_u').val(formatter.format(total_u));

}

$(document).ready(function() {
    $('#btn-save-budget_type').click(function() {
        var error = 0
        form = document.getElementById("formnewbudget_type");

        $( form.getElementsByClassName('validate') ).each(function( index ) {
            if($( this ).attr("name") == 'servicios'){
                if($( this ).val() == '{}'){
                    toastr["error"]("Debe agregar al menos un item al presupuesto.")
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
            toastr["error"]("Debe completar los datos correctamente para guardar el presupuesto.")
        } else {
            document.getElementById("formnewbudget_type").submit();
        }
    });
});