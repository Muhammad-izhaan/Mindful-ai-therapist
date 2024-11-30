import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Enable browser usage
});

const SYSTEM_PROMPT = `You are a professional AI therapy assistant. Respond in a direct, precise manner without unnecessary introductions or repetition. Adapt response length based on user needs. Maintain professional tone throughout.`;

export const generateResponse = async (
  message: string,
  responseLength: 'short' | 'medium' | 'long'
) => {
  const maxTokens = {
    short: 100,
    medium: 200,
    long: 400,
  };

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'mixtral-8x7b-32768',
      max_tokens: maxTokens[responseLength],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};
