import Conversation from "../models/conversation.model.js";
import User from "../models/users.model.js"

export const getUsersForSidebar=async(req,res)=>{
    try {
        const loggedInUserId=req.user._id
        const searchQuery=req.query.search.trim()

        if (!searchQuery) return res.status(200).json([]);


        const filteredUsers=await User.find({_id:{$ne:loggedInUserId},

            $or: [
                { username: { $regex: searchQuery, $options: "i" } }, 
            ]
        }).select("-password")

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("error in get users for sidebar function, ",error)
        res.status(500).json({error:"Server error"})
    }
}


export const getFreinds=async(req,res)=>{
    try {

        const loggedInUserId=req.user._id

    const conversation= await Conversation.find({participants:loggedInUserId}).populate("participants","-password")

    const uniqueUserMap=new Map()

    conversation.forEach(convo=>{
        convo.participants.forEach(user=>{
            if(user._id.toString() !== loggedInUserId.toString()){
                if(!uniqueUserMap.has(user._id.toString())){
                    uniqueUserMap.set(user._id.toString(),user)
                }
            }
        })
    })

    const freinds=Array.from(uniqueUserMap.values())

    res.status(200).json(freinds)

    } catch (error) {
        console.log("error getting freinds", error)

        res.status(500).json({error:"Server error"})
    }
}
