import prisma from "../config/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()




// <----- User Registration ----->
export const registerUserService = async (
    name: string,
    email: string,
    password: string,
) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (existingUser){
        throw new Error("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    })

    return user;
}



// <----- User Login ----->

export const loginUserService = async (email: string, password: string)  => {

    const tokenSecret = process.env.JWT_SECRET;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(!user){
        throw new Error("Invalid Email or Password!")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
    throw new Error("Invalid Email or Password!")
    }

    if (!tokenSecret) {
    throw new Error("JWT_SECRET is missing.");
    }


    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        tokenSecret,
        {
            expiresIn: "5d",
        }
    )

    
    return {
        user:  {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    }

}


