<?php

namespace Database\Seeders;

use App\Models\AnnouncementPlan;
use Illuminate\Database\Seeder;

class AnnouncementPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Anúncio de falecimento 3 dias',
                'slug' => 'falecimento-3',
                'type' => 'comunicado',
                'duration_days' => 3,
                'price_mt' => 200,
                'is_active' => true,
            ],
            [
                'name' => 'Anúncio de falecimento 7 dias',
                'slug' => 'falecimento-7',
                'type' => 'comunicado',
                'duration_days' => 7,
                'price_mt' => 300,
                'is_active' => true,
            ],
            [
                'name' => 'Homenagem póstuma de 15 dias',
                'slug' => 'homenagem-15',
                'type' => 'homenagem',
                'duration_days' => 15,
                'price_mt' => 500,
                'is_active' => true,
            ],
            [
                'name' => 'Outros anúncios',
                'slug' => 'outros-3',
                'type' => 'outros',
                'duration_days' => 3,
                'price_mt' => 200,
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            AnnouncementPlan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan,
            );
        }
    }
}

