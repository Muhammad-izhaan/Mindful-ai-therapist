interface VoiceSettings {
  pitch: number;
  rate: number;
  voice: SpeechSynthesisVoice | null;
}

interface SettingsProps {
  voiceSettings: VoiceSettings;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<VoiceSettings>) => void;
}

export function Settings({
  voiceSettings,
  onClose,
  onUpdateSettings,
}: SettingsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Voice Settings</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Pitch
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.pitch}
              onChange={(e) =>
                onUpdateSettings({ pitch: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Rate
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.rate}
              onChange={(e) =>
                onUpdateSettings({ rate: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
