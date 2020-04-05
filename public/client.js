let socket = io();
let otherCredentials = new Array();
let stream;

let message = document.querySelector('#message'),
    name = document.querySelector('#name'),
    room = document.querySelector('#room'),
    output = document.querySelector('#output'),
    info = document.querySelector('#info'),
    button = document.querySelector('#button');
    register = document.querySelector('#register')

    document.querySelector('#register').addEventListener('click', function(){
        console.log("Mon nom est :"+ name.value);
        if (name.value != '')
        {
            
            document.querySelector('#registerWindow').style.display = 'none';
            document.querySelector('#chatWindow').style.display = 'block';
        }
        else
        {
            alert("T'as pas de prénom ??")
        }
    })


    ///// VIDEO CHAT PEER SETUP///////

    let conn;
    let peer_id;
    let myStream;
    let userName;
    let dataConnection;

    // create a peer connection
    var peer = new Peer({key: 'lwjd5qra8257b9'});
    
    // display the peer Id in the DOM
    peer.on('open', function(){
        document.querySelector("#displayId").innerHTML = peer.id
    })
    
    
    peer.on('error', function(err){
        alert('an error occured' + err)
        console.log(err);
        
        
    })
    
    ////////////////// Sending to server ////////////////////////////
    
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
    
    // Send peer_id on register/join click
    register.addEventListener('click',() => {
        console.log("peerId sent :" + peer.id);
        
        
        socket.emit('userCredentials',{
            name: name.value,
            room: room.value,
            peer_id: peer.id
        })
    })
    
    getLVideo({
        success: function(stream){
            myStream = stream;
            console.log("Ma video demarre" );
            displayMyStream(stream);
            //recStream(stream, "#e-Video");
        },
        error: function(error){
            alert("cannot access your camera");
            console.log(err);
        }
    })
    
    ///////////////// Listening from Server /////////////////////////////
    
    // Listen to event from server and write message to output
    // socket.on('userMessage', (data) => {
        //     info.innerHTML = '';
        //     if (data.name == name.value)
        //     {
            //         output.innerHTML += "<div class='d-flex justify-content-end '><h5><span class='badge badge-primary p-2'>" + data.message +'</span></h5></div>'
            //     }
            //     else
            //     {
                //         output.innerHTML += "<div class='d-flex justify-content-start flex-column'> <i>" + data.name + "</i> <h5><span class='badge badge-secondary p-2 ml-3'>" + data.message +'<span></h5></div>'
                //     }
                // })
                
                // socket.on('userTyping', (data) => {
                    //     info.innerHTML = '<p> <i>' + data.name + ' écrit un truc... </i>  <p>'
                    // })
                    
    //////////////// RECEIVE PEER ID TO CONNECT TO ///////////////////////////
                    
    socket.on('otherCredentials', (data) => {
                        
        console.log(data[data.length - 1].peer_id); 
        //console.log("Credentials received : " + data.name + " " + data.peer_id + " " + data.room);
        
        if(peer.id == data[data.length - 1].peer_id){
            
            data.forEach(credentials => {
                
                if (credentials.peer_id != peer.id){
                    
                    otherCredentials = credentials;
                    
                    console.log("Need to connect to : " + credentials.name )
                    stream = myStream;
                    // Call a peer, providing our mediaStream
                    
                    dataConnection = peer.connect(credentials.peer_id, { metadata: { userName: name.value } });
                    let call = peer.call(credentials.peer_id, stream);
                    
                    
                    // `stream` is the MediaStream of the remote peer.
                    call.on('stream', function(stream){
                        remoteStream = stream; 
                        
                        console.log("remote")

                        createVideo(remoteStream , credentials.name);
                    })
                }
            });
        }
    })

    function displayMyStream(stream)
    {
        let myVideo = document.querySelector('#e-Video')
        myVideo.srcObject = stream;
    }




    // get my video 
    function getLVideo(callbacks){
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || mozGetUserMedia;
        var constraints ={
            video: true,
            audio: false
        }
        navigator.getUserMedia(constraints , callbacks.success, callbacks.error)
    }

    // function recStream(stream, domID)
    // {
    //     let emitterVideo = document.querySelector(domID);
    //         emitterVideo.srcObject = stream;
    //         remoteStream = stream;
    // }



    // recupere l'id entrer dans le field id et l'assigne a peer_id
    // document.querySelector("#connectButton").addEventListener('click',function(){
    //     peer_id = document.querySelector('#connectionId').value;

    //     // si peer_id alors je me connecte au peer avec cette peer_id
    //     if (peer_id){
    //         conn = peer.connect(peer_id);
    //     }
    //     else{
    //         alert("enter an id")
    //     }
    // })
    
    ///////// ANSWER THE CALL /////////////
    peer.on('connection', function(dataConnection){
        userName = dataConnection.metadata.userName;
        conn = dataConnection;
        peer_id = dataConnection.peer;
        
        //document.querySelector("#connectionId").value = peer_id;
        
    })

    peer.on("call", function (call){

            call.answer(myStream);

            //console.log(userName);
            
            call.on("stream", function(stream){
                remoteStream = stream;
                
                createVideo(remoteStream, userName );


                //recStream(stream, '#r-Video')
            });
            // alert si le call est arreté
            call.on("close", function(){
                alert("The call has ended")
                
            });

        
        
    })

    // //Ask to call
    // document.querySelector('#callButton').addEventListener('click', function(){
    //     //console.log("calling a peer" + peer_id);
    //     //console.log(peer);

    //     let call = peer.call(peer_id, myStream);

    //     call.on('stream', function(stream){
    //         remoteStream = stream;
            
    //         createVideo(remoteStream);

    //         //recStream(stream,'#r-Video');
    //     })
    // })


    /////////// CREATE VIDEO IN THE DOM ////////////////////

    function createVideo(stream , peer_id){
        try {
            var container = document.createElement('div');
            let videoId = document.createElement('span');
            videoId.innerHTML = peer_id; 
            var video = document.createElement('video');
    
            container.appendChild(video);
            container.appendChild(videoId);
            document.getElementById('participants').appendChild(container);
    
            video.autoplay = true;
            video.controls = false;
            video.srcObject = stream;
        } catch (error) {
            console.error(error);
        }

    }