interface VoiceControlsProps {
  isListening: boolean;
  onToggle: () => void;
}

export function VoiceControls({ isListening, onToggle }: VoiceControlsProps) {
  return (
    <div className="flex justify-center py-6">
      <button
        onClick={onToggle}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
          isListening
            ? 'bg-red-500 scale-110'
            : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        <svg
          className={`w-8 h-8 ${isListening ? 'text-white' : 'text-white'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
    </div>
  );
}
