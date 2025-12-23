var controladorTiempo = 3000;
var varsearch = '';
const formatter = new Intl.NumberFormat('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2});

padre = '';
$(document).ready(function() {
    $('body').on('click','#btnToggleSaldos2',function(){
        $(this).children().hasClass('fa-eye') ? 
            $(this).children().removeClass('fa-eye').addClass('fa-eye-slash') : 
            $(this).children().removeClass('fa-eye-slash').addClass('fa-eye') ;
    });

    $( '#type_document, #type_payment, #type_money, #type, #budgets_filter, #providers_filter, #users_filter, #clients_filter' ).select2( {
        theme: "bootstrap-5",
        width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
        placeholder: $( this ).data( 'placeholder' ),
        closeOnSelect: false,
    } );
    $( '#type_document, #type_payment, #type_money, #type, #budgets_filter, #providers_filter, #users_filter, #clients_filter' ).change(function(){
        get_filters_applied(); 
        callregister('/movement/table',1,$('#table_limit').val(),$('#table_order').val(),'si');
    });
    
    $('#fecha').daterangepicker({
        parentEl: "body",
        showDropdowns: true,
        buttonClasses: ' btn',
        applyClass: 'btn-primary',
        cancelClass: 'btn-secondary',
        autoUpdateInput : false,
        locale: {"applyLabel": "Aplicar","cancelLabel": "Limpiar","fromLabel": "Desde","toLabel": "hasta",
        "customRangeLabel": "Custom","daysOfWeek": ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
        "monthNames": ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre",
        "Octubre","Noviembre","Diciembre"],"firstDay": 1
        }
    });

    $('#fechaC').datepicker("setDate", new Date());

    $('#fecha').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        callregister('/movement/table',1,$('#table_limit').val(),$('#table_order').val(),'si');
        get_filters_applied();
    });

    $('#fecha').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
        callregister('/movement/table',1,$('#table_limit').val(),$('#table_order').val(),'si');
        get_filters_applied();
    });

    get_filters_applied();

    function get_filters_applied(){
        $('#filtrosaplicados').empty();
        fecha=$('#fecha').val();
        type=$('#type').val();
        money=$('#type_money').val();
        doc=$('#type_document').val();
        pay=$('#type_payment').val();

        client=$('#clients_filter').val();
        provider=$('#providers_filter').val();
        user=$('#users_filter').val();
        budget=$('#budgets_filter').val();

        var f_fecha = '', f_type='', f_money='' , f_doc='', f_pay='', f_client = '', f_provider='', f_user='', f_budget='';

        if(fecha!='') {f_fecha=`<div class="col-12 col-md-6"><b>Periodo: </b>${fecha}</div>`;
        }
        if(type!=''){
            f_type=`<div class="col-12 col-md-6"><b>Tipos de Movimientos: </b>`;
            $.each(type, function (key, val) {
                if( f_type=='<div class="col-12 col-md-6"><b>Tipos de Movimientos: </b>'){ f_type+=` ${val}`;}
                else { f_type+=`, ${val}`;}
            });
            f_type+=`<a href="javascript:void(0);" class="text-danger float-end" onclick="$('#type').val('').change()">
                <i class="fa-solid fa-xmark"></i>
            </a></div>`;
        }
        if(money!=''){
            f_money=`<div class="col-12 col-md-6"><b>Monedas: </b>`;
            
            var selectedTexts = $('#type_money').find('option:selected').map(function() {
                return $(this).text();
            }).toArray();

            $.each(selectedTexts, function () {
                if( f_money=='<div class="col-12 col-md-6"><b>Monedas: </b>'){ f_money+=` ${this}`;}
                else { f_money+=`, ${this}`;}
            });
            f_money+=`<a href="javascript:void(0);" class="text-danger float-end" onclick="$('#type_money').val('').change()">
                <i class="fa-solid fa-xmark"></i>
            </a></div>`;
        }
        if(doc!=''){
            f_doc=`<div class="col-12 col-md-6"><b>Tipos de Documentos: </b>`;
            var selectedTexts = $('#type_document').find('option:selected').map(function() {
                return $(this).text();
            }).toArray();

            $.each(selectedTexts, function () {
                if( f_doc=='<div class="col-12 col-md-6"><b>Tipos de Documentos: </b>'){f_doc+=` ${this}`;}
                else {f_doc+=`, ${this}`;}
            });
            f_doc+=`<a href="javascript:void(0);" class="text-danger float-end" onclick="$('#type_document').val('').change()">
                <i class="fa-solid fa-xmark"></i>
            </a></div>`;
        }
        if(pay!=''){
            f_pay=`<div class="col-12 col-md-6"><b>Tipos de Pago: </b>`;
            var selectedTexts = $('#type_payment').find('option:selected').map(function() {
                return $(this).text();
            }).toArray();
            $.each(selectedTexts, function () {
                if( f_pay=='<div class="col-12 col-md-6"><b>Tipos de Pago: </b>'){ f_pay+=` ${this}`;}
                else { f_pay+=`, ${this}`;}
            });
            f_pay+=`<a href="javascript:void(0);" class="text-danger float-end" onclick="$('#type_payment').val('').change()">
                <i class="fa-solid fa-xmark"></i>
            </a></div>`;
        }
        if(client!=''){
            f_client=`<div class="col-12 col-md-6"><b>Clientes: </b>`;
            var selectedTexts = $('#clients_filter').find('option:selected').map(function() {
                return $(this).text();
            }).toArray();
            $.each(selectedTexts, function () {
                if( f_client=='<div class="col-12 col-md-6"><b>Clientes: </b>'){ f_client+=` ${this}`;}
                else { f_client+=`, ${this}`;}
            });
            f_client+=`<a href="javascript:void(0);" class="text-danger float-end" onclick="$('#clients_filter').val('').change()">
                <i class="fa-solid fa-xmark"></i>
            </a></div>`;
        }
        if(provider!=''){
            f_provider=`<div class="col-12 col-md-6"><b>Proveedores: </b>`;
            var selectedTexts = $('#providers_filter').find('option:selected').map(function() {
                return $(this).text();
            }).toArray();
            $.each(selectedTexts, function () {
                if( f_provider=='<div class="col-12 col-md-6"><b>Proveedores: </b>'){ f_provider+=` ${this}`;}
                else { f_provider+=`, ${this}`;}
            });
            f_provider+=`<a href="javascript:void(0);" class="text-danger float-end" onclick="$('#providers_filter').val('').change()">
                <i class="fa-solid fa-xmark"></i>
            </a></div>`;
        }
        if(user!=''){
            f_user=`<div class="col-12 col-md-6"><b>Usuarios: </b>`;
            var selectedTexts = $('#users_filter').find('option:selected').map(function() {
                return $(this).text();
            }).toArray();
            $.each(selectedTexts, function () {
                if( f_user=='<div class="col-12 col-md-6"><b>Usuarios: </b>'){ f_user+=` ${this}`;}
                else { f_user+=`, ${this}`;}
            });
            f_user+=`<a href="javascript:void(0);" class="text-danger float-end" onclick="$('#users_filter').val('').change()">
                <i class="fa-solid fa-xmark"></i>
            </a></div>`;
        }
        if(budget!=''){
            f_budget=`<div class="col-12 col-md-6"><b>Presupuestos: </b>`;
            var selectedTexts = $('#budgets_filter').find('option:selected').map(function() {
                return $(this).text();
            }).toArray();
            $.each(selectedTexts, function () {
                if( f_budget=='<div class="col-12 col-md-6"><b>Presupuestos: </b>'){ f_budget+=` ${this}`;}
                else { f_budget+=`, ${this}`;}
            });
            f_budget+=`<a href="javascript:void(0);" class="text-danger float-end" onclick="$('#budgets_filter').val('').change()">
                <i class="fa-solid fa-xmark"></i>
            </a></div>`;
        }

        if(fecha!='' || type!='' || money!='' || doc!='' || pay!='' || client != '' || provider != '' || user != '' || budget != ''){
            $('#filtrosaplicados').append(`<div class="alert alert-type1 py-2" role="alert">
                <div class="row">
                    ${fecha!='' ? f_fecha : ''}
                    ${type!='' ? f_type : ''}
                    ${money!='' ? f_money : ''}
                    ${doc!='' ? f_doc : ''}
                    ${pay!='' ? f_pay : ''}
                    ${client!='' ? f_client : ''}
                    ${provider!='' ? f_provider : ''}
                    ${user!='' ? f_user : ''}
                    ${budget!='' ? f_budget : ''}
                </div>
            </div>`);
        }

    }

    callregister('/movement/table',1,$('#table_limit').val(),$('#table_order').val(),'si');
    $('body').on('click','.create',function(){ 
        $('#name').val('');
        $('#description').val('');
        $('#createmovement').modal('show');
    });
    $('body').on('click','.update, .read',function(){ 
        var read = $(this).hasClass('read') ? true : false;
        if (read == true) {document.getElementById("modal-title-edit-movement").innerHTML = "Ver Movimiento";}
        else {document.getElementById("modal-title-edit-movement").innerHTML = "Editar Movimiento";}

        $('#formeditmovement').attr('action',app_url+"/movement/"+$(this).data('id'));

        form = document.getElementById("formeditmovement");
        $( form.elements ).each(function( index ) {
            if($(this).attr('name') != '_method' && $(this).attr('name') != '_token'){
                $(this).val('');
            } 
        });

        $('#editmovement').modal('show');

        $('#modal-body-edit-movement-roller').removeClass('d-none');
        $('#modal-body-edit-movement-error').addClass('d-none');
        
        $('#modal-footer-edit-movement').addClass('d-none');

        $.ajax({contenttype : 'application/json; charset=utf-8',
            url : $('meta[name="app_url"]').attr('content')+'/movement/'+$(this).data('id')+'/edit',
            type : 'GET',
            done : function(response) { $('#modal-body-edit-movement-error').removeClass('d-none'); },
            error : function(jqXHR,textStatus,errorThrown) { $('#modal-body-edit-movement-error').removeClass('d-none'); },
            success : function(data) {
                $.each( data , function( index, value ) {
                    $( form.elements ).each(function( b ) {
                        if($(this).attr('name') == index){
                            $(this).val(value);
                            if (index != 'type_origin' && index != 'client_id' && index != 'provider_id' && index != 'user_id' && index != 'budget_id'){
                                $(this).change();
                            }
                        }
                        if($(this).attr('name') == 'money' && (index == 'deposit' || index == 'expense')){
                            if (value>0) { $(this).val(value);}
                        }
                        if($(this).attr('name') == 'bank_account' && index == 'bank_accounts_id'){
                            $(this).val(value).change();
                        }
                    });

                    if (index == 'client_id' && value != null){
                        $('#client_id_hide').val(value);
                        $('#budget_id_hide').val(data.budget_id);
                        $('#budget_item_id_hide').val(data.budget_item_id);
                        $('#type_origin_e').val('client').change();
                        $('#client_e').removeClass('d-none');
                        $('#budget_e').removeClass('d-none');
                        $('#budget_item_e').removeClass('d-none');
                    }
                    if (index == 'provider_id' && value != null){
                        $('#provider_id_hide').val(value);
                        $('#type_origin_e').val('provider').change();
                        $('#provider_e').removeClass('d-none');
                    }
                    if (index == 'user_id' && value != null){
                        $('#user_id_hide').val(value);
                        $('#type_origin_e').val('user').change();
                        $('#user_e').removeClass('d-none');
                    }
                });
                $('#modal-body-edit-movement').removeClass('d-none');
                if (read == false) {
                    $('#modal-footer-edit-movement').removeClass('d-none');
                }
                
            }
        }).always(function() {
            $('#modal-body-edit-movement-roller').addClass('d-none');
        });
    });
    
    $('body').on('click','.delete',function(){ 
        rolid=$(this).data('id');
        Swal.fire({
            title: "Borrar Movimiento",
            html: "Esta seguro que desea eliminar el movimiento "+$(this).data('name')+"?<br>No podrá revertir el cambio.",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Borrar",
            cancelButtonText: `Cancelar`,
        }).then((result) => {
            if (result.dismiss != 'cancel') {
                $('#formdestroy').attr('action',app_url+"/movement/"+$(this).data('id'));
                $('#formdestroy').submit();
            }
        });
    });
    $("#type_origin_c, #type_origin_e").on('change',function () {
        url_query = '';
        add_data=""

        if($(this).val() == 'client'){
            url_query = `/${$(this).val()}/table`;
        }else if($(this).val() == 'provider'){
            url_query = `/${$(this).val()}/table`;
        }else if($(this).val() == 'user'){
            url_query = `/${$(this).val()}s/table`;
        }
        
        if($(this).attr('id') == 'type_origin_c'){
            $('#client_c').addClass('d-none');
            $('#budget_c').addClass('d-none');
            $('#provider_c').addClass('d-none');
            $('#user_c').addClass('d-none');

            $('#client_id_c').empty();
            $('#provider_id_c').empty();
            $('#user_id_c').empty();

            if($(this).val() == 'client'){
                $('#client_c').removeClass('d-none');
                add_data='#client_id_c';
            }else if($(this).val() == 'provider'){
                $('#provider_c').removeClass('d-none');
                add_data='#provider_id_c';
            }else if($(this).val() == 'user'){
                $('#user_c').removeClass('d-none');
                add_data='#user_id_c';
            }
            if(url_query != ''){
                getdataselect(url_query,add_data, null, '', 'createmovement');
            }
        }else if($(this).attr('id') == 'type_origin_e'){
            $('#client_e').addClass('d-none');
            $('#budget_e').addClass('d-none');
            $('#provider_e').addClass('d-none');
            $('#user_e').addClass('d-none');

            $('#client_id_e').empty();
            $('#provider_id_e').empty();
            $('#user_id_e').empty();

            if($(this).val() == 'client'){
                $('#client_e').removeClass('d-none');
                add_data='#client_id_e';

                if(url_query != ''){
                    getdataselect(url_query,add_data, null, $('#client_id_hide').val(), 'editmovement');
                }
            }else if($(this).val() == 'provider'){
                $('#provider_e').removeClass('d-none');
                add_data='#provider_id_e';
                if(url_query != ''){
                    getdataselect(url_query,add_data, null, $('#provider_id_hide').val(), 'editmovement');
                }
            }else if($(this).val() == 'user'){
                $('#user_e').removeClass('d-none');
                add_data='#user_id_e';
                if(url_query != ''){
                    getdataselect(url_query,add_data, null, $('#user_id_hide').val(), 'editmovement');
                }
            }
        }

    });
    
    $("#client_id_c, #client_id_e").on('change',function () {
        if($(this).attr('id') == 'client_id_c'){
            campoevaluar="budget_c"
        } else if($(this).attr('id') == 'client_id_e'){
            campoevaluar="budget_e"
        }
        $('#'+campoevaluar).addClass('d-none');
        if($(this).val() != ''){
            $('#'+campoevaluar).removeClass('d-none');
            $('#'+campoevaluar+'_id').empty();
            $('.spinner-budget').removeClass('d-none');
            $.ajax({contenttype : 'application/json; charset=utf-8',
                url : $('meta[name="app_url"]').attr('content')+`/budget/client/${$(this).val()}`,
                type : 'GET',
                success : function(data) {
                    selects='<option value=""></option>';
                    $.each(data, function (key, val) {
                        selected_option = ($('#budget_id_hide').val() == val.id) ? 'selected' : '';
                        selects+=`<option value="${val.id}" ${selected_option}>${val.name}${val.total_dollars > 0 ? ' - USD: '+val.total_dollars : ''}${val.total_pesos > 0 ? ' - $: '+val.total_pesos : ''}${val.total_jus > 0 ? ' - JUS: '+val.total_jus : ''}</option>`;
                    });
                    $('#'+campoevaluar+'_id').append(selects);
                }
            }).always(function() {
                $('.spinner-budget').addClass('d-none');
                if(campoevaluar == 'budget_e' && $('#budget_id_hide').val() != ''){
                    $('#budget_e_id').change();
                };
            });
        } 
    });

    $("#budget_c_id, #budget_e_id").on('change',function () {
        if($(this).attr('id') == 'budget_c_id'){
            campoevaluar="budget_item_c"
        } else if($(this).attr('id') == 'budget_e_id'){
            campoevaluar="budget_item_e"
        }
        $('#'+campoevaluar).addClass('d-none');
        if($(this).val() != ''){
            $('#'+campoevaluar).removeClass('d-none');
            $('#'+campoevaluar+'_id').empty();
            $('.spinner-budget-item').removeClass('d-none');
            $.ajax({contenttype : 'application/json; charset=utf-8',
                url : $('meta[name="app_url"]').attr('content')+`/budget/${$(this).val()}`,
                type : 'GET',
                success : function(data) {
                    selects='<option value=""></option>';
                    $.each(data.budget_items, function (key, val) {
                        selected_option = ($('#budget_item_id_hide').val() == val.id) ? 'selected' : '';
                        selects+=`<option value="${val.id}" ${selected_option}>${val.service_name}${val.type_money == 'dolar' ? ' - USD: ': (val.type_money == 'jus' ? ' - JUS: ': ' - $: ')}${val.price}</option>`;
                    });
                    $('#'+campoevaluar+'_id').append(selects);
                }
            }).always(function() {
                $('.spinner-budget-item').addClass('d-none');
            });
        } 
    });

    function getdataselect(url_query,add_data, var_search, selected, parent){
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
                selects='<option value="" class="select-empty" style="color: #aaa;">Seleccione una opcion ...</option>';
                $.each(data.datos, function (key, val) {
                    selected_option = '';
                    if(selected!=null){
                        selected_option = (selected == val.id) ? 'selected' : '';
                    }
                    
                    if(add_data == '#user_id_c' || add_data == '#user_id_e' || add_data == '#users_filter'){
                        selects+=`<option value="${val.id}" ${selected_option}>${val.name}</option>`;
                    } else if(add_data == '#budgets_filter'){
                        selects+=`<option value="${val.id}" ${selected_option}>${val.budget_name}</option>`;
                    } else{
                        selects+=`<option value="${val.id}" ${selected_option}>${val.first_name} ${val.last_names}</option>`;
                    }
                });
                $(add_data).append(selects);
            }
        }).always(function() {
            $('.spinner-data').addClass('d-none');
            if (add_data == '#client_id_e') { $('#client_id_e').change();}
            $( add_data ).select2( {
                theme: "bootstrap-5",
                width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
                placeholder: 'Seleccione una opcion',
                dropdownParent: $('#'+parent),
                language: 'es'
            } );

            if (add_data.includes('_filter')) {
                $(add_data).select2('open');
            }
        });
    }
    
    $('body').on('keyup','.select2-search__field',function(){
        var parent = $(this).parent().parent().parent().parent().attr('id');
        padre = $(this).parent().parent().parent().parent().parent();
        var varsearch=this.value;
        clearInterval(controladorTiempo);
        controladorTiempo = setInterval(function () {
            url_query = '';
            add_data="";
                
            if (parent == 'createmovement') {
                if($("#type_origin_c").val() == 'client'){
                    url_query = `/${$("#type_origin_c").val()}/table`;
                }else if($("#type_origin_c").val() == 'provider'){
                    url_query = `/${$("#type_origin_c").val()}/table`;
                }else if($("#type_origin_c").val() == 'user'){
                    url_query = `/${$("#type_origin_c").val()}s/table`;
                }
                if($("#type_origin_c").val() == 'client'){
                    $('#client_id_c').empty();
                    $('#client_c').removeClass('d-none');
                    add_data='#client_id_c';
                }else if($("#type_origin_c").val() == 'provider'){
                    $('#provider_id_c').empty();
                    $('#provider_c').removeClass('d-none');
                    add_data='#provider_id_c';
                }else if($("#type_origin_c").val() == 'user'){
                    $('#user_id_c').empty();
                    $('#user_c').removeClass('d-none');
                    add_data='#user_id_c';
                }
            } else if (parent == 'editmovement') {
                if($("#type_origin_e").val() == 'client'){
                    url_query = `/${$("#type_origin_e").val()}/table`;
                }else if($("#type_origin_e").val() == 'provider'){
                    url_query = `/${$("#type_origin_e").val()}/table`;
                }else if($("#type_origin_e").val() == 'user'){
                    url_query = `/${$("#type_origin_e").val()}s/table`;
                }
                if($("#type_origin_e").val() == 'client'){
                    $('#client_id_e').empty();
                    $('#client_e').removeClass('d-none');
                    add_data='#client_id_e';
                }else if($("#type_origin_e").val() == 'provider'){
                    $('#provider_id_e').empty();
                    $('#provider_e').removeClass('d-none');
                    add_data='#provider_id_e';
                }else if($("#type_origin_e").val() == 'user'){
                    $('#user_id_e').empty();
                    $('#user_e').removeClass('d-none');
                    add_data='#user_id_e';
                }
            } else if( parent == undefined ){
                idpadrefilter = $($(padre).children()[1]).prop('id');
                if(idpadrefilter == 'clients_filter'){
                    url_query = `/client/table`;
                } else if(idpadrefilter == 'providers_filter'){
                    url_query = `/provider/table`;
                } else if(idpadrefilter == 'budgets_filter'){
                    url_query = `/budget/table`;
                }

                if(idpadrefilter != undefined && url_query != ''){
                    add_data=`#${idpadrefilter}`;
                    $(add_data).empty();
                    parent = 'offcanvasFiltersMovs';
                }
                
            }
            
            if(url_query != ''){
                getdataselect(url_query,add_data, varsearch, '', parent);
            }
            
            clearInterval(controladorTiempo); //Limpio el intervalo
        
        }, 400);
        

    });
    $('body').on('click',"#btn-create-movement",function () {
        var error = 0
        form = document.getElementById("formnewmovement");

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
            document.getElementById("formnewmovement").submit();
        }
    });
    $('body').on('click',"#btn-update-movement",function () {
        var error = 0
        form = document.getElementById("formeditmovement");

        $( form.getElementsByClassName('validate') ).each(function( index ) {
            if($( this ).val() == ''){
                $( this ).css('box-shadow', 'inset 0px 0px 2px 2px red');
                error++;
            } else {
                $( this ).css('box-shadow', '');
            }
        });
        if (error > 0) {
            toastr["error"]("Debe completar los datos correctamente para editar el Movimiento.")
        } else {
            document.getElementById("formeditmovement").submit();
        }
    });
    $('body').on('change',"#table_limit",function () {
        callregister('/movement/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
    });
    $('body').on('click',".column_orden", function(){
        var name = $(this).data('name');
        orden = name+' ASC';

        if ($(this).hasClass('sorttable_sorted'))  { orden = name+' DESC';}

        $('#table_order').val(orden);
        if($('#table_filtrados').val() != $('#table_totales').val()){
            callregister('/movement/table',1,$('#table_limit').val(),orden,'si')
        }
    });
    $('#table_search').on('change, keyup',function() {            
        if($('#table_filtrados').val() != $('#table_totales').val()){   
            clearInterval(controladorTiempo);
            controladorTiempo = setInterval(function(){
                callregister('/movement/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
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
    $('body').on('click','.readbudget',function(){ 
        form = document.getElementById("formshowbudget");
        $( form.elements ).each(function( index ) {
            $(this).val('');
        });
        $('#showbudget').modal('show');
                
        $('#print_budget_btn').attr('href', `/budget/pdf/${$(this).data('id')}`);

        $('#modal-body-show-budget-roller').removeClass('d-none');
        $('#modal-body-show-budget-error').addClass('d-none');
        $('#modal-body-show-budget').addClass('d-none');

        $.ajax({contenttype : 'application/json; charset=utf-8',
            url : $('meta[name="app_url"]').attr('content')+'/budget/'+$(this).data('id'),
            type : 'GET',
            done : function(response) { $('#modal-body-edit-budget-error').removeClass('d-none'); },
            error : function(jqXHR,textStatus,errorThrown) { $('#modal-body-edit-budget-error').removeClass('d-none'); },
            success : function(data) {
                $('#client_show').val(data.budget.client_name);
                $('#fecha_show').val(data.budget.fecha_format);
                $('#valid_show').val(data.budget.valid);
                $('#estatus_show').val(data.budget.estatus);
                $('#observations_show').val(data.budget.observations);
                $('#payment_methods_show').val(data.budget.payment_methods);
                $('#includes_show').val(data.budget.includes);
                $('#not_includes_show').val(data.budget.not_includes);
                $('#clarifications_show').val(data.budget.clarifications);
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
                $.each(data.budget_items, function(index, item) {
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

                $('#modal-body-show-budget').removeClass('d-none');
            }
        }).always(function() {
            $('#modal-body-show-budget-roller').addClass('d-none');
        });
    });
    $.each($('select'), function() {
        if ($(this).val() == '') {
            $(this).addClass('select-empty');   
        } else {
            $(this).removeClass('select-empty');
        }
    });

    $('select').on('change', function(ev) {
        if ($(this).val() == '') {
            $(this).addClass('select-empty');
        } else {
            $(this).removeClass('select-empty');
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
                    btn += `<li><a href="javascript:void(0);" data-id="${val.id}" class="dropdown-item delete" data-name="${val.id} de ${val.cliente} de tipo ${val.type_document} por el monto ${val.type_money} ${formatter.format(val.deposit > 0 ? val.deposit : val.expense)} de tipo ${val.type_payment}">
                        <i class="flaticon-delete"></i> Eliminar
                    </a></li>`
                }
        btn += `</ul></div>`;

        body += `<tr id="${val.id}">
            <td class="align-middle">${val.fecha}</td>
            <td class="align-middle">${val.type}</td>
            <td class="align-middle">${val.cliente}</td>
            <td class="align-middle">
                <a href="javascript:void(0);" class="readbudget" data-id="${val.budget_id}">${val.budget_name}</a>
            </td>
            <td class="align-middle">${val.type_document}</td>
            <td class="align-middle">${val.type_payment}</td>
            <td class="align-middle">${val.payment_detail ?? ''}</td>
            <td class="align-middle">${val.concepto ?? ''}</td>
            <td class="align-middle">${val.type_money}</td>
            <td class="align-middle">${formatter.format(val.deposit)}</td>
            <td class="align-middle">${formatter.format(val.expense)}</td>
            <td class="align-middle">${btn}</td>
        </tr>`;

        bodysmall += `<div class="col-11 mb-3 mx-3">
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Fecha</div>
                <div class="col-6 border p-1 text-center">${val.fecha}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Tipo</div>
                <div class="col-6 border p-1 text-center">${val.type}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Cliente</div>
                <div class="col-6 border p-1 text-center">${val.cliente}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small"># Pres.</div>
                <div class="col-6 border p-1 text-center">${val.budget_name}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Documento</div>
                <div class="col-6 border p-1 text-center">${val.type_document}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Tipo Pago</div>
                <div class="col-6 border p-1 text-center">${val.type_payment}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Detalle</div>
                <div class="col-6 border p-1 text-center">${val.payment_detail ?? ''}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Concepto</div>
                <div class="col-6 border p-1 text-center">${val.concepto ?? ''}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Moneda</div>
                <div class="col-6 border p-1 text-center">${val.type_money}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Ingreso</div>
                <div class="col-6 border p-1 text-center">${val.deposit}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Egreso</div>
                <div class="col-6 border p-1 text-center">${val.expense}</div>
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

function getlistbankaccounts(element){
    parent = $(element).parent().parent().parent().parent().parent().parent().parent().parent().attr('id');
    if (parent == 'createmovement') {
        form = document.getElementById("formnewmovement");
        typemoney = form.querySelectorAll('[name="type_money"]')[0].value;
        $('[name="bank_account"]').val('');
        $( form.querySelectorAll('[name="bank_account"]')[0].children ).each(function( index ) {
            if (index > 0) {
                if($(this).data('type') != typemoney) {$(this).addClass('d-none')}
                else{$(this).removeClass('d-none')}
            }
        });
    } else if (parent == 'editmovement') {

        form = document.getElementById("formeditmovement");
        typemoney = form.querySelectorAll('[name="type_money"]')[0].value;
        $( form.querySelectorAll('[name="bank_account"]')[0].children ).each(function( index ) {
            if (index > 0) {
                if($(this).data('type') != typemoney) {$(this).addClass('d-none')}
                else{$(this).removeClass('d-none')}
            }
        });
    }
}

function labelbankaccounts(value,element){
    parent = $(element).parent().parent().parent().parent().parent().parent().parent().parent().attr('id');

    if (parent == 'createmovement') {
        form = document.getElementById("formnewmovement");
    } else if (parent == 'editmovement') {
        form = document.getElementById("formeditmovement");
    }

    form.querySelector('[name="type_document"]').value = '';
    form.querySelector('[name="type_payment"]').value = '';
    form.querySelector('[name="type_money"]').value = '';
    form.querySelector('[name="bank_account"]').value = '';
    if(form.querySelector('[name="bank_account_dest"]') != null){
        form.querySelector('[name="bank_account_dest"]').value = '';
    }
    form.querySelector('[name="type_origin"]').value = '';
    $(form.querySelector('[name="type_origin"]')).change();
    text='Cuenta origen';
    if (value=="ingreso") { 
        text='Cuenta destino'; 
        $(form.querySelector('[name="type_document"]')).children().each(function() {
            if($(this).data('type') == 'I' || $(this).data('type') == 'IE' || $(this).data('type') == undefined){
                $(this).removeClass('d-none');
            } else {
                $(this).addClass('d-none');
            }
        });
        $(form.querySelector('[name="type_origin"]')).children().each(function() {
            if($(this).val() == 'provider' || $(this).val() == 'caja'){$(this).addClass('d-none');}
            else {$(this).removeClass('d-none');}
        });
    } else if (value=="egreso") { 
        $(form.querySelector('[name="type_document"]')).children().each(function() {
            if($(this).data('type') == 'E' || $(this).data('type') == 'IE' || $(this).data('type') == undefined){
                $(this).removeClass('d-none');
            } else {
                $(this).addClass('d-none');
            }
        });
        $(form.querySelector('[name="type_origin"]')).children().each(function() {
            $(this).removeClass('d-none');
        });
    } else if (value=="cambio") {
        $(form.querySelector('[name="type_document"]')).children().each(function() {
            if($(this).text().toLowerCase().includes('cambio usd')){
                $(this).removeClass('d-none').prop('selected', true);
            } else {
                $(this).addClass('d-none');
            }
        });
        $(form.querySelector('[name="type_origin"]')).children().each(function() {
            if($(this).val() != 'client'){$(this).addClass('d-none');}
            else {$(this).removeClass('d-none').prop('selected', true).change();}
        });
    } else if (value=="caja") {
        $(form.querySelector('[name="type_document"]')).children().each(function() {
            if($(this).text().toLowerCase().includes('caja')){
                $(this).removeClass('d-none').prop('selected', true);
            } else {
                $(this).addClass('d-none');
            }
        });
        $(form.querySelector('[name="type_origin"]')).children().each(function() {
            if($(this).val() == 'provider'){$(this).addClass('d-none');}
            else {$(this).removeClass('d-none');}
        });
    }
    
    if(value == 'cambio'){
        $(form.querySelector('[name="type_payment"]')).children().each(function() {
            if($(this).val() == 'efectivo'){
                $(this).prop('selected', true);
            } else {
                $(this).prop('disabled', 'disabled');
            }
        });
        $(form.querySelector('[name="type_money"]')).children().each(function() {
            if($(this).val() == 'dolar'){
                $(this).prop('selected', true).change();
            } else {
                $(this).prop('disabled', 'disabled');
            }
        });
        $(form.querySelector('[name="bank_account"]')).children().each(function() {
            if($(this).data('type') == 'dolar'){
                $(this).prop('selected', true).change();
            }
        });
        $(form.querySelector('[name="bank_account_dest"]')).children().each(function() {
            $(this).prop('selected', true).change();
        });
        $(form.querySelector('[name="priceusd"]')).parent().parent().removeClass('d-none');
        $(form.querySelector('[name="bank_account_dest"]')).parent().parent().removeClass('d-none');
    } else {
        $(form.querySelector('[name="type_payment"]')).children().each(function() {
            $(this).removeAttr("disabled");
        });
        $(form.querySelector('[name="type_money"]')).children().each(function() {
            $(this).removeAttr("disabled");
        });
        $(form.querySelector('[name="priceusd"]')).parent().parent().addClass('d-none');
        $(form.querySelector('[name="bank_account_dest"]')).parent().parent().addClass('d-none');
    }
}

