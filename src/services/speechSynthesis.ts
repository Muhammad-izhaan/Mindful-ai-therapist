import { useStore } from '../store/useStore';

export class SpeechSynthesisService {
  private static instance: SpeechSynthesisService;
  private synth: SpeechSynthesis;

  private constructor() {
    this.synth = window.speechSynthesis;
  }

  public static getInstance(): SpeechSynthesisService {
    if (!SpeechSynthesisService.instance) {
      SpeechSynthesisService.instance = new SpeechSynthesisService();
    }
    return SpeechSynthesisService.instance;
  }

  public speak(text: string, onEnd?: () => void, onInterrupt?: () => void): () => void {
    const { setIsSpeaking } = useStore.getState();

    if (!this.synth) return;

    // Cancel any ongoing speech
    this.cancel();

    // Set speaking state
    setIsSpeaking(true);

    // Find a female voice
    const voices = this.synth.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('zira') || 
      voice.name.toLowerCase().includes('susan')
    ) || voices.find(voice => voice.lang.startsWith('en-'));

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    // Event listeners
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    // Add interrupt option
    const handleInterrupt = () => {
      this.cancel();
      setIsSpeaking(false);
      onInterrupt?.();
    };

    // Start speaking
    this.synth.speak(utterance);

    return handleInterrupt;
  }

  public cancel(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }
}
