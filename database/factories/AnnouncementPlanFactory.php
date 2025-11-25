<?php

namespace Database\Factories;

use App\Models\AnnouncementPlan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\AnnouncementPlan>
 */
class AnnouncementPlanFactory extends Factory
{
    protected $model = AnnouncementPlan::class;

    public function definition(): array
    {
        $type = fake()->randomElement(['homenagem', 'comunicado', 'outros']);
        $duration = fake()->randomElement([3, 7, 15, 30]);

        $name = match ($type) {
            'homenagem' => "Homenagem póstuma {$duration} dias",
            'comunicado' => "Anúncio de falecimento {$duration} dias",
            default => "Outros anúncios {$duration} dias",
        };

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'type' => $type,
            'duration_days' => $duration,
            'price_mt' => fake()->numberBetween(150, 1000),
            'is_active' => true,
        ];
    }
}

