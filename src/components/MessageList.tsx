interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] p-4 rounded-lg backdrop-blur-lg ${
              message.role === 'user'
                ? 'bg-white/10 text-white'
                : 'bg-purple-600/20 text-white'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <span className="text-xs opacity-50 mt-2 block">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
