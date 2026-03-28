// Dark/Light Mode Toggle
const toggleButton = document.createElement('button');
toggleButton.textContent = '🌙';
toggleButton.className = 'mode-toggle';
toggleButton.setAttribute('aria-label', 'Alternar modo escuro/claro');
document.body.appendChild(toggleButton);

// Verificar preferência salva
const savedMode = localStorage.getItem('theme');
if (savedMode === 'light') {
  document.body.classList.add('light-mode');
  toggleButton.textContent = '☀️';
}

// Função para alternar modo
function toggleMode() {
  const isLight = document.body.classList.toggle('light-mode');
  toggleButton.textContent = isLight ? '☀️' : '🌙';

  // Salvar preferência
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Event listener
toggleButton.addEventListener('click', toggleMode);

// Armazenamento do perfil ativo no localStorage
function storeActiveProfile(event) {
  const perfilLink = event.currentTarget;
  const perfilType = perfilLink.getAttribute('data-perfil');
  const profileFigure = perfilLink.querySelector('.profile');
  const profileImg = profileFigure.querySelector('.imagem_perfil');
  const profileCaption = profileFigure.querySelector('figcaption');

  const activeProfile = {
    type: perfilType,
    name: profileCaption.textContent,
    image: profileImg.src,
    alt: profileImg.alt
  };

  // Armazenar no localStorage
  localStorage.setItem('activeProfile', JSON.stringify(activeProfile));

  // Debug: mostrar no console
  console.log('Perfil ativo armazenado:', activeProfile);
}

// Adicionar event listeners aos links dos perfis
document.addEventListener('DOMContentLoaded', () => {
  const perfilLinks = document.querySelectorAll('.perfil');

  perfilLinks.forEach(link => {
    link.addEventListener('click', storeActiveProfile);
  });
});

// Animação do título com efeito de digitação
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Animação do subtítulo com fade-in
function fadeIn(element, delay = 0) {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';

  setTimeout(() => {
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, delay);
}

// Sistema de Partículas Tech
class ParticleSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.colors = ['#e50914', '#ff6b35', '#ffffff', '#808080'];

    this.init();
    this.animate();
  }

  init() {
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';

    document.body.insertBefore(this.canvas, document.body.firstChild);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Criar partículas iniciais
    for (let i = 0; i < 50; i++) {
      this.createParticle();
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    const particle = {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      life: Math.random() * 100 + 50,
      maxLife: Math.random() * 100 + 50,
      opacity: Math.random() * 0.8 + 0.2
    };
    this.particles.push(particle);
  }

  updateParticle(particle) {
    // Movimento
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Atrair para o mouse levemente
    const dx = this.mouse.x - particle.x;
    const dy = this.mouse.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 150) {
      particle.vx += dx * 0.0001;
      particle.vy += dy * 0.0001;
    }

    // Bordas
    if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

    // Vida
    particle.life--;
    if (particle.life <= 0) {
      particle.x = Math.random() * this.canvas.width;
      particle.y = Math.random() * this.canvas.height;
      particle.life = particle.maxLife;
    }
  }

  drawParticle(particle) {
    this.ctx.save();
    this.ctx.globalAlpha = particle.opacity * (particle.life / particle.maxLife);
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Atualizar e desenhar partículas
    this.particles.forEach(particle => {
      this.updateParticle(particle);
      this.drawParticle(particle);
    });

    // Criar novas partículas ocasionalmente
    if (Math.random() < 0.02) {
      this.createParticle();
    }

    // Limitar número de partículas
    if (this.particles.length > 80) {
      this.particles = this.particles.slice(-70);
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Inicializar animações quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.tech-header h1');
  const subtitle = document.querySelector('.tech-subtitle');

  if (title) {
    // Remover o emoji temporariamente para animação
    const originalText = title.textContent;
    const emoji = originalText.includes('🎬') ? '🎬 ' : '';
    const textToType = originalText.replace('🎬 ', '').replace(' 💻', '');

    title.textContent = emoji;

    // Animação de digitação
    setTimeout(() => {
      typeWriter(title, textToType, 150);
    }, 500);

    // Adicionar emoji final após digitação
    setTimeout(() => {
      title.textContent += ' 💻';
    }, 500 + textToType.length * 150 + 200);
  }

  if (subtitle) {
    fadeIn(subtitle, 2000); // Delay para começar após o título
  }

  // Inicializar sistema de partículas
  new ParticleSystem();
});