<?php

namespace App\Traits;

Trait files  
{
    
    public function save_illustrative_file($file,$folder){
        $file_extension=$file->getClientOriginalExtension();
        $file_name=time().'.'.$file_extension;
        $path='assets/files/'.$folder;
        $file->move($path,$file_name);
        return $file_name;
   }
}
