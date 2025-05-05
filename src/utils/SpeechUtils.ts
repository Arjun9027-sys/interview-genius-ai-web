
// Speech-to-Text functionality
export class SpeechToText {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onInterimResultCallback: ((text: string) => void) | null = null;
  
  constructor() {
    // Initialize speech recognition if supported
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript && this.onResultCallback) {
          this.onResultCallback(finalTranscript);
        }
        
        if (interimTranscript && this.onInterimResultCallback) {
          this.onInterimResultCallback(interimTranscript);
        }
      };
      
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }
  
  public isSupported(): boolean {
    return this.recognition !== null;
  }
  
  public start(onResult: (text: string) => void, onInterimResult?: (text: string) => void): boolean {
    if (!this.recognition) return false;
    
    this.onResultCallback = onResult;
    this.onInterimResultCallback = onInterimResult || null;
    
    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }
  
  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  public isActive(): boolean {
    return this.isListening;
  }
}

// Text-to-Speech functionality
export class TextToSpeech {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private speaking: boolean = false;
  private onEndCallback: (() => void) | null = null;
  
  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Load available voices
    this.loadVoices();
    
    // Some browsers require a listener for voices to be loaded
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }
  
  private loadVoices(): void {
    this.voices = this.synthesis.getVoices();
    
    // Select a default English voice
    if (this.voices.length > 0) {
      // Try to find a high-quality English voice
      const preferredVoices = [
        'Google US English',
        'Microsoft David',
        'Alex',  // macOS voice
        'Samantha' // macOS voice
      ];
      
      // Find first preferred voice that exists
      for (const name of preferredVoices) {
        const voice = this.voices.find(v => v.name === name);
        if (voice) {
          this.selectedVoice = voice;
          break;
        }
      }
      
      // If no preferred voice found, find any English voice
      if (!this.selectedVoice) {
        this.selectedVoice = this.voices.find(v => v.lang.startsWith('en'));
      }
      
      // Default to first available voice if no English voice found
      if (!this.selectedVoice) {
        this.selectedVoice = this.voices[0];
      }
    }
  }
  
  public isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
  
  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
  
  public setVoice(voice: SpeechSynthesisVoice): void {
    this.selectedVoice = voice;
  }
  
  public speak(text: string, onEnd?: () => void): boolean {
    if (!this.isSupported() || !text) return false;
    
    // Cancel any ongoing speech
    this.synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    this.onEndCallback = onEnd || null;
    
    utterance.onend = () => {
      this.speaking = false;
      if (this.onEndCallback) this.onEndCallback();
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.speaking = false;
      if (this.onEndCallback) this.onEndCallback();
    };
    
    this.synthesis.speak(utterance);
    this.speaking = true;
    
    return true;
  }
  
  public stop(): void {
    if (this.isSupported()) {
      this.synthesis.cancel();
      this.speaking = false;
    }
  }
  
  public isSpeaking(): boolean {
    return this.speaking;
  }
}
