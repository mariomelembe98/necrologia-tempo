<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AnnouncementPlan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PublicAnnouncementController extends Controller
{
    public function home(): Response
    {
        $announcements = Announcement::query()
            ->where('status', 'published')
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn (Announcement $announcement) => $this->mapAnnouncement($announcement));

        return Inertia::render('Public/Home', [
            'announcements' => $announcements,
        ]);
    }

    public function homenagens(): Response
    {
        $announcements = Announcement::query()
            ->where('type', 'homenagem')
            ->where('status', 'published')
            ->latest()
            ->limit(60)
            ->get()
            ->map(fn (Announcement $announcement) => $this->mapAnnouncement($announcement));

        return Inertia::render('Public/Homenagens', [
            'announcements' => $announcements,
        ]);
    }

    public function comunicados(): Response
    {
        $announcements = Announcement::query()
            ->where('type', 'comunicado')
            ->where('status', 'published')
            ->latest()
            ->limit(60)
            ->get()
            ->map(fn (Announcement $announcement) => $this->mapAnnouncement($announcement));

        return Inertia::render('Public/Comunicados', [
            'announcements' => $announcements,
        ]);
    }

    public function pesquisar(): Response
    {
        $announcements = Announcement::query()
            ->where('status', 'published')
            ->latest()
            ->limit(60)
            ->get()
            ->map(fn (Announcement $announcement) => $this->mapAnnouncement($announcement));

        return Inertia::render('Public/Pesquisar', [
            'announcements' => $announcements,
        ]);
    }

    public function publicar(): Response
    {
        $plans = AnnouncementPlan::query()
            ->where('is_active', true)
            ->orderBy('price_mt')
            ->get(['id', 'name', 'slug', 'type', 'duration_days', 'price_mt']);

        return Inertia::render('Public/Publish', [
            'plans' => $plans,
        ]);
    }

    public function show(Announcement $announcement): Response
    {
        if ($announcement->status !== 'published') {
            abort(404);
        }

        $announcements = Announcement::query()
            ->where('status', 'published')
            ->latest()
            ->limit(30)
            ->get();

        if (! $announcements->contains('id', $announcement->id)) {
            $announcements->prepend($announcement);
        }

        $mapped = $announcements
            ->map(fn (Announcement $item) => $this->mapAnnouncement($item));

        return Inertia::render('Public/AnnouncementShow', [
            'slug' => $announcement->slug,
            'announcements' => $mapped,
        ]);
    }

    private function mapAnnouncement(Announcement $announcement): array
    {
        return [
            'id' => (string) $announcement->id,
            'slug' => $announcement->slug,
            'photoUrl' => $announcement->photo_path ? Storage::url($announcement->photo_path) : null,
            'type' => $announcement->type,
            'name' => $announcement->name,
            'dateOfBirth' => optional($announcement->date_of_birth)?->toDateString(),
            'dateOfDeath' => optional($announcement->date_of_death)?->toDateString(),
            'location' => $announcement->location,
            'description' => $announcement->description,
            'author' => $announcement->author,
            'advertiserName' => optional($announcement->advertiser)->name,
            'advertiserPhone' => optional($announcement->advertiser)->phone,
            'advertiserEmail' => optional($announcement->advertiser)->email,
            'advertiserDocument' => $announcement->document_path ? 'uploaded' : null,
            'plan' => optional($announcement->plan)->name,
            'planPrice' => optional($announcement->plan)->price_mt,
            'planDuration' => optional($announcement->plan)->duration_days,
            'createdAt' => optional($announcement->created_at)?->toIso8601String(),
            'expiresAt' => optional($announcement->expires_at)?->toIso8601String(),
        ];
    }
}
