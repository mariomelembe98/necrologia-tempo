<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnnouncementPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'type',
        'duration_days',
        'price_mt',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'duration_days' => 'integer',
        'price_mt' => 'integer',
    ];

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class, 'plan_id');
    }
}

