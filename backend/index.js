const http = require('http')
const { WebSocketServer } = require("ws")

const url = require('url')
const uuidv4 = require('uuid').v4

const server = http.createServer()
const wsServer = new WebSocketServer( { server: server })
const port = 8000

const connections = { }
const users = { }
const diceRolls = { }
activePlayer = ""
DEFAULT_COUNT = 5
DEFAULT_SIDES = 6

const broadcastUsers = () => {
    Object.keys(connections).forEach(uuid => {
        broadcastUser(uuid)
    })
}

const broadcastUser = (uuid, extraMessage = "") => {
    const connection = connections[uuid]
    const message = JSON.stringify({extraMessage: extraMessage, activePlayer: activePlayer, yourUuid: uuid, yourDice: diceRolls[uuid], users: users})
    connection.send(message)
}

const rollDice = (count = DEFAULT_COUNT, sides = DEFAULT_SIDES) => {
    console.log("count: " + count + ", sides: " + sides)
    const dice = Array(count)
    for(i = 0; i < count; i++) {
        dice[i] = Math.floor(Math.random() * sides) + 1
    }
    dice.sort()
    console.log("dice: " + dice)
    return dice
}
const handleMessage = (bytes, uuid) => {
    const message = JSON.parse(bytes.toString())
    const user = users[uuid]
    // if (messageType == Bet) -- something like this maybe for our project
    
    if (!isValid(message)) {
        console.log("invalid state fiund")
        broadcastUser(uuid, "Invalid State")
    } else {
        user.state = message
        // note: can instead do like user.state.x=message.x, etc
        broadcastUsers()
        console.log(`${user.username} updated their state: ${JSON.stringify(user.state)}`)
    }
}

// to be updated with further logic
const isValid = (bet) => {
    return bet.numBet <= DEFAULT_SIDES && bet.numBet > 0 && bet.diceBet > 0
}

const handleClose = uuid => {
    console.log(activePlayer)
    if (activePlayer == uuid) {
        nextActivePlayer();
    }
    delete connections[uuid]
    delete users[uuid]
    console.log(`user ${uuid} disconnected`)
    // send a message that says "user uuid is gone"

    broadcastUsers()
}

const nextActivePlayer = () => {
    activeIndex = Object.keys(users).indexOf(activePlayer);
    activePlayer = Object.keys(users)[(activeIndex + 1) % Object.keys(users).length]
    console.log(activePlayer + " is now the active player")

}

wsServer.on("connection", (connection, request) => {
    // ws://localhost:8000?username=Steve

    const { username } = url.parse(request.url, true).query
    const uuid = uuidv4()
    console.log(username + " has connected with uuid: " + uuid)
    console.log(users)
    console.log(Object.keys(users).length)
    if (Object.keys(users).length == 0) {
        activePlayer = uuid;
    }
    console.log(uuid + "connection" + activePlayer)
    // use connections to send 'broadcast' ie send message to everyone
    // connection.send sends info to that user
    connections[uuid] = connection
    diceRolls[uuid] = rollDice()
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
