var current_room_bind = null

var rooms_binded_to_listen = []

//initial page load setup

// -- /js/pusher.js
connectPusher()

subscribeToAdminRooms() //join the administration web socket which will listen for new chats

bindToLiveChats()

setInitialRoom()

//open the first valid chat room
function setInitialRoom() {

    const first_select_room_btn = document.querySelector('.select-room-btn')

    if(first_select_room_btn) {
        selectRoom(first_select_room_btn.innerText, first_select_room_btn)

        setNotification(`${rooms_binded_to_listen.length} rooms active`, rooms_binded_to_listen.length)
    } else {
        setNotification('No active live chats', 0)
    }
}

function subscribeToAdminRooms() {
    admin_channel = pusher.subscribe('admin-rooms')

    admin_channel.bind('new-room', function(data) {
        console.log(`new room ${data.room_id}: ${data.message}`)

        // Fetch the HTML for the new live chat room
        fetch('/admin/room/new', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'message': data.message,
                'room_id': data.room_id
            })
        }).then(function(res) {
            return res.text()
        }).then((html) => {
            const parser = new DOMParser()
            const doc = parser.parseFromString(html, 'text/html')
            const newLiveChat = doc.body.firstChild

            const rooms_container = document.getElementById(`rooms-container`)

            rooms_container.appendChild(newLiveChat)

            rooms_container.scrollTo(0, rooms_container.scrollHeight)

            // Bind admin to the new live chat room immediately
            bindLiveChatAdmin(data.room_id)
        })

        // Add the room selection button for the new chat room
        if (!document.getElementById(`select-${data.room_id}-chat-btn`)) {
            fetch('/admin/room/new/select', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'room_id': data.room_id
                })
            }).then(function(res) {
                return res.text()
            }).then((html) => {
                const parser = new DOMParser()
                const doc = parser.parseFromString(html, 'text/html')
                const newSelectBtn = doc.body.firstChild
    
                const room_select_container = document.getElementById(`room-select-container`)
    
                room_select_container.appendChild(newSelectBtn)
    
                room_select_container.scrollTo(0, room_select_container.scrollHeight)

                // Set unread alert if not in the current room
                if (data.room_id != current_room_bind) {
                    console.log(`Setting Unread Alert ${data.room_id}`)
                    document.getElementById(`unread-${data.room_id}`).style.width = '10px'
                }
            })
        }
    })
}

//select room button onclick
function selectRoom(room_id, btn) {
    setCurrentRoom(room_id)

    setActiveBtn(btn)

    showMessagesContainer(room_id)
}

//handle frontend UI
function setActiveBtn(btn) {
    const btns = document.querySelectorAll('.select-room-btn')
    btns.forEach(btn => {
        if(btn.classList.contains('btn-success')) {
            btn.classList.remove('btn-success')
            btn.classList.add('btn-primary')
        }
    })
    
    btn.classList.remove('btn-primary')
    btn.classList.remove('btn-danger')
    btn.classList.add('btn-success')

    document.getElementById(`unread-${btn.innerText}`).style.width = '0px'
}

function showMessagesContainer(room_id) {
    hideAllMessagesContainers()

    document.getElementById(`room-container-${room_id}`).classList.toggle('d-none')
}

function hideAllMessagesContainers() {
    const containers = document.querySelectorAll('.messages-container')
    containers.forEach(container => {
        container.classList.add('d-none')
    })
}

//bind to existing live chats
function bindToLiveChats() {

    const room_btns = document.querySelectorAll('.select-room-btn')

    room_btns.forEach(btn => {

        const room_id = btn.innerText

        if(rooms_binded_to_listen.indexOf(room_id) == -1) {
            console.log(`binding to: ${room_id}`)

            rooms_binded_to_listen.push(room_id)

            channel.bind(`live-chat-${room_id}`, function(data) {
                console.log(`Live chat message: ${data.message}`)

                fetch('/admin/receive', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'message': data.message,
                        'room_id': data.room_id
                    })
                }).then(function(res) {
                    return res.text()
                }).then((html) => {
                    const parser = new DOMParser()
                    const doc = parser.parseFromString(html, 'text/html')
                    const newMessage = doc.body.firstChild

                    const messages_container = document.getElementById(`room-container-${data.room_id}`)
        
                    messages_container.appendChild(newMessage)

                    messages_container.scrollTo(0, messages_container.scrollHeight)

                    if(data.room_id != current_room_bind) {
                        console.log(`Setting Unread Alert ${data.room_id}: ${newMessage}`)
                        document.getElementById(`unread-${data.room_id}`).style.width = '10px'
                    }
                })
            })
        }

        setNotification(`${rooms_binded_to_listen.length} rooms active`, rooms_binded_to_listen.length)
    })
}

function bindLiveChatAdmin(room_id) {
    if (rooms_binded_to_listen.indexOf(room_id) == -1) {
        rooms_binded_to_listen.push(room_id)

        channel.bind(`live-chat-${room_id}`, function(data) {
            console.log(`Live chat message: ${data.message}`)

            fetch('/admin/receive', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'message': data.message,
                    'room_id': data.room_id
                })
            }).then(function(res) {
                return res.text()
            }).then((html) => {
                const parser = new DOMParser()
                const doc = parser.parseFromString(html, 'text/html')
                const newMessage = doc.body.firstChild

                const messages_container = document.getElementById(`room-container-${data.room_id}`)

                messages_container.appendChild(newMessage)

                messages_container.scrollTo(0, messages_container.scrollHeight)

                if (data.room_id != current_room_bind) {
                    console.log(`Setting Unread Alert ${data.room_id}`)
                    document.getElementById(`unread-${data.room_id}`).style.width = '10px'
                }
            })
        })

        setNotification(`${rooms_binded_to_listen.length} rooms active`, rooms_binded_to_listen.length)
    }
}

//swap live chat room target for sending messages
function setCurrentRoom(room_id) {
    if(current_room_bind == room_id) {
        return
    }
    
    console.log(`set current room: ${room_id}`)

    current_room_bind = room_id
}

//send live chat to current room bind
function sendLiveChatMessageAdmin(e, form) {
    e.preventDefault()

    if(!current_room_bind) {
        console.error('Please select a chat')
        return
    }

    fetch('/admin/send', {
        method: 'POST',
        headers: {
            'X-Socket-Id': pusher.connection.socket_id,
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'message': document.getElementById('message_input').value,
            'user': 'Admin',
            'binded': current_room_bind,
        })
    }).then((res) => {
        return res.text()
    }).then((html) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const newMessage = doc.body.firstChild

        const messages_container = document.getElementById(`room-container-${current_room_bind}`)

        messages_container.appendChild(newMessage)

        messages_container.scrollTo(0, messages_container.scrollHeight)

        document.getElementById('message_input').value = ''
        
    }).catch((err) => {
        console.error(err)
    })
}

//unbind from a room
function unbindFromRoom(room_id) {
    channel.unbind(`live-chat-${room_id}`)

    rooms_binded_to_listen.splice(rooms_binded_to_listen.indexOf(room_id), 1)

    console.log(`unbinded from ${room_id}`)
}

