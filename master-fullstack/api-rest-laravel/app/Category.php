<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class category extends Model
{
  
    protected $table = 'categories';
    // Relación de una categoría a muchos post
    public function posts(){
        return $this->hasMany('App\Post');
    }


//
}
