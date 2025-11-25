<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminAnnouncementController extends Controller
{
    public function __invoke(Announcement $announcement): Response
    {
        $announcement->load(['advertiser', 'plan']);

        return Inertia::render('Admin/Announcements/Show', [
            'announcement' => [
                'id' => (string) $announcement->id,
                'slug' => $announcement->slug,
                'type' => $announcement->type,
                'name' => $announcement->name,
                'status' => $announcement->status,
                'photoUrl' => $announcement->photo_path ? Storage::url($announcement->photo_path) : null,
                'documentUrl' => $announcement->document_path ? Storage::url($announcement->document_path) : null,
                'dateOfBirth' => optional($announcement->date_of_birth)?->toDateString(),
                'dateOfDeath' => optional($announcement->date_of_death)?->toDateString(),
                'location' => $announcement->location,
                'description' => $announcement->description,
                'author' => $announcement->author,
                'advertiser' => [
                    'name' => optional($announcement->advertiser)->name,
                    'phone' => optional($announcement->advertiser)->phone,
                    'email' => optional($announcement->advertiser)->email,
                ],
                'plan' => $announcement->plan
                    ? [
                        'name' => $announcement->plan->name,
                        'duration_days' => $announcement->plan->duration_days,
                        'price_mt' => $announcement->plan->price_mt,
                    ]
                    : null,
                'createdAt' => optional($announcement->created_at)?->toIso8601String(),
                'updatedAt' => optional($announcement->updated_at)?->toIso8601String(),
                'publishedAt' => optional($announcement->published_at)?->toIso8601String(),
                'expiresAt' => optional($announcement->expires_at)?->toIso8601String(),
            ],
        ]);
    }
}

