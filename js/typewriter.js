// ===== TYPEWRITER EFFECT FOR LOVE LETTER =====

class TypewriterLetter {
  constructor() {
    this.letterElement = document.getElementById('love-letter');
    this.cursorElement = document.getElementById('cursor');
    this.dateElement = document.getElementById('letter-date');
    this.replayBtn = document.getElementById('replay-letter');
    this.pauseBtn = document.getElementById('pause-letter');
    this.declarationContent = document.querySelector('.declaration-content');
    
    // Estado
    this.isTyping = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.typingSpeed = 50; // Velocidade em ms
    this.pauseAfterParagraph = 800; // Pausa entre parágrafos
    this.isInitialized = false;
    
    // SUA CARTA AQUI - PERSONALIZE!
    this.letterText = `Meu amor,
    Sei que neste dia talvez você esperasse mais de mim, e sei o quanto é importante para você que eu me declare pra você publicamente.
    O meu perfil do instagram talvez não seja tão acessível, e aqui é pra sempre, é pra mim, pra você e para nossa história.
    Aqui escreveremos a nossa história, para nossos filhos, netos e bisnetos lerem e se emocionarem com o nosso amor.
    
    Eu sei que boa parte das fotos estão faltando, mas essa função de fotografia não é minha especialidade, e eu sei que você vai me ajudar a completar essa parte.
    O importante é que vivi todos estes momentos e fui feliz, e o que queria representar com algo digital é que o mais importante é o que
    foi vivido no físico.
    
    Eu quero declarar a todos que estarão aqui, que te amo e que sou muito feliz ao seu lado, e sei que nossos filhos ficaram felizes em ver
    o quanto nos amamos e o quanto somos felizes juntos.
    
    Nossa história continuará sendo escrita, e esse site existirá enquanto existirmos, para que possamos sempre relembrar e escrever algo para nossos filhos.
    
    Este é meu compromisso com você, e com nossa história.

    Nós morreremos, mas isto ficará para sempre!

    Feliz dia dos namorados, e esta é nossa carta de amor, que espero que você goste.
    Com todo meu amor,

    A + B 4ever! 💞
    Te amo, esporida! 💖`;
    
    // NÃO inicializar automaticamente - aguardar evento
  }
  
  init() {
    if (!this.letterElement || this.isInitialized) return;
    
    this.setupDate();
    this.setupEventListeners();
    this.observeSection();
    this.isInitialized = true;
    
    console.log('💌 Carta de amor carregada!');
  }
  
