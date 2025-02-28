import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"
import { getReciverSocketId } from "../socket/socket.js"
import { io } from "../socket/socket.js"

export const sendMessage=async(req,res)=>{
    try {
        const {message}= req.body
        const{id:reciverId}=req.params
        const senderId=req.user._id

        let conversation=await Conversation.findOne({
            participants:{$all:[senderId, reciverId]}
        })

        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,reciverId]
            })
        }

        const newMessage=new Message({
            senderId,
            reciverId,
            message,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save(),newMessage.save()])


        const reciverSocketId=getReciverSocketId(reciverId)
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage",newMessage)
        }
          

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in send message controller", error.message)
        res.status(500).json({error:"server error"})
    }
}

export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params
        const senderId=req.user._id

        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,userToChatId]}
        }).populate("messages")

        if(!conversation)return res.status(200).json([''])

        const messages=conversation.messages

        res.status(200).json(messages)

    } catch (error) {
        console.log("Error in get message controller", error.message)
        res.status(500).json({error:"server error"})
    }
}