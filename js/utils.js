// ===== UTILITY FUNCTIONS =====

// Debounce function para performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function para scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Verificar se elemento está visível na viewport
function isInViewport(element, threshold = 0.1) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = (rect.top <= windowHeight * (1 - threshold)) && ((rect.top + rect.height) >= windowHeight * threshold);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
  
  return vertInView && horInView;
}

// Smooth scroll para elemento
function smoothScrollTo(element, offset = 0) {
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Calcular dias entre duas datas
function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

// Formatar data em português
function formatDateBR(date) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'America/Sao_Paulo'
  };
  return new Date(date).toLocaleDateString('pt-BR', options);
}

// Criar elemento com classes e atributos
function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  
  if (options.classes) {
    element.classList.add(...options.classes);
  }
  
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  if (options.text) {
    element.textContent = options.text;
  }
  
  if (options.html) {
    element.innerHTML = options.html;
  }
  
  return element;
}

// Lazy loading de imagens
function setupLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Adicionar classe quando elemento entra na viewport
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationClass = element.dataset.animate;
        element.classList.add(animationClass);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => animationObserver.observe(el));
}

// Preloader de imagens
function preloadImages(urls) {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
      });
    })
  );
}

// Detectar device móvel
function isMobile() {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Scroll suave para âncoras
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        smoothScrollTo(target, 80);
      }
    });
  });
}

// Vibração em dispositivos móveis (se suportado)
function vibrate(pattern = [100]) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

// Mostrar notificação (se suportado)
function showNotification(title, options = {}) {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/assets/images/icons/heart.png',
      badge: '/assets/images/icons/heart.png',
      ...options
    });
  }
}

// Pedir permissão para notificações
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    return Notification.requestPermission();
  }
  return Promise.resolve(Notification.permission);
}

// Classe para gerenciar localStorage de forma segura
class SafeStorage {
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('LocalStorage não disponível:', e);
      return false;
    }
  }
  
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Erro ao ler localStorage:', e);
      return defaultValue;
    }
  }
  
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('Erro ao remover do localStorage:', e);
      return false;
    }
  }
}

// Exportar funções para uso global
window.Utils = {
  debounce,
  throttle,
  isInViewport,
  smoothScrollTo,
  daysBetween,
  formatDateBR,
  createElement,
  setupLazyLoading,
  setupScrollAnimations,
  preloadImages,
  isMobile,
  setupSmoothScrolling,
  vibrate,
  showNotification,
  requestNotificationPermission,
  SafeStorage
};