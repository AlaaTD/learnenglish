"use client";

// Audio manager with centralized state, browser GC retention,
// sentence chunking for long texts, and Chrome keep-alive.

export interface SpeakOptions {
  rate?: number;
  id?: string;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export interface AudioState {
  activeText: string | null;
  activeId: string | null;
  isPlaying: boolean;
  error: string | null;
}

let currentState: AudioState = {
  activeText: null,
  activeId: null,
  isPlaying: false,
  error: null,
};

const listeners = new Set<(state: AudioState) => void>();

function notify() {
  for (const listener of listeners) {
    listener(currentState);
  }
}

function updateState(partial: Partial<AudioState>) {
  currentState = { ...currentState, ...partial };
  notify();
}

// Retain references globally to prevent browser garbage collection
let activeUtterances: SpeechSynthesisUtterance[] = [];
let keepAliveTimer: ReturnType<typeof setInterval> | null = null;
let sentenceQueue: string[] = [];
let currentQueueIndex = 0;
let currentOptions: SpeakOptions = {};
let isCancelled = false;

function clearKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

function startKeepAlive() {
  clearKeepAlive();
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  // Chrome bug workaround: speech synthesis pauses after ~15 seconds of speaking
  keepAliveTimer = setInterval(() => {
    if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    } else {
      clearKeepAlive();
    }
  }, 8000);
}

function stopInternal() {
  isCancelled = true;
  sentenceQueue = [];
  currentQueueIndex = 0;
  clearKeepAlive();
  activeUtterances = [];

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore synthesis cancel errors
    }
  }

  if (currentState.isPlaying || currentState.activeText !== null || currentState.activeId !== null) {
    updateState({
      isPlaying: false,
      activeText: null,
      activeId: null,
      error: null,
    });
  }
}

function splitIntoSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const matches = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  if (!matches || matches.length === 0) return [trimmed];

  return matches
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function playNextSentence() {
  if (isCancelled || currentQueueIndex >= sentenceQueue.length) {
    clearKeepAlive();
    activeUtterances = [];
    updateState({ isPlaying: false, activeText: null, activeId: null });
    currentOptions.onEnd?.();
    return;
  }

  const sentence = sentenceQueue[currentQueueIndex];
  currentQueueIndex++;

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    stopInternal();
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-US";
    utterance.rate = currentOptions.rate ?? 1;

    activeUtterances.push(utterance);

    utterance.onend = () => {
      const idx = activeUtterances.indexOf(utterance);
      if (idx !== -1) activeUtterances.splice(idx, 1);

      if (!isCancelled) {
        if (currentQueueIndex < sentenceQueue.length) {
          setTimeout(() => {
            if (!isCancelled) playNextSentence();
          }, 150);
        } else {
          playNextSentence();
        }
      }
    };

    utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
      const idx = activeUtterances.indexOf(utterance);
      if (idx !== -1) activeUtterances.splice(idx, 1);

      if (e.error === "canceled" || e.error === "interrupted" || isCancelled) {
        return;
      }
      stopInternal();
      const msg = "Audio playback encountered an error.";
      updateState({ error: msg });
      currentOptions.onError?.(msg);
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    stopInternal();
    const msg = "Could not initialize audio.";
    updateState({ error: msg });
    currentOptions.onError?.(msg);
  }
}

const SERVER_SNAPSHOT: AudioState = {
  activeText: null,
  activeId: null,
  isPlaying: false,
  error: null,
};

export const audio = {
  isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  },

  getState(): AudioState {
    return currentState;
  },

  getServerState(): AudioState {
    return SERVER_SNAPSHOT;
  },

  subscribe(listener: (state: AudioState) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  speakWord(text: string, options: SpeakOptions = {}) {
    if (!this.isSupported()) {
      const errorMsg = "Audio is not supported in this browser.";
      updateState({ error: errorMsg });
      options.onError?.(errorMsg);
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) return;

    const targetId = options.id ?? trimmed;
    if (currentState.isPlaying && (currentState.activeId === targetId || currentState.activeText === trimmed)) {
      this.cancel();
      return;
    }

    stopInternal();

    isCancelled = false;
    currentOptions = options;
    sentenceQueue = splitIntoSentences(trimmed);
    currentQueueIndex = 0;

    updateState({
      isPlaying: true,
      activeText: trimmed,
      activeId: targetId,
      error: null,
    });

    startKeepAlive();
    playNextSentence();
  },

  cancel() {
    stopInternal();
  },

  stop() {
    stopInternal();
  },
};
