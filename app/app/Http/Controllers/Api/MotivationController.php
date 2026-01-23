<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class MotivationController extends Controller
{
    /**
     * Get a motivational quote in French from Wikiquote FR.
     * Uses MediaWiki API to parse the "Citation du jour" page.
     * Caches for 6 hours to avoid API spam.
     */
    public function random(): JsonResponse
    {
        $quote = Cache::remember('motivation_quote', 60 * 60 * 6, function () {
            try {
                // Wikiquote FR - Citation du jour
                // Get the parsed content of the main page which contains the quote of the day
                $response = Http::timeout(10)->get('https://fr.wikiquote.org/w/api.php', [
                    'action' => 'parse',
                    'page' => 'Wikiquote:Citation du jour/' . now()->format('j F'),
                    'format' => 'json',
                    'prop' => 'text',
                ]);
                
                if ($response->successful()) {
                    $data = $response->json();
                    $html = $data['parse']['text']['*'] ?? '';
                    
                    // Extract quote text from HTML
                    // The citation is usually in a <p> or within specific markup
                    if (preg_match('/<p[^>]*>(.*?)<\/p>/s', $html, $matches)) {
                        $text = strip_tags($matches[1]);
                        $text = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
                        $text = trim($text);
                        
                        // Try to extract author if present (often after a dash or in parentheses)
                        $author = null;
                        if (preg_match('/—\s*(.+)$/', $text, $authorMatch)) {
                            $author = trim($authorMatch[1]);
                            $text = trim(preg_replace('/—\s*.+$/', '', $text));
                        } elseif (preg_match('/\(([^)]+)\)$/', $text, $authorMatch)) {
                            $author = trim($authorMatch[1]);
                            $text = trim(preg_replace('/\([^)]+\)$/', '', $text));
                        }
                        
                        if (!empty($text)) {
                            return [
                                'text' => $text,
                                'author' => $author,
                                'source' => 'Wikiquote FR',
                            ];
                        }
                    }
                }
            } catch (\Exception $e) {
                // Fallback to Kaamelott if Wikiquote fails
                try {
                    $response = Http::timeout(5)->get('https://kaamelott.chaudie.re/api/random');
                    
                    if ($response->successful()) {
                        $data = $response->json();
                        return [
                            'text' => $data['citation']['citation'] ?? null,
                            'author' => $data['citation']['infos']['personnage'] ?? 'Kaamelott',
                            'source' => 'Kaamelott',
                        ];
                    }
                } catch (\Exception $e2) {
                    // Both APIs failed
                }
            }
            
            return null;
        });

        if (!$quote || empty($quote['text'])) {
            // Try Kaamelott as final fallback (not cached)
            try {
                $response = Http::timeout(5)->get('https://kaamelott.chaudie.re/api/random');
                if ($response->successful()) {
                    $data = $response->json();
                    return response()->json([
                        'text' => $data['citation']['citation'] ?? 'Citation indisponible',
                        'author' => $data['citation']['infos']['personnage'] ?? null,
                        'source' => 'Kaamelott',
                    ]);
                }
            } catch (\Exception $e) {
                // Final fallback
            }
            
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
