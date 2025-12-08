import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

export default function YouTubePlayer({ videoId, playing, onPlay, onPause, onEnd, autoPlayNext }) {
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(playing || false);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const playerRef = useRef(null);

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            window.onYouTubeIframeAPIReady = () => {
                createPlayer();
            };
        } else {
            createPlayer();
        }

        return () => {
            if (player) {
                player.destroy();
            }
        };
    }, [videoId]);

    const createPlayer = () => {
        if (!videoId || !window.YT) return;
        
        const newPlayer = new window.YT.Player(`youtube-player-${videoId}`, {
            height: '360',
            width: '640',
            videoId: videoId,
            playerVars: {
                autoplay: isPlaying ? 1 : 0,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0
            },
            events: {
                onReady: (event) => {
                    setPlayer(event.target);
                    if (isPlaying) {
                        event.target.playVideo();
                    }
                },
                onStateChange: (event) => {
                    switch (event.data) {
                        case window.YT.PlayerState.PLAYING:
                            setIsPlaying(true);
                            onPlay && onPlay();
                            break;
                        case window.YT.PlayerState.PAUSED:
                            setIsPlaying(false);
                            onPause && onPause();
                            break;
                        case window.YT.PlayerState.ENDED:
                            setIsPlaying(false);
                            onEnd && onEnd();
                            if (autoPlayNext) {
                                autoPlayNext();
                            }
                            break;
                    }
                }
            }
        });
    };

    const handlePlay = () => {
        if (player) {
            player.playVideo();
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        if (player) {
            player.pauseVideo();
            setIsPlaying(false);
        }
    };

    const handleToggleMute = () => {
        if (player) {
            if (isMuted) {
                player.unMute();
            } else {
                player.mute();
            }
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (event) => {
        const newVolume = parseInt(event.target.value);
        setVolume(newVolume);
        if (player) {
            player.setVolume(newVolume);
            if (newVolume === 0) {
                setIsMuted(true);
            } else if (isMuted) {
                setIsMuted(false);
            }
        }
    };

    const extractYouTubeId = (url) => {
        if (!url) return null;
        
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([A-Za-z0-9_-]{11})$/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    };

    const actualVideoId = extractYouTubeId(videoId) || videoId;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {actualVideoId ? (
                <>
                    <div id={`youtube-player-${actualVideoId}`}></div>
                    
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={handlePlay} disabled={isPlaying}>
                            <PlayArrowIcon />
                        </IconButton>
                        <IconButton onClick={handlePause} disabled={!isPlaying}>
                            <PauseIcon />
                        </IconButton>
                        <IconButton onClick={handleToggleMute}>
                            {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
                        </IconButton>
                        
                        <Box sx={{ width: 100 }}>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={handleVolumeChange}
                                style={{ width: '100%' }}
                            />
                        </Box>
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        YouTube ID: {actualVideoId}
                    </Typography>
                </>
            ) : (
                <Box sx={{ 
                    width: 640, 
                    height: 360, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'grey.900',
                    color: 'white',
                    borderRadius: 1
                }}>
                    <Typography variant="h6">No video selected</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Enter a valid YouTube ID or URL
                    </Typography>
                </Box>
            )}
        </Box>
    );
}