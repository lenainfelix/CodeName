let socket = io();

let message = document.querySelector('#message'),
    name = document.querySelector('#name'),
    output = document.querySelector('#output'),
    info = document.querySelector('#info'),
    button = document.querySelector('#button');

    // Send Message on button click
    button.addEventListener('click', (e) => {
            e.preventDefault()
            socket.emit('userMessage', {
                name: name.value,
                message: message.value
            })
            document.querySelector('#message').value = ''
            
    })

    // Send user name on user typing
    message.addEventListener('keypress', () => {
        socket.emit('userTyping',{
            name: name.value
        })
    })
    // Listen to event from server and write message to output
    socket.on('userMessage', (data) => {
        info.innerHTML = '';
        if (data.name == name.value)
        {
            output.innerHTML += "<div class='d-flex justify-content-end '><h5><span class='badge badge-primary p-2'>" + data.message +'</span></h5></div>'
        }
        else
        {
            output.innerHTML += "<div class='d-flex justify-content-start flex-column'> <i>" + data.name + "</i> <h5><span class='badge badge-secondary p-2 ml-3'>" + data.message +'<span></h5></div>'
        }
    })

    socket.on('userTyping', (data) => {
        info.innerHTML = '<p> <i>' + data.name + ' écrit un truc... </i>  <p>'
    })

    // Video chat

    // get the emitter video and display it
    function getLVideo(callbacks){
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || mozGetUserMedia;
        var constraints ={
            video: true,
            audio: false
        }
        navigator.getUserMedia(constraints , callbacks.success, callbacks.error)
    }

    function recStream(stream, domID)
    {
        let emitterVideo = document.querySelector(domID);
            emitterVideo.srcObject = stream;
            window.peer_stream =stream;
    }

    getLVideo({
        success: function(stream){
            window.localstream = stream;
            recStream(stream, "#e-Video");
        },
        error: function(error){
            alert("cannot access your camera");
            console.log(err);
        }
    })

    ///// VIDEO CHAT ///////

    let conn;
    let peer_id;

    // create a peer connection
    var peer = new Peer({key: 'lwjd5qra8257b9'});

    // display the peer Id in the DOM
    peer.on('open', function(){
        document.querySelector("#displayId").innerHTML = peer.id
    })

    peer.on('connection', function(connection){
        conn = connection;
        peer_id = connection.peer;

        document.querySelector("#connectionId").value = peer_id;
    })
    peer.on('error', function(err){
        alert('an error occured' + err)
        console.log(err);
    

    })

    document.querySelector("#connectButton").addEventListener('click',function(){
        peer_id = document.querySelector('#connectionId').value;

        if (peer_id){
            conn = peer.connect(peer_id);
        }
        else{
            alert("enter an id")
        }
    })
    
    peer.on("call", function (call){
        let acceptCall = confirm("Do you want to answer the call?")
        
        if (acceptCall){
            call.answer(window.localstream);
            
            call.on("stream", function(stream){
                window.peer_stream = stream;
                
                recStream(stream, '#r-Video')
            });
            
            call.on("close", function(){
                alert("The call has ended")
                
            });

        }
        else{
            console.log("Call denied");
        } 
    })

    //Ask to call
    document.querySelector('#callButton').addEventListener('click', function(){
        console.log("calling a peer" + peer_id);
        console.log(peer);

        let call = peer.call(peer_id, window.localstream);

        call.on('stream', function(stream){
            window.peer_stream = stream;

            recStream(stream,'#r-Video');
        })
    })