import { io } from "socket.io-client";
import { SocketExtraData } from "../types/models";
import { CREATE_SESSION } from "../types/socket";

const socket = io('http://localhost:3002', { autoConnect: false }) as SocketExtraData;

socket.on(CREATE_SESSION, ({sessionID}) => {
  console.log('session created', sessionID)
  // attach the session ID to the next reconnection attempts
  socket.auth = { sessionID };
  // store it in the sessionStorage
  sessionStorage.setItem('sessionID', sessionID);
})

export function establishSocketConnection() {
  const sessionID = sessionStorage.getItem('sessionID');
  if (!sessionID) {
    console.log('establish connection!!!');
    socket.connect();
    return;
  }
  console.log('establish connection2!!!');
  socket.auth = { sessionID };
  socket.connect();
}

export default socket;