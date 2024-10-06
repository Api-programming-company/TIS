<?php

namespace App\Http\Controllers;

use App\Models\AcademicPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Exception;
use Illuminate\Validation\ValidationException;

class AcademicPeriodController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        try {
            $user = Auth::user();

            if ($user->user_type !== 'D') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $academicPeriods = AcademicPeriod::where('user_id', $user->id)->get();
            return response()->json($academicPeriods);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Ocurrio un error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            // Verificar el tipo de usuario
            if ($user->user_type !== 'D') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Validar la solicitud
            $request->validate([
                'name' => 'required|string|max:255|unique:academic_periods',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'description' => 'nullable|string',
            ]);

            // Crear el periodo académico
            $academicPeriod = AcademicPeriod::create([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'description' => $request->description,
                'user_id' => $user->id,
            ]);

            // Devolver respuesta de éxito
            return response()->json($academicPeriod, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->validator->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAllGroupedByTeacher()
    {
        try {
            $academicPeriods = AcademicPeriod::with('creator')->get();

            // Agrupar los periodos por docente (user_id)
            $groupedByTeacher = $academicPeriods->groupBy('user_id')->map(function ($periods, $userId) {
                // Obtener información del docente
                $teacher = User::find($userId);

                return [
                    'teacher_name' => $teacher->getFullNameAttribute(),
                    'teacher_email' => $teacher->getAttribute('email'),
                    'academic_periods' => $periods->toArray()
                ];
            })->values();

            return response()->json($groupedByTeacher);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Ocurrio un error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function enroll(Request $request)
    {
        try {
            /** @var \App\Models\User $user **/
            $user = Auth::user();

            // Solo los estudiantes pueden inscribirse
            if ($user->user_type !== 'E') {
                return response()->json(['message' => 'Solo estudiantes pueden inscribirse.'], 403);
            }

            // Verifica que el estudiante no esté ya inscrito en un periodo académico
            if ($user->academic_period_id) {
                return response()->json(['message' => 'Ya está inscrito en un periodo académico'], 400);
            }

            $academicPeriodId = $request->input('academic_period_id');
            $academicPeriod = AcademicPeriod::findOrFail($academicPeriodId);
            $currentDate = now();

            // Verificar si la fecha actual está entre start_date y end_date del periodo académico
            if ($currentDate->lt($academicPeriod->start_date) || $currentDate->gt($academicPeriod->end_date)) {
                return response()->json(['message' => 'No se puede inscribir, el periodo académico no está en curso.'], 403);
            }

            // Inscribe al estudiante en el periodo académico
            $user->academic_period_id = $academicPeriod->id;
            $user->save();

            return response()->json(['message' => 'Se inscribió correctamente en el periodo académico']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Ocurrio un error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();

            // Verificar si el usuario tiene permiso para actualizar el periodo académico
            if ($user->user_type !== 'D') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Validar los datos
            $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date', // La fecha de fin debe ser mayor que la fecha de inicio
            ]);

            // Buscar el periodo académico
            $academicPeriod = AcademicPeriod::findOrFail($id);

            // Actualizar fechas de inicio y fin
            $academicPeriod->start_date = $request->start_date;
            $academicPeriod->end_date = $request->end_date;
            $academicPeriod->save();

            // Mensaje de retroalimentación
            return response()->json(['message' => 'La fecha ha sido ajustada con éxito', 'academic_period' => $academicPeriod], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->validator->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::user();

            // Verificar si el usuario es un docente
            if ($user->user_type !== 'D') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Buscar el periodo académico por su ID
            $academicPeriod = AcademicPeriod::findOrFail($id);

            // Verificar si el periodo académico pertenece al docente autenticado
            if ($academicPeriod->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Retornar el periodo académico encontrado
            return response()->json($academicPeriod, 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
