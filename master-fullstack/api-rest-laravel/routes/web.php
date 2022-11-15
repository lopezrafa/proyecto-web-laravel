<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//Cargar clases
use App\Http\Middleware\ApiAuthMiddleware;

// Rutas de prueba
Route::get('/', function () {
    return '<h2>Hola Mundo desde Laravel</h2>';
});


Route::get('/welcome', function () {
    return view('welcome');
});

/*Ruta con un parametro (Añadir '?' con parametros opcionales*/
Route::get('/pruebas/{nombre?}', function ($nombre = '') {
    $texto = '<h2>Texto de ruta</h2>';
    $texto.='Nombre: '.$nombre;
    /* Llevamos nuestra funcionalidad a la vista para que muestre los resultados
        Mostrarlos en 'pruebas.blade.php' y no directamente aquí para modularidad */
    return view('pruebas', array(
        'texto' => $texto
             
    ));

});

Route::get('/test-orm', 'PruebasController@testOrm');


//Rutas api rest

    /*MÉTODOS HTTP

     * GET: Conseguir datos o recursos
     * POST: Guardar datos  o recursos o hacer lógica desde un formulario
     * PUT: Actualizar datos o recursos
     * DELETE: Eliminar datos o recursos     */

/*Rutas de prueba de controladores
Route::get('/usuario/pruebas','UserController@pruebas');
Route::get('/categoria/pruebas','CategoryController@pruebas');
Route::get('/entrada/pruebas','PostController@pruebas');*/

//Rutas del controlador de usuarios

Route::post('/api/register', 'UserController@register');
Route::post('/api/login', 'UserController@login');
Route::put('/api/user/update', 'UserController@update');
Route::post('/api/user/upload', 'UserController@upload')->middleware(ApiAuthMiddleware::class);
Route::get('/api/user/avatar/{filename}','UserController@getImage');
Route::get('/api/user/detail/{id}','UserController@detail');


// Rutas controlador categorías

Route::resource('/api/category', 'CategoryController');

// Rutas controlador entradas

Route::resource('/api/post', 'PostController');
Route::post('/api/post/upload', 'PostController@upload');
Route::get('api/post/image/{filename}', 'PostController@getImage');
Route::get('/api/post/category/{id}', 'PostController@getPostsByCategory');
Route::get('/api/post/user/{id}', 'PostController@getPostsByUser');







