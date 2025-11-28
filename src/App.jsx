import { useState, useEffect } from 'react';
import { getNotes, saveNote, deleteNote } from './lib/db';
import { isAIAvailable, summarize, proofread, rewrite, generateTitle, generateBody, generateTags } from './lib/ai';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import AIActions from './components/AIActions';
import AIWarning from './components/AIWarning';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '', tags: [] });
  const [loading, setLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);

  useEffect(() => {
    setAiAvailable(isAIAvailable());
    loadNotes();
  }, []);

  async function loadNotes() {
    const data = await getNotes();
    setNotes(data);
  }

  async function handleSave() {
    if (!currentNote.title && !currentNote.content) return;
    // Ensure tags are included when saving
    const noteToSave = {
      ...currentNote,
      tags: currentNote.tags || []
    };
    await saveNote(noteToSave);
    await loadNotes();
    setCurrentNote({ id: null, title: '', content: '', tags: [] });
  }

  async function handleDelete(id) {
    await deleteNote(id);
    await loadNotes();
    if (currentNote.id === id) {
      setCurrentNote({ id: null, title: '', content: '', tags: [] });
    }
  }

  function handleNewNote() {
    setCurrentNote({ id: null, title: '', content: '', tags: [] });
  }

  function handleSelectNote(note) {
    setCurrentNote({ ...note, tags: note.tags || [] });
  }

  async function handleAI(action) {
    setLoading(true);
    try {
      const aiActions = {
        generateTitle: () => generateTitle(currentNote.content).then(result => ({ title: result })),
        generateBody: () => generateBody(currentNote.title).then(result => ({ content: result })),
        summarize: () => summarize(currentNote.content).then(result => ({ content: result })),
        proofread: () => proofread(currentNote.content).then(result => ({ content: result })),
        rewrite: () => rewrite(currentNote.content).then(result => ({ content: result })),
        generateTags: () => generateTags(currentNote.content).then(result => ({ tags: result })),
      };

      const update = await aiActions[action]();
      if (update) {
        setCurrentNote({ ...currentNote, ...update });
      }
    } catch (error) {
      console.error('AI error:', error);
      alert(error.message || 'AI feature not available. Enable Chrome AI flags in chrome://flags');
    }
    setLoading(false);
  }

  return (
    <div className="app">
      <NoteList
        notes={notes}
        currentNote={currentNote}
        onSelectNote={handleSelectNote}
        onNewNote={handleNewNote}
        onDeleteNote={handleDelete}
      />
      <div className="main-content">
        <NoteEditor
          currentNote={currentNote}
          onNoteChange={setCurrentNote}
        />
        <div className="action-bar">
          <button className="button button-primary" onClick={handleSave}>
            Save
          </button>
          <AIActions
            aiAvailable={aiAvailable}
            loading={loading}
            hasContent={!!currentNote.content}
            hasTitle={!!currentNote.title}
            onAIAction={handleAI}
          />
        </div>
        {!aiAvailable && <AIWarning />}
      </div>
    </div>
  );
}

export default App;

