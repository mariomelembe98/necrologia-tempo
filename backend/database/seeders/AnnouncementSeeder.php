<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\AnnouncementPlan;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        if (AnnouncementPlan::query()->count() === 0) {
            $this->call(AnnouncementPlanSeeder::class);
        }

        Announcement::factory()
            ->count(30)
            ->create();
    }
}

