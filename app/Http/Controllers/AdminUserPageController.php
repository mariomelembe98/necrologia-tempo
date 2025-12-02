<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AdminUserPageController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Users/Index');
    }
}
