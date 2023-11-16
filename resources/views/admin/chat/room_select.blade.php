<div class="row d-flex justify-content-center" id="room-select-container-{{$room_id}}">
    <div class="col-auto">
        <div class="d-flex gap-2 align-items-center">
            <button onclick="selectRoom('{{$room_id}}', this)" id="select-{{$room_id}}-chat-btn" class="btn select-room-btn btn-primary">{{$room_id}}</button>
            <div id="unread-{{$room_id}}" style="width: 0px; border-radius: 50%; height: 10px; background-color: red; transition: all .2s ease;"></div>
        </div>
    </div>
</div>