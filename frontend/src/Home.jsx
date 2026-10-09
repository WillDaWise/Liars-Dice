import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";
// probably don't need throttle or useRef for our purposes
// import throttle from "lodash.throttle";
import Button from "./components/Button";
import Value from "./components/Value";
import Dice from "./components/Dice";

// import { Cursor } from "./components/cursor";

/*const renderCursors = users => {
    return Object.keys(users).map(uuid =>{
        const user = users[uuid]

        return (
            <Cursor key={uuid} point={[user.state.x, user.state.y]} />
        )
    })
}*/

const renderUsersList = (data) => {
  return (
    <ul>
      {Object.keys(data.users).map((uuid) => {
        //extra = ":"
        // if (uuid == users.activePlayer) {
        //   extra = "(Active Player):"
        // }
        return <li key={uuid}>{<><div>{data.users[uuid].username + ((uuid == data.activePlayer) ? "(Active Player):" : ":")}</div> <Dice number={data.users[uuid].state.numBet} count={data.users[uuid].state.diceBet}></Dice></>}</li>;
      })}
    </ul>
    
  );
};




export function Home({ username }) {
  const WS_URL = "ws://localhost:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });

  // const THROTTLE = 50; in ms
  // const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));
  const [diceBet, setDiceBet] = useState(1);
  const [numBet, setNumBet] = useState(1);

  function changeNumBet(amount) {
    setNumBet((prevCount) => prevCount + amount);
    console.log("numbet chanbed by " + amount);

    return;
  }

  function changeDiceBet(amount) {
    setDiceBet((prevCount) => prevCount + amount);
    // further logic needed
    console.log("Dicebet changed by" + amount);
    return;
  }

  useEffect(() => {
    sendJsonMessage({ diceBet: diceBet, numBet: numBet });
    /*window.addEventListener("mousemove", (e) => {
      // send
      sendJsonMessageThrottled.current({
        x: e.clientX,
        y: e.clientY,
      });
      // e.clientX
      // e.clientY
    });*/
    //let increaseDiceButton = Button(
    //  "increase Dice bet",
    //  changeDiceBet(diceBet, 1)
    //);
    //document.addEventListener("click", () => {
    //  sendJsonMessage({ diceBet: diceBet, numBet: numBet });
    //});
    // increaseDiceButton.addEventListener("Click", changeDiceBet);
    // HERE
  }, [diceBet, numBet, sendJsonMessage]);

  useEffect(() => {
    console.log(lastJsonMessage);
    if (lastJsonMessage && lastJsonMessage.extraMessage != "") {
      let bet = lastJsonMessage.users[lastJsonMessage.yourUuid].state
      if (bet.diceBet == diceBet && bet.numBet == numBet) {
        sendJsonMessage(bet)
      }
      console.log(bet)
      setDiceBet(bet.diceBet)
      setNumBet(bet.numBet)
      console.log("numBet: " + numBet + ", diceBet: " + diceBet)
    }
  }, [lastJsonMessage])

  if (lastJsonMessage) {
    
    return (
      <>
        
        <p>Number on dice: <Button
          classname="btn btn-primary"
          text="&uarr;"
          toCall={() => changeNumBet(1)}
        >
        </Button>
        <Button
          classname="btn btn-primary"
          text="&darr;"
          toCall={() => changeNumBet(-1)}
        >
        </Button></p>
        <p style={{"font-size": "32px"}}><Dice number={numBet} count={diceBet}></Dice></p>
        <p>Number of dice: <Button
          classname="btn btn-primary"
          text="+"
          toCall={() => changeDiceBet(1)}
        >
        </Button>
        <Button
          classname="btn btn-primary"
          text="-"
          toCall={() => changeDiceBet(-1)}
        >
        </Button></p>
        
        {renderUsersList(lastJsonMessage)}
        <pre>{JSON.stringify(lastJsonMessage, null, 2)}</pre>
      </>
    );
  }

  return <h1>Hello, {username}</h1>;
}
