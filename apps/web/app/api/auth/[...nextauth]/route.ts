import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { threadId, message } = await req.json();

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const sendEvent = (data: any) => {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                };

                // Simulated RAG backend response stream
                const responseText = `Here is the process guidance for "${message}": Please refer to our governance requirements and risk matrix before proceeding with bid approval.`;
                const words = responseText.split(' ');

                for (const word of words) {
                    sendEvent({ text: `${word} ` });
                    await new Promise((res) => setTimeout(res, 50)); // typing delay effect
                }

                // Send grounding citations metadata at the end
                sendEvent({
                    metadata: {
                        groundedCount: 2,
                        docs: [
                            { id: '101', title: 'Governance_Policy.docx', type: 'doc', subtitle: 'Standard Operating Procedure' },
                        ],
                    },
                });

                controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
    }
}