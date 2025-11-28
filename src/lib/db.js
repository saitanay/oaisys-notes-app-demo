const DB_NAME = 'SmartNotes';

export async function getNotes() {
  const data = localStorage.getItem(DB_NAME);
  return data ? JSON.parse(data) : [];
}

export async function saveNote(note) {
  const notes = await getNotes();
  const index = notes.findIndex((n) => n.id === note.id);
  
  // Ensure tags is always an array
  const noteWithTags = {
    ...note,
    tags: Array.isArray(note.tags) ? note.tags : []
  };
  
  if (index >= 0) {
    notes[index] = { ...noteWithTags, updatedAt: Date.now() };
  } else {
    notes.push({ 
      ...noteWithTags, 
      id: Date.now().toString(), 
      createdAt: Date.now(), 
      updatedAt: Date.now() 
    });
  }
  localStorage.setItem(DB_NAME, JSON.stringify(notes));
  return noteWithTags;
}

export async function deleteNote(id) {
  const notes = await getNotes();
  const filtered = notes.filter((n) => n.id !== id);
  localStorage.setItem(DB_NAME, JSON.stringify(filtered));
}

