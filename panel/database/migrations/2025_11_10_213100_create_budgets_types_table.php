<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('budgets_types', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();

            $table->double('total_pesos', 20, 4)->default(0.0000);
            $table->double('total_dollars', 20, 4)->default(0.0000);
            $table->double('total_jus', 20, 4)->default(0.0000);

            $table->enum('estatus', ['abierto', 'cerrado', 'rechazado'])->default('abierto');

            $table->text('observations')->nullable();
            $table->text('includes')->nullable();
            $table->text('not_includes')->nullable();
            $table->text('payment_methods')->nullable();
            $table->text('clarifications')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id', 'budgets_types_user_id_index');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets_types');
    }
};
