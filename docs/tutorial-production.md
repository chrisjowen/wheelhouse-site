# Wheelhouse tutorial: production record

The tutorial follows a fictional crew building **Daymark**, a small habit tracker. It runs from the request to Firstmate through the task, a decision, the app preview, the reading view, PR review and landing, then tours the rest of Wheelhouse. The narration transcript and aligned chapter times live in `src/tutorial.mjs`.

## Sources and isolation

- Wheelhouse source: fresh clone of `chrisjowen/wheelhouse`, main commit `496eac434a9f36ffeca17bb69dd0575905f4d05e`.
- PR review UI: `chrisjowen/pr-review-wheelhouse`, commit `c2e9c602725f8373d8753424036a4b240dab216a`.
- Capture: actual Wheelhouse pages in dark mode, 1920×1080, driven and screenshotted with `chrome-devtools-axi`. The phone scene uses a 500×932 viewport, composed into the 1080p video.
- An isolated fake Firstmate home uses Wheelhouse's test harness, seeded tasks, a fleet ledger, chat transcript, decision, report, diff and cached check observations. The PR review plugin renders seeded review records through its real UI with fake GitHub/model boundaries. The embedded Daymark app is a local demo. Tasks, checks, reviews and the merge are a scripted illustration; no real worker or GitHub merge was run.
- Demo services use loopback ports 4981–4984. No capture connects to the live Wheelhouse on port 4310 or reads the live fleet's records. Capture sources and intermediate output stay outside this repository.

## Narration

361 words, synthesized in **one** request with ElevenLabs voice `b7KMRhsKiOzXq0GV97l0`, model `eleven_multilingual_v2`. The key was supplied only to the synthesis process through `wh-vault run --only ELEVEN_LABS_KEY`. No credential is stored in the project.

The [speech-with-timing endpoint](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps) supplied character alignment. Both the burned-in captions and downloadable WebVTT use that alignment, offset 1.2 seconds for the opening. Captions have bold text, a dark backing and a short fade/scale animation. The English caption track is also available in the web player; the transcript remains readable without JavaScript.

## Music and licence

**“Carefree” — Kevin MacLeod (incompetech.com)**

- [Artist's track and attribution page](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1400037)
- [Artist's MP3](https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3)
- Licence: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/), permitting commercial use with attribution.
- Verified against the artist's [track listing](https://remote.incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1400037) on 11 November 2026.
- Changes: excerpted, faded in/out, volume adjusted, and dynamically ducked beneath narration. No endorsement is implied.

The credit appears on the video's closing card and beside the player on both pages. The original music recording retains its CC BY 4.0 licence; the repository's MIT licence does not replace third-party media licences.

## Edit and delivery

The edit uses FFmpeg: still sequences from the live demo, gentle camera moves with closer views of decisions/code/report/preview, fades between shots, ASS captions, and a sidechain compressor to duck the music under the normalized voice. H.264 video, yuv420p, 1920×1080 at 24 fps; AAC audio at 96 kbps; MP4 fast-start metadata for progressive playback. A poster and English WebVTT ship beside it in `assets/video/`. WebM is omitted to avoid an extra large repository asset.

The site build hashes the video, poster and captions; `/tour/` includes chapters, downloads, credits and the full transcript. Both players require user interaction and do not preload the video. Starting one narrated player pauses the other. The development server serves WebVTT as `text/vtt` and supports MP4 byte ranges.

Validate with `npm run check`, then `node scripts/serve.mjs <port>`. Review `/` and `/tour/`, play the MP4, seek a chapter, inspect the transcript, and check the video URL with an HTTP Range request. The tutorial MP4 is capped at 25 MB by the build checks. Review the local draft before publication.
