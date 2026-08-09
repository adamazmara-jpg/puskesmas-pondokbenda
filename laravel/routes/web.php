<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\ConfusionMatrixController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [QueueController::class, 'index'])->name('antrean.index');
Route::post('/antrean', [QueueController::class, 'store'])->name('antrean.store');

Route::get('/confusion-matrix', [ConfusionMatrixController::class, 'index'])->name('confusion.index');
Route::delete('/confusion-matrix', [ConfusionMatrixController::class, 'destroyAll'])->name('confusion.destroyAll');
