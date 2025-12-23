
$(document).ready(function() {
    $('#fechaC, #fechaE').datepicker("setDate", new Date());
    callregister('/balances/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
    $('body').on('click','.create',function(){ 
        $("#formnewbalances").trigger("reset");
        $('#fechaC').datepicker("setDate", new Date());
        $('#createbalances').modal('show')}
    );
    $('body').on('click','.update',function(){ 
        $('#formeditbalances').attr('action',app_url+"/balances/"+$(this).data('id'));
        form = document.getElementById("formeditbalances");
        $("#formeditbalances").trigger("reset");
        $('#editbalances').modal('show');

        $('#modal-body-edit-balances-roller').removeClass('d-none');
        $('#modal-body-edit-balances-error').addClass('d-none');
        $('#modal-body-edit-balances').addClass('d-none');
        $('#modal-footer-edit-balances').addClass('d-none');

        $.ajax({contenttype : 'application/json; charset=utf-8',
            url : $('meta[name="app_url"]').attr('content')+'/balances/'+$(this).data('id')+'/edit',
            type : 'GET',
            done : function(response) { $('#modal-body-edit-balances-error').removeClass('d-none'); },
            error : function(jqXHR,textStatus,errorThrown) { $('#modal-body-edit-balances-error').removeClass('d-none'); },
            success : function(data) {
                $.each( data , function( index, value ) {
                    $( form.elements ).each(function( b ) {
                        if($(this).attr('name') == index){
                            $(this).val(value.toString().toUpperCase());
                        }
                    });
                });
                $('#modal-body-edit-balances').removeClass('d-none');
                $('#modal-footer-edit-balances').removeClass('d-none');
            }
        }).always(function() {
            $('#modal-body-edit-balances-roller').addClass('d-none');
        });
    });
    $('body').on('click','.delete',function(){ 
        rolid=$(this).data('id');
        Swal.fire({
            title: "Borrar Cuenta",
            html: "Esta seguro que desea eliminar la cuenta "+$(this).data('name')+"?<br>No podrá revertir el cambio.",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Borrar",
            cancelButtonText: `Cancelar`,
        }).then((result) => {
            if (result.dismiss != 'cancel') {
                $('#formdestroy').attr('action',app_url+"/balances/"+$(this).data('id'));
                $('#formdestroy').submit();
            }
        });
    });

    $('body').on('click',"#btn-create-balances",function () {
        form = document.getElementById("formnewbalances");
        error = validateinputsform(form);
        if (error > 0) {
            toastr["error"]("Debe completar los datos correctamente.")
        } else {
            document.getElementById("formnewbalances").submit();
        }
    });
    $('body').on('click',"#btn-update-balances",function () {
        form = document.getElementById("formeditbalances");
        error = validateinputsform(form);
 
        if (error > 0) {
            toastr["error"]("Debe completar los datos correctamente para editar la Cuenta.")
        } else {
            document.getElementById("formeditbalances").submit();
        }
    });
    $('body').on('change',"#table_limit",function () {
        callregister('/balances/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
    });
    $('body').on('click',".column_orden", function(){
        var name = $(this).data('name');
        orden = name+' ASC';

        if ($(this).hasClass('sorttable_sorted'))  { orden = name+' DESC';}

        $('#table_order').val(orden);
        if($('#table_filtrados').val() != $('#table_totales').val()){
            callregister('/balances/table',1,$('#table_limit').val(),orden,'si')
        }
    });
    var controladorTiempo = 3000;
    $('#table_search').on('change, keyup',function() {            
        if($('#table_filtrados').val() != $('#table_totales').val()){   
            clearInterval(controladorTiempo);
            controladorTiempo = setInterval(function(){
                callregister('/balances/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
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

function validateinputsform(form){
    var error = 0
    $( form.getElementsByClassName('validate') ).each(function( index ) {
        if($( this ).val() == ''){
            $( this ).css('box-shadow', 'inset 0px 0px 2px 2px red');
            error++;
        } else {
            $( this ).css('box-shadow', '');
        }
    });
    return error;
}

function tableregister(data, page, callpaginas, url_query){
    body='';
    bodysmall=''
    const formatter = new Intl.NumberFormat('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2,});

    $.each(data.datos, function (key, val) {
        typemoney='JUS';
        if(val.type_money=='peso'){typemoney='$';}
        else if(val.type_money=='dolar'){typemoney='U$S';}

        btn = `<div class="dropdown">
            <button class="btn btn-link dropdown-toggle-menu-body text-type1 py-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-ellipsis"></i>
            </button>
            <ul class="dropdown-menu" >`;
                if( data.permissions.includes('update') ) {
                    btn += `<li><a href="javascript:void(0);" data-id="${val.id}" class="dropdown-item update">
                        <i class="flaticon-upload"></i> Editar
                    </a></li>`
                }

                if ( data.permissions.includes('delete') ){
                    btn += `<li><a href="javascript:void(0);" data-id="${val.id}" class="dropdown-item delete" data-name="${val.first_name} ${val.last_names}">
                        <i class="flaticon-delete"></i> Eliminar
                    </a></li>`
                }
        btn += `</ul></div>`;

        body += `<tr id="${val.id}">
            <td class="align-middle">${val.creado}</td>
            <td class="align-middle">${val.type.toUpperCase()}</td>
            <td class="align-middle">${typemoney}</td>
            <td class="align-middle">${formatter.format(val.price)}</td>
            <td class="align-middle">
                <span class="badge rounded-pill w-100 ${val.status == 'activo' ? 'text-bg-success' : 'text-bg-danger'}">
                    ${val.status.toUpperCase()}
                </span>
            </td>
            <td class="align-middle">${btn}</td>
        </tr>`;

        bodysmall += `<div class="col-11 mb-3 mx-3">
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Fecha</div>
                <div class="col-6 border p-1 text-center">${val.creado}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Tipo</div>
                <div class="col-6 border p-1 text-center">${val.type.toUpperCase()}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Moneda</div>
                <div class="col-6 border p-1 text-center">${val.typemoney}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Precio</div>
                <div class="col-6 border p-1 text-center">${formatter.format(val.price)}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Estado</div>
                <div class="col-6 border p-1 text-center">
                    <span class="badge rounded-pill w-100 ${val.status == 'activo' ? 'text-bg-success' : 'text-bg-danger'}">
                        ${val.status.toUpperCase()}
                    </span>
                </div>
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

