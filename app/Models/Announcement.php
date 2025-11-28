<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

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
        'payment_status',
        'payment_method',
        'payment_reference',
        'photo_path',
        'document_path',
        'published_at',
        'paid_at',
        'expires_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_of_death' => 'date',
        'published_at' => 'datetime',
        'paid_at' => 'datetime',
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

    public static function promotionEndsAt(): Carbon
    {
        return Carbon::parse(config('announcements.promotion_end'));
    }

    public static function isPromotionActive(?Carbon $when = null): bool
    {
        $when ??= now();

        return $when->lte(static::promotionEndsAt());
    }
}
