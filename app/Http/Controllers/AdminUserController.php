<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserController extends Controller
{
    private function ensureManager(Request $request): User
    {
        $user = $request->user();

        if (! $user || ! $user->canEditUsers()) {
            abort(403);
        }

        return $user;
    }

    private function ensureAdmin(Request $request): User
    {
        $user = $request->user();

        if (! $user || ! $user->isAdmin()) {
            abort(403);
        }

        return $user;
    }

    public function index(Request $request): JsonResponse
    {
        $this->ensureManager($request);

        $query = User::query();

        if ($status = $request->get('status')) {
            $status = trim($status);
            if (in_array($status, User::allowedStatuses(), true)) {
                $query->where('status', $status);
            }
        }

        if ($role = $request->get('role')) {
            $role = trim($role);
            if (in_array($role, User::ROLES, true)) {
                $query->where('role', $role);
            }
        }

        if ($search = $request->get('search')) {
            $query->where(function ($sub) use ($search) {
                $sub->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query
            ->latest('created_at')
            ->paginate(25)
            ->withQueryString();

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|string|in:'.implode(',', User::ROLES),
            'status' => 'required|string|in:'.implode(',', User::allowedStatuses()),
            'password' => 'nullable|string|min:8',
        ]);

        $password = $data['password'] ?? Str::random(12);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'status' => $data['status'],
            'password' => Hash::make($password),
        ]);

        return response()->json([
            'user' => $user,
            'credentials' => $request->filled('password') ? null : ['password' => $password],
        ], 201);
    }

    public function show(User $user): JsonResponse
    {
        $this->ensureManager(request());

        return response()->json(['user' => $user]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $actor = $this->ensureManager($request);

        $rules = [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8',
        ];

        if ($actor->isAdmin()) {
            $rules['role'] = 'sometimes|required|string|in:'.implode(',', User::ROLES);
            $rules['status'] = 'sometimes|required|string|in:'.implode(',', User::allowedStatuses());
        }

        $data = $request->validate($rules);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if (! $actor->isAdmin()) {
            unset($data['role'], $data['status']);
        }

        $user->update($data);

        return response()->json(['user' => $user]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->ensureAdmin($request);

        if ($request->user()?->id === $user->id) {
            return response()->json(['message' => 'Não é possível excluir o próprio utilizador'], 422);
        }

        $user->delete();

        return response()->json([], 204);
    }
}
