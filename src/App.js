import React from 'react';
import Split from 'react-split';
import { nanoid } from 'nanoid';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { data } from './data';
import 'react-mde/lib/styles/css/react-mde-all.css';

export default function App() {
  const LOCAL_STORAGE_KEY = 'notes';
  const LOCAL_STORAGE_ID_KEY = 'notes.id';
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [],
  );
  const [currentNoteId, setCurrentNoteId] = React.useState(
    () => (notes[0]
        && notes[0].id
        && JSON.parse(localStorage.getItem(LOCAL_STORAGE_ID_KEY)))
      || '',
  );

  const result = notes[0].body.split('\n');
  console.log(result);

  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ID_KEY, JSON.stringify(currentNoteId));
  }, [currentNoteId]);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    setNotes((oldNotes) => {
      const newArray = [];
      oldNotes.forEach((oldNote) => {
        if (oldNote.id === currentNoteId) {
          newArray.unshift({ ...oldNote, body: text });
        } else newArray.push(oldNote);
      });
      return newArray;
    });
  }

  function findCurrentNote() {
    return (
      notes.find((note) => note.id === currentNoteId) || notes[0]
    );
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    console.log(noteId);
    setNotes((oldNotes) => oldNotes.filter((note) => note.id !== noteId));
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
          <button type="button" className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
