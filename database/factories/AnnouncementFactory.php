<?php

namespace Database\Factories;

use App\Models\Advertiser;
use App\Models\Announcement;
use App\Models\AnnouncementPlan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    public function definition(): array
    {
        $type = fake()->randomElement(['homenagem', 'comunicado', 'outros']);

        $name = fake()->name();
        $slugBase = Str::slug($name);

        $dateOfDeath = fake()->dateTimeBetween('-1 year', 'now');
        $dateOfBirth = (clone $dateOfDeath)->modify('-' . fake()->numberBetween(30, 90) . ' years');

        $plan = AnnouncementPlan::query()->inRandomOrder()->first()
            ?? AnnouncementPlan::factory()->create();

        $advertiser = Advertiser::query()->inRandomOrder()->first()
            ?? Advertiser::factory()->create();

        $createdAt = fake()->dateTimeBetween('-6 months', 'now');
        $expiresAt = (clone $createdAt)->modify('+' . $plan->duration_days . ' days');

        return [
            'type' => $type,
            'name' => $name,
            'slug' => $slugBase ?: Str::uuid()->toString(),
            'date_of_birth' => $dateOfBirth,
            'date_of_death' => $dateOfDeath,
            'location' => fake()->city() . ', ' . fake()->country(),
            'description' => fake()->paragraphs(3, true),
            'author' => fake()->name(),
            'advertiser_id' => $advertiser->id,
            'plan_id' => $plan->id,
            'status' => 'published',
            'photo_path' => null,
            'document_path' => null,
            'published_at' => $createdAt,
            'expires_at' => $expiresAt,
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ];
    }
}

