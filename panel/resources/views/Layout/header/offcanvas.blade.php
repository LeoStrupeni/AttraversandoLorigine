<button type="button" class="btn btn-link rounded-circle p-0 me-3" data-bs-toggle="offcanvas" href="#offcanvasMenu" >
    <span class="navbar-toggler-icon"></span>
</button>

<div class="offcanvas offcanvas-start" data-bs-scroll="false" tabindex="-1" id="offcanvasMenu" aria-labelledby="offcanvasMenuLabel">
    <div class="offcanvas-header">
      <a href="{{ url('/') }}">
        <img src="{{env('APP_URL')}}/assets/media/originales/logo_lignos_seguro.png" alt="Logo" height="60">
      </a>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" style="background-color: white !important;opacity: 1;"></button>
    </div>
    <div class="offcanvas-body">
      <div>
       
      </div>
      <ul class="list-unstyled ps-0">
        <li class="mb-2">
          <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed ms-2" data-bs-toggle="collapse" data-bs-target="#coc-administracion" aria-expanded="false">
            Administracion
          </button>
          <div class="collapse" id="coc-administracion">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                href="{{ url('/') }}">Home</a>
              </li>
              <li>
                <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                href="{{ route('client.index') }}">Clientes</a>
              </li>
              <li>
                <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                href="{{ route('provider.index') }}">Proveedores</a>
              </li>
              <li>
                <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                href="{{ route('service.index') }}">Servicios</a>
              </li>
              <li>
                <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                href="{{ route('service_package.index') }}">Paquetes</a>
              </li>
              <li>
                <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                href="{{ route('typesdocmov.index') }}">Tipos de Movimientos</a>
              </li>
              <li>
                <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                href="{{ route('account.index') }}">Cuentas</a>
              </li>
            </ul>
          </div>
        </li>
        <li class="mb-2">
          <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed ms-2" data-bs-toggle="collapse" data-bs-target="#coc-configuracion" aria-expanded="false">
            Configuración
          </button>
          <div class="collapse" id="coc-configuracion">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                  href="{{ route('users.index') }}">Usuarios</a>
              </li>
              <li>
                <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                  href="{{ route('roles.index') }}">Roles</a>
              </li>
              @if (Session::get('user')['roles'][0] == 'sistema' || Session::get('user')['roles'][0] == 'admin')
                <li>
                  <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                    href="{{ route('permission.index') }}">Permisos</a>
                </li>
              @endif
              <li>
                <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                  href="{{ route('budget_type.index') }}">Modelos de Presupuestos</a>
              </li>
              <li>
                <a class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4" 
                  href="{{ route('balances.index') }}">Saldos Iniciales</a>
              </li>
            </ul>
          </div>
        </li>
        
        <li class="border-top my-3"></li>
        <li class="mb-2">
            <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed ms-2" data-bs-toggle="collapse" data-bs-target="#coc-account" aria-expanded="false">
                Usuario
            </button>
            <div class="collapse" id="coc-account">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li><a href="#" class="link-body-emphasis d-inline-flex text-decoration-none rounded ms-4">Perfil</a></li>
                    <li>
                        <form action="/logout" method="post" style="display: inline;">
                            @csrf
                            <a class="dropdown-item py-3" href="#" onclick="this.closest('form').submit()">Logout</a>
                        </form>
                    </li>
                </ul>
            </div>
        </li>
      </ul>
    </div>
</div>