import { io } from "socket.io-client";
import { SocketExtraData } from "../types/models";

const socket = io('http://localhost:3002', { autoConnect: false }) as SocketExtraData;

socket.on('session', ({sessionID, userID}) => {
  // attach the session ID to the next reconnection attempts
  socket.auth = { sessionID };
  // store it in the sessionStorage
  sessionStorage.setItem('sessionID', sessionID);
  // save the ID of the user
  socket.userID = userID;
})

export function establishSocketConnection() {
  const sessionID = sessionStorage.getItem('sessionID');
  if (!sessionID) {
    socket.connect();
    return;
  }
  socket.auth = { sessionID };
  socket.connect();
}

export default socket;