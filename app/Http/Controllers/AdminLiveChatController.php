<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ChatRoom;


class AdminLiveChatController extends Controller
{
    public function index() {
        $rooms = ChatRoom::all();

        return view('admin.select_chat')->with('rooms', $rooms);
    }

    public function receive(Request $request) {
        return view('admin.chat.receive')->with(['message' => $request->get('message'),
                                                    'room_id' => $request->get('room_id')]);
    }

    public function send(Request $request) {
        broadcast(new \App\Events\Message($request->get('message'), intval($request->get('binded'))))->toOthers();

        $message = new \App\Models\Message;

        $message->chat_room_id = intval($request->get('binded'));
        $message->user = $request->get('user');
        $message->message = $request->get('message');

        $message->save();

        return view('admin.chat.send')->with('message', $request->get('message'));
    }

    public function newRoom(Request $request) {
        $room = ChatRoom::find(intval($request->get('room_id')));

        return view('admin.chat.chat_room')->with([
            'room' => $room,
        ]);
    }

    public function newRoomSelect(Request $request) {
        return view('admin.chat.room_select')->with([
            'room_id' => $request->get('room_id'),
        ]);
    }

    public function setRoomCompleted(Request $request, $id) {
        $room = ChatRoom::find($id);

        if(!$room) {
            return response(['error' => "Could not located room $id"], 200);
        }

        $room->completed = true;

        $room->save();

        return response(['success' => "Set room $id completed"], 200);
    }
}
