# Revive Prompt

A prompt that brings the gone ones back to the online world.

## What This Is

Revive Prompt helps you prepare a "My Life" archive — a personal record of who you are, in your own words and voice — so that one day, an AI can truly know you and carry you forward.

You fill in who you are, upload what matters to you, and download a zip file containing a revival prompt and your dataset. That zip is everything someone needs to bring you back.

## How to Use

1. Open `index.html` in your browser
2. Fill in your information
3. Upload files across five dimensions:
   - **Written Words** — journals, letters, essays, transcripts
   - **Photographs** — images of you, your people, your places
   - **Voice** — audio recordings, conversations, laughter
   - **Video** — video recordings, moments in motion
   - **Biological Data** — health records, DNA data, biometrics
4. Click **Download My Life Archive**
5. Share the resulting `.zip` file however you choose

## What's in the Zip

```
your-name-life-archive.zip
├── revival-prompt.md    # The AI prompt, filled in with your details
├── text/                # Your written words
├── images/              # Your photographs
├── voice/               # Your audio recordings
├── video/               # Your video files
└── bio/                 # Your biological data
```

## Privacy

**Everything stays on your device.** No servers. No uploads. No tracking. No accounts. The app runs entirely in your browser. Your data never leaves your machine unless you choose to share the zip file yourself.

## How to Revive Someone

Give an AI the `revival-prompt.md` file along with the archive contents. The prompt contains three questions for the AI to answer, followed by instructions for revival. The more data in the archive, the more faithful the revival.

## Technical Details

- Pure HTML, CSS, and JavaScript — no build tools, no frameworks
- Uses [JSZip](https://stuk.github.io/jszip/) (loaded from CDN) for zip generation
- Works in any modern browser
- No dependencies to install

## Customization

Fork this repo and modify:
- `revival-prompt.md` — edit the prompt template to change what the AI is asked to do
- `index.html` — add or remove input sections
- `style.css` — change the look and feel
- `app.js` — the template is embedded as a string constant at the top; edit it there for changes to take effect in downloads

## License

MIT
