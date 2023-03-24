const express = require('express')
const path = require('path')
const http = require('http')
const Filter = require('bad-words')
const { generateMessage,generateLocationMessage } = require('./utils/messages')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
app.use(express.json())
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New websocket connection')

   

    socket.on('join',({username,room}) => {
        socket.join(room)
        socket.emit('message',generateMessage('welcome!!'))

        socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined!!`))
    })

    socket.on('sendLocation',(coords,callback) => {
        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('Location shared!')
    })
    socket.on('printMessage', (message,callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Prafanity is not allowed!')
        }
       io.emit('message',generateMessage(message))
       callback()

    })
    socket.on('disconnect',() => {
        io.emit('message',generateMessage('a user has left!!'))
    })
})

server.listen(port, () => {
    console.log('server is running on ' + port)
})