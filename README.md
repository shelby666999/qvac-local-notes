# QVAC Local Notes

A local-first notes assistant powered by QVAC on-device AI.

## What it does

QVAC Local Notes lets you paste a note and ask a question about it. The application uses the QVAC SDK to load an on-device language model and generate an answer based on the supplied note.

## Key features

* Local-first note processing
* QVAC on-device model loading
* Question answering with QVAC completion
* Simple responsive interface
* No application backend for sending notes to a remote AI service

## Technology

* Node.js 20+
* QVAC SDK `@qvac/sdk` 0.19.1
* HTML
* CSS
* JavaScript

## QVAC integration

The application uses the QVAC SDK directly in `server.js`:

* `loadModel()` loads the on-device QVAC model
* `completion()` generates the answer
* `unloadModel()` releases the loaded model

The inference is performed on-device using the QVAC SDK.

## Installation

Make sure Node.js 20 or newer is installed.

Clone the repository and open the project folder:

```bash
git clone https://github.com/shelby666999/qvac-local-notes.git
cd qvac-local-notes
```

Install the dependencies:

```bash
npm install
```

## Run

Start the application:

```bash
npm start
```

The server will start at:

```text
http://localhost:3000
```

Open that address in your browser.

Enter a note, ask a question about the note, and click **Ask locally**. The answer is generated using QVAC on-device AI.

## QVAC SDK Version

This project uses:

```text
@qvac/sdk 0.19.1
```

## Privacy

Notes are processed locally through the QVAC on-device AI integration. The application does not send notes to a remote AI service for inference.

## License

This project is licensed under the MIT License.
