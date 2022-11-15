<?php

namespace App\Http\Controllers;

use App\category;
use App\post;

use Illuminate\Http\Request;

class PruebasController extends Controller
{
    public function testOrm(){
        $posts = Post::all();
        
        $categories = Category::all();
        foreach($categories as $category){
            
            echo "<h1>{$category->name}</h1>";
            
            foreach($category->posts as $post){
                echo "<h2>".$post->title."</h2>";
                echo "<h4>{$post->user->name}  -  {$post->category->name}</h4>";
                echo "<p>".$post->content."</p>";                
            }
            
            echo "<hr>";


            
        }
        
        die();
    }
}
