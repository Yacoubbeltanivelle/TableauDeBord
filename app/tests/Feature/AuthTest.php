<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Login page loads without 419
     */
    public function test_login_page_loads_successfully(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Auth/Login'));
    }

    /**
     * Test: Register page loads without 419
     */
    public function test_register_page_loads_successfully(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Auth/Register'));
    }

    /**
     * Test: Login with valid credentials works
     */
    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect();
        $this->assertAuthenticated();
    }

    /**
     * Test: Login with invalid credentials fails
     */
    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    /**
     * Test: Terms page loads
     */
    public function test_terms_page_loads_successfully(): void
    {
        $response = $this->get('/terms');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Legal/Terms'));
    }

    /**
     * Test: Privacy page loads
     */
    public function test_privacy_page_loads_successfully(): void
    {
        $response = $this->get('/privacy');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Legal/Privacy'));
    }

    /**
     * Test: Demo user can login after seeding
     */
    public function test_demo_user_can_login_after_seeding(): void
    {
        $this->seed();

        $response = $this->post('/login', [
            'email' => 'demo@tableaudebord.test',
            'password' => 'password',
        ]);

        $response->assertRedirect();
        $this->assertAuthenticated();
    }
}
