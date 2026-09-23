import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadModel,
  completion,
  unloadModel,
  LLAMA_3_2_1B_INST_Q4_0,
} from '@qvac/sdk';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const publicDir = join(__dirname, 'public');

let modelId = null;

async function ensureModel() {
  if (modelId) return modelId;

  const loaded = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
  });

  modelId = loaded.modelId ?? loaded;
  return modelId;
}

async function askLocal(note, question) {
  const id = await ensureModel();

  const prompt = `Answer the question using only the note below.
If the note does not contain enough information, say that clearly.

NOTE:
${note}

QUESTION:
${question}`;

  const run = completion({
    modelId: id,
    history: [{ role: 'user', content: prompt }],
    stream: true,
  });

  let answer = '';

  for await (const token of run.tokenStream) {
    answer += token;
  }

  return answer.trim();
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/api/ask' && req.method === 'POST') {
      let body = '';

      for await (const chunk of req) {
        body += chunk;
      }

      const { note, question } = JSON.parse(body);

      if (!note?.trim() || !question?.trim()) {
        res.writeHead(400, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({
          error: 'Please provide both a note and a question.',
        }));
        return;
      }

      const answer = await askLocal(note, question);

      res.writeHead(200, {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify({
        answer,
        local: true,
      }));

      return;
    }

    const requestedPath =
      req.url === '/' ? '/index.html' : req.url;

    const filePath = join(
      publicDir,
      requestedPath.replace(/^\/+/, ''),
    );

    const data = await readFile(filePath);

    res.writeHead(200, {
      'Content-Type':
        mimeTypes[extname(filePath)] ||
        'application/octet-stream',
    });

    res.end(data);
  } catch (error) {
    console.error(error);

    res.writeHead(500, {
      'Content-Type': 'application/json',
    });

    res.end(JSON.stringify({
      error: 'Something went wrong while processing the request.',
    }));
  }
});

server.listen(3000, () => {
  console.log('QVAC Local Notes running at http://localhost:3000');
});

async function shutdown() {
  if (modelId) {
    try {
      await unloadModel({ modelId });
    } catch {
      // Ignore cleanup errors during shutdown.
    }
  }

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
