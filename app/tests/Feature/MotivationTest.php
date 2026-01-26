<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use App\Models\User;

class MotivationTest extends TestCase
{
    use RefreshDatabase;

    public function test_motivation_endpoint_returns_quote()
    {
        $user = User::factory()->create();

        // Mock Http for ZenQuotes AND Translation
        Http::fake([
            'zenquotes.io/*' => Http::response([
                [
                    'q' => 'Test Quote',
                    'a' => 'Test Author',
                    'h' => '...'
                ]
            ], 200),
            'libretranslate.de/*' => Http::response([
                'translatedText' => 'Citation Test'
            ], 200),
        ]);

        $response = $this->actingAs($user)->get('/api/motivation');

        $response->assertStatus(200)
            ->assertJson([
                'text' => 'Citation Test',
                'author' => 'Test Author',
            ]);
            
        // Assert cached
        $this->assertTrue(Cache::has('motivation_quote_fr'));
    }

    public function test_refresh_flag_bypasses_cache()
    {
        $user = User::factory()->create();

        // Prime cache
        Cache::put('motivation_quote_fr', ['text' => 'Old Quote', 'author' => 'Old Author'], 60);

        // Mock New Quote
        Http::fake([
            'zenquotes.io/*' => Http::response([
                [
                    'q' => 'New Quote',
                    'a' => 'New Author'
                ]
            ], 200),
            'libretranslate.de/*' => Http::response([
                'translatedText' => 'Nouvelle Citation'
            ], 200),
        ]);

        // Request with refresh=true
        $response = $this->actingAs($user)->get('/api/motivation?refresh=true');

        $response->assertStatus(200)
            ->assertJson([
                'text' => 'Nouvelle Citation',
                'author' => 'New Author',
            ]);
    }
}
