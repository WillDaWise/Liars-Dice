import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";
// probably don't need throttle or useRef for our purposes
// import throttle from "lodash.throttle";
import Button from "./components/Button";
import Value from "./components/Value";

// import { Cursor } from "./components/cursor";

/*const renderCursors = users => {
    return Object.keys(users).map(uuid =>{
        const user = users[uuid]

        return (
            <Cursor key={uuid} point={[user.state.x, user.state.y]} />
        )
    })
}*/

const renderUsersList = (users) => {
  return (
    <ul>
      {Object.keys(users).map((uuid) => {
        return <li key={uuid}>{JSON.stringify(users[uuid])}</li>;
      })}
    </ul>
  );
};

const renderUserInput = () => {
  return (
    <form action="Home.jsx">
      <div>
        <label for="diceCount">How many dice?</label>
        <br></br>
        <input type="text" id="diceCount" name="diceCount" required></input>
        <br></br>
      </div>
      <div>
        <label for="diceNum">What number on the dice?</label>
        <br></br>
        <input type="text" id="diceNum" name="diceNum" required></input>
        <br></br>
      </div>
      <input type="submit" value="Submit"></input>
    </form>
  );
};

export function Home({ username }) {
  const WS_URL = "ws://localhost:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });

  const THROTTLE = 50; //in ms
  // const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));
  const [diceBet, setDiceBet] = useState(0);
  const [numBet, setNumBet] = useState(0);

  function changeNumBet(bet, amount) {
    setNumBet((prevCount) => prevCount + amount);
    console.log("numbet chanbed by " + amount);

    return;
  }

  function changeDiceBet(bet, amount) {
    setDiceBet((prevCount) => prevCount + amount);
    // further logic needed
    console.log("Dicebet changed by" + amount);
    return;
  }

  let bet = { diceBet: 0, numBet: 0 };
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

  if (lastJsonMessage) {
    console.log(lastJsonMessage);
    return (
      <>
        {renderUserInput(lastJsonMessage)}
        <Button
          classname="btn btn-primary"
          text="+"
          toCall={() => changeNumBet(bet, 1)}
        >
          bean
        </Button>
        <Button
          classname="btn btn-primary"
          text="-"
          toCall={() => changeNumBet(bet, -1)}
        >
          bean
        </Button>
        <Value text={numBet}></Value>
        <Value text={diceBet}></Value>

        <Button
          classname="btn btn-primary"
          text="+"
          toCall={() => changeDiceBet(bet, 1)}
        >
          bean
        </Button>
        <Button
          classname="btn btn-primary"
          text="-"
          toCall={() => changeDiceBet(bet, -1)}
        >
          bean
        </Button>
        {renderUsersList(lastJsonMessage)}
      </>
    );
  }

  return <h1>Hello, {username}</h1>;
}
