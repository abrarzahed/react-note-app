import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";

export default function App() {
  //=== Notes Data  ===//
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );

  //=== Current Note ID  ===//
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  //=== Create New Note  ===//
  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => {
      return [newNote, ...prevNotes];
    });
    setCurrentNoteId(newNote.id);
  }

  //=== Update Note  ===//
  function updateNote(text) {
    setNotes((oldNotes) => {
      const newArr = [];
      oldNotes.forEach((note) => {
        if (note.id === currentNoteId) {
          const updatedNote = {
            id: note.id,
            body: text,
          };
          newArr.unshift(updatedNote);
        } else {
          newArr.push(note);
        }
      });
      return newArr;
    });
  }

  //=== Delete Note  ===//
  function deleteNote(event, noteId, noteBody) {
    event.stopPropagation();

    const permission = window.confirm(
      `Are you sure want to delete "${noteBody}..." ?`
    );

    permission &&
      setNotes((prevNotes) => {
        return prevNotes.filter((note) => note.id !== noteId);
      });
  }

  //=== Find Current Note  ===//
  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
