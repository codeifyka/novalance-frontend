<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FilesUploadController extends Controller
{
    public function uploadServicesImages(Request $request)
    {
        $files = $request->allFiles();
        $names = [];

        foreach($files as $file){
            $uniqueFilename = $file->store('services_images');
            array_push($names, $uniqueFilename);
        }

        return response()->json([
            "data" => $names,
        ]);
    }
}
