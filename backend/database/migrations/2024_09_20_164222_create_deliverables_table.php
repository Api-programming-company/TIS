<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeliverablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deliverables', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre del deliverable
            $table->string('responsible'); // Responsable del deliverable
            $table->text('objective'); // Objetivo del deliverable
            $table->unsignedBigInteger('milestone_id'); // Relación con Milestone
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('milestone_id')->references('id')->on('milestones')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('deliverables');
    }
}
