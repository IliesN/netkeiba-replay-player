# Netkeiba Replay Player

A lightweight browser extension that replaces the static video placeholders on Netkeiba race result pages with the official JRA (Japan Racing Association) video player.

## How It Works

The extension operates seamlessly in the background to connect Netkeiba's database with the official JRA video archives.

To prevent third-party sites from embedding their videos directly, the JRA uses an anti-hotlinking security that blocks requests coming from external domains.
The extension bypasses this by spawning the video player in a clean, dedicated pop-up functionally hosted on `jra.jp` using the race ID found on Netkeiba.  

If the replay of any given race isn't hosted on `jra.jp`, the extension will instead redirect you to a YouTube search page matching the race you're looking for with a simple button press.  


## How to Install from GitHub

This extension is pending Web Store approval, so in the meantime, you can load it directly into Chrome:

1. Download the `.zip` file from the Releases section.
2. Extract the `.zip` file into a folder on your computer.
3. Open Chrome and navigate to `chrome://extensions/` (or go to Menu > Extensions > Manage Extensions).
4. Turn on **Developer mode** using the toggle switch in the top right corner.
5. Click the **Load unpacked** button in the top left.
6. Select the folder you extracted in Step 2.

The extension is now installed and will automatically activate on Netkeiba race result pages (hopefully!)

## Disclaimers

This extension only works on the **English version of Netkeiba**.  
While every graded race should be available to watch with this extension either directly within a pop-up widonw or by being redirected to YouTube, you might stumble upon a few races that greet you with an error message. **This is because `jra.jp` did not begin comprehensively archiving weekend race replays until March 28, 2015.** This issue is currently being worked on.
