# Replay Player for Netkeiba

A lightweight browser extension that replaces the static video placeholders on Netkeiba race result pages with the official JRA (Japan Racing Association) race replay, playing right on the page.

## How It Works

The extension operates seamlessly in the background to connect Netkeiba's database with the official JRA video archives.

JRA's replays are HLS video streams hosted by J-Stream (`*.stream.ne.jp`). JRA's own video player refuses to run anywhere but `jra.jp` (it checks `document.referrer` in JavaScript), but the streams themselves and the small metadata files that point to them are public.
So when you open a race page, the extension converts Netkeiba's race ID into JRA's format, looks the race up in J-Stream's three replay archives at once, and plays the best-quality match in a native video player directly inside the REPLAY section.

If JRA has no replay for a given race, the extension will instead offer a YouTube search page matching the race you're looking for with a simple button press.  

On other pages, such as a horse's profile and results, the little video icons next to each race take you straight to that race's replay.  

## How to Install

### Chrome

[Download from Chrome Web Store.](https://chromewebstore.google.com/detail/replay-player-for-netkeib/cmkljjcgajgojaohmmjgpkgnecollfmd?authuser=0&hl=fr)

**OR** download from GitHub:

1. Download the Chrome `.zip` file (`replay-player-for-netkeiba-<version>-chrome.zip`) from the [Releases section](https://github.com/IliesN/netkeiba-replay-player/releases/).
2. Extract the `.zip` file into a folder on your computer.
3. Open Chrome and navigate to `chrome://extensions/` (or go to Menu > Extensions > Manage Extensions).
4. Turn on **Developer mode** using the toggle switch in the top right corner.
5. Click the **Load unpacked** button in the top left.
6. Select the folder you extracted in Step 2.

### Mozilla Firefox

[Download from Firefox Add-ons.](https://addons.mozilla.org/en-GB/firefox/addon/replay-player-for-netkeiba/)

**OR** download from GitHub:

1. Download and extract the Firefox `.zip` file (`replay-player-for-netkeiba-<version>-firefox.zip`) from the [Releases section](https://github.com/IliesN/netkeiba-replay-player/releases/) to a folder on your computer.
2. Open Firefox and type `about:debugging` in the address bar, then press **Enter**.
3. Select **This Firefox** from the left-hand sidebar.
4. Click the **Load Temporary Add-on...** button.
5. Navigate into your extracted folder and select the `manifest.json` file.  

> **Note:** Firefox removes temporary add-ons when it closes, so you'll need to repeat these steps each time you restart it. Getting the extension from Firefox Add-ons would be more convenient.

The extension is now installed and will automatically activate on Netkeiba race result pages (hopefully!)

## Disclaimers

This extension works on the **English version of Netkeiba** (race pages and race result pages) and on the **Japanese version's race video pages** (`race.netkeiba.com/race/movie.html`), where the player appears in Japanese.  
While every graded race should be available to watch with this extension either directly on the page or by being redirected to YouTube, many older races have no JRA replay at all. **This is because `jra.jp` did not begin comprehensively archiving weekend race replays until March 28, 2015.** For those races, the extension tells you no JRA replay was found and offers the YouTube search instead.  

## Third-Party Code

`lib/hls.light.min.js` is an unmodified copy of [hls.js](https://github.com/video-dev/hls.js) v1.7.3 (Apache-2.0, see `lib/hls.js-LICENSE.txt`). Firefox cannot play HLS streams natively, so hls.js feeds them to the `<video>` element.  

This extension is an independent, open-source project and is **not** affiliated with, endorsed by, or sponsored by the Japan Racing Association (JRA) or Netkeiba. All trademarks and copyrights belong to their respective owners.
    