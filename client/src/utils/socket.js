import { io } from "socket.io-client";

const socket = new io("http://localhost:9000");

export default socket;