<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class MotivationController extends Controller
{
    /**
     * Get a motivational quote in French.
     * Uses Kaamelott API (100% French quotes).
     * Caches for 30 minutes to avoid API spam.
     */
    public function random(): JsonResponse
    {
        $quote = Cache::remember('motivation_quote', 60 * 30, function () {
            try {
                // Kaamelott API - 100% French quotes
                $response = Http::timeout(5)->get('https://kaamelott.chaudie.re/api/random');
                
                if ($response->successful()) {
                    $data = $response->json();
                    return [
                        'text' => $data['citation']['citation'] ?? null,
                        'author' => $data['citation']['infos']['personnage'] ?? 'Kaamelott',
                        'source' => 'Kaamelott',
                    ];
                }
            } catch (\Exception $e) {
                // Fallback silently
            }
            
            return null;
        });

        if (!$quote) {
            return response()->json([
                'text' => 'Citation indisponible, réessaie plus tard.',
                'author' => null,
                'source' => null,
                'error' => true,
            ]);
        }

        return response()->json($quote);
    }
}
