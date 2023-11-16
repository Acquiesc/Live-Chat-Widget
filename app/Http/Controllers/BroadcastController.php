<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BroadcastController extends Controller
{
    public function auth() {
        //implement session based auth check
        return true;
    }
}
