import  jwt  from "jsonwebtoken";

export const generateToken=(user)=>{
    let jwtSecretKey=process.env.JWTֹֹ_SECRET||"success";
    let data={
        userName:user.userName,
        _id:user._id,
        role:user.role
    }
    const token=jwt.sign(data,jwtSecretKey,{
        expiresIn:'30m',
    });
    return token;
}