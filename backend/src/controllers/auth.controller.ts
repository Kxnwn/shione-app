import { Request , Response } from "express"
import { registerUserService, loginUserService } from "../services/auth.service.js"


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } =  req.body

        const user = await registerUserService (
            name,
            email,
            password
        )

        res.status(201).json({message: "user registered successfully.", user})
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const result = await loginUserService(
            email,
            password
        )

        res.status(200).json({ message: "user login successfully.", ...result, })
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}
