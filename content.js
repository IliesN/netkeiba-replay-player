const videoContainer = document.querySelector('.VideoSampleThum');

if (videoContainer) {
    // Extract ID from URL
    const urlMatch = window.location.pathname.match(/\/db\/race\/(\d{12})/);
    
    if (urlMatch && urlMatch[1]) {
        const nkId = urlMatch[1];
        const year = parseInt(nkId.substring(0, 4));
        
        // Grab the existing thumbnail image URL before we clear the container
        const existingImg = videoContainer.querySelector('img');
        const thumbUrl = existingImg ? existingImg.src : '';
        
        videoContainer.innerHTML = '';
        
        if (year <= 2012) {
            // --- Pre-2013 replay YouTube redirection ---
            const raceNameElement = document.querySelector('.RaceName_main');
            const raceName = raceNameElement ? raceNameElement.innerText.trim() : "";
            
            const searchQuery = encodeURIComponent(`${year} ${raceName} JRA`);
            const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
            
            videoContainer.style.position = 'relative';
            videoContainer.style.backgroundImage = thumbUrl ? `url(${thumbUrl})` : 'none';
            videoContainer.style.backgroundSize = 'cover';
            videoContainer.style.backgroundPosition = 'center';
            videoContainer.style.borderRadius = '8px';
            videoContainer.style.overflow = 'hidden';

            videoContainer.innerHTML = `
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 1;"></div>
                <div style="position: relative; z-index: 2; width: 100%; aspect-ratio: 16/9; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="color: #fff; font-weight: bold; margin-bottom: 15px; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">Archive not available on JRA Web</div>
                    <button onclick="window.open('${youtubeSearchUrl}', '_blank')" style="padding: 10px 20px; background-color: #f00; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        🔍 Search on YouTube
                    </button>
                </div>
            `;
        } else {
            // ID Conversion
            const yearStr = nkId.substring(0, 4);     // YYYY
            const course = nkId.substring(4, 6);      // CC
            const meeting = nkId.substring(6, 8);     // KK
            const day = nkId.substring(8, 10);        // DD
            const raceNum = nkId.substring(10, 12);   // NN
            

            const jraId = `${yearStr}${meeting}${course}${day}${raceNum}`;
            
            // Player creation
            const fakePlayer = document.createElement('div');

            fakePlayer.style.width = "100%";
            fakePlayer.style.aspectRatio = "16 / 9";
            fakePlayer.style.backgroundImage = thumbUrl ? `url(${thumbUrl})` : 'none';
            fakePlayer.style.backgroundSize = "cover";
            fakePlayer.style.backgroundPosition = "center";
            fakePlayer.style.position = "relative";
            fakePlayer.style.display = "flex";
            fakePlayer.style.flexDirection = "column";
            fakePlayer.style.alignItems = "center";
            fakePlayer.style.justifyContent = "center";
            fakePlayer.style.borderRadius = "8px";
            fakePlayer.style.overflow = "hidden";
            fakePlayer.style.border = "1px solid #333";
            fakePlayer.style.boxShadow = "inset 0 0 50px rgba(0,0,0,0.8)";

            const overlay = document.createElement('div');

            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.backdropFilter = 'blur(4px)';
            overlay.style.zIndex = '1';

            const contentWrapper = document.createElement('div');

            contentWrapper.style.position = 'relative';
            contentWrapper.style.zIndex = '2';
            contentWrapper.style.display = 'flex';
            contentWrapper.style.flexDirection = 'column';
            contentWrapper.style.alignItems = 'center';

            const title = document.createElement('div');

            title.innerText = "Launch JRA Video";
            title.style.color = "#fff";
            title.style.fontWeight = "bold";
            title.style.fontFamily = "sans-serif";
            title.style.marginBottom = "20px";
            title.style.textShadow = "1px 1px 3px rgba(0,0,0,0.8)";
            
            function openJraPopup() {
                const url = `https://jra.jp/?jra_video=${jraId}`;
                window.open(url, "JRAPlayer", "width=854,height=480,backgroundColor=#000");
            }
            
            const btnPlay = document.createElement('button');
            
            btnPlay.innerText = "▶ Play Replay";
            btnPlay.onclick = openJraPopup;
            btnPlay.style.padding = "10px 20px";
            btnPlay.style.cursor = "pointer";
            btnPlay.style.backgroundColor = "#2b72a5";
            btnPlay.style.color = "white";
            btnPlay.style.border = "none";
            btnPlay.style.borderRadius = "5px";
            btnPlay.style.fontWeight = "bold";
            btnPlay.style.transition = "background-color 0.2s";
            btnPlay.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
            
            btnPlay.onmouseover = () => btnPlay.style.backgroundColor = "#1e527a";
            btnPlay.onmouseout = () => btnPlay.style.backgroundColor = "#2b72a5";
            
            contentWrapper.appendChild(title);
            contentWrapper.appendChild(btnPlay);
            
            fakePlayer.appendChild(overlay);
            fakePlayer.appendChild(contentWrapper);
            
            videoContainer.appendChild(fakePlayer);
        }
    }
}