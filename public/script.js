const videoGrid=document.getElementById('grid-video')
let myVideo=document.createElement('video')
myVideo.muted=true

//This is used for asking permission form the user for vedio and audio and returns a promise
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then((stream)=>{
    addVideoStream(myVideo,stream)
})
.catch((error)=>{
    console.log(error)
})

//function to loading vedio and appending it to vedio-grid
addVideoStream=(video,stream)=>{
    video.srcObject=stream
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video)
}