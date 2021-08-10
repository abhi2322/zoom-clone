const express=require('express')
const app=express()
const server=require('http').Server(app)

//Making a get requet on root path
app.get('/',(req,res)=>{
    res.status(200).send("Hellow world")
})

//starting the server at 3030 port
server.listen(3030,()=>{
    console.log('server runnig at http://localhost:3030')
})