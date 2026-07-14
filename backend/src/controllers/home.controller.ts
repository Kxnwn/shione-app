
import { Request, Response } from "express"
import { getHomeDataService } from "../services/home.services.js"

export const getHomeData = async (req: Request, res: Response) => {
   
    try {
        const userId = req.user.id;


        const data = await getHomeDataService(
            userId
        )

        return res.status(200).json({
            message: "Data get successfully.", data: data
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}