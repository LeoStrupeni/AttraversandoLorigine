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
        Schema::create('budgets_types_items', function (Blueprint $table) {
            $table->id();

            // relation to budgets_types (replaces budget_id)
            $table->unsignedBigInteger('budgets_types_id')->nullable();
            $table->unsignedBigInteger('service_id')->nullable();

            $table->date('fecha');
            $table->enum('type_money', ['dolar', 'peso', 'jus']);
            $table->double('price', 20, 4)->default(0.0000);

            $table->text('name')->nullable();
            $table->text('description')->nullable();
            $table->integer('position')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('budgets_types_id', 'budgets_types_items_budgets_types_id_index');
            $table->index('service_id', 'budgets_types_items_service_id_index');

            $table->foreign('budgets_types_id')->references('id')->on('budgets_types');
            $table->foreign('service_id')->references('id')->on('services');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets_types_items');
    }
};
