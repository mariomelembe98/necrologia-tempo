<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Advertiser extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'document_path',
        'document_status',
        'document_verified_at',
    ];

    protected $casts = [
        'document_verified_at' => 'datetime',
    ];

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class);
    }
}

