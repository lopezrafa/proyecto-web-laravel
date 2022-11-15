<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class post extends Model
{
    
  
    
    protected $table = 'posts';
    
      protected $fillable = [
        'title', 'content', 'category_id', 'image'
    ];
             
    // Relación de muchos post a un usuario o categoría
    
    public function user(){
        return $this->belongsTo('App\User', 'user_id');
    }
    
    
    public function category(){
        return $this->belongsTo('App\Category', 'category_id');
    }
            
            
}
