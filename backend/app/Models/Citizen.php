<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Citizen extends Model
{
    use HasFactory;

    protected $fillable = ['household_id', 'is_head_of_household'];

    public function household()
    {
        return $this->belongsTo(Household::class);
    }
}
