<?php

namespace App\Http\Controllers;

use App\Models\Advertiser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminAdvertiserController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->get('status');

        $query = Advertiser::query()
            ->withCount('announcements')
            ->orderBy('name');

        if (! empty($status) && $status !== 'all') {
            $query->where('document_status', $status);
        }

        $advertisers = $query
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Advertisers/Index', [
            'advertisers' => $advertisers,
            'filters' => [
                'status' => $status ?: 'all',
            ],
        ]);
    }
}
