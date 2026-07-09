import express from "express"
import  authRoutes  from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import moodRoutes from "./routes/mood.routes.js"
import journalRoutes from "./routes/journal.routes.js"
const app = express();

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/moods", moodRoutes)
app.use("/api/journals", journalRoutes)

app.listen(5000, () => {
    console.log("Server is running on port 5000")
})