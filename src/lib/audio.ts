"use client";

// Audio abstraction: the app never calls a concrete engine directly.
// Today's provider is the browser's built-in speech synthesis (no files, no keys,
// no network). Replacing it with stored MP3s or a cloud TTS API only requires
// registering a different AudioProvider via `setAudioProvider`.

export interface SpeakOptions {
  rate?: number;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export interface AudioProvider {
  readonly name: string;
  isSupported(): boolean;
  speak(text: string, options?: SpeakOptions): void;
  cancel(): void;
}

class WebSpeechProvider implements AudioProvider {
  readonly name = "web-speech";

  isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  speak(text: string, options: SpeakOptions = {}): void {
    if (!this.isSupported()) {
      options.onError?.("Audio is not supported in this browser.");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = options.rate ?? 1;
      if (options.onEnd) utterance.onend = options.onEnd;
      if (options.onError) utterance.onerror = () => options.onError!("Could not play audio.");
      window.speechSynthesis.speak(utterance);
    } catch {
      options.onError?.("Could not play audio.");
    }
  }

  cancel(): void {
    if (this.isSupported()) window.speechSynthesis.cancel();
  }
}

class UnavailableProvider implements AudioProvider {
  readonly name = "unavailable";
  isSupported() {
    return false;
  }
  speak(_text: string, options: SpeakOptions = {}) {
    options.onError?.("Audio is not available.");
  }
  cancel() {}
}

let provider: AudioProvider =
  typeof window !== "undefined" && "speechSynthesis" in window
    ? new WebSpeechProvider()
    : new UnavailableProvider();

export function setAudioProvider(next: AudioProvider): void {
  provider.cancel();
  provider = next;
}

export function getAudioProvider(): AudioProvider {
  return provider;
}

export const audio = {
  speakWord(text: string, options?: SpeakOptions) {
    provider.speak(text, options);
  },
  cancel() {
    provider.cancel();
  },
};
