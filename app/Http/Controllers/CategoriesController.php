<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    public function getAll(Request $request)
    {
        $categories = Category::query()->get(['*'])->all();
        return response()->json([
            "data" => $categories,
        ]);
    }
}
