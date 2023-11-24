<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Price;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServicesController extends Controller
{
    public function getSelfAll(Request $request)
    {
        $user = auth('api')->user(); 
        $services = DB::table('services')->
        select('services.id as id','title','prices.value as price','rate','categories.name as category','currency_code')->
            join('prices','prices.id','=','services.price_id')->
            join('categories','categories.id','=','services.category_id')->
        where('user_id','=',$user->id)->get();

        foreach($services as $service){
            $images = DB::table('services_images')->select('*')->where('service_id','=',$service->id)->get();
            $arr = [];
            foreach($images as $img){
                array_push($arr, [
                    "id" => $img->id,
                    "url" => asset('storage/'.$img->path),
                ]);
            }
            $service->images = $arr;
        }

        return response()->json([
            "data" => $services,
        ]);
    }

    public function getById(Request $request)
    {
        $service_id = $request->id;

        $services = DB::table('services')->
        select('services.id as id','title','description','prices.value as price','rate','categories.name as category','currency_code')->
            join('prices','prices.id','=','services.price_id')->
            join('categories','categories.id','=','services.category_id')->
        where('services.id','=',$service_id)->get();
        
        foreach($services as $service){
            $images = DB::table('services_images')->select('*')->where('service_id','=',$service->id)->get();
            $arr = [];
            foreach($images as $img){
                array_push($arr, [
                    "id" => $img->id,
                    "url" => asset('storage/'.$img->path),
                ]);
            }
            $service->images = $arr;
        }

        
        if(count($services) == 0){
            return response()->json([
                "data" => null,
            ]);
        }

        return response()->json([
            "data" => $services[0],
        ]);
    }
    
    public function getAll(Request $request)
    {
        $username = request('username');
        $users = DB::table('users')->select('id','username')->where('username','=', $username)->get(); 

        if(count($users) == 0){
            return response()->json([
                "error" => "No user",
                "username" => $username,
            ]);
        }

        $services = DB::table('services')->
        select('services.id as id','title','description','prices.value as price','rate','categories.name as category','currency_code')->
            join('prices','prices.id','=','services.price_id')->
            join('categories','categories.id','=','services.category_id')->
        where('user_id','=',$users[0]->id)->get();
        
        foreach($services as $service){
            $images = DB::table('services_images')->select('*')->where('service_id','=',$service->id)->get();
            $arr = [];
            foreach($images as $img){
                array_push($arr, [
                    "id" => $img->id,
                    "url" => asset('storage/'.$img->path),
                ]);
            }
            $service->images = $arr;
        }

        return response()->json([
            "data" => $services,
        ]);
    }

    public function create(Request $request)
    {
        $categories = Category::query()->get(['*'])->where('name','=',$request['category']);
        if(count($categories) == 0){
            return response()->json([
                "error" => "Category does not exist."  
            ]);
        }
        
        $price = Price::create([
            "value" => $request['price'],
            "currency_code" => 'USD',
            "currency_symbol" => '$'
        ]);
        
        $service = Service::create([
            "title" => $request['title'],
            "description" => $request['description'],
            "user_id" => auth('api')->user()['id'],
            "category_id" => $categories[0]['id'],
            "price_id" => $price['id'],
            "rate" => 0
        ]);

        foreach($request["images"] as $img){
            DB::table('services_images')->insert([
                "path" => $img,
                "service_id" => $service->id
            ]);
        }

        return response()->json([
            "data" => $service
        ]);
    }
}
