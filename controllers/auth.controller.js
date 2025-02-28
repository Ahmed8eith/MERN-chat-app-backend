import User from "../models/users.model.js"
import bcrypt from "bcrypt"
import generatetokenAndsetCookie from "../utils/generateToken.js"

export const register = async(req,res)=>{
    try {
        const {name, username, password, confirmPassword,gender}= req.body
        const randomBoy= Math.floor(Math.random() * 50) + 1;
        const randomGirl= Math.floor(Math.random() * 45) + 51;


        

        if(password !== confirmPassword) {
            return res.status(400).json({msg:"Passwords did not match"})
        }

        if(password.length < 6) {
            return res.status(400).json({error: "Password must be at least 6 characters long"})
        }

        const user = await User.findOne({username})

        if(user){
            return res.status(400).json({error:"Username already exists"})
        }

        
        //HASHING PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        // random profile Picture
        const boyProfilePic = `https://avatar.iran.liara.run/public/${randomBoy}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/${randomGirl}`;

        const newUser = new User({
            name,
            username,
            password: hashedPassword,
            gender,
            profilePicture: gender=="male"? boyProfilePic: girlProfilePic

        })

        //save user and generate jwt
        if(newUser){
            generatetokenAndsetCookie(newUser._id,res)
            await newUser.save()
        }

        res.status(201).json({
            id:newUser._id,
            profilePicture:newUser.profilePicture
        })

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const login = async(req,res)=>{
    try {
        const {username,password}=req.body 
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password"}) 
        }

        generatetokenAndsetCookie(user._id,res)
        res.status(200).json({
            id:user._id,
            profilePicture:user.profilePicture

        })
        
    } catch (error) {
        console.log("Error logging in", error)
        res.status(500).json({error:"Internal server error"})
    }
}

export const logout = (req,res)=>{
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            path: "/",
            expires: new Date(0)  
        })
        res.status(200).json({msg:"Logged out successfully"})
    } catch (error) {
        console.log("Error logging out", error)
        res.status(500).json({error:"Internal server error"})
    }
}
