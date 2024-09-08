@extends('layouts.app')
@section('content')

<div class="container d-flex flex-column" style="min-height: 100vh;"> 
    <div class="row mt-3">
        <div class="col text-center">
            <h1>Admin Live Chat</h1>
            <p class="alert d-none" id="live-chat-notifications"></p>
        </div>
    </div>

    <div class="row" id="live-chats-container" style="">
        <div class="col-auto py-3 border rounded d-flex flex-column gap-3" id="room-select-container" style="height: 75vh; min-width: 50px;">
            @foreach($rooms as $room)
            @if(!$room->completed)
                @include('admin.chat.room_select', ['room_id' => $room->id])
            @endif
            @endforeach
        </div>
        <div class="col" style="min-width: 75%;">
            <div class="row" id="rooms-container">
                @foreach($rooms as $room)
                @if(!$room->completed)
                    @include('admin.chat.chat_room', ['room' => $room])
                @endif
                @endforeach
            </div>
        </div>
        <div class="col-12 my-3">
            <form onsubmit="sendLiveChatMessageAdmin(event, this)" action="">
                @csrf
                <div class="d-flex mb-3">
                    <label for="message_input" class="visually-hidden form-label">Message</label>
                    <input type="text" name="message_input" id="message_input" class="form-control" placeholder="Message...">
                    <button type="submit" class="btn btn-primary"><i class="bi bi-caret-right-fill"></i></button>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="/js/adminPusherNotifications.js"></script>

<script src="/js/pusher.js"></script>

<script src="/js/adminPusher.js"></script>

<script>
    function setLiveChatCompleted(room_id) {
        
        unbindFromRoom(room_id)

        fetch(`/admin/room/${room_id}/completed`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        }).then(function(res) {
            return res.json()
        }).then(function(json) {
            if(json.success) {
                document.getElementById(`room-select-container-${room_id}`).remove()

                document.getElementById(`room-container-${room_id}`).remove()

                setInitialRoom()
            } else {
                console.error(json.error)
            }
        })
    }
</script>

@endsection