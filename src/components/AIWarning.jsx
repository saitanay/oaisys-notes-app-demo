function AIWarning() {
  return (
    <div className="ai-warning">
      <strong>Enable Chrome AI flags:</strong> Go to chrome://flags and enable 
      "Prompt API for Gemini Nano", "Summarization API for Gemini Nano", 
      "Writer API for Gemini Nano", "Rewriter API for Gemini Nano", and 
      "Proofreader API for Gemini Nano", then restart Chrome.
    </div>
  );
}

export default AIWarning;

