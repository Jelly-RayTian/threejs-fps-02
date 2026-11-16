# Verification and capture handoff

Tested with Node v24.22.1, using only erasable TypeScript and Node 22 APIs in the entrypoint and server.

- `node tests/simulation.mjs`: passes purchase affordability, weapon switching, ammunition and reloads, head damage, movement acceleration and stopping, crouch height, collision, grenade detonation, plant/overload and defuse, deterministic replay, clear screenshot poses, and autonomous bot planting and defusing.
- `node --experimental-vm-modules tests/scene-smoke.mjs`: passes scene construction using the actual vendored Three.js, all three stage render paths, and static geometry batching (437 instances). WebGLRenderer is stubbed; this is not a visual or GPU test.
- `node --experimental-vm-modules tests/input-smoke.mjs`: passes the actual entry module and UI flow for deploy, pause, supply purchases, round clock, movement, mouse look, fire, reload and roster. Browser, audio and GPU host APIs are stubbed.
- `node --check` passes for every game module, including the two vendored Three.js modules.
- Byte comparisons confirm the dossier library, both Three.js modules, and the MIT LICENSE match the required kit originals.

`MAKEFUN_OUTPUT_DIR=out node main.ts` was run. It copies the static game and screenshots directory successfully, then the unmodified dossier library refuses the empty screenshot directory. A complete dossier cannot be produced until genuine browser screenshots exist. No placeholder images have been supplied.

The sandbox rejects the server's listening socket with EPERM. The available Chromium also exits at startup because its crash handler's socket operation is denied. Thus real browser playtesting and screenshot capture remain outstanding. The `screenshots/` directory contains only an empty `.gitkeep` so Git preserves it.

On a machine with desktop Chrome and WebGL 2:

1. Run `node serve.ts` and play http://localhost:8080. Check mouse capture, rendering, audio, HUD and the complete round loop.
2. Capture the actual page at **1280 × 720**, without editing or compositing:
   - http://localhost:8080/?shot=start&seed=1 → `screenshots/1-start.jpg`
   - http://localhost:8080/?shot=play&seed=1 → `screenshots/2-play.jpg`
   - http://localhost:8080/?shot=end&seed=1 → `screenshots/3-end.jpg`
3. Use browser JPEG capture quality around 85; each file must be at most 256 KiB. The scenes are frozen and repeatable. The shot stages reuse the game map, actor models, weapon, HUD and effects.
4. Run `MAKEFUN_OUTPUT_DIR=out node main.ts` twice and compare the generated dossiers byte for byte. Keep generated `out/` out of the repository upload.
5. The operator still needs to set GitHub About's website to https://make.fun/c/threejs-fps-02/ and topic to `makefun`, bundle the original recorded transcripts, commit/upload, and submit the repository. No commit or submission was performed in this session.
