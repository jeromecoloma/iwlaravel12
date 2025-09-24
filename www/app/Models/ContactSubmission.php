<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactSubmission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'ip_address',
        'user_agent',
        'status',
        'processed_at',
        'user_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'processed_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the user that submitted this contact form.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include processed submissions.
     */
    public function scopeProcessed(Builder $query): Builder
    {
        return $query->where('status', 'processed');
    }

    /**
     * Scope a query to only include pending submissions.
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include recent submissions.
     */
    public function scopeRecent(Builder $query, int $days = 30): Builder
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope a query to only include submissions from a specific email.
     */
    public function scopeFromEmail(Builder $query, string $email): Builder
    {
        return $query->where('email', $email);
    }

    /**
     * Get contact submissions with optimized queries.
     */
    public static function getWithUser(): Builder
    {
        return static::query()
            ->with('user:id,name,email')
            ->select(['id', 'name', 'email', 'subject', 'status', 'created_at', 'user_id'])
            ->latest();
    }

    /**
     * Get contact submission statistics.
     */
    public static function getStatistics(): array
    {
        return cache()->remember('contact_submissions_stats', 3600, function () {
            return [
                'total' => static::count(),
                'pending' => static::pending()->count(),
                'processed' => static::processed()->count(),
                'recent' => static::recent(7)->count(),
                'today' => static::whereDate('created_at', today())->count(),
            ];
        });
    }
}
