import express from "express"
import  authRoutes  from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import moodRoutes from "./routes/mood.routes.js"
import journalRoutes from "./routes/journal.routes.js"
import homeRoutes from "./routes/home.routes.js"
import cors from "cors"
import chatRoutes from './routes/chat.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'
import verseRoutes from './routes/verse.routes.js'
const app = express();


app.use(cors())
app.use(express.json());

app.use("/api/home",homeRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/moods", moodRoutes)
app.use("/api/journals", journalRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/verse", verseRoutes);

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});

app.listen(5000, "0.0.0.0", () => {
    console.log("Server is running on port 5000")
})