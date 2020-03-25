let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let PORT = process.env.PORT || 3000;

http.listen(PORT, () =>{
    //console.log("listening to port : " + PORT)

});

app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html")
})

app.use(express.static('public'));


io.on('connection',function (socket){
    //console.log("client is connected " + socket.id)

    socket.on('userMessage', (data) => {
        io.sockets.emit('userMessage',data)
    })

    socket.on('userTyping', (data) => {
        socket.broadcast.emit("userTyping", data )
    })
});