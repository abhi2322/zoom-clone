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
    audio:true
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

//funciton to make a connection to new user and add its vedio stream to our grid
const connectToNewUser=(userId,stream)=>{
    const call=peer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
}

//function for loading vedio and appending it to vedio-grid
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

//function to keep scrolling till the end
function updateScroll(){
    element.scrollTop = element.scrollHeight;
}


//function for mute and unmute button
const muteUnmute=()=>{
    var enabled=mystream.getAudioTracks()[0].enabled
    if(enabled){
        setUnmuteButton()
        mystream.getAudioTracks()[0].enabled=false
    }
    else{
        setMuteButton()
        mystream.getAudioTracks()[0].enabled=true
    }
}

const setMuteButton=()=>{
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }

//function to stop and play video
  const playStop = () => {
    let enabled = mystream.getVideoTracks()[0].enabled;
    if (enabled) {
      mystream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      mystream.getVideoTracks()[0].enabled = true;
    }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }