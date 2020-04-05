let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let PORT = process.env.PORT || 3000;
let peerIds = new Array();
let userNames = new Array();
let rooms = new Array();
let receivedCredentials = new Array();

http.listen(PORT, () =>{
    //console.log("listening to port : " + PORT)

});

app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html")
})

app.use(express.static('public'));


io.on('connection',function (socket){
    console.log("client is connected " + socket.id)

    socket.on('userCredentials', (credentials) => {
        
        if (rooms.length == 0)
        {           
            receivedCredentials.push(credentials); 
            rooms.push(credentials.room);
            //peerIds.push(credentials.peer_id);
            //userNames.push(credentials.name);
            
            console.log("La room :" + credentials.room + " a été crée")
            console.log("Bienvenue dans la room : " + credentials.room)
        }
        else
        {
            
            rooms.forEach(room => {
                
                if(room == credentials.room)
                {
                    console.log("Bienvenue " + credentials.name + " id : " + credentials.peer_id +" dans la room : " + credentials.room)
                    receivedCredentials.push(credentials); 
                    //peerIds.push(credentials.peer_id);
                    //userNames.push(credentials.name);
                    
                    console.log('Envoi');
                    io.sockets.emit('otherCredentials', receivedCredentials);
                    
                    
                    console.log(receivedCredentials)
                    
                    
                }
                else
                {
                    console.log("La room :" + credentials.room + " a été crée")
                    rooms.push(credentials.room);
                    receivedCredentials.push(credentials); 

                    console.log("Bienvenue dans la room : " + credentials.room)
                    //peerIds.push(credentials.peer_id);
                    //userNames.push(credentials.name);
                    console.log(peerIds)
                }
                
            });
        }

    })

    socket.on('userMessage', (data) => {
        io.sockets.emit('userMessage',data)
    })

    socket.on('userTyping', (data) => {
        socket.broadcast.emit("userTyping", data )
    })

});