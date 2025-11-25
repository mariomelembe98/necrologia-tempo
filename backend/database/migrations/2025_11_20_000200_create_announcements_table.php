<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 20)->default('comunicado');
            $table->string('name');
            $table->string('slug')->unique();
            $table->date('date_of_birth')->nullable();
            $table->date('date_of_death')->nullable();
            $table->string('location');
            $table->text('description');
            $table->string('author');

            $table->foreignId('advertiser_id')
                ->constrained('advertisers')
                ->cascadeOnDelete();

            $table->foreignId('plan_id')
                ->nullable()
                ->constrained('announcement_plans')
                ->nullOnDelete();

            $table->string('status', 30)->default('pending'); // pending, published, rejected, archived
            $table->string('photo_path')->nullable();
            $table->string('document_path')->nullable();

            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
