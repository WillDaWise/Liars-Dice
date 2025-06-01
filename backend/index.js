const http = require('http')
const { WebSocketServer } = require("ws")

const url = require('url')
const uuidv4 = require('uuid').v4

const server = http.createServer()
const wsServer = new WebSocketServer( { server: server })
const port = 8000

const connections = { }
const users = { }

const broadcastUsers = () => {
    Object.keys(connections).forEach(uuid => {
        const connection = connections[uuid]
        const message = JSON.stringify(users)
        connection.send(message)
    })
}

const handleMessage = (bytes, uuid) => {
    const message = JSON.parse(bytes.toString())
    const user = users[uuid]
    // if (messageType == Bet) -- something like this maybe for our project
    user.state = message
    // note: can instead do like user.state.x=message.x, etc
    broadcastUsers()
    console.log(`${user.username} updated their state: ${JSON.stringify(user.state)}`)
}

const handleClose = uuid => {
    delete connections[uuid]
    delete users[uuid]
    console.log(`user ${uuid} disconnected`)
    // send a message that says "user uuid is gone"

    broadcastUsers()
}

wsServer.on("connection", (connection, request) => {
    // ws://localhost:8000?username=Steve

    const { username } = url.parse(request.url, true).query
    const uuid = uuidv4()
    console.log(username)
    console.log(uuid)

    // use connections to send 'broadcast' ie send message to everyone
    // connection.send sends info to that user
    connections[uuid] = connection

    users[uuid] = {
        username: username,
        state: {
            
        }
    }

    connection.on("message", message => handleMessage(message, uuid))
    connection.on("close", () => handleClose(uuid))

})
server.listen(port, () => {
    console.log(`WebSocket server running on port ${port}`)
})
