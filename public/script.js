const videoGrid=document.getElementById('grid-video')
let myVideo=document.createElement('video')
myVideo.muted=true
const socket=io()
const peer=new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3030',
})

//This is used for asking permission form the user for vedio and audio and returns a promise
let mystream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:false
}).then((stream)=>{
    addVideoStream(myVideo,stream)
    peer.on('call',(call)=>{
        call.answer(stream)
        const video=document.createElement('video')
        call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
    })
    mystream=stream
    socket.on('user-connected',(userId)=>{
        /*Try to remove this setTimeout later as the issue i am having is that getuserMedia promise doest resolve int time for peer.on('call) to 
        to answer the call so we delay connectToNewUser and then getUserMedia resolves*/
        setTimeout(connectToNewUser,100,userId,stream)
    })
})
.catch((error)=>{
    console.log(error)
})

peer.on('open',(id)=>{
    console.log(id)
    socket.emit('join-room',roomId,id)
})


const connectToNewUser=(userId,stream)=>{
    const call=peer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
}

//function to loading vedio and appending it to vedio-grid
addVideoStream=(video,stream)=>{
    video.srcObject=stream
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video)
}