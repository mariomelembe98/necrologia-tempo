<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'slug',
        'date_of_birth',
        'date_of_death',
        'location',
        'description',
        'author',
        'advertiser_id',
        'plan_id',
        'status',
        'photo_path',
        'document_path',
        'published_at',
        'expires_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_of_death' => 'date',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function advertiser(): BelongsTo
    {
        return $this->belongsTo(Advertiser::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(AnnouncementPlan::class, 'plan_id');
    }
}
