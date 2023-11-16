<div class="col-12 py-3 border d-none rounded messages-container" id="messages-container-{{$room->id}}" style="height: 75vh; overflow-y: scroll;">
    <h2 class="fw-bold fs-5"><u>Live Chat Message History</u></h2>
    <button onclick="setLiveChatCompleted('{{$room->id}}')" class="btn btn-danger mb-3">Mark Completed</button>
    @if(count($room->messages) > 0)
    @foreach($room->messages as $message)
    <p><span class="fw-bold">{{$message->user}}: </span> {{$message->message}}</p>
    @endforeach
    @else
    <p>This live chat has no message history</p>
    @endif

    <hr>

    
</div>