<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminOrderApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
        ]);
    }

    public function test_admin_can_list_orders_with_pagination(): void
    {
        Order::factory()->count(55)->create();

        Sanctum::actingAs($this->admin);

        $response = $this->getJson('/api/admin/orders');

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'links',
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ])
            ->assertJsonPath('meta.per_page', 20)
            ->assertJsonPath('meta.total', 55);
    }

    public function test_status_filter_works(): void
    {
        Order::factory()->count(10)->create(['status' => 'pending']);
        Order::factory()->count(5)->create(['status' => 'paid']);

        Sanctum::actingAs($this->admin);

        $response = $this->getJson('/api/admin/orders?status=paid');

        $response->assertOk()
            ->assertJsonPath('meta.total', 5);

        foreach ($response->json('data') as $order) {
            $this->assertSame('paid', $order['status']);
        }
    }

    public function test_date_filters_work(): void
    {
        Order::factory()->create(['ordered_at' => '2026-01-15 10:00:00']);
        Order::factory()->create(['ordered_at' => '2026-02-15 10:00:00']);
        Order::factory()->create(['ordered_at' => '2026-03-15 10:00:00']);

        Sanctum::actingAs($this->admin);

        $response = $this->getJson('/api/admin/orders?date_from=2026-02-01&date_to=2026-02-28');

        $response->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    public function test_page_two_returns_different_data(): void
    {
        for ($i = 0; $i < 55; $i++) {
            Order::factory()->create([
                'ordered_at' => now()->subDays($i),
            ]);
        }

        Sanctum::actingAs($this->admin);

        $page1 = $this->getJson('/api/admin/orders?page=1')->json('data');
        $page2 = $this->getJson('/api/admin/orders?page=2')->json('data');

        $this->assertNotEmpty($page1);
        $this->assertNotEmpty($page2);
        $this->assertNotEquals(
            collect($page1)->pluck('id')->all(),
            collect($page2)->pluck('id')->all()
        );
    }
}
