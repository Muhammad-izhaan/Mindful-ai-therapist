import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { SpeechSynthesisService } from './services/speechSynthesis';
import Groq from 'groq-sdk';

import './App.css';
import Logo from './assets/logo.svg';

// Helper function to parse markdown-like formatting and add line breaks
const parseFormattedText = (text: string) => {
  // Split text into paragraphs
  const paragraphs = text.split(/\n\n/);
  
  return paragraphs.map((paragraph, pIndex) => {
    const parts = paragraph.split(/(\*\*.*?\*\*|__.*?__|`.*?`)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('__') && part.endsWith('__')) {
        return <em key={`italic-${index}`}>{part.slice(2, -2)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={`code-${index}`} className="bg-gray-800 px-1 rounded">{part.slice(1, -1)}</code>;
      }
      return part;
    });
    
    return <p key={`para-${pIndex}`} className="mb-2">{parts}</p>;
  });
};

const App: React.FC = () => {
  const {
    messages, 
    addMessage, 
    currentTranscription,
    setCurrentTranscription,
    clearCurrentTranscription,
  } = useStore();

  const [manualMessage, setManualMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const initialMessageRef = useRef(false);
  const speechSynthesisService = useRef(SpeechSynthesisService.getInstance());
  const groq = useRef(new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  }));

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send initial message only once when component mounts
  useEffect(() => {
    if (!initialMessageRef.current && messages.length === 0) {
      const initialMessage = "**Hello, I'm Izhaan, your therapist.** How can I support you today?";
      
      addMessage({ 
        content: initialMessage, 
        role: 'assistant' 
      });
      
      initialMessageRef.current = true;
    }
  }, [messages]);

  const speakMessage = (message: string) => {
    speechSynthesisService.current.speak(message);
  };

  const processUserMessage = async (message: string) => {
    // Immediately clear the input
    setManualMessage('');

    addMessage({ 
      content: message, 
      role: 'user' 
    });

    const response = await groq.current.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: `You are Izhaan, a highly empathetic professional therapist. 
          Respond with markdown-like formatting:
          - Use **bold** for emphasis
          - Separate thoughts into paragraphs
          - Provide structured, compassionate support
          - Break complex thoughts into digestible sections
          - Maintain a professional, supportive tone`
        },
        ...messages.map(msg => ({ 
          role: msg.role === 'user' ? 'user' : 'assistant', 
          content: msg.content 
        })),
        { role: 'user', content: message }
      ],
      model: 'mixtral-8x7b-32768',
      max_tokens: 300,
      temperature: 0.7
    });

    const aiResponse = response.choices[0]?.message?.content || "I'm here to listen and support you.";
    
    addMessage({ 
      content: aiResponse, 
      role: 'assistant' 
    });
  };

  const handleManualSend = async () => {
    if (manualMessage.trim()) {
      await processUserMessage(manualMessage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] text-gray-300">
      <header className="sticky top-0 z-10 p-4 bg-[#112240]/50 backdrop-blur-md shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src={Logo} 
              alt="MindfulAI Logo" 
              className="w-12 h-12 rounded-full"
            />
            <h1 className="text-2xl font-semibold text-gray-200">
              MindfulAI <span className="text-sm text-gray-500">by Izhaan</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col overflow-hidden">
        <div className="flex-grow overflow-y-auto px-4 pt-4 pb-24">
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start space-x-2 ${
                    msg.role === 'user' 
                      ? 'justify-end' 
                      : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => speakMessage(msg.content)}
                      className="text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  )}
                  <div 
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.role === 'user' 
                        ? 'bg-[#233554] text-gray-300' 
                        : 'bg-[#1D2E3F] text-gray-300'
                    }`}
                  >
                    {parseFormattedText(msg.content)}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#112240]/50 backdrop-blur-md p-4">
          <div className="max-w-4xl mx-auto flex space-x-4">
            <input 
              type="text" 
              value={manualMessage}
              onChange={(e) => setManualMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-3 bg-[#233554] text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#64ffda]/30"
              onKeyPress={(e) => e.key === 'Enter' && handleManualSend()}
            />
            <button 
              onClick={handleManualSend}
              className="bg-[#64ffda]/20 hover:bg-[#64ffda]/30 text-[#64ffda] p-3 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
