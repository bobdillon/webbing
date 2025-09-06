// Retro Music Player - Dave's Workshop Vibes
class RetroMusicPlayer {
    constructor() {
        // David's curated playlist of awesome tunes
        this.playlist = [
            { id: "jfKfPfyJRdk", title: "🎮 Lofi Hip Hop Radio - beats to relax/study to" },
            { id: "5qap5aO4i9A", title: "🔧 Chillhop Essentials - beats for working" },
            { id: "DWcJFNfaw9c", title: "🕹️ Synthwave Radio - retro vibes" },
            { id: "n61ULEU7CO0", title: "⚡ Electronic Gems & JazzHop" },
            { id: "rUxyKA_-grg", title: "🎵 Morning Coffee Jazz - mellow vibes" },
            { id: "MVPTGNGiI-4", title: "🔨 Focus Flow - concentration music" },
            { id: "c_27dHlxKAw", title: "🎸 Acoustic Study Session" },
            { id: "36YnV9STBqc", title: "🌊 Lofi Girl - midnight vibes" }
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;
        this.isMuted = false;
        this.volume = 50; // Start at 50% volume
        this.player = null;
        this.isPlayerReady = false;
        
        // Initialize when YouTube API is ready
        this.initializePlayer();
        
        // Update UI
        this.updateTrackInfo();
    }
    
    async initializePlayer() {
        // Wait for YouTube API to be ready
        if (typeof YT === 'undefined' || !YT.Player) {
            setTimeout(() => this.initializePlayer(), 100);
            return;
        }
        
        this.player = new YT.Player('youtube-player', {
            height: '1',
            width: '1',
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'disablekb': 1,
                'enablejsapi': 1,
                'modestbranding': 1,
                'playsinline': 1,
                'rel': 0
            },
            events: {
                'onReady': (event) => this.onPlayerReady(event),
                'onStateChange': (event) => this.onPlayerStateChange(event),
                'onError': (event) => this.onPlayerError(event)
            }
        });
    }
    
    onPlayerReady(event) {
        console.log('🎵 Music Player Ready!');
        this.isPlayerReady = true;
        this.loadCurrentTrack();
        
        // Try multiple autoplay strategies
        this.attemptAutoplay();
    }
    
    attemptAutoplay() {
        console.log('🎵 Attempting autoplay...');
        
        // Strategy 1: Immediate play
        setTimeout(() => {
            this.play();
            console.log('🎵 Tried immediate play');
        }, 500);
        
        // Strategy 2: User interaction fallback
        this.addUserInteractionListener();
        
        // Strategy 3: Periodic retry
        let retryCount = 0;
        const retryInterval = setInterval(() => {
            if (!this.isPlaying && retryCount < 5) {
                console.log(`🎵 Retry attempt ${retryCount + 1}`);
                this.play();
                retryCount++;
            } else {
                clearInterval(retryInterval);
            }
        }, 2000);
    }
    
