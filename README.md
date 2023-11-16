# Live-Chat-Widget

Live Chat Widget is a simple way to broadcast messages in realtime from a user facing live chat widget and a live chat administration panel.  This provides instantaneous user response to questions and feedback, potentially increasing
the number of conversions on a store front or service based web page.  Created with intent of applying knowledge to https://sonsic.com homepage and sharing what I've learned about websockets and realtime messaging.

- Anonymous live-chat logic allows for immediate assistance & the best user experience possible.
- Instaneous message delivery from user to administrator & vice versa.
- Relational database management for message history tracking.
<br><br>
## Pre-Requisites
This project was created with:
- PHP v8.0.28
- Laravel v9.19
- Pusher v7.2

[Get PHP & MySQL](https://www.apachefriends.org/download.html)<br>
[Ensure you have composer installed](https://getcomposer.org/download/)<br>
[Register Project with Pusher (free sandbox up to 200,000 daily messages)](https://dashboard.pusher.com/accounts/sign_up)
<br><br>
## Setting Up the Project
1. Once you've downloaded the GitHub repo locally, open the project root in a text editor such as [VS Code](https://code.visualstudio.com/download)

2. Create a .env file or rename the '.env.example' file to '.env'


(optional) Create a new database such as 'live-chat-widget' via http://localhost/phpmyadmin

3. Set .env variables to the related database

    > DB_CONNECTION=mysql
    
    > DB_HOST=127.0.0.1
    
    > DB_PORT=3306

    > DB_DATABASE=laravel

    > DB_USERNAME=root
    
    > DB_PASSWORD=

3. Set .env variables to the related Pusher project API keys

    > BROADCAST_DRIVER=pusher
    
    
    > PUSHER_APP_ID=xxxxxxxxxxxx
    
    > PUSHER_APP_KEY=xxxxxxxxxxxxx
    
    > PUSHER_APP_SECRET=xxxxxxxxxxxx
    
    > PUSHER_PORT=443
    
    > PUSHER_SCHEME=https
    
    > PUSHER_APP_CLUSTER=xxx

4. Open a terminal inside the project root and run the following commands:

   install packages
   > composer install
   
   update packages
   > composer update

   create the database
   > php artisan migrate

   reset local caching
   > php artisan optimize
   
   serve the local website
   > php artisan serve

4. Open the generated localhost URL displayed in the console, likely http://127.0.0.1:8000 (recommended to use incognito mode)
<br><br><br><br>
# Using the Application

## Setting Up
1. Once web page is properly displayed with the live widget in the bottom right hand corner of the web page, open a second incognito window or a second (different) web browser
2. Navigate to http://127.0.0.1:8000/admin inside the second window

**You should now have one window open to simulate the user input, and one window open to simulate the administrator input.**
<br><br>
# User

## Sending a Message
1. Click on the live chat widget in the bottom right hand corner of the web page to open the live chat interface
2. Type your message into the text input
3. Submit the form

## Receiving a message
1. A Message broadcast event triggers the interal code from
   
   > channel.bind('live-chat-${room_id}', function(data) { some function })
   
with 'data' representing the data contained in Message.
2. The broadcasted data is compiled into a frontend fetch request and posted to '/message/receive'
3. The response is converted into text and parsed into html
4. The parsed HTML is appended to the messages-container and the container is scrolled to it's available scroll height

note: This could be simplified from an administration and user endpoint to a single receive/broadcast endpoint with the User/Admin name templated into the components with {{$message->name}}.
<br>
<br>

# Admin

## Page Initialization
Only existing, incomplete chat rooms are displayed in the chat interface.  If no chat rooms are currently available to be selected, the administrator should wait for a new live chat to be created or for the user to re-initialize a previously completed live chat.
Administrators are initially binded to all live-chat channels based on the initialized buttons and their room id's.
<br>

## Managing Live Chats
1. Select an existing incomplete chat based on id
2. View the chat history templated into the "message-container-$room-id" and any new messages below
3. Click the 'mark-completed' button highlighted in red, located at the top of the messages container<br>
    - Sets the live chat as completed in the database<br>
    - Hides the messages and select button on the UI<br>
4. Fill out and submit the message form to broadcast a message back to the currently selected chat room

## Receiving a message
1. A Message broadcast event triggers the interal code from
   
   > channel.bind('live-chat-${room_id}', function(data) { some function })
   
with 'data' representing the data contained in Message.  

2. The broadcasted data is compiled into a frontend fetch request and posted to '/admin/receive'
3. The response is converted into text and parsed into html
4. The parsed HTML is appended to the messages-container and the container is scrolled to it's available scroll height

note: This could be simplified from an administration and user endpoint to a single receive/broadcast endpoint with the User name templated into the components.
<br>

## Unread Messages
If a message is received on a binded channel which is not currently selected, the corresponding unread message label (red circle) is displayed next to the select-room button.

The unread message notification is removed once the corresponding chat is selected
<br>

# Pusher Integration
When both the user page and admin page is loaded, the **/public/js/pusher.js** script connects to the Pusher broadcasting service using the Pusher API

     pusher = new Pusher('PUSHER_APP_KEY', {
         'cluster': 'PUSHER_APP_CLUSTER',
     })

The scrip then proceeds to subscribe them to the default live-chat broadcasting channel 'live-chat' defined in the 'App\Events\Message' function broadcastOn 

use and administration page

    channel = pusher.subscribe('live-chat')

administrator page via **/public/js/adminPusher.js**

    admin_channel = pusher.subscribe('admin-rooms')

Once a user submits the 'send message' form, a fetch request is made to the '/message/send' route

If the user has not used the live chat function<br>

1. A new ChatRoom entry to the ChatRooms database is created
2. A new Message is created in the Messages database with relation to the new ChatRoom
3. A NewLiveChat event is broadcasted over the 'admin-rooms' channel as a 'new-room' broadcast
4. A Message event is broadcasted over the 'live-chat' channel as a "live-chat-$room->id" broadcast
5. Upon fetch response, the user is binded to the "live-chat-$room->id" via the channel previously created

If the user has used the live chat function

1. Query the ChatRoom based on the currently binded room_id sent in the body of the request
2. Ensure the ChatRoom is set to complete = false
3. A new Message is created in the Messages database with relation to the current ChatRoom
4. If the ChatRoom was marked complete and adjusted to incomplete, a NewLiveChat event is broadcasted over the 'admin-rooms' channel as a 'new-room' broadcast
5. A Message event is broadcasted over the 'live-chat' channel as a "live-chat-$room->id" broadcast
<br><br>

## Development Notes
Creating a new event in Laravel with

    php artisan make:event SomeEvent

creates the class

    class SomeEvent

while Pusher requires

    class SomeEvent implements ShouldBroadcast

It also only default impelements the function

    public function broadcastOn() { return new PrivateChannel('broadcast-channel-name'); }

which should be (unless you're implementing authentication to subscribe to each broadcast) modified to

    public function broadcastOn() { return new Channel('broadcast-channel-name'); }

the broadcastOn() function name relates to

    channel = pusher.subscribe('broadcast-channel-name')

It does not default implement the function

    public function broadcastAs() { return 'broadcast-room-name'; } 

the broadcastAs() function name relates to

    channel.bind('broadcast-room-name', function(data) {  })

# Future Updates
1. Code organization, cleanup, & optimization
2. Email & SMS notifications if an administrator is not currently monitoring the live chat or enable/disable live-chat functionality from backend
3. CSS styling updates
4. Audible new message alert for admins
