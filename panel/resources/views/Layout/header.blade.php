@auth
    <nav class="navbar navbar-expand-lg p-0 sticky-top" style="background-color: rgb(232 228 217 / 90%) !important; height: 65px;">
        <div class="container-fluid">
            <a class="navbar-brand m-0 ps-1 ps-md-5" href="{{ url('/') }}">
                <img src="{{env('APP_URL')}}/assets/media/originales/logo_lignos_seguro.png" alt="Logo" height="60">
            </a>

            <div class="btn-group d-lg-none" role="group">
                @include('Layout/header/offcanvas')
                @include('Layout/header/avatar')
            </div>

            <div class="collapse navbar-collapse justify-content-start ms-5" id="navbarText">
                <ul class="navbar-nav" style="height: 65px;">
                    <li class="nav-item dropdown btn-header-menu">
                        <button class="btn btn-lg rounded-0 h-100" data-bs-toggle="dropdown" aria-expanded="false">
                            Administracion
                        </button>
                        <ul class="dropdown-menu dropdown-menu-dark rounded-0 p-0">
                            <li><a class="dropdown-item py-3" href="{{ url('/') }}">Home</a></li>
                            <li><a class="dropdown-item py-3" href="{{ route('budget.index') }}">Presupuestos</a></li>
                            <li><a class="dropdown-item py-3" href="{{ route('client.index') }}">Clientes</a></li>
                            <li><a class="dropdown-item py-3" href="{{ route('provider.index') }}">Proveedores</a></li>
                            <li><a class="dropdown-item py-3" href="{{ route('service.index') }}">Servicios</a></li>
                            <li><a class="dropdown-item py-3" href="{{ route('service_package.index') }}">Paquetes</a></li>
                            <li><a class="dropdown-item py-3" href="{{ route('typesdocmov.index') }}">Tipos de Movimientos</a></li>
                            <li><a class="dropdown-item py-3" href="{{ route('account.index') }}">Cuentas</a></li>
                            
                        </ul>
                    </li>

                    <li class="nav-item dropdown btn-header-menu">
                        <button class="btn btn-lg rounded-0 h-100" data-bs-toggle="dropdown" aria-expanded="false">
                            Configuración
                        </button>
                        <ul class="dropdown-menu dropdown-menu-dark rounded-0 p-0">
                            <li><a class="dropdown-item py-3" href="{{ route('users.index') }}">Usuarios</a></li>
                            <li><a class="dropdown-item py-3" href="{{ route('roles.index') }}">Roles</a></li>
                            @if (Session::get('user')['roles'][0] == 'sistema' || Session::get('user')['roles'][0] == 'admin')
                                <li><a class="dropdown-item py-3" href="{{ route('permission.index') }}">Permisos</a></li>   
                            @endif
                            <li><a class="dropdown-item py-3" href="{{ route('budget_type.index') }}">Modelos de Presupuestos</a></li>
                            <li><a class="dropdown-item py-3" href="{{ route('balances.index') }}">Saldos Iniciales</a></li>   
                        </ul>
                    </li>
 
                    {{-- <li class="nav-item dropdown btn-header-menu">
                        <button class="btn btn-lg rounded-0 h-100" data-bs-toggle="dropdown" aria-expanded="false">
                            Usuario
                        </button>
                        <ul class="dropdown-menu dropdown-menu-dark rounded-0 p-0">
                            <li>
                                <a class="dropdown-item py-3" href="#">Perfil</a>
                            </li>
                            <li>
                                <form action="/logout" method="post" style="display: inline;">
                                    @csrf
                                    <a class="dropdown-item py-3" href="#" onclick="this.closest('form').submit()">Logout</a>
                                </form>
                            </li>
                        </ul>
                    </li> --}}

                </ul>
            </div>
            <div class="d-none d-lg-block">
                @include('Layout/header/avatar')
            </div>
            
        </div>
    </nav>  
@else 
    @if ($_SERVER['REQUEST_URI'] != '/login' && $_SERVER['REQUEST_URI'] != '/password/reset' )
        <nav class="navbar navbar-expand-lg p-0 sticky-top" style="background-color: rgb(204 204 204 / 90%) !important; height: 65px;" id="navheaderpublic">
            <div class="container-fluid">
                <a class="navbar-brand m-0 ps-5" href="#">
                    <img src="{{env('APP_URL')}}/assets/media/Logo.png" alt="Logo" id="navheaderlogo" height="60">
                </a>
                {{-- <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button> --}}

                <div class="btn-group d-lg-none" role="group">
                    @include('Layout/header/offcanvaspublic')
                </div>

                <div class="collapse navbar-collapse justify-content-end pe-5" id="navbarText">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <button type="button" class="btn rounded-0 ir" aria-current="page" data-href="inicio" style="height: 65px!important;">
                                Inicio
                            </button>
                        </li>
                        <li class="nav-item">
                            <button type="button" class="btn rounded-0 ir" aria-current="page" data-href="tramites" style="height: 65px!important;">
                                Trámites
                            </button>
                        </li>
                        <li class="nav-item">
                            <button type="button" class="btn rounded-0 ir" aria-current="page" data-href="nosotros" style="height: 65px!important;">
                                Nosotros
                            </button>
                        </li>
                        <li class="nav-item">
                            <button type="button" class="btn rounded-0 ir" aria-current="page" data-href="novedades" style="height: 65px!important;">
                                Novedades
                            </button>
                        </li>
                        <li class="nav-item">
                            <button type="button" class="btn rounded-0 ir" aria-current="page" data-href="quienessomos" style="height: 65px!important;">
                                Quienes somos
                            </button>
                        </li>
                        <li class="nav-item">
                            <button type="button" class="btn rounded-0 ir" aria-current="page" data-href="contacto" style="height: 65px!important;">
                                Contacto
                            </button>
                        </li>
                        <li class="nav-item">
                            <button type="button" class="btn rounded-0 ir" aria-current="page" style="height: 65px!important;" onclick="window.location.href='{{route('login')}}'">
                                Intra
                            </button>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>      
    @endif
@endauth
