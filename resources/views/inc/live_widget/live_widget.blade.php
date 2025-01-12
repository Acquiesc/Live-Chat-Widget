<button class="d-flex align-items-center text-white py-2" id="live-widget-toggle-btn" onclick="toggleLiveChat()">
    <i class="bi bi-chat fs-5"></i>
    <p class="d-none d-md-block my-auto ms-2">Need help?  Join live chat</p>
</button>

<div class="" style="background-color: #ffffff;" id="live-chat">
    <div class="container h-100 w-100 d-flex flex-column justify-content-between">
        <div class="row">
            <div class="col text-center">
                <h1 class="fw-bold">Live Chat</h1>
            </div>
        </div>
        <div class="row">   
            <div class="col" id="messages-container">
                
            </div>
        </div>
        <div class="row">
            <div class="col my-3">
                <form onSubmit="sendLiveChatMessage(event, this)" action="">
                    @csrf
                    <div class="d-flex">
                        <label for="message" class="form-label visually-hidden">Message</label>
                        <input type="text" name="message" id="message" class="form-control message" placeholder="Enter Message...">
                        <button type="submit" class="btn btn-primary"><i class="bi bi-caret-right-fill"></i></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script src="/js/pusher.js"></script>

<script>
    const live_chat = document.getElementById('live-chat')

    function toggleLiveChat() {
        live_chat.classList.toggle('live-chat-active')

        if(live_chat.classList.contains('live-chat-active')) {
            connectPusher()
        } else {
            //Could disconnect but want to notify users of new messages if they're just closing
            //temporarily for screen real estate
            //disconnectPusher()
        }
    }
</script>