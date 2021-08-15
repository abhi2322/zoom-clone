const videoGrid=document.getElementById('grid-video')
let myVideo=document.createElement('video')
const text=document.getElementById('chat__message')
const msgList=document.getElementById('msgList')
const chatWindow = document.getElementById('chatWindow');
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
    mystream=stream
    socket.emit('join-room',roomId,peer.id)
})
.catch((error)=>{
    console.log(error)
})

socket.on('user-connected',(userId)=>{
    connectToNewUser(userId,mystream)
})

peer.on('call',(call)=>{
    call.answer(mystream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
    addVideoStream(video,userVideoStream)
})
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

text.addEventListener('keypress',(event)=>{
    if(event.which==13 && text.value.length!==0){
        socket.emit('message',text.value)
        text.value=""
    }
})

socket.on('createMsg',(msg)=>{
    const isScrolledToBottom = chatWindow.scrollHeight - chatWindow.clientHeight <= chatWindow.scrollTop + 1
    let li=document.createElement('li')
    li.className="messages"
    li.innerHTML=`<b>user</b><br/>${msg}`
    msgList.appendChild(li)
    if (isScrolledToBottom) {
        chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight
      }
})

function updateScroll(){
    element.scrollTop = element.scrollHeight;
}