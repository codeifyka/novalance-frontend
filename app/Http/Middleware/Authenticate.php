<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate extends Middleware
{
    public function handle($request, Closure $next, ...$guards)
    {
        if(!$request->hasHeader('Authorization')){
            return response()->json([
                "error" => "Authorization header not found."
            ]);
        }

        if(!auth('api')->check()){
            return response()->json([
                "error" => "Invalid token."
            ]);
        }
        
        return $next($request);
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        return $request->expectsJson() ? null : route('login');
    }
}
