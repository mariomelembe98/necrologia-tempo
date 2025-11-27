<?php

namespace App\Http\Controllers;

use App\Mail\AnnouncementSubmitted;
use App\Mail\AnnouncementSubmittedToAdvertiser;
use App\Models\Advertiser;
use App\Models\Announcement;
use App\Models\AnnouncementPlan;
use App\Services\MpesaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(Request $request): Response
    {
        $from = $request->date('from');
        $to = $request->date('to');

        $query = Announcement::with(['advertiser', 'plan']);

        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        $announcements = $query
            ->latest()
            ->get();

        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => [
                'from' => $from?->toDateString(),
                'to' => $to?->toDateString(),
            ],
        ]);
    }

    public function store(Request $request, MpesaService $mpesa): RedirectResponse
    {
        $data = $request->validate(
            [
                'type' => 'required|string|in:homenagem,comunicado,outros',
                'name' => 'required|string|max:255',
                'dateOfBirth' => 'nullable|date',
                'dateOfDeath' => 'nullable|date|after_or_equal:dateOfBirth',
                'location' => 'required|string|max:255',
                'description' => 'required|string',
                'author' => 'required|string|max:255',
                'plan' => 'nullable|string|max:255',
                'advertiserName' => 'required|string|max:255',
                'advertiserPhone' => 'required|string|max:255',
                'advertiserEmail' => 'nullable|email|max:255',
                'photo' => 'nullable|image|max:5120',
                'document' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            ],
            [
                'type.required' => 'Selecione o tipo de anuncio.',
                'name.required' => 'Informe o nome da pessoa homenageada/falecida.',
                'dateOfBirth.date' => 'A data de nascimento deve ser uma data valida.',
                'dateOfDeath.date' => 'A data de falecimento deve ser uma data valida.',
                'dateOfDeath.after_or_equal' => 'A data de falecimento deve ser igual ou posterior a data de nascimento.',
                'location.required' => 'Informe o local (cidade, provincia).',
                'description.required' => 'Escreva a mensagem ou detalhes do anuncio.',
                'author.required' => 'Informe quem esta publicando o anuncio.',
                'advertiserName.required' => 'Informe o nome completo do anunciante.',
                'advertiserPhone.required' => 'Informe o telefone de contacto do anunciante.',
                'advertiserEmail.email' => 'Informe um e-mail valido.',
                'photo.image' => 'A foto deve ser uma imagem nos formatos JPG ou PNG.',
                'photo.max' => 'A foto nao pode ter mais de 5MB.',
                'document.required' => 'Envie um documento de identificacao do anunciante.',
                'document.mimes' => 'O documento deve ser JPG, PNG ou PDF.',
                'document.max' => 'O documento nao pode ter mais de 5MB.',
            ],
        );

        $plan = null;

        if (! empty($data['plan'])) {
            $plan = AnnouncementPlan::query()
                ->where('name', $data['plan'])
                ->where('is_active', true)
                ->first();
        }

        $advertiserData = [
            'name' => $data['advertiserName'],
            'phone' => $data['advertiserPhone'],
            'email' => $data['advertiserEmail'] ?? null,
        ];

        if (! empty($data['advertiserEmail'])) {
            $advertiser = Advertiser::firstOrCreate(
                ['email' => $data['advertiserEmail']],
                $advertiserData,
            );
        } else {
            $advertiser = Advertiser::firstOrCreate(
                ['phone' => $data['advertiserPhone']],
                $advertiserData,
            );
        }

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store(
                'announcements/photos',
                'public',
            );
        }

        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store(
                'announcements/documents',
                'public',
            );
        }

        $announcement = Announcement::create([
            'type' => $data['type'],
            'name' => $data['name'],
            'slug' => $this->generateUniqueSlug($data['name']),
            'date_of_birth' => $data['dateOfBirth'] ?? null,
            'date_of_death' => $data['dateOfDeath'] ?? null,
            'location' => $data['location'],
            'description' => $data['description'],
            'author' => $data['author'],
            'advertiser_id' => $advertiser->id,
            'plan_id' => $plan?->id,
            'status' => 'pending',
            'photo_path' => $photoPath,
            'document_path' => $documentPath,
            'expires_at' => $plan
                ? now()->addDays($plan->duration_days)
                : null,
        ]);

        try {
            $toAddress = config('mail.from.address');

            if ($toAddress) {
                Mail::to($toAddress)->send(
                    new AnnouncementSubmitted($announcement),
                );
            }

            if (! empty($advertiser->email)) {
                Mail::to($advertiser->email)->send(
                    new AnnouncementSubmittedToAdvertiser($announcement),
                );
            }
        } catch (\Throwable $exception) {
            report($exception);
        }

        return redirect()
            ->route('checkout.show', $announcement)
            ->with('success', 'Anuncio criado! Complete o pagamento para publicar.');
    }

    protected function generateUniqueSlug(string $name): string
    {
        $base = Str::slug($name);

        if ($base === '') {
            $base = 'anuncio';
        }

        $slug = $base;
        $counter = 2;

        while (Announcement::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    public function updateStatus(Request $request, Announcement $announcement): RedirectResponse
    {
        $data = $request->validate([
            'status' => 'required|string|in:pending,published,rejected,archived',
        ]);

        $announcement->status = $data['status'];

        if ($data['status'] === 'published' && ! $announcement->published_at) {
            $announcement->published_at = now();
        }

        $announcement->save();

        return redirect()
            ->back()
            ->with('success', 'Status do anuncio actualizado.');
    }

    public function payWithMpesa(
        Request $request,
        Announcement $announcement,
        MpesaService $mpesa,
    ): RedirectResponse {
        $data = $request->validate([
            'phone' => 'required|string|max:30',
        ]);

        if (! $announcement->plan || ! $announcement->plan->price_mt) {
            return redirect()
                ->back()
                ->with('error', 'Este anuncio nao tem um plano com valor definido.');
        }

        $result = $mpesa->initiatePayment($announcement, $data['phone']);

        if ($result['success']) {
            $announcement->payment_method = 'mpesa';
            $announcement->payment_status = 'pending';
            if (! empty($result['transactionId'])) {
                $announcement->payment_reference = $result['transactionId'];
            }
            $announcement->save();

            return redirect()
                ->back()
                ->with('success', $result['message']);
        }

        return redirect()
            ->back()
            ->with('error', $result['message']);
    }
}
