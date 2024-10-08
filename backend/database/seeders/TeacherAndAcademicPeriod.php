<?php

namespace Database\Seeders;

use App\Models\AcademicPeriod;
use Illuminate\Database\Seeder;
use App\Models\User;
use Carbon\Carbon;

class TeacherAndAcademicPeriod extends Seeder
{
    public static $periodo2024Id;
    public static $periodo2021_1Id;
    public static $periodo2021_2Id;

    public static $borisId;
    public static $porDesignarId;

    public function run()
    {
        // Crear usuarios
        $boris = User::create([
            'first_name' => 'BORIS MARCELO',
            'last_name' => 'CALANCHA NAVIA',
            'email' => 'boris@fcyt.umss.edu.bo',
            'password' => bcrypt('Boris1234*'),
            'user_type' => 'D',
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $porDesignar = User::create([
            'first_name' => 'Por',
            'last_name' => 'Designar',
            'email' => 'pordesignar@fcyt.umss.edu.bo',
            'password' => bcrypt('Docente1234*'),
            'user_type' => 'D',
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        self::$borisId = $boris->id;
        self::$porDesignarId = $porDesignar->id;

        // Crear periodos académicos
        $periodo2024 = AcademicPeriod::create([
            'name' => '2do semestre 2024',
            'start_date' => '2024-06-01',
            'end_date' => '2024-12-15',
            'description' => '2do semestre 2024 de tis docente Boris Calancha',
            'user_id' => $boris->id,
        ]);

        $periodo2021_1 = AcademicPeriod::create([
            'name' => '1er semestre 2021',
            'start_date' => '2021-01-01',
            'end_date' => '2021-06-15',
            'description' => '1er semestre 2021 de tis docente Boris Calancha',
            'user_id' => $boris->id,
        ]);

        $periodo2021_2 = AcademicPeriod::create([
            'name' => '2do semestre 2021',
            'start_date' => '2021-06-01',
            'end_date' => '2021-12-15',
            'description' => '2do semestre 2021 de tis docente Por Designar',
            'user_id' => $porDesignar->id,
        ]);

        self::$periodo2024Id = $periodo2024->id;
        self::$periodo2021_1Id = $periodo2021_1->id;
        self::$periodo2021_2Id = $periodo2021_2->id;
    }
}
