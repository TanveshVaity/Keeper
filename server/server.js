require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB database connection established successfully");
})
.catch(error => {
    console.error("MongoDB connection error:", error);
});

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});
const Note = mongoose.model("Note", noteSchema);

app.get("/api/notes", async (req, res, next) => {
    try {
        const foundNotes = await Note.find();
        res.json(foundNotes);
    } catch (err) {
        next(err);
    }
});

app.post("/api/note/add", async (req, res, next) => {
    const { title, content } = req.body;
    const note = new Note({ title, content });

    try {
        const newNote = await note.save();
        res.json({ message: "Note added successfully.", note: newNote._doc });
    } catch (err) {
        next(err);
    }
});

app.delete("/api/note/:id", async (req, res, next) => {
    try {
        await Note.deleteOne({ _id: req.params.id });
        res.json({ message: "Note deleted successfully." });
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
