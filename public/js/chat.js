const socket = io()
const messageForm = document.getElementById('formId')
const messageFormInput = document.getElementById('name')
const messageFormButton = document.getElementById('submit')
const sendLocation = document.getElementById('send-location')
const messages = document.getElementById('messages')
const messageTemplate = document.getElementById('message-template').innerHTML
const locationMessageTemplate = document.getElementById('location-message-template').innerHTML



// socket.on('countUpdated',(count) =>{
//     console.log('count updated!!' + count)
// })

// document.getElementById('increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    messageFormButton.setAttribute('disabled', 'disabled')
    const message = messageFormInput.value

    socket.emit('printMessage', message, (error) => {
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Delivered!')
    })
})

sendLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation does not supported by browser')
    }
    sendLocation.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        sendLocation.removeAttribute('disabled')
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (message) => {
            return console.log(message)
        })
    })
})

socket.emit('join', { username, room })