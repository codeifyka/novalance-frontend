<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function getInfo(Request $request)
    {
        $user_id = auth('api')->user()->id;
        
        $users = DB::table('users')->select('id','username')->where('id','=', $user_id)->get(); 
        if(count($users) == 0){
            return response()->json([
                "error" => "You are not allowed"
            ]);
        }
        
        $services = DB::table('services')->select('*')->where('user_id','=', $user_id)->count('*'); 
        $projects = DB::table('projects')->select('*')->where('user_id','=', $user_id)->count('*'); 


        return response()->json([
            "data" => [
                "user" => $users[0],
                "services" => $services,
                "projects" => $projects,
            ],
        ]);
    }
}
