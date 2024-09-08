<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/', function () {
    return view('welcome');
});

Route::post('/message/send', 'App\Http\Controllers\LiveChatController@send');
Route::post('/message/receive', 'App\Http\Controllers\LiveChatController@receive');

Route::get('/admin', 'App\Http\Controllers\AdminLiveChatController@index');
Route::post('/admin/send', 'App\Http\Controllers\AdminLiveChatController@send');
Route::post('/admin/receive', 'App\Http\Controllers\AdminLiveChatController@receive');
Route::post('/admin/room/new', 'App\Http\Controllers\AdminLiveChatController@newRoom');
Route::post('/admin/room/new/select', 'App\Http\Controllers\AdminLiveChatController@newRoomSelect');
Route::post('/admin/room/{id}/completed', 'App\Http\Controllers\AdminLiveChatController@setRoomCompleted');