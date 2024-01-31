<?php

namespace App\Http\Controllers;
use App\Traits\files;
use Illuminate\Http\Request;

class FilesUploadController extends Controller
{
    use files;

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

    public function uploadJobPostFiles(Request $request)
    {
        $files = $request->allFiles();
        $names = [];

        foreach($files as $file){
            $file_name = $this->files($file,'illustrative_files');
            array_push($names, $file_name);
        }

        return response()->json([
            "data" => $names,
        ]);
    }
}
