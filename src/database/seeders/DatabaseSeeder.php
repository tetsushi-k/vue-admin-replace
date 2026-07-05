<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => 'password123',
                'role' => 'admin',
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'staff@example.com'],
            [
                'name' => 'Staff User',
                'password' => 'password123',
                'role' => 'staff',
            ],
        );

        if (Order::query()->exists()) {
            return;
        }

        $staff = User::query()->where('email', 'staff@example.com')->firstOrFail();
        $statuses = ['pending', 'paid', 'shipped', 'cancelled'];
        $users = [$admin, $staff];

        for ($i = 0; $i < 55; $i++) {
            Order::factory()->create([
                'user_id' => $users[array_rand($users)]->id,
                'status' => $statuses[$i % count($statuses)],
                'ordered_at' => now()->subDays($i % 90)->subHours($i % 24),
            ]);
        }
    }
}
