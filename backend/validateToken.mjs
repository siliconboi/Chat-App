import jwt from "jsonwebtoken"
const validateTokenio = (socket,next)=>{
    const token = socket.handshake.query.token
    if(!token) next(new Error('please login'))
    const verifiedUser = jwt.verify(token, process.env.TOKEN_KEY)
    if(!verifiedUser) next(new Error('log in'))
    socket.handshake.user = verifiedUser
    next()
}
export {validateTokenio}