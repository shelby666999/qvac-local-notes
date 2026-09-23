# QVAC Local Notes

A local-first notes assistant powered by QVAC on-device AI.

## What it does

QVAC Local Notes lets you paste a note and ask a question about it. The application uses the QVAC SDK to load an on-device language model and generate an answer based on the supplied note.

## Key features

- Local-first note processing
- QVAC on-device model loading
- Question answering with QVAC completion
- Simple responsive interface
- No application backend for sending notes to a remote AI service

## Technology

- Node.js 20+
- QVAC SDK `@qvac/sdk` 0.19.1
- HTML
- CSS
- JavaScript

## QVAC integration

The server uses:

- `loadModel()` to load the QVAC model
- `completion()` to generate the answer
- `unloadModel()` to release the loaded model

The relevant integration is implemented in `server.js`.

## Installation

Clone the repository and install the dependencies:

```bash
npm install
