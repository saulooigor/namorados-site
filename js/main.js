// ===== MAIN SITE CONTROLLER =====

class LoveSite {
  constructor() {
    this.relationshipStartDate = '2022-01-28'; // AJUSTE AQUI - Data do início do relacionamento
    this.isInitialized = false;
    this.currentSection = 'hero';
    
    // Elementos DOM principais
    this.mainSite = document.getElementById('main-site');
    this.sections = [];
    
    this.init();
  }
  
  init() {
    // Aguardar site principal ficar visível
    this.waitForSiteReveal();
  }
  
  waitForSiteReveal() {
    const checkInterval = setInterval(() => {
      if (this.mainSite && !this.mainSite.classList.contains('hidden')) {
        clearInterval(checkInterval);
        this.initializeSite();
      }
    }, 500);
  }
  
  initializeSite() {
    console.log('🎀 Inicializando site principal...');
    
    // Configurar funcionalidades básicas
    this.setupSections();
    this.setupHeroSection();
    this.setupTimelineSection();
    this.setupDaysCounter();
    this.setupScrollEffects();
    this.setupSmoothScrolling();
    this.setupLazyLoading();
    
    // Marcar como inicializado
    this.isInitialized = true;
    
    console.log('✨ Site inicializado com sucesso!');
  }
  
  setupSections() {
    this.sections = [
      { id: 'hero', element: document.getElementById('hero') },
      { id: 'timeline', element: document.getElementById('timeline') },
      { id: 'gallery', element: document.getElementById('gallery') },
      { id: 'places', element: document.getElementById('places') },
      { id: 'declaration', element: document.getElementById('declaration') },
      { id: 'music', element: document.getElementById('music') },
      { id: 'surprise', element: document.getElementById('surprise') }
    ].filter(section => section.element); // Filtrar apenas seções que existem
  }
  
  setupHeroSection() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    // Adicionar data de início do relacionamento
    const subtitle = heroSection.querySelector('.hero-subtitle');
    if (subtitle) {
      const formattedDate = Utils.formatDateBR(this.relationshipStartDate);
      subtitle.innerHTML = subtitle.innerHTML.replace('[DATA]', formattedDate);
    }
    
