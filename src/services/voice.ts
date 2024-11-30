export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private onResult: (text: string) => void;
  private onStart: () => void;
  private onEnd: () => void;
  private onError: (error: Error) => void;

  constructor(
    onResult: (text: string) => void,
    onStart: () => void,
    onEnd: () => void,
    onError: (error: Error) => void
  ) {
    this.onResult = onResult;
    this.onStart = onStart;
    this.onEnd = onEnd;
    this.onError = onError;
    this.synthesis = window.speechSynthesis;

    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    } else {
      console.error('Speech recognition not supported in this browser');
      this.onError(new Error('Speech recognition not supported'));
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    // Configure recognition settings
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US'; // Set language

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.onStart();
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      this.onEnd();
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.onError(new Error(`Speech recognition error: ${event.error}`));
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      
      if (finalTranscript) {
        console.log('Recognized speech:', finalTranscript);
        this.onResult(finalTranscript);
      }
    };
  }

  startListening() {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      return;
    }

    try {
      // Stop any existing recognition
      this.stopListening();
      
      // Start new recognition
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  speak(text: string, voice: SpeechSynthesisVoice | null, rate: number, pitch: number) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };

    this.synthesis.speak(utterance);
  }

  getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      let voices = this.synthesis.getVoices();
      
      if (voices.length > 0) {
        resolve(voices);
      } else {
        this.synthesis.onvoiceschanged = () => {
          resolve(this.synthesis.getVoices());
        };
      }
    });
  }

  cancel() {
    this.synthesis.cancel();
  }
}
