# Music Visualiser

A p5.js music player for CM1010, styled after Windows Media Player 11. Playback, volume, and speed live on one player. Five visuals draw from the sound.

Open `index.html` in Chrome. Press play or the space bar before the audio starts.

## Controls

- **Play** in the centre starts or pauses. The buttons on either side change speed. The slider sets volume; drag it.
- **Song names** on the left switch track. The current name is highlighted.
- **Space** plays or pauses.
- **Left / right** change track.
- **Up / down** change volume.
- **f / s** play faster or slower. Speed stays between 0.5 and 2.
- **1–5** select a visual. **m** shows or hides the names, which can also be clicked.
- **g** toggles fullscreen.

## Visuals

| Key | Visual | Track while playing |
|---|---|---|
| 1 | spectrum | keeps the current song |
| 2 | wavepattern | `gfriend_sunrise.mp3` |
| 3 | needles | `gfriend_rainbow.mp3` |
| 4 | phyllotaxis | `gfriend_flower_garden.mp3` |
| 5 | disco | `gfriend_mago.mp3` |

## Layout

- `index.html` loads p5, p5.sound, and the scripts.
- `script/player.js` owns the tracks, volume, speed, and FFT.
- `script/visuals/` holds one file per visual.
- `script/buttons/` holds the play, speed, and volume controls.
- `assets/` holds the audio and `lyric.csv`.
- `report/` holds the written report and logs.

## Libraries

- p5.js 1.8.0
- p5.sound 1.0.1
