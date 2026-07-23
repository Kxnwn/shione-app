import { Request, Response } from "express";
import { chatService, chatHistoryService } from "../services/chat.service.js";





export const postChat = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id
        const { message } = req.body

        const result = await chatService(
            userId,
            message
        )

        res.status(200).json({
            message: "Message Successfully sent!", data: result
        })
    } catch (error) {
          res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}

export const chatHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id

        const result = await chatHistoryService(
            userId
        )

        res.status(200).json({
            message: "Chat History fetched!", data: result
        })
    } catch (error) {
         res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}