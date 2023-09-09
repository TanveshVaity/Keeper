import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    fetchNotes();
  }, []);

  function fetchNotes() {
    axios
      .get("http://localhost:5000/api/notes")
      .then((response) => {
        console.log("API response:", response.data);
        console.log("Type of response data:", typeof response.data);
        setNotes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  }
  
  function addNote(newNote) {
    axios
      .post("http://localhost:5000/api/note/add", newNote)
      .then((response) => {
        setNotes((prevNotes) => [...prevNotes, response.data.note]);
      })
      .catch((error) => {
        console.error("Error adding note:", error);
      });
  }
  
  function deleteNote(id) {
    axios
      .delete(`http://localhost:5000/api/note/${id}`)
      .then(() => {
        const updatedNotes = notes.filter((note) => note._id !== id);
        setNotes(updatedNotes);
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem) => { 
        return (
          <Note
            key={noteItem._id}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
