const params = new URLSearchParams(window.location.search);
const videoId = params.get('jra_video');
const era = parseInt(params.get('era') || '4');

// Pre-select the correct player flag based on the era passed by content.js
let isV2 = (era === 4); 

if (videoId) {
    const renderPage = () => {
        let iframeSrc = "";
        
        if (era === 2) {
            // ERA 2: Mid-era database (Dec 2012 - Dec 2017)
            const year = params.get('year');
            const mmdd = params.get('mmdd');
            iframeSrc = `https://web-cache.stream.ne.jp/web/jra/onetag2020/subwindow.html?movie=pc_seiseki/${year}/${mmdd}/${videoId}&type=2&thum=&id=2`;
        } else {
            // ERAS 3 & 4: Modern database (Post Dec 2017)
            // It will load eqPcPlayer.html directly if era is 3, skipping the V2 failure
            const playerFile = isV2 ? 'eqPcPlayer2.html' : 'eqPcPlayer.html';
            iframeSrc = `https://jra.webcdn.stream.ne.jp/web/jra/onetag2020/${playerFile}?target=${videoId}`;
        }
        
        document.documentElement.innerHTML = `
            <head>
                <title>JRA Video Player</title>
                <style>
                    body { margin: 0; background-color: #000; overflow: hidden; }
                    iframe { width: 100vw; height: 100vh; border: none; }
                </style>
            </head>
            <body>
                <iframe src="${iframeSrc}" allow="autoplay; fullscreen"></iframe>
            </body>
        `;
    };

    window.addEventListener('message', (event) => {
        if (event.data === 'JRA_P1001_ERROR' && isV2) {
            console.log("P1001 Error detected: Switching to V1 player fallback!");
            isV2 = false;
            renderPage();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderPage);
    } else {
        renderPage();
    }
}