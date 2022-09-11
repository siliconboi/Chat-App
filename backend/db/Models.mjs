import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },// match parameter to accept email ids in proper format from given regex, which will be checked by node assert
    password:{
        type: String,
        required : true
    },
    userID:{
        type: String
    }
})
const msgSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    from:{//from email
        type: String,
        required: true
    },
    to:{// to email
        type: String,
        required : true
    }
})
const Msg = mongoose.model('msg', msgSchema)
const User = mongoose.model('user', userSchema)

export {Msg, User}