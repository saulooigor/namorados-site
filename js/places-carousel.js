// ===== PLACES CAROUSEL =====

class PlacesCarousel {
  constructor() {
    this.carousel = document.querySelector('.places-carousel');
    this.cards = document.querySelectorAll('.place-card');
    this.prevBtn = document.getElementById('places-prev');
    this.nextBtn = document.getElementById('places-next');
    this.indicators = document.querySelectorAll('.carousel-indicators .indicator');
    
    this.currentSlide = 0;
    this.totalSlides = this.cards.length;
    this.isAnimating = false;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5 segundos
    
    this.init();
  }
  
  init() {
    if (!this.carousel || this.totalSlides === 0) return;
    
    this.setupEventListeners();
    this.updateCarousel();
    this.startAutoPlay();
    
    // Parar autoplay quando user interage
    this.setupAutoPlayControls();
    
    console.log('🎠 Carousel de lugares inicializado!');
  }
  
  setupEventListeners() {
    // Botões de navegação
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Touch/swipe support
    this.setupTouchEvents();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isInViewport(this.carousel)) {
        if (e.key === 'ArrowLeft') this.prevSlide();
        if (e.key === 'ArrowRight') this.nextSlide();
      }
    });
  }
  
  setupTouchEvents() {
    let startX = 0;
    let isDragging = false;
    
    this.carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.pauseAutoPlay();
    }, { passive: true });
    
    this.carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    }, { passive: false });
    
    this.carousel.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      // Mínimo de 50px para considerar swipe
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      
      isDragging = false;
      this.resumeAutoPlay();
    }, { passive: true });
  }
  
  setupAutoPlayControls() {
    const carouselContainer = document.querySelector('.places-carousel-container');
    
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
      carouselContainer.addEventListener('mouseleave', () => this.resumeAutoPlay());
    }
  }
  
  nextSlide() {
    if (this.isAnimating) return;
    
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
  }
  
  prevSlide() {
    if (this.isAnimating) return;
    
    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.updateCarousel();
  }
  
  goToSlide(index) {
    if (this.isAnimating || index === this.currentSlide) return;
    
    this.currentSlide = index;
    this.updateCarousel();
    this.resetAutoPlay();
  }
  
  updateCarousel() {
    this.isAnimating = true;
    
    // Atualizar transform do carousel
    const translateX = -this.currentSlide * 100;
    this.carousel.style.transform = `translateX(${translateX}%)`;
    
    // Atualizar classes dos cards
    this.cards.forEach((card, index) => {
      card.classList.toggle('active', index === this.currentSlide);
    });
    
    // Atualizar indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });
    
    // Vibração sutil no mobile
    if (this.isMobile()) {
      this.vibrate([30]);
    }
    
    // Reset animation flag após transição
    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
    
    // Trigger evento customizado
    this.emitSlideChange();
  }
  
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }
  
  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  resumeAutoPlay() {
    if (!this.autoPlayInterval) {
      this.startAutoPlay();
    }
  }
  
  resetAutoPlay() {
    this.pauseAutoPlay();
    this.resumeAutoPlay();
  }
  
  // Utility methods
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  isMobile() {
    return window.innerWidth <= 768;
  }
  
  vibrate(pattern = [100]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
  
  emitSlideChange() {
    const event = new CustomEvent('placesCarouselChange', {
      detail: {
        currentSlide: this.currentSlide,
        totalSlides: this.totalSlides,
        slideData: this.getSlideData()
      }
    });
    document.dispatchEvent(event);
  }
  
  getSlideData() {
    const currentCard = this.cards[this.currentSlide];
    if (!currentCard) return null;
    
    return {
      title: currentCard.querySelector('.place-title')?.textContent,
      description: currentCard.querySelector('.place-description')?.textContent,
      date: currentCard.querySelector('.place-date')?.textContent,
      image: currentCard.querySelector('.place-image img')?.src
    };
  }
  
  // Métodos públicos para controle externo
  play() {
    this.startAutoPlay();
  }
  
  pause() {
    this.pauseAutoPlay();
  }
  
  getCurrentSlide() {
    return this.currentSlide;
  }
  
  getTotalSlides() {
    return this.totalSlides;
  }
  
  // Destruir carousel (cleanup)
  destroy() {
    this.pauseAutoPlay();
    
    // Remover event listeners
    if (this.prevBtn) this.prevBtn.removeEventListener('click', this.prevSlide);
    if (this.nextBtn) this.nextBtn.removeEventListener('click', this.nextSlide);
    
    this.indicators.forEach((indicator) => {
      indicator.removeEventListener('click', this.goToSlide);
    });
    
    console.log('🎠 Carousel destruído');
  }
}

// ===== INICIALIZAÇÃO =====

// Aguardar site principal estar visível
document.addEventListener('DOMContentLoaded', () => {
  // Aguardar um pouco para garantir que o site principal foi revelado
  setTimeout(() => {
    const mainSite = document.getElementById('main-site');
    if (mainSite && !mainSite.classList.contains('hidden')) {
      initializePlacesCarousel();
    } else {
      // Tentar novamente após mais um tempo
      const checkInterval = setInterval(() => {
        if (mainSite && !mainSite.classList.contains('hidden')) {
          clearInterval(checkInterval);
          initializePlacesCarousel();
        }
      }, 1000);
    }
  }, 2000);
});

function initializePlacesCarousel() {
  // Inicializar carousel
  window.placesCarousel = new PlacesCarousel();
  
  // Event listener para mudanças de slide (opcional)
  document.addEventListener('placesCarouselChange', (e) => {
    console.log('Slide changed:', e.detail);
    // Aqui você pode adicionar analytics ou outras ações
  });
  
  console.log('✨ Carousel de lugares pronto!');
}

// Exportar para uso global
window.PlacesCarousel = PlacesCarousel;