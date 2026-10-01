import { runGeminiAgent } from './src/geminiAgent.js';

async function test() {
  console.log('Testing runGeminiAgent...');
  try {
    const result = await runGeminiAgent({
      request: 'Create a minimal personal portfolio for a photographer named Elena Vance.',
      onEvent: (evt) => {
        if (evt.type === 'activity_started' || evt.type === 'activity_completed') {
          console.log(`[Event] ${evt.type}: ${evt.message}`);
        } else if (evt.type === 'file_created') {
          console.log(`[Event] file_created: ${evt.file?.path}`);
        }
      }
    });

    console.log('Finished successfully!');
    console.log('Files generated:', Object.keys(result.files));
    console.log('Summary:', result.summary);
  } catch (err) {
    console.error('Test Failed:', err);
  }
}

test();
