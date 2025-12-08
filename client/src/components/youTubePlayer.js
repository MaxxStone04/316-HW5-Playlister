import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';

export default function YouTubePlayer({ videoId, playing, onPlay, onPause, onEnd }) {
    const playerRef = useRef(null);

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('youtube-player', {
                height: '360',
                width: '640',
                videoId: videoId,
                playerVars: {
                    'playsinline': 1
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [videoId]);

    const onPlayerReady = (event) => {
    };

    const onPlayerStateChange = (event) => {
        switch (event.data) {
            case window.YT.PlayerState.PLAYING:
                onPlay && onPlay();
                break;
            case window.YT.PlayerState.PAUSED:
                onPause && onPause();
                break;
            case window.YT.PlayerState.ENDED:
                onEnd && onEnd();
                break;
        }
    };

    const handlePlay = () => {
        if (playerRef.current) {
            playerRef.current.playVideo();
        }
    };

    const handlePause = () => {
        if (playerRef.current) {
            playerRef.current.pauseVideo();
        }
    };

    return (
        <Box>
            <div id="youtube-player"></div>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <button onClick={handlePlay}>Play</button>
                <button onClick={handlePause}>Pause</button>
            </Box>
        </Box>
    );
}