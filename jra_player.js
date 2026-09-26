const params = new URLSearchParams(window.location.search);
const videoId = params.get('jra_video');
let isV2 = true;

if (videoId) {
    const renderPage = () => {
        const playerFile = isV2 ? 'eqPcPlayer2.html' : 'eqPcPlayer.html';
        
        document.documentElement.innerHTML = `
            <head>
                <title>JRA Video Player</title>
                <style>
                    body { margin: 0; background-color: #000; overflow: hidden; }
                    iframe { width: 100vw; height: 100vh; border: none; }
                </style>
            </head>
            <body>
                <iframe src="https://jra.webcdn.stream.ne.jp/web/jra/onetag2020/${playerFile}?target=${videoId}" allow="autoplay; fullscreen"></iframe>
            </body>
        `;
    };

    window.addEventListener('message', (event) => {
        if (event.data === 'JRA_P1001_ERROR' && isV2) {
            console.log("P1001 Error detected: Automatically switching to V1 player!");
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