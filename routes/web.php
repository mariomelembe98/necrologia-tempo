<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AdminAnnouncementController;
use App\Http\Controllers\AdminAdvertiserController;
use App\Http\Controllers\AdminPlanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicAnnouncementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [PublicAnnouncementController::class, 'home'])->name('home');

Route::get('/homenagens', [PublicAnnouncementController::class, 'homenagens'])
    ->name('public.homenagens');

Route::get('/comunicados', [PublicAnnouncementController::class, 'comunicados'])
    ->name('public.comunicados');

Route::get('/pesquisar', [PublicAnnouncementController::class, 'pesquisar'])
    ->name('public.pesquisar');

Route::get('/publicar', [PublicAnnouncementController::class, 'publicar'])
    ->name('public.publicar');

Route::get('/anuncio/{announcement:slug}', [PublicAnnouncementController::class, 'show'])
    ->name('public.anuncio.show');

Route::post('/anuncios', [AnnouncementController::class, 'store'])
    ->name('announcements.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('/admin/anuncios', [AnnouncementController::class, 'index'])
        ->name('admin.announcements.index');

    Route::get('/admin/planos', [AdminPlanController::class, 'index'])
        ->name('admin.plans.index');
    Route::post('/admin/planos', [AdminPlanController::class, 'store'])
        ->name('admin.plans.store');
    Route::put('/admin/planos/{plan}', [AdminPlanController::class, 'update'])
        ->name('admin.plans.update');
    Route::patch('/admin/planos/{plan}/toggle', [AdminPlanController::class, 'toggleStatus'])
        ->name('admin.plans.toggle');

    Route::get('/admin/anunciantes', [AdminAdvertiserController::class, 'index'])
        ->name('admin.advertisers.index');

    Route::get('/admin/anuncios/{announcement:slug}', AdminAnnouncementController::class)
        ->name('admin.announcements.show');

    Route::patch('/admin/anuncios/{announcement:slug}/status', [AnnouncementController::class, 'updateStatus'])
        ->name('admin.announcements.updateStatus');

    Route::post('/admin/anuncios/{announcement:slug}/pagamentos/mpesa', [AnnouncementController::class, 'payWithMpesa'])
        ->name('admin.announcements.pay.mpesa');
});

require __DIR__.'/settings.php';