  setupDate() {
    if (this.dateElement) {
      const today = new Date();
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'America/Sao_Paulo'
      };
      const dateString = today.toLocaleDateString('pt-BR', options);
      this.dateElement.textContent = dateString;
    }
  }
  
  setupEventListeners() {
    if (this.replayBtn) {
      this.replayBtn.addEventListener('click', () => this.replayLetter());
    }
    
    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => this.togglePause());
    }
  }
  
  observeSection() {
    const declarationSection = document.getElementById('declaration');
    if (!declarationSection) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isTyping && this.currentIndex === 0) {
          // Pequeno delay antes de começar a escrever
          setTimeout(() => {
            this.startTyping();
          }, 500);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(declarationSection);
  }
  
  startTyping() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    this.currentIndex = 0;
    this.letterElement.textContent = '';
    
    // Adicionar classe de escrita
    if (this.declarationContent) {
      this.declarationContent.classList.add('writing');
    }
    
    // Atualizar botões
    this.updateButtons();
    
    // Iniciar efeito
    this.typeNextCharacter();
    
    // Vibração sutil no mobile
    this.vibrate([50]);
  }
  
  typeNextCharacter() {
    if (!this.isTyping || this.isPaused) return;
    
    if (this.currentIndex < this.letterText.length) {
      const char = this.letterText[this.currentIndex];
      this.letterElement.textContent += char;
      this.currentIndex++;
      
      // Scroll suave para acompanhar o texto
      this.scrollToBottom();
      
      // Velocidade variável baseada no caractere
      let speed = this.typingSpeed;
      
      if (char === '.' || char === '!' || char === '?') {
        speed = this.typingSpeed * 3; // Pausa após pontuação
      } else if (char === ',') {
        speed = this.typingSpeed * 1.5; // Pausa menor após vírgula
      } else if (char === '\n') {
        speed = this.pauseAfterParagraph; // Pausa entre parágrafos
      }
      
      // Continuar digitando
      setTimeout(() => this.typeNextCharacter(), speed);
      
    } else {
      // Terminou de digitar
      this.finishTyping();
    }
  }
  
  finishTyping() {
    this.isTyping = false;
    this.isPaused = false;
    
    // Remover classe de escrita
    if (this.declarationContent) {
      this.declarationContent.classList.remove('writing');
      this.declarationContent.classList.add('typewriter-finished');
    }
    
    // Esconder cursor
    if (this.cursorElement) {
      this.cursorElement.style.display = 'none';
    }
    
    // Atualizar botões
    this.updateButtons();
    
    // Efeito especial ao terminar
    this.celebrateFinish();
    
    console.log('💌 Carta finalizada!');
  }
  
  replayLetter() {
    this.resetLetter();
    this.startTyping();
  }
  
  resetLetter() {
    this.isTyping = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.letterElement.textContent = '';
    
    // Remover classes
    if (this.declarationContent) {
      this.declarationContent.classList.remove('writing', 'typewriter-finished', 'typewriter-paused');
    }
    
    // Mostrar cursor
    if (this.cursorElement) {
      this.cursorElement.style.display = 'inline-block';
    }
    
    this.updateButtons();
  }
  
  togglePause() {
    if (!this.isTyping) return;
    
    this.isPaused = !this.isPaused;
    
    if (this.declarationContent) {
      this.declarationContent.classList.toggle('typewriter-paused', this.isPaused);
    }
    
    if (!this.isPaused) {
      this.typeNextCharacter();
    }
    
    this.updateButtons();
    this.vibrate([30]);
  }
  
  updateButtons() {
    if (this.replayBtn) {
      this.replayBtn.disabled = this.isTyping;
    }
    
    if (this.pauseBtn) {
      if (this.isTyping) {
        this.pauseBtn.disabled = false;
        this.pauseBtn.innerHTML = this.isPaused ? 
          '<span>▶️</span> Continuar' : 
          '<span>⏸️</span> Pausar';
      } else {
        this.pauseBtn.disabled = true;
        this.pauseBtn.innerHTML = '<span>⏸️</span> Pausar';
      }
    }
  }
  
  scrollToBottom() {
    // Scroll suave para acompanhar o texto
    if (this.letterElement) {
      const container = this.letterElement.closest('.declaration-content');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }
  
  celebrateFinish() {
    // Efeito de brilho
    if (this.declarationContent) {
      const glow = document.createElement('div');
      glow.className = 'letter-glow';
      this.declarationContent.appendChild(glow);
      
      setTimeout(() => {
        glow.remove();
      }, 4000);
    }
    
    // Vibração de celebração
    this.vibrate([100, 50, 100, 50, 200]);
  }
  
  // Utility methods
  vibrate(pattern = [100]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
  
  // Métodos públicos
  setTypingSpeed(speed) {
    this.typingSpeed = speed;
  }
  
  setLetterText(text) {
    this.letterText = text;
  }
  
  getCurrentProgress() {
    return {
      currentIndex: this.currentIndex,
      totalLength: this.letterText.length,
      percentage: Math.round((this.currentIndex / this.letterText.length) * 100),
      isTyping: this.isTyping,
      isPaused: this.isPaused
    };
  }
}

// ===== INICIALIZAÇÃO SEGURA =====

// Função para verificar se elementos estão prontos
function checkElementsReady() {
  const mainSite = document.getElementById('main-site');
  const letterElement = document.getElementById('love-letter');
  
  return mainSite && 
         !mainSite.classList.contains('hidden') && 
         getComputedStyle(mainSite).opacity !== '0' && 
         letterElement;
}

// Função para inicializar typewriter
function initializeTypewriter() {
  if (window.typewriterLetter) {
    console.log('⚠️ Typewriter já inicializado');
    return;
  }
  
  if (!checkElementsReady()) {
    console.log('❌ Elementos não estão prontos para typewriter');
    return;
  }
  
  console.log('✅ Inicializando typewriter...');
  window.typewriterLetter = new TypewriterLetter();
  window.typewriterLetter.init();
}

// ===== EVENT LISTENERS =====

// Escutar evento do countdown
document.addEventListener('siteReady', (e) => {
  console.log('🎉 Site pronto detectado! Inicializando typewriter...');
  
  // Pequeno delay para garantir que tudo está renderizado
  setTimeout(() => {
    initializeTypewriter();
  }, 500);
});

// Fallback para desenvolvimento/debug
document.addEventListener('DOMContentLoaded', () => {
  // Aguardar um pouco antes de verificar
  setTimeout(() => {
    if (checkElementsReady()) {
      console.log('🔄 Fallback: Site já está pronto, inicializando typewriter...');
      initializeTypewriter();
    }
  }, 3000);
});

// Função de emergência para forçar inicialização
window.forceInitTypewriter = function() {
  console.log('🚨 Forçando inicialização do typewriter...');
  window.typewriterLetter = new TypewriterLetter();
  window.typewriterLetter.init();
};

// Exportar para uso global
window.TypewriterLetter = TypewriterLetter;