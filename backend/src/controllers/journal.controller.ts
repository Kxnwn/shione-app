import { Request, Response } from "express";
import { createJournalService, deleteJournalService, getJournalService, updateJournalService } from "../services/journal.service.js";


export const createJournal = async (req: Request, res: Response) => {
    const { title, content } = req.body
    const userId = req.user.id

    try {
        
        const result = await createJournalService (
            title,
            content,
            userId
        )

        res.status(200).json({
            message: "Created a journal", journal: result
        })
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}

export const getJournals = async(req: Request, res: Response) => {
    const userId = req.user.id

    try {
        const results = await getJournalService(
            userId
        )

        res.status(200).json({
            message: "Your Journals", journals: results
        })
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}

export const updateJournal = async(req: Request, res:Response) => {
    const { title, content } = req.body
    const userId = req.user.id
    const journalId = Number(req.params.id)

    try {
        const results = await updateJournalService(
            title,
            content,
            userId,
            journalId
        )

        res.status(200).json({
            message: "Journal Updated", updatedJournal: results
        })
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}

export const deleteJournal = async(req: Request, res: Response) => {
    const journalId = Number(req.params.id)
    const userId = req.user.id

    try {
        const results = await deleteJournalService (
            journalId,
            userId
        )

        res.status(200).json({
            message: "Journal Deleted", deletedJournal: results
        })
    } catch (error) {
         res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}