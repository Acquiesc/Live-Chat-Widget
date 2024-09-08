<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ChatRoom;

class LiveChatController extends Controller
{
    public function send(Request $request) {

        $new_room = false;

        if(!$request->get('binded')) {
            $room = new ChatRoom;
            $room->completed = false;
            
            $new_room = true;

        } else {
            $room = ChatRoom::find(intval($request->get('binded')));
            if($room->completed == true) {
                $room->completed = false;
                $new_room = false;
            }
        }
        $room->save();

        $message = new \App\Models\Message;

        $message->chat_room_id = $room->id;
        $message->user = $request->get('user');
        $message->message = $request->get('message');

        $message->save();

        if($new_room) {
            broadcast(new \App\Events\NewLiveChat($request->get('message'), $room->id))->toOthers();
        } else {
            broadcast(new \App\Events\Message($request->get('message'), $room->id))->toOthers();
        }


        return view('inc.live_widget.send')->with(['message' => $request->get('message'),
                                                    'user' => $request->get('user'), 
                                                    'room_id' => $room->id]);
    }

    public function receive(Request $request) {
        return view('inc.live_widget.receive')->with(['message' => $request->get('message'), 
                                                        'user' => $request->get('user')]);
    }
}
