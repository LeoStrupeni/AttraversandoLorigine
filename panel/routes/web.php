<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\BalanceController;
use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\BudgetTypeController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MoneyMovementController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\ServicePackageController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\TypesDocMovementsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Route::get('test', function () {
// 	dd( base_path(). '/../public/storage/',env('APP_URL'),storage_path('app'));
// });
Route::get('test', function () {
    dd(base_path('../public/fonts/'), env('APP_URL'), storage_path('app'));
});

Route::view('/public','home')->name('home');

Route::get('/', [HomeController::class,'index']);

Route::view('/login','Auth.login')->name('login')->middleware('guest');
Route::post('/login', [LoginController::class,'login']);
Route::post('/logout', [LoginController::class,'logout'])->name('logout');
Route::get('/logout', [LoginController::class,'logoutGet']);

Route::view('/password/reset','Auth.passwords.email')->name('password.request');
Route::post('/password/email', [ForgotPasswordController::class,'sendResetLinkEmail'])->name('password.email');
Route::get('/password/reset/{token}',[ForgotPasswordController::class,'showResetForm'])->name('password.reset');
Route::post('/password/reset', [ForgotPasswordController::class,'reset'])->name('password.update');

Route::resource('/contact',ContactController::class);

Route::group(['middleware' => 'auth'], function () {
    Route::redirect('/home', '/');

    Route::resource('/users',UserController::class);
    Route::post('/users/table', [UserController::class,'getDataTable']);
    Route::resource('/roles',RolController::class);
    Route::post('/roles/table', [RolController::class,'getDataTable']);
    Route::get('/roles/users/{id}', [RolController::class,'getUsersRol']);
    
    Route::resource('/permission',PermissionController::class);
    Route::post('/permission/table', [PermissionController::class,'getDataTable']);

    Route::post('/roles/permission/update', [PermissionController::class,'updaterolpermission'])->name('updaterolpermission');

    Route::resource('/client',ClientController::class);
    Route::post('/client/table', [ClientController::class,'getDataTable']);
    Route::resource('/provider',ProviderController::class);
    Route::post('/provider/table', [ProviderController::class,'getDataTable']);

    Route::resource('/movement',MoneyMovementController::class);
    Route::post('/movement/table', [MoneyMovementController::class,'getDataTable']);

    Route::resource('/account',BankAccountController::class);
    Route::post('/account/table', [BankAccountController::class,'getDataTable']);

    Route::resource('/typesdocmov',TypesDocMovementsController::class);
    Route::post('/typesdocmov/table', [TypesDocMovementsController::class,'getDataTable']);

    Route::resource('/budget',BudgetController::class);
    Route::post('/budget/table', [BudgetController::class,'getDataTable']);
    Route::get('/budget/client/{id}', [BudgetController::class,'getDataCliente']);
    Route::get('/budget/pdf/{id}', [BudgetController::class,'getPdf'])->name('budget.pdf');
    Route::get('/budget/pdf2/{id}', [BudgetController::class,'getPdf2'])->name('budget.pdf2');

    Route::resource('/budget_type',BudgetTypeController::class);
    Route::post('/budget_type/table', [BudgetTypeController::class,'getDataTable']);

    Route::resource('/service',ServicesController::class);
    Route::post('/service/table', [ServicesController::class,'getDataTable']);
    Route::post('/getDetailsServices', [ServicesController::class,'getDetailsServices']);

    Route::resource('/service_package', ServicePackageController::class);
    Route::post('/service_package/table', [ServicePackageController::class, 'getDataTable']);
    Route::post('/getDetailsServicePackage/{id}', [ServicePackageController::class,'getDetailsServicePackage']);

    Route::resource('/balances', BalanceController::class);
    Route::post('/balances/table', [BalanceController::class,'getDataTable']);

    Route::post('/fastcharge', [Controller::class,'fastcharge'])->name('fastcharge');
});