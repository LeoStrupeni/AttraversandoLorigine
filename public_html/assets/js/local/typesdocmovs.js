$(document).ready(function() {
    callregister('/typesdocmov/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
    $('body').on('click','.create',function(){ 
        $('#name').val('');
        $('#description').val('');
        $('#type').val('');
        $('#createtypesdocmov').modal('show')}
    );
    $('body').on('click','.update',function(){ 
        $('#formedittypesdocmov').attr('action',app_url+"/typesdocmov/"+$(this).data('id'));

        $('#e_name').val('');
        $('#e_description').val('');
        $('#edittypesdocmov').modal('show');

        $('#modal-body-edit-typesdocmov-roller').removeClass('d-none');
        $('#modal-body-edit-typesdocmov-error').addClass('d-none');
        $('#modal-body-edit-typesdocmov').addClass('d-none');
        $('#modal-footer-edit-typesdocmov').addClass('d-none');

        $.ajax({contenttype : 'application/json; charset=utf-8',
            url : $('meta[name="app_url"]').attr('content')+'/typesdocmov/'+$(this).data('id')+'/edit',
            type : 'GET',
            done : function(response) { $('#modal-body-edit-typesdocmov-error').removeClass('d-none'); },
            error : function(jqXHR,textStatus,errorThrown) { $('#modal-body-edit-typesdocmov-error').removeClass('d-none'); },
            success : function(data) {
                $('#e_name').val(data.name);
                $('#e_description').val(data.description);
                $('#e_type').val(data.type);
                $('#modal-body-edit-typesdocmov').removeClass('d-none');
                $('#modal-footer-edit-typesdocmov').removeClass('d-none');
            }
        }).always(function() {
            $('#modal-body-edit-typesdocmov-roller').addClass('d-none');
        });
    });
    $('body').on('click','.read',function(){ 
        $('#s_name').val('');
        $('#s_description').val('');
        $('#showtypesdocmov').modal('show');

        $('#modal-body-show-typesdocmov-roller').removeClass('d-none');
        $('#modal-body-show-typesdocmov-error').addClass('d-none');
        $('#modal-body-show-typesdocmov').addClass('d-none');

        $.ajax({contenttype : 'application/json; charset=utf-8',
            url : $('meta[name="app_url"]').attr('content')+'/typesdocmov/'+$(this).data('id')+'/edit',
            type : 'GET',
            done : function(response) { $('#modal-body-edit-typesdocmov-error').removeClass('d-none'); },
            error : function(jqXHR,textStatus,errorThrown) { $('#modal-body-edit-typesdocmov-error').removeClass('d-none'); },
            success : function(data) {
                $('#s_name').val(data.name);
                $('#s_description').val(data.description);
                if(data.type == 'I'){type = 'Ingreso';}
                else if(data.type == 'E'){type = 'Egreso';}
                else{type = 'Ingreso / Egreso';}
                $('#s_type').val(type);
                $('#modal-body-show-typesdocmov').removeClass('d-none');
            }
        }).always(function() {
            $('#modal-body-show-typesdocmov-roller').addClass('d-none');
        });
    });    
    $('body').on('click','.delete',function(){ 
        typesdocmovid=$(this).data('id');
        Swal.fire({
            title: "Borrar Tipo de Movimiento",
            html: "Esta seguro que desea eliminar al tipo "+$(this).data('name')+"?<br>No podrá revertir el cambio.",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Borrar",
            cancelButtonText: `Cancelar`,
        }).then((result) => {
            if (result.dismiss != 'cancel') {
                $('#formdestroy').attr('action',app_url+"/typesdocmov/"+$(this).data('id'));
                $('#formdestroy').submit();
            }
        });
    });
    
    $('body').on('click',"#btn-create-typesdocmov",function () {
        form = document.getElementById("formnewtypesdocmov");
        error = validateinputsform(form);
       
        if (error > 0) {
            toastr["error"]("Debe completar los datos correctamente para generar el nuevo registro.")
        } else {
            document.getElementById("formnewtypesdocmov").submit();
        }
    });
    $('body').on('click',"#btn-update-typesdocmov",function () {
        form = document.getElementById("formedittypesdocmov");
        error = validateinputsform(form);
        if (error > 0) {
            toastr["error"]("Debe completar los datos correctamente para editar el registro.")
        } else {
            document.getElementById("formedittypesdocmov").submit();
        }
    });
    $('body').on('change',"#table_limit",function () {
        callregister('/typesdocmov/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
    });
    $('body').on('click',".column_orden", function(){
        var name = $(this).data('name');
        orden = name+' ASC';

        if ($(this).hasClass('sorttable_sorted'))  { orden = name+' DESC';}

        $('#table_order').val(orden);
        if($('#table_filtrados').val() != $('#table_totales').val()){
            callregister('/typesdocmov/table',1,$('#table_limit').val(),orden,'si')
        }
    });
    var controladorTiempo = 3000;
    $('#table_search').on('change, keyup',function() {            
        if($('#table_filtrados').val() != $('#table_totales').val()){   
            clearInterval(controladorTiempo);
            controladorTiempo = setInterval(function(){
                callregister('/typesdocmov/table',1,$('#table_limit').val(),$('#table_order').val(),'si')
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
    bodysmall='';
    const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 2,maximumFractionDigits: 2,});

    $.each(data.datos, function (key, val) {
        imagen = val.imagen;
        if(imagen == ''){imagen = app_url+"/assets/media/avatar.jpg"}

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

                if ( data.permissions.includes('delete') && val.name != 'sistema' ){
                    btn += `<li><a href="javascript:void(0);" data-id="${val.id}" class="dropdown-item delete" data-name="${val.name}">
                        <i class="flaticon-delete"></i> Eliminar
                    </a></li>`
                }
        btn += `</ul></div>`;
        body += `<tr id="${val.id}">
            <td class="align-middle">${val.name}</td>
            <td class="align-middle">${val.description ?? ''}</td>
            <td class="align-middle">${val.type == 'I' ? 'Ingreso' : (val.type == 'E' ? 'Egreso' : 'Ingreso / Egreso' )}</td>
            <td class="align-middle">${btn}</td>
        </tr>`;

        bodysmall += `<div class="col-11 mb-3 mx-3">
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Nombre</div>
                <div class="col-6 border p-1 text-center">${val.name}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Descripcion</div>
                <div class="col-6 border p-1 text-center">${val.description ?? ''}</div>
            </div>
            <div class="row">
                <div class="col-6 bg-type1 border text-center text-nowrap fw-medium p-1 titles_table_small">Tipo</div>
                <div class="col-6 border p-1 text-center">${val.type == 'I' ? 'Ingreso' : (val.type == 'E' ? 'Egreso' : 'Ingreso / Egreso' )}</div>
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