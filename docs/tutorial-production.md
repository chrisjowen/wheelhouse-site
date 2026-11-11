# Wheelhouse tutorial: production record

The tutorial follows a fictional six-project crew building **nightly smart summaries for Docket**. Changed knowledge-graph nodes receive fresh summaries with their evidence attached. The story runs from the request to Firstmate through the task, a decision, the preview, the reading view, PR review and landing, then tours the rest of the bridge. The narration transcript and aligned chapter times live in `src/tutorial.mjs`.

## Sources and isolation

- Wheelhouse source: fresh clone of `chrisjowen/wheelhouse`, main commit `496eac434a9f36ffeca17bb69dd0575905f4d05e`.
- PR review UI: `chrisjowen/pr-review-wheelhouse`, commit `c2e9c602725f8373d8753424036a4b240dab216a`.
- Capture: actual Wheelhouse pages in dark mode, 1920×1080, driven and screenshotted with `chrome-devtools-axi`. The phone scene uses a 430×932 mobile viewport, composed into the 1080p video.
- The isolated fake Firstmate home uses Wheelhouse's test harness. Docket, Atlas, Compass, Beacon, Harbour and Relay have workers and queued tasks across building, testing, decision, review and landed states. The project switcher lists all six projects.
- A seeded fleet ledger, chat transcript, decision, report, diff and cached check observations drive the real Wheelhouse UI. The PR review plugin renders seeded records with fake GitHub/model boundaries. The embedded Docket feature is a running prototype showing the graph, linked evidence, nightly run and dry run. Tasks, checks, reviews and the merge are scripted illustrations; no real agent job or GitHub merge was run.
- Demo services use loopback ports 4981–4983 and 4985. No capture connects to the live Wheelhouse on port 4310 or reads the live fleet's records. Capture sources and intermediate output stay outside this repository.

## Narration

241 words, synthesized in **one new request** for this revision with ElevenLabs voice `b7KMRhsKiOzXq0GV97l0`, model `eleven_multilingual_v2`, speed 1.10. This is the second synthesis request across the two draft versions. The key was supplied only to the synthesis process through `wh-vault run --only ELEVEN_LABS_KEY`; no credential is stored in the project.

The [speech-with-timing endpoint](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps) supplied character alignment. Burned-in captions and downloadable WebVTT use the same alignment, offset 0.65 seconds for the opening. Captions have bold text, a dark backing and short fade/scale animation. The player also offers an English caption track. The full transcript is readable without JavaScript.

## Music and licence

**“EDM Detection Mode” — Kevin MacLeod (incompetech.com)**

- [Artist's track and attribution page](https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1500026)
- [Artist's MP3](https://incompetech.com/music/royalty-free/mp3-royaltyfree/EDM%20Detection%20Mode.mp3)
- Licence: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/), permitting commercial use with attribution. The artist also lists the track in the [CC BY 4.0 download collection](https://web.incompetech.com/music/royalty-free/Downloads/allthemusic.html).
- The artist describes the track as driving electronica at 128 BPM. Source and licence verified on 12 November 2026.
- Changes: an excerpt beginning at 02:00, faded in/out, normalized, volume adjusted and dynamically ducked beneath narration. No endorsement is implied.

The credit appears on the video's closing card and beside the player on both pages. The music retains its CC BY 4.0 licence; the repository's MIT licence does not replace third-party media licences.

## Edit and delivery

The revised edit is approximately 1:46. It uses tighter cuts across the fleet, Docket's build and the wider tour. Camera moves are rendered programmatically with Pillow's floating-point affine resampler and bicubic filtering. Scale and position follow eased curves, returning from key close-ups to the full bridge. There are no integer crop steps from FFmpeg's zoompan filter. Chapter changes slide with eased motion and brief motion blur; cuts within a chapter crossfade. Titles and captions stay fixed to the output frame.

FFmpeg encodes the camera pass, burns ASS captions, and ducks the new soundtrack using the narration as a sidechain. H.264, yuv420p, 1920×1080 at 30 fps; AAC at 112 kbps; MP4 fast-start metadata for progressive playback. A poster and English WebVTT ship in `assets/video/`. WebM is omitted to avoid an extra large repository asset.

The site build hashes video, poster and captions. `/tour/` includes chapters, downloads, credits and the full transcript; the home-page hero features the same video. Playback requires user interaction and does not preload the video. Starting one narrated player pauses the other. The development server serves WebVTT as `text/vtt` and supports MP4 byte ranges.

Validate with `npm run check`, then `node scripts/serve.mjs <port>`. Review `/` and `/tour/`, play the MP4, seek a chapter, inspect the transcript, and check an HTTP Range request against the video URL. Build checks cap MP4 assets at 25 MB. Review the local draft before publication.
