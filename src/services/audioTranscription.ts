import Groq from 'groq-sdk';

export class AudioTranscriptionService {
  private groq: Groq;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: BlobPart[] = [];
  private onTranscriptionUpdate: ((transcription: string) => void) | null = null;
  private recordingStartTime: number = 0;

  constructor() {
    this.groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const file = new File([audioBlob], 'recording.webm', { 
        type: 'audio/webm' 
      });

      const transcription = await this.groq.audio.transcriptions.create({
        file: file,
        model: 'whisper-large-v3-turbo',
        response_format: 'json',
        language: 'en',
        temperature: 0.2
      });

      return transcription.text || '';
    } catch (error) {
      console.error('Transcription error:', error);
      return '';
    }
  }

  async startRecording(onTranscriptionUpdate: (transcription: string) => void): Promise<MediaRecorder> {
    try {
      this.audioChunks = [];
      this.onTranscriptionUpdate = onTranscriptionUpdate;
      this.recordingStartTime = Date.now();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1
        } 
      });

      this.mediaRecorder = new MediaRecorder(stream, { 
        mimeType: 'audio/webm' 
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        const recordingDuration = Date.now() - this.recordingStartTime;
        
        // Only process if recording was longer than 2 seconds
        if (recordingDuration > 2000 && this.audioChunks.length > 0) {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          
          if (audioBlob.size > 1000) {
            const transcription = await this.transcribeAudio(audioBlob);
            if (transcription && this.onTranscriptionUpdate) {
              this.onTranscriptionUpdate(transcription);
            }
          }
        }
      };

      this.mediaRecorder.start();
      return this.mediaRecorder;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
      });

      this.mediaRecorder.stop();
      
      // Stop all tracks to release the microphone
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }
}
