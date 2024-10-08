<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(TeacherAndAcademicPeriod::class);
        $this->call(UsersTableSeeder::class);
        $this->call(CompaniesTableSeeder::class);
        $this->call(PlanningsTableSeeder::class);
        $this->call(MilestonesTableSeeder::class);
        $this->call(DeliverablesTableSeeder::class);
        $this->call(CompanyUserTableSeeder::class);
    }
}
