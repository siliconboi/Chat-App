import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import { Server } from "socket.io";
import {createServer} from "http";
import { validateTokenio } from "./backend/validateToken.mjs";
import {authRouter} from "./backend/routes/auth.mjs";
import {Msg, User} from "./backend/db/Models.mjs";

dotenv.config();//config .env file

const app = express();
const httpServer = createServer(app);

app.use(morgan('dev'));//to record requests from server
app.use(express.static('./frontend'));//serving static files from frontend
app.use('/user/api', authRouter);//for login authentication of user

const io = new Server(httpServer);

io.use(validateTokenio);//to validate token

io.on("connection", async (socket)=>{
const currentUser = await User.findByIdAndUpdate(socket.handshake.user._id,{$set: { userID: socket.id}}, {new: true}).exec();//adding latest socketid to user document
const users = await User.find({}).exec();//array of all user objects

socket.emit("users", users);
socket.broadcast.emit("new user connected", {email: currentUser.email, newSocketID: currentUser.userID});//sending updated socket id to everyone when a user connects

socket.on("private message", async ({ msg, to }) => {
  await Msg.create({message: msg, from: currentUser.email, to: to.email});
  socket.to(to.socketid).emit("private message", {//sending message to private room
    msg,
    from: currentUser.userID
  });
});

socket.on("allChat", async ({from, to})=>{
const msgs = await Msg.find( { $or: [ { from: from, to: to }, { from: to, to: from } ] }).exec();// array of all msg objects sent or received from and to the given emails
socket.emit("allChat", msgs);
})
});

mongoose.connect(process.env.DB_CONNECT);
httpServer.listen(3000||process.env.PORT, ()=>{
        console.log(`listening on http://localhost:3000`)
});
