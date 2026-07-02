<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $staff = User::factory()->create([
            'name' => 'Staff User',
            'email' => 'staff@example.com',
            'password' => Hash::make('password123'),
            'role' => 'staff',
        ]);

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
