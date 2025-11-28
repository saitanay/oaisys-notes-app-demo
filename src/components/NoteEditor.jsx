function NoteEditor({ currentNote, onNoteChange }) {
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = (currentNote.tags || []).filter(tag => tag !== tagToRemove);
    onNoteChange({ ...currentNote, tags: updatedTags });
  };

  return (
    <div className="editor">
      <input
        className="editor-title"
        placeholder="Note title"
        value={currentNote.title || ''}
        onChange={(e) => onNoteChange({ ...currentNote, title: e.target.value })}
      />
      <textarea
        className="editor-content"
        placeholder="Write your note here..."
        value={currentNote.content || ''}
        onChange={(e) => onNoteChange({ ...currentNote, content: e.target.value })}
      />
      {(currentNote.tags && currentNote.tags.length > 0) && (
        <div className="tags-container">
          <div className="tags-label">Tags:</div>
          <div className="tags-list">
            {currentNote.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button
                  className="tag-remove"
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteEditor;

