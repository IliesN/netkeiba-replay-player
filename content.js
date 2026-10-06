// Plays JRA replays inline on Netkeiba race pages (English and Japanese sites).
// JRA's player only runs on jra.jp, but its HLS streams are public: we fetch and play them directly.
(async () => {
    // Supported pages: where the replay area, race name and thumbnail are, and which language to use
    const PAGE_TYPES = [
        { url: /en\.netkeiba\.com\/db\/race\//, box: '.VideoSampleThum', name: '.RaceName_main', thumb: 'img', lang: 'en' },
        { url: /en\.netkeiba\.com\/race\/race_result\.html/, box: '.VideoSampleThum', name: '.Race_Name', thumb: 'img', lang: 'en' },
        { url: /race\.netkeiba\.com\/race\/movie\.html/, box: '.PremiumRegistWrap', name: '.RaceName', thumb: null, lang: 'ja' },
    ];
    const LABELS = {
        en: { looking: 'Looking for the replay…', play: '▶ Play Replay', youtube: '🔍 Search on YouTube',
              none: 'No JRA replay was found for this race.', failed: 'The JRA replay failed to load.' },
        ja: { looking: 'レース映像を検索中…', play: '▶ レース映像を再生', youtube: '🔍 YouTubeで検索',
              none: 'このレースのJRA映像は見つかりませんでした。', failed: 'JRA映像を読み込めませんでした。' },
    };
    const page = PAGE_TYPES.find((p) => p.url.test(location.href));
    const idMatch = location.href.match(/(?:\/db\/race\/|race_id=)(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)/);
    if (!page || !idMatch) return;
    const label = LABELS[page.lang];

    // Netkeiba ID: year+course+meeting+day+race; JRA swaps course and meeting
    const [, year, course, meeting, day, race] = idMatch;
    const jraId = year + meeting + course + day + race;

    // Race date from the meta description ("27 SEP 2026 …" or "2026年5月17日 …"), for the legacy archive
    const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const desc = document.querySelector('meta[name="description"]')?.content || '';
    const en = desc.match(/^(\d{2})\s([A-Z]{3})\s\d{4}/i);
    const ja = desc.match(/^\d{4}年(\d{1,2})月(\d{1,2})日/);
    const month = ja ? Number(ja[1]) : MONTHS.indexOf(en?.[2].toUpperCase()) + 1;
    const dd = ja ? ja[2].padStart(2, '0') : en?.[1];
    const mmdd = month ? String(month).padStart(2, '0') + dd : '';

    // --- Replay lookup: probe all archives at once; first hit (best quality) wins ---
    const eqBase = (id) => `https://${id}.eq.webcdn.stream.ne.jp/www50/${id}/jmc_pub/`;
    const findEq = async (id) => {
        const res = await fetch(`${eqBase(id)}eq_meta/v1_o/${jraId}.jsonp`);
        if (!res.ok) return null;
        const text = await res.text(); // JSONP: parse the JSON, never eval it
        const movie = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)).movie;
        const streams = (movie?.enable !== '0' && movie?.movie_list_hls) || []; // as in JRA's player
        const stream = streams.find((s) => s.text === 'auto') || streams[0];
        // http thumbnails would be blocked on https pages
        return stream && { url: eqBase(id) + stream.url, poster: movie.thumbnail_url?.replace(/^http:/, 'https:') };
    };
    const findLegacy = async () => { // pre-2018 archive, keyed by date
        const url = `https://jra-fms.hls.wseod.stream.ne.jp/www11/jra-fms/_definst_/mp4:pc_seiseki/${year}/${mmdd}/${jraId}/playlist.m3u8`;
        return mmdd && (await fetch(url)).ok ? { url } : null;
    };
    const lookups = [findEq('eqc834rezx'), findEq('eqd109zrse'), findLegacy()]; // eqPcPlayer2, eqPcPlayer, subwindow
    const replay = Promise.all(lookups.map((p) => p.catch(() => null))).then((found) => found.find(Boolean));

    // --- UI ---
    // Some pages inject their replay area a few seconds after load, so wait for it (give up after 20s)
    const container = document.querySelector(page.box) || await new Promise((resolve) => {
        const observer = new MutationObserver(() => {
            const box = document.querySelector(page.box);
            if (box) { observer.disconnect(); resolve(box); }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 20000);
    });
    const make = (tag, css) => { const el = document.createElement(tag); el.style.cssText = css; return el; };
    const player = make('div', 'position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:8px;border:1px solid #333;background:#000 center/cover');
    let thumb = '';
    const setThumb = (url) => { thumb = url; player.style.backgroundImage = `url("${url}")`; };
    const pageThumb = page.thumb && container.querySelector(page.thumb)?.src;
    if (pageThumb) setThumb(pageThumb);
    const overlay = make('div', 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(0,0,0,.5);backdrop-filter:blur(4px)');
    const button = make('button', 'padding:10px 20px;color:#fff;border:none;border-radius:5px;font-weight:bold;font-size:14px;transition:filter .2s;box-shadow:0 4px 6px rgba(0,0,0,.3)');
    const caption = make('div', 'color:#eee;font-size:12px;text-shadow:0 1px 2px #000');
    button.onmouseenter = () => { if (!button.disabled) button.style.filter = 'brightness(.8)'; };
    button.onmouseleave = () => { button.style.filter = ''; };
    overlay.append(button, caption);
    player.append(overlay);
    container.replaceChildren(player);

    const setButton = (text, color, onclick = null) => {
        Object.assign(button, { textContent: text, onclick, disabled: !onclick });
        Object.assign(button.style, { background: color, cursor: onclick ? 'pointer' : 'default' });
    };

    const showYoutube = (message) => {
        const name = document.querySelector(page.name)?.innerText.trim() || '';
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${year} ${name} JRA`)}`;
        setButton(label.youtube, '#f00', () => window.open(url, '_blank', 'noopener'));
        caption.textContent = message;
        player.replaceChildren(overlay);
    };

    const playInline = (url) => {
        const video = make('video', 'position:absolute;inset:0;width:100%;height:100%;background:#000');
        Object.assign(video, { controls: true, playsInline: true, poster: thumb });
        player.replaceChildren(video);
        const { Hls } = globalThis;
        if (Hls?.isSupported()) {
            // hls.js: Firefox has no native HLS. High bandwidth estimate = start at top quality
            const hls = new Hls({ enableWorker: false, abrEwmaDefaultEstimate: 5e6 });
            let recovered = false;
            hls.on(Hls.Events.ERROR, (_, { fatal, type }) => {
                if (!fatal) return;
                if (type === Hls.ErrorTypes.MEDIA_ERROR && !recovered) {
                    recovered = true;
                    return hls.recoverMediaError();
                }
                hls.destroy();
                showYoutube(label.failed);
            });
            hls.loadSource(url);
            hls.attachMedia(video);
        } else {
            video.src = url; // native HLS
        }
        video.play().catch(() => {}); // autoplay may be blocked; controls remain
    };

    setButton(label.looking, '#555');
    replay.then((found) => {
        if (!found) return showYoutube(label.none);
        if (!thumb && found.poster) setThumb(found.poster); // pages without their own thumbnail
        setButton(label.play, '#2b72a5', () => playInline(found.url));
    });
})();
