// Prefer camera resolution nearest to 1280x720.
var constraints = {
    audio: false,
    video: {
        width: 1280,
        height: 720
    }
};

let peerConnection = null;

function bindEvents(peerConnection) {

    peerConnection.on('signal', function (data) {
        document.querySelector('#offer').textContent = JSON.stringify(data)
    })
    
    peerConnection.on('error', function (err) {

        console.log('putain d\'erreur', err)
    })
    
    peerConnection.on('stream', function (stream) {
        let receiverVideo = document.querySelector('#receiver-video');
        receiverVideo.srcObject = stream;
        receiverVideo.play();
    })
    
    
}

document.querySelector('#start').addEventListener('click', function (e) {

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (mediaStream) {

            peerConnection = new SimplePeer({
                initiator: true,
                stream: mediaStream,
                trickle:false
            })
            bindEvents(peerConnection)
            let emitterVideo = document.querySelector('#emitter-video');
            emitterVideo.srcObject = mediaStream;
            emitterVideo.play();

        })
        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        }); // always check for errors at the end.
})

document.querySelector("#incoming").addEventListener('submit', function (e) {
    e.preventDefault();

    if (peerConnection == null) {
            peerConnection = new SimplePeer({
            initiator: false,
            trickle: false
        })

        bindEvents(peerConnection)
    };
    console.log(e.target.querySelector('#formText').value)
    peerConnection.signal(JSON.parse(e.target.querySelector('textarea').value))
})