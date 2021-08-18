const express=require('express')
const app=express()
const server=require('http').Server(app)
const{v4:uuidv4}=require('uuid')
const io=require('socket.io')(server)
const {ExpressPeerServer}=require('peer')
const PeerServer=ExpressPeerServer(server,{
    debug:true
})
app.use('/peerjs',PeerServer)
app.set('view engine','ejs')
app.use(express.static(__dirname+'/public'))


//Making a get requet on root path
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

io.on('connection',(socket)=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected',userId);
        socket.on('message',(msg)=>{
            io.to(roomId).emit('createMsg',msg)
        })
        socket.on('disconnect',()=>{
            socket.broadcast.to(roomId).emit('user-disconnected',userId)
        })
    })
})

//starting the server at 3030 port
server.listen(3030,()=>{
    console.log('server runnig at http://localhost:3030')
})