    // Configurar scroll indicator
    const scrollIndicator = heroSection.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const nextSection = document.getElementById('timeline');
        if (nextSection) {
          Utils.smoothScrollTo(nextSection, 80);
        }
      });
    }
    
    // Animação de entrada da hero
    setTimeout(() => {
      heroSection.classList.add('animate-fadeIn');
    }, 500);
  }
  
  setupTimelineSection() {
    // Timeline será populada via dados específicos depois
    this.createTimelineItems();
  }
  
  createTimelineItems() {
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;
    
    // Dados de exemplo - VOCÊ VAI PERSONALIZAR DEPOIS
    const timelineData = [
      {
        date: this.relationshipStartDate,
        title: 'Quando tudo começou',
        description: 'O dia em que tudo começou ❤️',
        image: 'assets/images/timeline/first.jpg'
      },
      {
        date: '2022-02-15',
        title: '2 reais ou um pudim misterioso?',
        description: 'Nosso primeiro beijo 😘',
        image: 'assets/images/timeline/preencher.png'
      },
      {
        date: '2022-02-15',
        title: 'Nosso primeiro encontro',
        description: 'Nada melhor que um macarrão em frente a PUC 🍝',
        image: 'assets/images/timeline/preencher.png'
      },
      {
        date: '2022-03-19',
        title: 'O término de 1 dia',
        description: 'Nós não aguentamos nem 24 horas separados 😂',
        image: 'assets/images/timeline/preencher.png'
      },
      {
        date: '2022-04-16',
        title: 'O dia que conheci sua família por parte de pai',
        description: 'E depois você conheceu meu pai e te apresentei como namorada 🥰',
        image: 'assets/images/timeline/preencher.png'
      },
      {
        date: '2022-10-27',
        title: 'Rolou um pedido que não foi tão surpresa assim',
        description: 'Mas foi especial do mesmo jeito 💍',
        image: 'assets/images/timeline/preencher.png'
      },
      {
        date: '2022-11-08',
        title: 'Encontramos o lugar para iniciar nossa vida juntos',
        description: 'Era a certeza de que estávamos no caminho certo 🏡',
        image: 'assets/images/timeline/preencher.png'
      },
      {
        date: '2022-09-11',
        title: 'Nosso primeiro pet 🐶',
        description: 'Tiiipaammmmmmmmmmm and Blaaaair 🐾',
        image: 'assets/images/timeline/preencher.png'
      },
      {
        date: '2023-01-23',
        title: 'Nossa Primeira Viagem',
        description: 'Aventuras juntos criam as melhores memórias ✈️',
        image: 'assets/images/timeline/primeiraviagem.jpg'
      },
      {
        date: '2023-03-05',
        title: 'Nossa primeira perda familiar 😢',
        description: 'Vovó Dete partiu, mas sempre estará em nossos corações ❤️',
        image: 'assets/images/timeline/preencher.png'
      },
      {
        date: '2023-12-05',
        title: 'Seu primeiro dedo quebrado hahahaha',
        description: 'Justo o dedinho do pé direito, mas você é forte e superou! 💪',
        image: 'assets/images/timeline/pequebrado.jpg'
      },
      {
        date: '2024-06-05',
        title: 'Nosso primeiro automotivo 🚗',
        description: 'Não foi um carro, mas sim uma moto! 🏍️',
        image: 'assets/images/timeline/preencher.png'
      },
      {
        date: '2024-12-24',
        title: 'Nosso primeiro e último Natal na família Solar do Madeira',
        description: 'O primeiro e mais importante Natal graças a você, minha linda! 🎄',
        image: 'assets/images/timeline/preencher.png'
      },
      {
        date: '2024-02-10',
        title: 'Perdemos mais um membro da família 😢',
        description: 'Izabela do Solar do Madeira, norinha querida!!!',
        image: 'assets/images/timeline/pai.jpg'
      },
      {
        date: '2024-12-05',
        title: 'Donatello Chegooouuuuu!!',
        description: 'Nosso docinho chegou para completar a família 🐢',
        image: 'assets/images/timeline/donatello.jpg'
      },
      {
        date: '2025-03-29',
        title: 'Conhecemos o Nordeste!!',
        description: 'A viagem dos sonhos para relaxar e aproveitar a vida 🌴',
        image: 'assets/images/timeline/viagemtop.jpg'
      },
      {
        date: '2025-06-12',
        title: 'Seguimos...',
        description: 'Seguimos escrevendo nossa história juntos, com amor e aventuras! 💖',
        image: 'assets/images/timeline/preencher.png'
      }
      // Adicione mais momentos aqui
    ];
    
    timelineData.forEach((item, index) => {
      const timelineItem = this.createTimelineItem(item, index);
      timelineContainer.appendChild(timelineItem);
    });
  }
  
  createTimelineItem(data, index) {
    const item = Utils.createElement('div', {
      classes: ['timeline-item'],
      attributes: { 'data-animate': 'slideInUp' }
    });
    
    const isLeft = index % 2 === 0;
    item.classList.add(isLeft ? 'timeline-left' : 'timeline-right');
    
    item.innerHTML = `
      <div class="timeline-content">
        <div class="timeline-date">${Utils.formatDateBR(data.date)}</div>
        <h3 class="timeline-title">${data.title}</h3>
        <p class="timeline-description">${data.description}</p>
        <div class="timeline-image">
          <img src="assets/images/placeholder.jpg" data-src="${data.image}" alt="${data.title}" loading="lazy">
        </div>
      </div>
      <div class="timeline-marker"></div>
    `;
    
    return item;
  }
  
  setupDaysCounter() {
    const counterElement = document.getElementById('days-together');
    if (!counterElement) return;
    
    const startDate = new Date(this.relationshipStartDate);
    const today = new Date();
    const daysTogehter = Utils.daysBetween(startDate, today);
    
    // Animação do contador
    this.animateCounter(counterElement, 0, daysTogehter, 2000);
  }
  
  animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (difference * easeOutQuart));
      
      element.textContent = current.toLocaleString('pt-BR');
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  }
  
  setupScrollEffects() {
    // Configurar animações de scroll
    Utils.setupScrollAnimations();
    
    // Header fixo (se houver)
    this.setupScrollHeader();
    
    // Parallax sutil nos backgrounds
    this.setupParallax();
  }
  
  setupScrollHeader() {
    // Para implementar depois se tivermos header fixo
    const header = document.querySelector('.header');
    if (!header) return;
    
    const scrollHandler = Utils.throttle(() => {
      const scrolled = window.pageYOffset > 100;
      header.classList.toggle('scrolled', scrolled);
    }, 100);
    
    window.addEventListener('scroll', scrollHandler);
  }
  
  setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    const handleParallax = Utils.throttle(() => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleParallax);
  }
  
  setupSmoothScrolling() {
    Utils.setupSmoothScrolling();
  }
  
  setupLazyLoading() {
    Utils.setupLazyLoading();
  }
  
  // Método para adicionar eventos customizados
  on(event, callback) {
    document.addEventListener(`lovesite:${event}`, callback);
  }
  
  // Método para disparar eventos customizados
  emit(event, data = {}) {
    document.dispatchEvent(new CustomEvent(`lovesite:${event}`, { detail: data }));
  }
  
  // Método para obter informações do relacionamento
  getRelationshipInfo() {
    const startDate = new Date(this.relationshipStartDate);
    const today = new Date();
    
    return {
      startDate: this.relationshipStartDate,
      formattedStartDate: Utils.formatDateBR(this.relationshipStartDate),
      daysTogether: Utils.daysBetween(startDate, today),
      monthsTogether: Math.floor(Utils.daysBetween(startDate, today) / 30),
      yearsTogether: Math.floor(Utils.daysBetween(startDate, today) / 365)
    };
  }
}

// ===== EVENT LISTENERS GLOBAIS =====

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar site principal
  window.loveSite = new LoveSite();
  
  // Console info para debug
  console.log('💕 Sistema carregado!');
  console.log('Acesse: window.loveSite para debug');
});

// Tratamento de erros
window.addEventListener('error', (e) => {
  console.error('Erro no site:', e.error);
});

// Redimensionamento da janela
window.addEventListener('resize', Utils.debounce(() => {
  // Reajustar elementos se necessário
  if (window.loveSite && window.loveSite.isInitialized) {
    console.log('Redimensionamento detectado');
  }
}, 250));

// ===== SERVICE WORKER (OPCIONAL) =====
// Uncomment para adicionar cache offline
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registrado'))
      .catch(error => console.log('SW falhou'));
  });
}
*/