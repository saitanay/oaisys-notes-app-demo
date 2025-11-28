// Checks if all required AI APIs are available
export function isAIAvailable() {
  return typeof window !== 'undefined' && 
    ('Summarizer' in window && 'Proofreader' in window && 'Rewriter' in window && 'LanguageModel' in window && 'Writer' in window);
}

// Wrapper for the Writer API
export async function generateBody(title) {
  const writer = await window.Writer.create({ format: 'plain-text' });
  const prompt = `Write a short note about: ${title}. Give plain-text only. Don't use markdown.`;
  const result = await writer.write(prompt);
  writer.destroy();
  return result;
}

// Wrapper for the Summarizer API
export async function summarize(text) {
  const summarizer = await window.Summarizer.create({
    type: 'tldr',
    format: 'plain-text',
    length: 'long'
  });
  return await summarizer.summarize(text);
}

export async function proofread(text) {
  const proofreader = await window.Proofreader.create();
  const result = await proofreader.proofread(text);
  let correctedText = result.correctedInput;
  // Remove "PROOFREAD_TEXT: " prefix if present
  if (correctedText.startsWith('PROOFREAD_TEXT: ')) {
    correctedText = correctedText.substring('PROOFREAD_TEXT: '.length);
  }
  return correctedText;
}

export async function rewrite(text) {
  const rewriter = await window.Rewriter.create();
  return await rewriter.rewrite(text, {});
}

export async function generateTitle(text) {
  const session = await window.LanguageModel.create();
  const prompt = `Generate a concise title (maximum 5-7 words) for the following note content. Return only the title, nothing else:\n\n${text}`;
  const result = await session.prompt(prompt);
  session.destroy();
  return result.trim();
}

export async function generateTags(text) {
  const session = await window.LanguageModel.create();
  
  // JSON Schema for structured output - tags array with max 10 items
  const schema = {
    "type": "object",
    "properties": {
      "tags": {
        "type": "array",
        "maxItems": 10,
        "minItems": 1,
        "items": {
          "type": "string",
          "minLength": 1,
          "maxLength": 30
        }
      }
    },
    "required": ["tags"],
    "additionalProperties": false
  };
  
  const prompt = `Analyze the following note content and generate relevant tags (keywords or short phrases) that best describe the main topics and themes. Generate between 3-10 tags.\n\nNote content:\n${text}`;
  
  const result = await session.prompt(prompt, {
    responseConstraint: schema
  });
  
  session.destroy();
  
  // Parse the JSON result
  const parsed = JSON.parse(result);
  return parsed.tags || [];
}

