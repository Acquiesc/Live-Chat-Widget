const admin_notifications = document.getElementById('live-chat-notifications')

function setNotification(message, count) {
    console.log(`setting room notifications: count[${count}] message[${message}]`)

    admin_notifications.classList.remove('d-none')
    admin_notifications.classList.remove('alert-success')
    admin_notifications.classList.remove('alert-warning')
    admin_notifications.classList.remove('alert-danger')

    if(count < 1) {
        admin_notifications.classList.add('alert-success')
    } else if (count >= 1 && count <= 3) {
        admin_notifications.classList.add('alert-warning')
    } else if (count >= 4) {
        admin_notifications.classList.add('alert-danger')
    }
    admin_notifications.innerText = message
}