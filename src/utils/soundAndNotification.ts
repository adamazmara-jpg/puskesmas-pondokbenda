// Utility for Sound Effects (Web Audio API Synthesizer), Text-to-Speech, and Browser Notifications

export function playCallChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Friendly 3-tone hospital chime: F5 (698.46Hz) -> A5 (880.00Hz) -> C6 (1046.50Hz)
    const notes = [698.46, 880.00, 1046.50];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      // Volume envelope
      gain.gain.setValueAtTime(0, now + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.18 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.7);
    });
  } catch (err) {
    console.warn('Audio chime error:', err);
  }
}

export function playSpeechCall(queueNumber: string, poliName: string, doctorName?: string) {
  try {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Format queue number for clear vocalization: e.g. "A 0 0 3" or "A 3"
    const formattedNum = queueNumber.split('').join(' ');
    const text = `Nomor antrean, ${formattedNum}. Silakan menuju ke ${poliName}.${doctorName ? ' Dokter penanggung jawab ' + doctorName : ''}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Try to pick an Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    try {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return false;
    }
  }
  return false;
}

export function isNotificationSupportedAndGranted(): boolean {
  if (!('Notification' in window)) return false;
  return Notification.permission === 'granted';
}

export function sendBrowserNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'puskesmas-queue-call-' + Date.now(),
        requireInteraction: true,
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (err) {
      console.warn('Browser notification trigger error:', err);
    }
  }
}
