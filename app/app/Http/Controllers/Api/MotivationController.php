<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class MotivationController extends Controller
{
    /**
     * Get a motivational quote.
     * Source: ZenQuotes (English) -> Translated to FR.
     * Caches for 1 hour.
     * Supports ?refresh=true to force update.
     */
    public function random(Request $request): JsonResponse
    {
        $forceRefresh = $request->query('refresh') === 'true';
        $cacheKey = 'motivation_quote_fr';

        if ($forceRefresh) {
            Cache::forget($cacheKey);
        }

        $quote = Cache::remember($cacheKey, 60 * 60, function () {
            try {
                // 1. Fetch from ZenQuotes
                $response = Http::timeout(5)->get('https://zenquotes.io/api/random');
                
                if ($response->successful()) {
                    $data = $response->json();
                    // ZenQuotes returns array [0 => [...]]
                    $originalText = $data[0]['q'] ?? null;
                    $author = $data[0]['a'] ?? null;

                    if ($originalText) {
                        // 2. Translate to French
                        // Trying public LibreTranslate instance. 
                        // If this fails often, we might need a fallback or API key.
                        try {
                            $transResponse = Http::timeout(5)->post('https://libretranslate.de/translate', [
                                'q' => $originalText,
                                'source' => 'en',
                                'target' => 'fr',
                                'format' => 'text'
                            ]);

                            if ($transResponse->successful()) {
                                $transData = $transResponse->json();
                                $translatedText = $transData['translatedText'] ?? $originalText;
                                
                                return [
                                    'text' => $translatedText,
                                    'author' => $author,
                                    'source' => 'ZenQuotes + LibreTranslate'
                                ];
                            }
                        } catch (\Exception $e) {
                            // Translation failed, return English (better than nothing)
                             return [
                                'text' => $originalText,
                                'author' => $author,
                                'source' => 'ZenQuotes (EN)'
                            ];
                        }
                    }
                }
            } catch (\Exception $e) {
                // Fallback below
            }

            // 3. Fallback to Kaamelott if logic above fails
            try {
                $response = Http::timeout(5)->get('https://kaamelott.chaudie.re/api/random');
                if ($response->successful()) {
                    $data = $response->json();
                    return [
                        'text' => $data['citation']['citation'] ?? 'Citation indisponible',
                        'author' => $data['citation']['infos']['personnage'] ?? 'Kaamelott',
                        'source' => 'Kaamelott',
                    ];
                }
            } catch (\Exception $e2) {
                // ALL failed
            }
            
            return [
                'text' => 'Impossible de récupérer une citation pour le moment.',
                'author' => null,
                'error' => true
            ];
        });

        return response()->json($quote);
    }
}
