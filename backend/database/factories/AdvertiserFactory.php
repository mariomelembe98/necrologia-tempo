<?php

namespace Database\Factories;

use App\Models\Advertiser;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Advertiser>
 */
class AdvertiserFactory extends Factory
{
    protected $model = Advertiser::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'phone' => '+258 ' . fake()->randomElement(['82', '84', '85', '86']) . ' ' . fake()->numberBetween(1000000, 9999999),
            'email' => fake()->unique()->safeEmail(),
            'document_path' => null,
            'document_status' => 'pending',
            'document_verified_at' => null,
        ];
    }
}

