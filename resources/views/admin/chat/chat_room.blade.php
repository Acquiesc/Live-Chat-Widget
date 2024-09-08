<div class="col-12 py-3 border d-none rounded messages-container" id="room-container-{{$room->id}}" style="height: 75vh; overflow-y: auto;">
    <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">
        <h2 class="fw-bold fs-5 mb-0">Live Chat #{{$room->id}}</h2>
        <button onclick="setLiveChatCompleted('{{$room->id}}')" class="btn btn-danger">Mark Completed</button>
    </div>

    <hr>

    <div class="row">
        <div class="col">
            @if(count($room->messages) > 0)
            @foreach($room->messages as $message)
             @if($message->user == 'Admin')
                @include('admin.chat.send', ['message' => $message->message, 'room_id' => $message->chat_room_id])
             @else
                @include('admin.chat.receive', ['message' => $message->message, 'room_id' => $message->chat_room_id])
             @endif
            @endforeach
            @else
            <p>This live chat has no message history</p>
            @endif
        </div>
    </div>
    
</div>