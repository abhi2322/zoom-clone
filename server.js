const express=require('express')
const app=express()
const server=require('http').Server(app)
const{v4:uuidv4}=require('uuid')
app.set('view engine','ejs')
app.use(express.static(__dirname+'/public'))
//Making a get requet on root path
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

//starting the server at 3030 port
server.listen(3030,()=>{
    console.log('server runnig at http://localhost:3030')
})