<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class jobPostFiles extends Model
{
    use HasFactory;
    protected $table = 'job_post_files';
    // protected $appends = ['url'];

    protected $fillable = [
        'path',
        'job_post_id',
    ];
}
