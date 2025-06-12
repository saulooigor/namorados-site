// ===== MUSIC PLAYER =====

class MusicPlayer {
  constructor() {
    // Elementos DOM
    this.audio = null;
    this.playBtn = document.getElementById('play-btn');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.songTitle = document.getElementById('song-title');
    this.songArtist = document.getElementById('song-artist');
    this.songCover = document.getElementById('song-cover');
    this.currentTime = document.getElementById('current-time');
    this.duration = document.getElementById('duration');
    this.progressBar = document.getElementById('progress-bar');
    this.progressFill = document.getElementById('progress-fill');
    this.progressHandle = document.getElementById('progress-handle');
    this.volumeBar = document.getElementById('volume-bar');
    this.volumeFill = document.getElementById('volume-fill');
    this.volumeHandle = document.getElementById('volume-handle');
    this.playlist = document.getElementById('playlist');
    this.vinylRecord = document.querySelector('.vinyl-record');
    
    // Estado do player
    this.currentSongIndex = 0;
    this.isPlaying = false;
    this.volume = 0.7;
    this.isDragging = false;
    this.isVolumeChanging = false;
    this.isInitialized = false;
    
    // SUAS MÚSICAS AQUI - Personalize!
    this.songs = [
      {
        title: "Somewhere Over the Rainbow",
        artist: "Israel Kamakawiwo'ole",
        src: "assets/music/gordao.mp3",
        cover: "assets/images/music/gordao.jpg",
        story: "Música romântica para chorar!!" 
      },
      {
        title: "Hoje é seu aniversário",
        artist: "Principe Ouro Negro",
        src: "assets/music/aniversario.mp3",
        cover: "assets/images/music/principe.jpeg",
        story: "Parabéééééns!!!"
      },
      {
        title: "Meu Lençol Dobrado",
        artist: "João Gustavo e Murilo",
        src: "assets/music/lencol.mp3",
        cover: "assets/images/music/lencol.jpg",
        story: "Meu lençoooool dobrado, música pós cantada"
      },
      {
        title: "Ombrin",
        artist: "Alguma coisa Sena",
        src: "assets/music/ombrin.mp3",
        cover: "assets/images/music/ombro.jpeg",
        story: "Aiiiiii que delícia o verão"
      },
      {
        title: "Eu me lembro",
        artist: "Clarice Falcão",
        src: "assets/music/iremember.mp3",
        cover: "assets/images/music/clarice.jpeg",
        story: "Música que me ensinou a gostar!"
      }
    ];
    
    // NÃO inicializar automaticamente - aguardar evento
  }
  
  init() {
    if (this.isInitialized) return;
    
    console.log('🎵 Inicializando music player...');
    
    // Verificar se elementos essenciais existem
    if (!this.playBtn || !this.songTitle) {
      console.error('❌ Elementos essenciais do music player não encontrados');
      return;
    }
    
    this.createAudioElement();
    this.renderPlaylist();
    this.setupEventListeners();
    this.loadSong(this.currentSongIndex);
    this.setVolume(this.volume);
    this.isInitialized = true;
    
    // Auto-play após alguns segundos (se o usuário interagiu com a página)
    setTimeout(() => {
      this.autoPlay();
    }, 3000);
    
    console.log('🎶 Music player inicializado!');
  }
  
