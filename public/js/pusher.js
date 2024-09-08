var pusher;
var channel;

var binded = null;

function connectPusher() {
     
    pusher = new Pusher('e8ee38f755067225d865', {
        'cluster': 'us2',
    })

    // Pusher.log = function(msg) {
    //     console.log(msg);
    // };

    channel = pusher.subscribe('live-chat')

    console.log('connected pusher')
}

function sendLiveChatMessage(e, form) {
    e.preventDefault()

    fetch('/message/send', {
        method: 'POST',
        headers: {
            'X-Socket-Id': pusher.connection.socket_id,
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'message': form.querySelector('.message').value,
            'user': 'User',
            'binded': binded,
        })
    }).then((res) => {
        return res.text()
    }).then((html) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const newMessage = doc.body

        const messages_container = document.getElementById('messages-container')

        messages_container.appendChild(newMessage)

        messages_container.scrollTo(0, messages_container.scrollHeight)

        if(!binded) {
            binded = document.querySelector('.live-chat-id').innerText

            bindLiveChat()
        }

        form.querySelector('.message').value = ''
        
    }).catch((err) => {
        console.error(err)
    })
}

function bindLiveChat() {
    channel.bind(`live-chat-${binded}`, function(data) {
        fetch('/message/receive', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'message': data.message,
            })
        }).then((res) => {
            return res.text()
        }).then((html) => {
            const parser = new DOMParser()
            const doc = parser.parseFromString(html, 'text/html')
            const newMessage = doc.body.firstChild
    
            const messages_container = document.getElementById('messages-container')
    
            messages_container.appendChild(newMessage)
    
            messages_container.scrollTo(0, messages_container.scrollHeight)
            
        }).catch((err) => {
            console.error(err)
        })
    })
}

function disconnectPusher() {
    if(pusher && channel) {
        channel.unbind(`live-chat-${binded}`)

        console.log('disconnected from channel')
    }
}