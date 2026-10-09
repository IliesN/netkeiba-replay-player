// Packages the extension for both stores: `node build.mjs` -> dist/<name>-<version>-{firefox,chrome}.zip
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const FILES = ['manifest.json', 'content.js', 'links.js', 'lib', 'icons', '_locales']; // everything the extension ships
const TAR = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe'); // Windows' bsdtar writes clean zips

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
// The name is a "__MSG_extName__" placeholder: read the English one from _locales
const messages = JSON.parse(fs.readFileSync(path.join(root, '_locales', 'en', 'messages.json'), 'utf8'));
const name = manifest.name.replace(/^__MSG_(\w+)__$/, (_, key) => messages[key].message);
const base = `${name.toLowerCase().replace(/\W+/g, '-')}-${manifest.version}`;
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });

const zip = (dir, name) => {
    const out = path.join(dist, name);
    fs.rmSync(out, { force: true });
    execFileSync(TAR, ['-a', '-cf', out, ...FILES], { cwd: dir }); // manifest.json at the zip root
    console.log(`built dist/${name}`);
};

// Firefox: files as they are
zip(root, `${base}-firefox.zip`);

// Chrome: same files, minus the Firefox-only manifest key
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nkrp-'));
for (const f of FILES) fs.cpSync(path.join(root, f), path.join(tmp, f), { recursive: true });
const { browser_specific_settings, ...chromeManifest } = manifest;
fs.writeFileSync(path.join(tmp, 'manifest.json'), `${JSON.stringify(chromeManifest, null, 2)}\n`);
zip(tmp, `${base}-chrome.zip`);
fs.rmSync(tmp, { recursive: true, force: true });