  createAudioElement() {
    this.audio = new Audio();
    this.audio.volume = this.volume;
    this.audio.preload = 'metadata';
    
    // Event listeners do áudio
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.nextSong());
    this.audio.addEventListener('canplay', () => this.updatePlayButton());
    this.audio.addEventListener('loadstart', () => this.showLoading());
    this.audio.addEventListener('canplaythrough', () => this.hideLoading());
    this.audio.addEventListener('error', (e) => this.handleError(e));
  }
  
  setupEventListeners() {
    // Botões de controle
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }
    
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSong());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSong());
    }
    
    // Barra de progresso
    this.setupProgressBar();
    
    // Controle de volume
    this.setupVolumeControl();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }
  
  setupProgressBar() {
    if (!this.progressBar) return;
    
    this.progressBar.addEventListener('click', (e) => this.seekTo(e));
    
    if (this.progressHandle) {
      this.progressHandle.addEventListener('mousedown', (e) => this.startDragging(e));
    }
    
    document.addEventListener('mousemove', (e) => this.handleDragging(e));
    document.addEventListener('mouseup', () => this.stopDragging());
  }
  
  setupVolumeControl() {
    if (!this.volumeBar) return;
    
    this.volumeBar.addEventListener('click', (e) => this.changeVolume(e));
    
    if (this.volumeHandle) {
      this.volumeHandle.addEventListener('mousedown', (e) => this.startVolumeChange(e));
    }
    
    document.addEventListener('mousemove', (e) => this.handleVolumeChange(e));
    document.addEventListener('mouseup', () => this.stopVolumeChange());
  }
  
  renderPlaylist() {
    if (!this.playlist) return;
    
    this.playlist.innerHTML = '';
    
    this.songs.forEach((song, index) => {
      const item = document.createElement('div');
      item.className = 'playlist-item';
      item.dataset.index = index;
      
      item.innerHTML = `
        <div class="playlist-number">${(index + 1).toString().padStart(2, '0')}</div>
        <div class="playlist-info">
          <div class="playlist-song">${song.title}</div>
          <div class="playlist-artist">${song.artist} • ${song.story}</div>
        </div>
        <div class="playlist-duration">--:--</div>
      `;
      
      item.addEventListener('click', () => this.playSong(index));
      this.playlist.appendChild(item);
    });
  }
  
  loadSong(index) {
    if (!this.songs[index] || !this.audio) return;
    
    const song = this.songs[index];
    this.currentSongIndex = index;
    
    // Atualizar informações da música
    if (this.songTitle) this.songTitle.textContent = song.title;
    if (this.songArtist) this.songArtist.textContent = `${song.artist} • ${song.story}`;
    
    // Atualizar capa (com fallback)
    if (this.songCover) {
      this.songCover.src = song.cover;
      this.songCover.onerror = () => {
        this.songCover.src = 'assets/images/music/default-cover.jpg';
      };
    }
    
    // Carregar áudio
    this.audio.src = song.src;
    this.audio.load();
    
    // Atualizar playlist visual
    this.updatePlaylistActive();
    
    console.log(`🎵 Carregando: ${song.title} - ${song.artist}`);
  }
  
  playSong(index) {
    this.loadSong(index);
    this.play();
  }
  
  play() {
    if (!this.audio) return;
    
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updatePlayButton();
      this.updateVinyl();
      this.vibrate([50]);
    }).catch((error) => {
      console.error('Erro ao reproduzir:', error);
      this.handlePlayError();
    });
  }
  
  pause() {
    if (!this.audio) return;
    
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton();
    this.updateVinyl();
  }
  
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  
  nextSong() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    this.playSong(this.currentSongIndex);
  }
  
  prevSong() {
    this.currentSongIndex = this.currentSongIndex === 0 ? 
      this.songs.length - 1 : this.currentSongIndex - 1;
    this.playSong(this.currentSongIndex);
  }
  
  autoPlay() {
    // Tentar auto-play (pode falhar devido a políticas do navegador)
    const playPromise = this.play();
    if (playPromise) {
      playPromise.catch(() => {
        console.log('🎵 Auto-play bloqueado - aguardando interação do usuário');
        this.showPlayPrompt();
      });
    }
  }
  
  // Atualizar interface
  updatePlayButton() {
    if (!this.playBtn) return;
    
    this.playBtn.innerHTML = this.isPlaying ? '⏸️' : '▶️';
    this.playBtn.title = this.isPlaying ? 'Pausar' : 'Reproduzir';
  }
  
  updateVinyl() {
    if (!this.vinylRecord) return;
    
    this.vinylRecord.className = `vinyl-record ${this.isPlaying ? 'playing' : 'paused'}`;
  }
  
  updateDuration() {
    if (!this.audio || !this.duration) return;
    
    const duration = this.formatTime(this.audio.duration);
    this.duration.textContent = duration;
    
    // Atualizar duração na playlist
    const playlistItem = this.playlist?.children[this.currentSongIndex];
    if (playlistItem) {
      const durationEl = playlistItem.querySelector('.playlist-duration');
      if (durationEl) durationEl.textContent = duration;
    }
  }
  
  updateProgress() {
    if (!this.audio || this.isDragging) return;
    
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    
    if (this.progressFill) {
      this.progressFill.style.width = `${progress}%`;
    }
    
    if (this.currentTime) {
      this.currentTime.textContent = this.formatTime(this.audio.currentTime);
    }
  }
  
  updatePlaylistActive() {
    if (!this.playlist) return;
    
    // Remover active de todos
    [...this.playlist.children].forEach(item => {
      item.classList.remove('active', 'playing');
    });
    
    // Adicionar active ao atual
    const activeItem = this.playlist.children[this.currentSongIndex];
    if (activeItem) {
      activeItem.classList.add('active');
      if (this.isPlaying) {
        activeItem.classList.add('playing');
      }
    }
  }
  
  // Controles de progresso
  seekTo(e) {
    if (!this.audio || !this.progressBar) return;
    
    const rect = this.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * this.audio.duration;
    
    this.audio.currentTime = seekTime;
  }
  
  startDragging(e) {
    this.isDragging = true;
    e.preventDefault();
  }
  
  handleDragging(e) {
    if (!this.isDragging || !this.progressBar) return;
    
    const rect = this.progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    if (this.progressFill) {
      this.progressFill.style.width = `${percent * 100}%`;
    }
  }
  
  stopDragging() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    const percent = parseFloat(this.progressFill.style.width) / 100;
    this.audio.currentTime = percent * this.audio.duration;
  }
  
  // Controles de volume
  changeVolume(e) {
    if (!this.volumeBar) return;
    
    const rect = this.volumeBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.setVolume(percent);
  }
  
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    
    if (this.volumeFill) {
      this.volumeFill.style.width = `${this.volume * 100}%`;
    }
    
    if (this.volumeHandle) {
      this.volumeHandle.style.right = `${(1 - this.volume) * 100}%`;
    }
  }
  
  // Utility methods
  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  handleKeyboard(e) {
    if (e.target.tagName.toLowerCase() === 'input') return;
    
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowLeft':
        this.prevSong();
        break;
      case 'ArrowRight':
        this.nextSong();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.setVolume(this.volume + 0.1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.setVolume(this.volume - 0.1);
        break;
    }
  }
  
  showLoading() {
    // Implementar indicador de loading se necessário
  }
  
  hideLoading() {
    // Remover indicador de loading se necessário
  }
  
  showPlayPrompt() {
    if (this.playBtn) {
      this.playBtn.style.animation = 'pulse 1s ease-in-out infinite';
    }
  }
  
  handleError(e) {
    console.error('Erro no áudio:', e);
    // Tentar próxima música se houver erro
    setTimeout(() => this.nextSong(), 1000);
  }
  
  handlePlayError() {
    console.log('🎵 Reprodução bloqueada - aguardando interação');
  }
  
  vibrate(pattern = [100]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
  
  // Métodos públicos
  getCurrentSong() {
    return this.songs[this.currentSongIndex];
  }
  
  getPlaylist() {
    return this.songs;
  }
  
  isCurrentlyPlaying() {
    return this.isPlaying;
  }
}

