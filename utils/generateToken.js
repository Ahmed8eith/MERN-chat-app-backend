import jwt from "jsonwebtoken"

const generatetokenAndsetCookie=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"15d"
    })

    res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none", 
        secure: true
      });
      
}

export default generatetokenAndsetCookie