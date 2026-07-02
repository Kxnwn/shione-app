import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
    res.send("Register route works!")
})

export default router;