    addUserInteractionListener() {
        let hasStarted = false;
        
        const startMusic = (event) => {
            if (!hasStarted && !this.isPlaying) {
                hasStarted = true;
                console.log('🎵 User interaction detected, starting music...');
                
                // Force play the current track
                this.play();
                
                // If that doesn't work, try loading and playing again
                setTimeout(() => {
                    if (!this.isPlaying) {
                        console.log('🎵 Retrying with fresh load...');
                        this.loadCurrentTrack();
                        setTimeout(() => this.play(), 1000);
                    }
                }, 1000);
                
                // Remove all listeners
                document.removeEventListener('click', startMusic);
                document.removeEventListener('scroll', startMusic);
                document.removeEventListener('keydown', startMusic);
                document.removeEventListener('touchstart', startMusic);
                document.removeEventListener('mousedown', startMusic);
            }
        };
        
        // Add multiple interaction types
        document.addEventListener('click', startMusic);
        document.addEventListener('scroll', startMusic);
        document.addEventListener('keydown', startMusic);
        document.addEventListener('touchstart', startMusic);
        document.addEventListener('mousedown', startMusic);
        
        // Show message after delay
        setTimeout(() => {
            if (!this.isPlaying) {
                this.updateNowPlaying("🎵 Click or scroll to start the music! 🎵");
            }
        }, 3000);
    }
    
    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            this.nextTrack();
        } else if (event.data === YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            this.updatePlayPauseButton();
            this.startEqualizer();
        } else if (event.data === YT.PlayerState.PAUSED) {
            this.isPlaying = false;
            this.updatePlayPauseButton();
            this.stopEqualizer();
        }
    }
    
    onPlayerError(event) {
        console.log('🚫 Player error, skipping to next track:', event.data);
        this.nextTrack();
    }
    
    loadCurrentTrack() {
        if (!this.isPlayerReady || !this.player) return;
        
        const track = this.playlist[this.currentTrack];
        this.player.loadVideoById(track.id);
        this.updateNowPlaying(track.title);
        this.updateTrackInfo();
    }
    
    play() {
        if (this.isPlayerReady && this.player) {
            this.player.playVideo();
        }
    }
    
    pause() {
        if (this.isPlayerReady && this.player) {
            this.player.pauseVideo();
        }
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadCurrentTrack();
        if (this.isPlaying) {
            setTimeout(() => this.play(), 500);
        }
    }
    
    previousTrack() {
        this.currentTrack = this.currentTrack === 0 ? 
            this.playlist.length - 1 : this.currentTrack - 1;
        this.loadCurrentTrack();
        if (this.isPlaying) {
            setTimeout(() => this.play(), 500);
        }
    }
    
    toggleMute() {
        if (!this.isPlayerReady || !this.player) return;
        
        if (this.isMuted) {
            this.player.unMute();
            this.isMuted = false;
            this.updateVolumeIcon();
        } else {
            this.player.mute();
            this.isMuted = true;
            this.updateVolumeIcon();
        }
    }
    
    volumeUp() {
        if (!this.isPlayerReady || !this.player) return;
        
        this.volume = Math.min(100, this.volume + 10); // Increase by 10, max 100
        this.player.setVolume(this.volume);
        
        // Unmute if it was muted
        if (this.isMuted) {
            this.player.unMute();
            this.isMuted = false;
        }
        
        this.updateVolumeIcon();
        console.log(`🔊 Volume: ${this.volume}%`);
    }
    
    volumeDown() {
        if (!this.isPlayerReady || !this.player) return;
        
        this.volume = Math.max(0, this.volume - 10); // Decrease by 10, min 0
        this.player.setVolume(this.volume);
        
        // Auto-mute if volume reaches 0
        if (this.volume === 0) {
            this.isMuted = true;
        } else if (this.isMuted) {
            this.player.unMute();
            this.isMuted = false;
        }
        
        this.updateVolumeIcon();
        console.log(`🔉 Volume: ${this.volume}%`);
    }
    
    updateVolumeIcon() {
        const volumeIcon = document.getElementById('volume-icon');
        if (!volumeIcon) return;
        
        if (this.isMuted || this.volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (this.volume < 30) {
            volumeIcon.textContent = '🔈';
        } else if (this.volume < 70) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '�';
        }
    }
    
    updateNowPlaying(title) {
        const marquee = document.getElementById('song-title');
        if (marquee) {
            marquee.textContent = `♪ ${title} ♪`;
        }
    }
    
    updateTrackInfo() {
        const counter = document.getElementById('track-counter');
        if (counter) {
            counter.textContent = `${this.currentTrack + 1} / ${this.playlist.length}`;
        }
    }
    
    updatePlayPauseButton() {
        const btn = document.getElementById('play-pause-btn');
        if (btn) {
            btn.textContent = this.isPlaying ? '⏸️' : '▶️';
        }
    }
    
    startEqualizer() {
        const bars = document.querySelectorAll('.eq-bar');
        bars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
    }
    
    stopEqualizer() {
        const bars = document.querySelectorAll('.eq-bar');
        bars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    }
}

// Global functions for HTML onclick events
function togglePlayer() {
    const player = document.getElementById('retro-music-player');
    player.classList.toggle('minimized');
    
    const btn = document.querySelector('.minimize-btn');
    btn.textContent = player.classList.contains('minimized') ? '+' : '−';
}

// Initialize when YouTube API loads
function onYouTubeIframeAPIReady() {
    console.log('🎵 YouTube API Ready - Initializing Music Player');
    window.musicPlayer = new RetroMusicPlayer();
}

// Fallback initialization if API is already loaded
if (typeof YT !== 'undefined' && YT.Player) {
    onYouTubeIframeAPIReady();
}
