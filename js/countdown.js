// ===== COUNTDOWN LOGIC =====

class CountdownTimer {
  constructor() {
    // Data target - AJUSTE AQUI PARA SUA DATA
    this.targetDate = new Date('2025-06-12T12:00:00-03:00'); // 12 de junho 2025, 00:00 (horário de Brasília)
    
    // Elementos DOM
    this.daysEl = document.getElementById('days');
    this.hoursEl = document.getElementById('hours');
    this.minutesEl = document.getElementById('minutes');
    this.secondsEl = document.getElementById('seconds');
    this.countdownScreen = document.getElementById('countdown-screen');
    this.mainSite = document.getElementById('main-site');
    this.loadingScreen = document.getElementById('loading');
    
    // Estado
    this.intervalId = null;
    this.isCountdownFinished = false;
    
    this.init();
  }
  
  init() {
    // Esconder loading e mostrar countdown após um delay pequeno
    setTimeout(() => {
      this.hideLoading();
      this.startCountdown();
    }, 1500);
  }
  
  hideLoading() {
    if (this.loadingScreen) {
      this.loadingScreen.style.opacity = '0';
      setTimeout(() => {
        this.loadingScreen.style.display = 'none';
      }, 500);
    }
  }
  
  startCountdown() {
    // Verificar se já passou da data
    if (this.isDatePassed()) {
      this.revealSite();
      return;
    }
    
    // Atualizar imediatamente
    this.updateCountdown();
    
    // Atualizar a cada segundo
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }
  
  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;
    
    // Se chegou na data
    if (distance < 0) {
      this.finishCountdown();
      return;
    }
    
    // Calcular tempo restante
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Atualizar DOM com animação
    this.updateTimeDisplay(this.daysEl, days);
    this.updateTimeDisplay(this.hoursEl, hours);
    this.updateTimeDisplay(this.minutesEl, minutes);
    this.updateTimeDisplay(this.secondsEl, seconds);
  }
  
  updateTimeDisplay(element, value) {
    if (!element) return;
    
    const formattedValue = value.toString().padStart(2, '0');
    
    // Só atualiza se o valor mudou
    if (element.textContent !== formattedValue) {
      // Pequena animação de mudança
      element.style.transform = 'scale(1.1)';
      element.style.color = 'var(--soft-pink-light)';
      
      setTimeout(() => {
        element.textContent = formattedValue;
        element.style.transform = 'scale(1)';
        element.style.color = 'var(--soft-pink)';
      }, 150);
    }
  }
  
  finishCountdown() {
    clearInterval(this.intervalId);
    this.isCountdownFinished = true;
    
    // Animação especial quando terminar
    this.celebrateAndReveal();
  }
  
  celebrateAndReveal() {
    // Efeito de celebração
    const heart = document.querySelector('.countdown-heart');
    if (heart) {
      heart.style.animation = 'heartbeat 0.3s ease-in-out 5';
      heart.style.transform = 'scale(1.5)';
      heart.style.filter = 'drop-shadow(0 0 30px rgba(232, 180, 184, 1))';
    }
    
    // Mostrar números zerados com efeito
    setTimeout(() => {
      this.updateTimeDisplay(this.daysEl, 0);
      this.updateTimeDisplay(this.hoursEl, 0);
      this.updateTimeDisplay(this.minutesEl, 0);
      this.updateTimeDisplay(this.secondsEl, 0);
      
      // Revelar o site após 2 segundos
      setTimeout(() => {
        this.revealSite();
      }, 2000);
    }, 500);
  }
  
  revealSite() {
    // Adicionar classe de fade out ao countdown
    if (this.countdownScreen) {
      this.countdownScreen.classList.add('fade-out');
      
      // Remover countdown e mostrar site principal
      setTimeout(() => {
        this.countdownScreen.style.display = 'none';
        if (this.mainSite) {
          this.mainSite.classList.remove('hidden');
          this.mainSite.style.opacity = '0';
          
          // Fade in do site principal
          setTimeout(() => {
            this.mainSite.style.transition = 'opacity 1s ease-in-out';
            this.mainSite.style.opacity = '1';
          }, 100);
        }
      }, 600);
    }
  }
  
  isDatePassed() {
    const now = new Date().getTime();
    return now >= this.targetDate.getTime();
  }
  
  // Método para debug - remover em produção
  skipCountdown() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.revealSite();
  }
  
  // Método para definir uma nova data (útil para testes)
  setTargetDate(dateString) {
    this.targetDate = new Date(dateString);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.startCountdown();
    }
  }
}

// ===== FUNÇÕES UTILITÁRIAS =====

// Função para testar com data próxima (para desenvolvimento)
function setTestDate(secondsFromNow = 10) {
  const testDate = new Date();
  testDate.setSeconds(testDate.getSeconds() + secondsFromNow);
  
  if (window.countdown) {
    window.countdown.setTargetDate(testDate.toISOString());
  }
  
  console.log(`Countdown definido para: ${testDate.toLocaleString()}`);
}

// Função para pular countdown (para desenvolvimento)
function skipToSite() {
  if (window.countdown) {
    window.countdown.skipCountdown();
  }
}

// ===== INICIALIZAÇÃO =====

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  // Criar instância global do countdown
  window.countdown = new CountdownTimer();
  
  // Funções de debug disponíveis no console (apenas desenvolvimento)
  window.setTestDate = setTestDate;
  window.skipToSite = skipToSite;
  
  console.log('🕐 Countdown iniciado!');
  console.log('Para testar: setTestDate(10) ou skipToSite()');
});