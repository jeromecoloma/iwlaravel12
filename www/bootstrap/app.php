<?php

use App\Http\Middleware\HandleInertiaRequests;
use Errly\LaravelErrly\ErrlyServiceProvider;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Configure Errly for error reporting
        if (class_exists(ErrlyServiceProvider::class)) {
            ErrlyServiceProvider::configureExceptions($exceptions);
        }
        $exceptions->render(function (Throwable $e, $request) {
            if (! $request->expectsJson()) {
                // Handle different HTTP status codes with custom Inertia pages
                $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

                // Map status codes to appropriate error pages
                $errorPage = match ($status) {
                    404 => 'Errors/404',
                    403 => 'Errors/403',
                    419 => 'Errors/419', // CSRF token mismatch
                    429 => 'Errors/429', // Rate limiting
                    500, 502, 503, 504 => 'Errors/500',
                    default => $status >= 500 ? 'Errors/500' : 'Errors/404',
                };

                // Prepare error data for the frontend
                $errorData = [
                    'status' => $status,
                    'message' => $e->getMessage() ?: 'An error occurred',
                ];

                // Add debug information in development
                if (app()->hasDebugModeEnabled()) {
                    $errorData['debug'] = true;
                    $errorData['exception'] = [
                        'message' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'trace' => collect($e->getTrace())->take(10)->map(function ($trace) {
                            return ($trace['file'] ?? 'unknown').':'.($trace['line'] ?? 'unknown').
                                   ' '.($trace['class'] ?? '').($trace['type'] ?? '').($trace['function'] ?? '');
                        })->toArray(),
                    ];
                }

                return \Inertia\Inertia::render($errorPage, $errorData)
                    ->toResponse($request)
                    ->setStatusCode($status);
            }
        });
    })->create();
