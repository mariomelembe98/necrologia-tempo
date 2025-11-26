<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('announcements', function (Blueprint $table): void {
            $table->string('payment_status', 20)
                ->default('pending')
                ->after('status'); // pending, paid, failed

            $table->string('payment_method', 30)
                ->nullable()
                ->after('payment_status'); // mpesa, emola, transferencia, etc.

            $table->string('payment_reference', 100)
                ->nullable()
                ->after('payment_method');

            $table->timestamp('paid_at')
                ->nullable()
                ->after('payment_reference');
        });
    }

    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table): void {
            $table->dropColumn([
                'payment_status',
                'payment_method',
                'payment_reference',
                'paid_at',
            ]);
        });
    }
};

