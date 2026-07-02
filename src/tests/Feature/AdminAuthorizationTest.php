<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/admin/orders');

        $response->assertUnauthorized();
    }

    public function test_staff_role_returns_403(): void
    {
        $staff = User::factory()->staff()->create();
        Sanctum::actingAs($staff);

        $response = $this->getJson('/api/admin/orders');

        $response->assertForbidden();
    }

    public function test_admin_role_returns_200(): void
    {
        $admin = User::factory()->admin()->create();
        Order::factory()->count(3)->create();
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/orders');

        $response->assertOk();
    }
}
