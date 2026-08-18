export interface StreamMessageOptions {
  threadId: string;
  prompt: string;
  onChunk: (chunk: string) => void;
  onMetadata?: (meta: any) => void;
  onDone: () => void;
  onError?: (err: any) => void;
}

export async function sendStreamMessage(options: StreamMessageOptions) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threadId: options.threadId,
        message: options.prompt,
      }),
    });

    if (!response.body) throw new Error('No response body from server');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.replace('data: ', '').trim();
          if (dataStr === '[DONE]') {
            options.onDone();
            return;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) options.onChunk(parsed.text);
            if (parsed.metadata && options.onMetadata) options.onMetadata(parsed.metadata);
          } catch {
            // Handle plain string fallback
            options.onChunk(dataStr);
          }
        }
      }
    }
    options.onDone();
  } catch (error) {
    if (options.onError) options.onError(error);
  }
}