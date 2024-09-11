<?php

use Illuminate\Http\Request;
use Illuminate\Routing\RouteRegistrar;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\Api\EstudianteController;
use App\Http\Controllers\EmailController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


//Comandos de simon :D 
//no me lo borren por favor

// docker-compose exec app php artisan make:model Estudiante  
//docker exec -it laravel_app bash


Route::apiResource('posts', PostController::class);

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/simon', function () {
    return 'simon hola';
});

Route::apiResource('/estudiante', EstudianteController::class); //RESTful
//Route::get('/estudiante', [EstudianteController::class, 'index']); // Ruta para GET  prueba


Route::get('/test', [TestController::class, 'index']); // Ruta para GET
Route::post('/test', [TestController::class, 'nombre_funcion']); // Ruta para POST

Route::post('/send-test-email', [EmailController::class, 'sendTestEmail']);