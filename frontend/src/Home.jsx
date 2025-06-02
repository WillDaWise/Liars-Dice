import useWebSocket from 'react-use-websocket'
import { useEffect, useRef } from 'react'
// probably don't need throttle or useRef for our purposes
import throttle from 'lodash.throttle'

export function Home({ username }) {
    
    const WS_URL = 'ws://localhost:8000'
    const { sendJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { username }
    })



    const THROTTLE = 50 //in ms
    const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE))

    useEffect(() => {
        window.addEventListener("mousemove", e => {
            // // send
            sendJsonMessageThrottled.current({
                x: e.clientX,
                y: e.clientY
            })
            // e.clientX
            // e.clientY
        })
    }, [])

    return <h1>Hello, {username}</h1>
}