const videoContainer = document.querySelector('.VideoSampleThum');

if (videoContainer) {
    const urlMatch = window.location.pathname.match(/\/db\/race\/(\d{12})/);
    
    if (urlMatch && urlMatch[1]) {
        const nkId = urlMatch[1];
        
        // ID Parsing
        const yearStr = nkId.substring(0, 4);
        const course = nkId.substring(4, 6);
        const meeting = nkId.substring(6, 8);
        const day = nkId.substring(8, 10);
        const raceNum = nkId.substring(10, 12);
        const jraId = `${yearStr}${meeting}${course}${day}${raceNum}`;

        // Date Extraction from Meta Description
        const metaDesc = document.querySelector('meta[name="description"]');
        let raceDate = null;
        let mmdd = "";

        if (metaDesc) {
            const dateMatch = metaDesc.content.match(/^(\d{2})\s([A-Z]{3})\s(\d{4})/i);
            if (dateMatch) {
                const d = dateMatch[1];
                const monthStr = dateMatch[2].toUpperCase();
                const y = dateMatch[3];
                const months = {JAN:'01', FEB:'02', MAR:'03', APR:'04', MAY:'05', JUN:'06', JUL:'07', AUG:'08', SEP:'09', OCT:'10', NOV:'11', DEC:'12'};
                mmdd = `${months[monthStr]}${d}`;
                raceDate = new Date(`${y}-${months[monthStr]}-${d}`);
            }
        }

        const era1Cutoff = new Date('2012-12-08');
        const era2Cutoff = new Date('2017-12-03'); 
        const era3Cutoff = new Date('2022-09-10'); 
        
        let era = 4; 
        if (raceDate && raceDate < era1Cutoff) {
            era = 1; 
        } else if (raceDate && raceDate < era2Cutoff) {
            era = 2; 
        } else if (raceDate && raceDate < era3Cutoff) {
            era = 3; 
        }

        // UI Setup
        const existingImg = videoContainer.querySelector('img');
        const thumbUrl = existingImg ? existingImg.src : '';
        videoContainer.innerHTML = '';
        
        if (era === 1) {
            const raceNameElement = document.querySelector('.RaceName_main');
            const raceName = raceNameElement ? raceNameElement.innerText.trim() : "";
            const searchQuery = encodeURIComponent(`${yearStr} ${raceName} JRA`);
            const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
            
            videoContainer.style.position = 'relative';
            videoContainer.style.width = '100%';
            videoContainer.style.aspectRatio = '16 / 9'; // Forces the correct video dimensions
            videoContainer.style.backgroundImage = thumbUrl ? `url(${thumbUrl})` : 'none';
            videoContainer.style.backgroundSize = 'cover';
            videoContainer.style.backgroundPosition = 'center';
            videoContainer.style.borderRadius = '8px';
            videoContainer.style.overflow = 'hidden';

            videoContainer.innerHTML = `
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 1;"></div>
                <div style="position: relative; z-index: 2; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <button onclick="window.open('${youtubeSearchUrl}', '_blank')" style="padding: 10px 20px; background-color: #f00; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        🔍 Search on YouTube
                    </button>
                </div>
            `;
        } else {
            // --- ERAS 2, 3 & 4: JRA Players ---
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
            contentWrapper.style.width = '100%';
            contentWrapper.style.height = '100%';
            contentWrapper.style.display = 'flex';
            contentWrapper.style.alignItems = 'center';
            contentWrapper.style.justifyContent = 'center';

            function openJraPopup() {
                let url = `https://jra.jp/?jra_video=${jraId}&era=${era}`;
                if (era === 2) {
                    url += `&mmdd=${mmdd}&year=${yearStr}`;
                }
                
                const rect = fakePlayer.getBoundingClientRect();
                const width = Math.round(rect.width);
                const height = Math.round(rect.height);
                

                const left = Math.round(window.screenX + rect.left);
                const top = Math.round(window.screenY + (window.outerHeight - window.innerHeight) + rect.top);

                const windowFeatures = `width=${width},height=${height},left=${left},top=${top},backgroundColor=#000`;
                
                window.open(url, "JRAPlayer", windowFeatures);
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
            
            contentWrapper.appendChild(btnPlay);
            
            fakePlayer.appendChild(overlay);
            fakePlayer.appendChild(contentWrapper);
            
            videoContainer.appendChild(fakePlayer);
        }
    }
}