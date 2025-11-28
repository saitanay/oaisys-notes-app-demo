function AIActions({ aiAvailable, loading, hasContent, hasTitle, onAIAction }) {
  if (!aiAvailable) {
    return null;
  }

  const buttons = [
    { action: 'generateTitle', label: 'Generate Title', requiresContent: true },
    { action: 'generateBody', label: 'Write For Me', requiresTitle: true },
    { action: 'summarize', label: 'Summarize', requiresContent: true },
    { action: 'proofread', label: 'Proofread', requiresContent: true },
    { action: 'rewrite', label: 'Rewrite', requiresContent: true },
    { action: 'generateTags', label: 'Generate Tags', requiresContent: true },
  ];

  return (
    <div className="ai-actions">
      {buttons.map(({ action, label, requiresContent, requiresTitle }) => (
        <button
          key={action}
          className="button button-ai"
          onClick={() => onAIAction(action)}
          disabled={loading || (requiresContent && !hasContent) || (requiresTitle && !hasTitle)}
        >
          {loading ? '...' : label}
        </button>
      ))}
    </div>
  );
}

export default AIActions;

