<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Services\MpesaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        protected MpesaService $mpesa,
    ) {
    }

    public function show(Announcement $announcement): Response
    {
        $plan = $announcement->plan;

        return Inertia::render('Public/Checkout', [
            'announcement' => [
                'id' => (string) $announcement->id,
                'slug' => $announcement->slug,
                'name' => $announcement->name,
                'type' => $announcement->type,
                'location' => $announcement->location,
            ],
            'plan' => [
                'name' => optional($plan)->name,
                'duration' => optional($plan)->duration_days,
                'price' => optional($plan)->price_mt,
            ],
            'paymentUrl' => route('checkout.pay', $announcement),
        ]);
    }

    public function pay(Request $request, Announcement $announcement): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string'],
        ]);

        $result = $this->mpesa->initiatePayment($announcement, $request->input('phone'));

        if ($result['success']) {
            $announcement->update([
                'payment_status' => 'paid',
                'payment_method' => 'mpesa',
                'payment_reference' => $result['transactionId'],
                'paid_at' => now(),
                'status' => 'published',
                'published_at' => $announcement->published_at ?? now(),
            ]);

            return response()->json(['success' => true, 'message' => $result['message']]);
        }

        return response()->json(['success' => false, 'message' => $result['message']], 422);
    }
}
