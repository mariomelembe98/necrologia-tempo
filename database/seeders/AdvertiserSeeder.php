<?php

namespace Database\Seeders;

use App\Models\Advertiser;
use Illuminate\Database\Seeder;

class AdvertiserSeeder extends Seeder
{
    public function run(): void
    {
        Advertiser::factory()
            ->count(10)
            ->create();
    }
}

