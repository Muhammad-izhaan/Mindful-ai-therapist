import { create } from 'zustand';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface VoiceSettings {
  pitch: number;
  rate: number;
  voice: SpeechSynthesisVoice | null;
}

interface AppState {
  messages: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  currentTranscription: string;
  voiceSettings: VoiceSettings;
  responseLength: 'short' | 'medium' | 'long';
  addMessage: (message: Omit<Message, 'timestamp'>) => void;
  setIsListening: (isListening: boolean) => void;
  setIsSpeaking: (isSpeaking: boolean) => void;
  setCurrentTranscription: (transcription: string) => void;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  setResponseLength: (length: 'short' | 'medium' | 'long') => void;
  clearCurrentTranscription: () => void;
}

export const useStore = create<AppState>((set) => ({
  messages: [],
  isListening: false,
  isSpeaking: false,
  currentTranscription: '',
  voiceSettings: {
    pitch: 1,
    rate: 1,
    voice: null,
  },
  responseLength: 'medium',
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, timestamp: new Date() }],
    })),
  setIsListening: (isListening) => set({ isListening }),
  setIsSpeaking: (isSpeaking) => set({ isSpeaking }),
  setCurrentTranscription: (transcription) => 
    set({ currentTranscription: transcription }),
  clearCurrentTranscription: () => set({ currentTranscription: '' }),
  updateVoiceSettings: (settings) =>
    set((state) => ({
      voiceSettings: { ...state.voiceSettings, ...settings },
    })),
  setResponseLength: (length) => set({ responseLength: length }),
}));