// ===== INICIALIZAÇÃO SEGURA =====

// Função para verificar se elementos estão prontos
function checkMusicElementsReady() {
  const mainSite = document.getElementById('main-site');
  const playBtn = document.getElementById('play-btn');
  const songTitle = document.getElementById('song-title');
  
  return mainSite && 
         !mainSite.classList.contains('hidden') && 
         getComputedStyle(mainSite).opacity !== '0' && 
         playBtn && 
         songTitle;
}

// Função para inicializar music player
function initializeMusicPlayer() {
  if (window.musicPlayer) {
    console.log('⚠️ Music Player já inicializado');
    return;
  }
  
  if (!checkMusicElementsReady()) {
    console.log('❌ Elementos não estão prontos para music player');
    return;
  }
  
  console.log('✅ Inicializando music player...');
  window.musicPlayer = new MusicPlayer();
  window.musicPlayer.init();
}

// ===== EVENT LISTENERS =====

// Escutar evento do countdown
document.addEventListener('siteReady', (e) => {
  console.log('🎉 Site pronto detectado! Inicializando music player...');
  
  // Delay maior para music player (aguardar typewriter primeiro)
  setTimeout(() => {
    initializeMusicPlayer();
  }, 1500);
});

// Fallback para desenvolvimento/debug
document.addEventListener('DOMContentLoaded', () => {
  // Aguardar mais tempo para music player
  setTimeout(() => {
    if (checkMusicElementsReady()) {
      console.log('🔄 Fallback: Site já está pronto, inicializando music player...');
      initializeMusicPlayer();
    }
  }, 5000);
});

// Função de emergência para forçar inicialização
window.forceInitMusicPlayer = function() {
  console.log('🚨 Forçando inicialização do music player...');
  window.musicPlayer = new MusicPlayer();
  window.musicPlayer.init();
};

// Exportar para uso global
window.MusicPlayer = MusicPlayer;