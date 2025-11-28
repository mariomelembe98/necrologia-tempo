<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $from = $request->date('from');
        $to = $request->date('to');

        $baseQuery = Announcement::query();

        if ($from) {
            $baseQuery->whereDate('created_at', '>=', $from);
        }

        if ($to) {
            $baseQuery->whereDate('created_at', '<=', $to);
        }

        $statsQuery = clone $baseQuery;

        $total = (clone $statsQuery)->count();
        $pending = (clone $statsQuery)
            ->where('status', 'pending')
            ->count();
        $published = (clone $statsQuery)
            ->where('status', 'published')
            ->count();

        $homenagens = (clone $statsQuery)
            ->where('type', 'homenagem')
            ->count();
        $comunicados = (clone $statsQuery)
            ->where('type', 'comunicado')
            ->count();
        $outros = (clone $statsQuery)
            ->where('type', 'outros')
            ->count();

        $paymentPending = (clone $statsQuery)
            ->where('payment_status', 'pending')
            ->count();
        $paymentPaid = (clone $statsQuery)
            ->where('payment_status', 'paid')
            ->count();
        $paymentFailed = (clone $statsQuery)
            ->where('payment_status', 'failed')
            ->count();

        $now = Carbon::now();

        $expiringSoon = (clone $statsQuery)
            ->where('status', 'published')
            ->whereNotNull('expires_at')
            ->whereBetween('expires_at', [
                $now,
                $now->copy()->addDays(7),
            ])
            ->count();

        $expired = (clone $statsQuery)
            ->where('status', 'published')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', $now)
            ->count();

        $pendingPromotion = (clone $statsQuery)
            ->where('status', 'pending')
            ->where('created_at', '<=', Announcement::promotionEndsAt())
            ->count();

        $recentAnnouncements = (clone $baseQuery)
            ->with(['advertiser', 'plan'])
            ->latest()
            ->limit(50)
            ->get()
            ->map(function (Announcement $announcement) {
                return [
                    'id' => (string) $announcement->id,
                    'slug' => $announcement->slug,
                    'name' => $announcement->name,
                    'type' => $announcement->type,
                    'status' => $announcement->status,
                    'createdAt' => optional($announcement->created_at)?->toIso8601String(),
                    'expiresAt' => optional($announcement->expires_at)?->toIso8601String(),
                    'advertiserName' => optional($announcement->advertiser)->name,
                    'planName' => optional($announcement->plan)->name,
                ];
            });

        $trend = (clone $baseQuery)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'count' => (int) $row->count,
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'total' => $total,
                'pending' => $pending,
                'published' => $published,
                'homenagens' => $homenagens,
                'comunicados' => $comunicados,
                'outros' => $outros,
                'paymentPending' => $paymentPending,
                'paymentPaid' => $paymentPaid,
                'paymentFailed' => $paymentFailed,
                'expiringSoon' => $expiringSoon,
                'expired' => $expired,
                'pendingPromotion' => $pendingPromotion,
            ],
            'recentAnnouncements' => $recentAnnouncements,
            'trend' => $trend,
            'filters' => [
                'from' => $from?->toDateString(),
                'to' => $to?->toDateString(),
            ],
        ]);
    }
}
