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
            console.log(data.name + name.value )
            output.innerHTML += "<div class='d-flex justify-content-start flex-column'><p class='badge badge-primary'>" + data.message +'<p></div>'
        }
        else
        {
            console.log(data.name + name.value )
            output.innerHTML += "<div class='d-flex justify-content-start flex-column'><p class='badge badge-secondary'> <strong>" + data.name + ' : </strong>' + data.message +'<p></div>'
        }
    })

    socket.on('userTyping', (data) => {
        info.innerHTML = '<p> <i>' + data.name + ' écrit un truc... </i>  <p>'
    })