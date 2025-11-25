<?php

namespace App\Http\Controllers;

use App\Models\AnnouncementPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminPlanController extends Controller
{
    public function index(Request $request): Response
    {
        $plans = AnnouncementPlan::query()
            ->withCount('announcements')
            ->orderBy('price_mt')
            ->get()
            ->map(function (AnnouncementPlan $plan) {
                return [
                    'id' => (string) $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'type' => $plan->type,
                    'duration_days' => $plan->duration_days,
                    'price_mt' => $plan->price_mt,
                    'is_active' => $plan->is_active,
                    'announcements_count' => $plan->announcements_count,
                ];
            });

        return Inertia::render('Admin/Plans/Index', [
            'plans' => $plans,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:homenagem,comunicado,outros'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'price_mt' => ['required', 'integer', 'min:0'],
        ]);

        $slug = $data['slug'] ?: Str::slug($data['name']);

        AnnouncementPlan::create([
            'name' => $data['name'],
            'slug' => $slug,
            'type' => $data['type'],
            'duration_days' => $data['duration_days'],
            'price_mt' => $data['price_mt'],
            'is_active' => true,
        ]);

        return redirect()
            ->route('admin.plans.index')
            ->with('success', 'Plano criado com sucesso.');
    }

    public function update(Request $request, AnnouncementPlan $plan)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:homenagem,comunicado,outros'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'price_mt' => ['required', 'integer', 'min:0'],
        ]);

        $slug = $data['slug'] ?: Str::slug($data['name']);

        $plan->update([
            'name' => $data['name'],
            'slug' => $slug,
            'type' => $data['type'],
            'duration_days' => $data['duration_days'],
            'price_mt' => $data['price_mt'],
        ]);

        return redirect()
            ->route('admin.plans.index')
            ->with('success', 'Plano atualizado com sucesso.');
    }

    public function toggleStatus(AnnouncementPlan $plan)
    {
        $plan->is_active = ! $plan->is_active;
        $plan->save();

        return redirect()
            ->route('admin.plans.index')
            ->with('success', 'Status do plano actualizado.');
    }
}
