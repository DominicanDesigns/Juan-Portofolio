/* Improved script: rain + accessible dropdowns + centralized chat/Tawk loader */



// ---------- Rain effect (Financial Algorithm symbols) ----------
function createRain() {
  const container = document.querySelector('.rain-container');
  if (!container) return;
  container.textContent = '';

  const symbols = '01$€£₿¥₮';
  // Reduced density for a cleaner look
  const density = Math.max(10, Math.round(window.innerWidth / 40));
  const count = Math.min(60, density); // Cap at 60 for performance/aesthetics

  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'rain-letter';
    el.textContent = symbols.charAt(Math.floor(Math.random() * symbols.length));

    const left = Math.random() * 100;
    const size = Math.floor(Math.random() * 14) + 10; // Smaller font
    const duration = (Math.random() * 5 + 3).toFixed(2); // Slower fall
    const delay = (Math.random() * 5).toFixed(2);
    const opacity = (Math.random() * 0.3 + 0.05).toFixed(2); // More transparent

    el.style.left = `${left}%`;
    el.style.fontSize = `${size}px`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    el.style.opacity = opacity;
    el.style.color = Math.random() > 0.9 ? 'var(--accent-gold)' : 'var(--accent-primary)';

    frag.appendChild(el);
  }
  container.appendChild(frag);
}

// ---------- Typing Effect ----------
function initTypingEffect() {
  const heroTitle = document.querySelector('.hero-text h1 .text-gradient');
  if (!heroTitle) return;

  const originalText = heroTitle.textContent;
  heroTitle.textContent = '';
  // Ensure we keep the height so no layout shift
  heroTitle.style.display = 'inline-block';
  heroTitle.style.minHeight = '1.2em';

  let i = 0;

  function type() {
    if (i < originalText.length) {
      heroTitle.textContent += originalText.charAt(i);
      i++;
      setTimeout(type, 80); // Slightly faster
    }
  }
  setTimeout(type, 500); // Small delay before start
}

// ---------- Scroll Reveal Observer ----------
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ---------- Nav Scroll Effect ----------
function initNavScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

let _resizeTimer = null;
function initRain() {
  createRain();
  initScrollReveal();
  initNavScroll();

  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(createRain, 240);
  });
}

// ---------- Centralized minimal chat fallback ----------
// Tawk.to integration removed by user request

function initChatUI() {
  // Provide a safe chatBackend API so pages/scripts can use it
  window.chatBackend = window.chatBackend || {};

  // Minimal chat widget (lightweight fallback)
  if (!document.getElementById('chat-open')) {
    const openBtn = document.createElement('button');
    openBtn.id = 'chat-open';
    openBtn.className = 'chat-open-btn';
    openBtn.textContent = 'Chat';
    openBtn.type = 'button';
    document.body.appendChild(openBtn);
  }

  if (!document.getElementById('chat-widget')) {
    const widget = document.createElement('div');
    widget.id = 'chat-widget';
    widget.className = 'chat-widget hidden';
    widget.innerHTML = `
      <div class="chat-header">
        <span>Chat</span>
        <button id="chat-close" aria-label="Close chat" style="border:none;background:transparent;cursor:pointer">✕</button>
      </div>
      <div id="chat-messages" class="chat-messages" aria-live="polite"></div>
      <form id="chat-form" class="chat-form">
        <input id="chat-input" placeholder="Type a message..." autocomplete="off" />
        <button type="submit">Send</button>
      </form>
    `;
    document.body.appendChild(widget);
  }

  const btn = document.getElementById('chat-open');
  const closeBtn = document.getElementById('chat-close');
  const messagesEl = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  btn && btn.addEventListener('click', () => document.getElementById('chat-widget').classList.toggle('hidden'));
  closeBtn && closeBtn.addEventListener('click', () => document.getElementById('chat-widget').classList.add('hidden'));

  function appendMessage({ name = 'Guest', text = '', self = false, ts }) {
    if (!messagesEl) return;
    const wrap = document.createElement('div');
    wrap.className = 'chat-message' + (self ? ' me' : '');
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${name} · ${new Date(ts || Date.now()).toLocaleTimeString()}`;
    const txt = document.createElement('div');
    txt.className = 'text';
    txt.textContent = text;
    wrap.appendChild(meta);
    wrap.appendChild(txt);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  window.chatBackend.sendMessage = window.chatBackend.sendMessage || function (text) { appendMessage({ name: 'You', text, self: true }); };
  window.chatBackend.onMessage = window.chatBackend.onMessage || function (cb) { /* optional */ };
  window.__appendChatMessage = appendMessage;

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      try {
        if (window.chatBackend && typeof window.chatBackend.sendMessage === 'function') {
          window.chatBackend.sendMessage(text);
        }
        if (window.__appendChatMessage) {
          window.__appendChatMessage({ name: 'You', text, self: true });
        }
      } catch (err) { console.error(err); }
      input.value = '';
      input.focus();
    });
  }
}

// ---------- Lightweight i18n (client-only) ----------
const _i18n = {
  en: {
    'nav.home': 'Organization',
    'nav.services': 'Ventures',
    'nav.python': 'Python Solutions',
    'nav.audit': 'Protocol: AUDIT',
    'nav.game': 'Sim: EMPIRE',
    'nav.contact': 'Partnership',
    'nav.languages': 'Languages:',
    'hero.title': 'Architect of Digital Dominance',
    'hero.lead': 'Owner of a high-yield portfolio of digital assets. I build, scale, and monopolize niche markets with autonomous P2P platforms. Success isn\'t just a goal; it\'s my infrastructure.',
    'cta.hire': 'Join the Empire',
    'cta.services': 'View Assets',
    'services.heading': 'Enterprise Capabilities',
    'services.lead': 'Deploying sovereign capabilities for digital conquest.',
    'service.web.title': 'Empire Building',
    'service.web.desc': 'Constructing robust digital infrastructures that dominate market niches.',
    'service.apps.title': 'Rapid Deployment',
    'service.apps.desc': 'Launching scalable applications with military precision.',
    'service.maint.title': 'Asset Protection',
    'service.maint.desc': 'Ensuring the longevity and security of digital holdings.',
    'gallery.heading': 'Success Stories: Owned Enterprises',
    'gallery.lead': 'Proven models of digital success.',
    'portfolio.heading': 'Ventures Portfolio',
    'portfolio.lead': 'A glimpse into the active holdings of the Nunez Empire.',
    'portfolio.apps': 'Sovereign Apps',
    'portfolio.website': 'Business Platforms',
    'portfolio.maintenance': 'Strategic Support',
    'algo.heading': 'The Wealth Algorithm',
    'algo.lead': 'A proprietary automated system for sustainable revenue generation.',
    'algo.profit.title': 'Automated Revenue',
    'algo.profit.desc': '15% commission hardcoded into every transaction. Wealth generation on autopilot.',
    'algo.p2p.title': 'Self-Sustaining Economy',
    'algo.p2p.desc': 'A decentralized marketplace where users drive the value.',
    'algo.secure.title': 'Sovereign Control',
    'algo.secure.desc': 'Absolute administrative oversight. Nothing moves without approval.',
    'portfolio.domain': 'Domain registration',
    'contact.getintouch': 'Initiate Partnership',
    'contact.lead': "Serious inquiries only. If you're ready to build wealth or partner on a venture, reach out.",
    'form.firstname': 'First name',
    'form.lastname': 'Last name',
    'form.email': 'Email',
    'form.message': 'Proposal',
    'form.send': 'Send Proposal',
    'form.status': '',
    'form.placeholder.firstname': 'Your first name',
    'form.placeholder.lastname': 'Your last name',
    'form.placeholder.email': 'ceo@company.com',
    'form.placeholder.message': 'Outline your proposition...',
    'apps.title': 'Sovereign App Assets',
    'apps.paragraph': 'Deploying high-utility applications that serve specific market needs and generate passive income streams.',
    'apps.after': 'Standard Deployment Protocol',
    'website.title': 'Digital Platforms',
    'website.paragraph': 'Creating the digital real estate upon which businesses are built and empires are founded.',
    'website.after': 'Launch Sequence',
    'maint.title': 'Infrastructure Security',
    'maint.paragraph': 'Maintaining the integrity and uptime of revenue-generating assets is non-negotiable.',
    'maint.after': ' ongoing protocols',
    'pricing.heading': 'Investment Opportunities',
    'pricing.title': 'Capital Deployment',
    'stats.assets': 'Owned Assets',
    'stats.yield': 'Profit Yield',
    'stats.reach': 'Market Reach',
    'portfolio.apps.desc': 'High-Utility Applications',
    'portfolio.web.desc': 'Marketplace Solutions',
    'portfolio.maint.desc': 'Infrastructure Maintenance',
    'portfolio.inspect': 'Inspect Assets →',
    'portfolio.strategy': 'View Strategy →',
    'pricing.lead': 'Strategic investments for maximum ROI. Choose your tier.',
    'plan.web': 'Platform Build',
    'plan.web.f1': 'responsive architecture',
    'plan.web.f2': 'SEO dominance',
    'plan.web.f3': '2 rounds of refinement',
    'plan.apps': 'App Launch',
    'plan.apps.f1': 'Cross-platform native',
    'plan.apps.f2': 'Rigorous testing',
    'plan.apps.f3': 'Store domination',
    'plan.maint': 'Asset Management',
    'plan.maint.f1': 'Updates & hardening',
    'plan.maint.f2': 'Threat monitoring',
    'plan.maint.f3': 'Performance reporting',
    'plan.domain': 'Domain Acquisition',
    'plan.domain.price': 'Market Rate',
    'plan.domain.f1': 'Secure registration',
    'plan.domain.f2': 'Privacy shielding',
    'plan.web.premium': 'Empire Suite',
    'plan.web.f2.premium': 'High-Frequency Optimization',
    'status.fill_required': 'Please fill the required fields.',
    'status.opening_mail': 'Opening secure mail client...',
    'contact.whatsapp.title': 'Direct Line',
    'contact.whatsapp.desc': 'Personal & Business. For formal proposals, please use the form below.',
    'status.mail_fail': 'If your mail client didn\'t open, please send an email to',
    'cta.secure_deploy': 'Secure Deployment',
    'cta.launch_platform': 'Launch Platform',
    'cta.subscribe': 'Subscribe',
    'cta.subscribe': 'Subscribe',
    'cta.contact': 'Contact',
    'apps.step1.title': 'Requirements & planning',
    'apps.step1.desc': 'clarify features, target platforms, and delivery milestones.',
    'apps.step2.title': 'Design & prototyping',
    'apps.step2.desc': 'wireframes and UI mockups with feedback rounds.',
    'apps.step3.title': 'Implementation',
    'apps.step3.desc': 'development of the app, integrations, and content population as agreed.',
    'apps.step4.title': 'Testing',
    'apps.step4.desc': 'unit, integration, and user acceptance testing across devices.',
    'apps.step5.title': 'Deployment',
    'apps.step5.desc': 'publish to stores or set up hosting/CI, plus domain/SSL when needed.',
    'apps.step6.title': 'Handover & docs',
    'apps.step6.desc': 'delivery of source, credentials, and brief training/documentation.',
    'apps.step7.title': 'Post-launch support',
    'apps.step7.desc': '30 days of support included; ongoing maintenance plans are available.',
    'apps.timeline': 'Typical timeline: 3–12 weeks depending on complexity. For a tailored quote and timeline,',
    'apps.contact': 'contact me',
    'maint.step1.title': 'Updates',
    'maint.step1.desc': 'keeping CMS, plugins, and frameworks on the latest stable versions.',
    'maint.step2.title': 'Backups',
    'maint.step2.desc': 'regular off-site backups to ensure data safety.',
    'maint.step3.title': 'Security',
    'maint.step3.desc': 'monitoring for vulnerabilities and fixing them proactively.',
    'maint.step4.title': 'Performance',
    'maint.step4.desc': 'regular checks to ensure the site loads fast.',
    'maint.step5.title': 'Reports',
    'maint.step5.desc': 'a monthly summary of what was done and how the site is performing.',
    'maint.cta_text': 'Peace of mind for your business.',
    'maint.subscribe': 'Subscribe now',
    'website.step1.title': 'Discovery',
    'website.step1.desc': 'understanding your brand, audience, and goals.',
    'website.step2.title': 'Design',
    'website.step2.desc': 'creating a visual style and layout that fits your needs.',
    'website.step3.title': 'Development',
    'website.step3.desc': 'coding the site with best practices for speed and SEO.',
    'website.step4.title': 'Content',
    'website.step4.desc': 'adding your text and images (or helping you create them).',
    'website.step5.title': 'Launch',
    'website.step5.desc': 'connecting your domain, setting up SSL, and going live.',
    'website.step6.title': 'Training',
    'website.step6.desc': 'showing you how to update content if needed.',
    'website.timeline': 'Typical timeline: 2–6 weeks. Ready to start?',
    'website.quote': 'Get a quote',
    'python.hero.title': 'Python Enterprise Logic',
    'python.hero.lead': 'Harnessing the raw power of Python to automate, analyze, and dominate business processes. Pure efficiency, engineered for the elite.',
    'python.cta.start': 'Deploy Logic',
    'python.cta.audit': 'System Audit',
    'python.feat.1.title': 'Algorithmic Dominance',
    'python.feat.1.desc': 'Custom algorithms that outperform human efficiency by orders of magnitude.',
    'python.feat.2.title': 'Data Sovereignty',
    'python.feat.2.desc': 'Secure, localized data processing pipelines that ensure total control.',
    'python.feat.3.title': 'AI Integration',
    'python.feat.3.desc': 'Seamless integration of advanced AI models for predictive business intelligence.',
    'python.stats.1': 'Efficiency Incr.',
    'python.stats.2': 'Cost Reduct.',
    'python.stats.3': 'Logic Uptime',
    'audit.title': 'Sovereign Audit Protocol',
    'audit.lead': 'Initiate a deep-scan analysis of your digital asset. Identify vulnerabilities. Quantify inefficiency. Prepare for conquest.',
    'audit.input.placeholder': 'ENTER TARGET URL (e.g. business.com)',
    'audit.btn.scan': 'INITIATE SCAN',
    'audit.status.init': 'Initializing Sovereign Protocol...',
    'audit.status.connect': 'Establishing Neural Handshake...',
    'audit.status.analyze': 'Analyzing Vector Surfaces...',
    'audit.status.calc': 'Calculating Dominance Score...',
    'audit.result.title': 'AUDIT COMPLETE',
    'audit.result.score': 'Dominance Score:',
    'audit.result.vuln': 'Critical Vulnerabilities Detected',
    'audit.result.msg': 'Your asset is exposed. Efficiency is sub-optimal. Immediate intervention recommended.',
    'audit.cta.fix': 'DEPLOY FIXES',
    'game.title': 'Sovereign Empire Simulation',
    'game.currency': 'Net Worth',
    'game.income': 'Passive Income',
    'game.btn.mine': 'MINE DATA',
    'game.shop.title': 'Asset Acquisition',
    'game.upg.server': 'Cloud Server',
    'game.upg.algo': 'Trading Algorithm',
    'game.upg.ai': 'Neural Network',
    'game.locked': 'Locked',
  },
  es: {
    'nav.home': 'Organización',
    'nav.services': 'Empresas',
    'nav.python': 'Soluciones Python',
    'nav.audit': 'Protocolo: AUDITORÍA',
    'nav.game': 'Sim: IMPERIO',
    'nav.contact': 'Alianzas',
    'nav.languages': 'Idiomas:',
    'hero.title': 'Arquitecto de Dominio Digital',
    'hero.lead': 'Propietario de un portafolio de activos digitales de alto rendimiento. Construyo, escalo y monopolizo nichos de mercado con plataformas P2P autónomas. El éxito no es una meta; es mi infraestructura.',
    'cta.hire': 'Únete al Imperio',
    'cta.services': 'Ver Activos',
    'services.heading': 'Capacidades Empresariales',
    'services.lead': 'Desplegando capacidades soberanas para la conquista digital.',
    'service.web.title': 'Construcción de Imperios',
    'service.web.desc': 'Construcción de infraestructuras digitales robustas que dominan nichos de mercado.',
    'service.apps.title': 'Despliegue Rápido',
    'service.apps.desc': 'Lanzamiento de aplicaciones escalables con precisión militar.',
    'service.maint.title': 'Protección de Activos',
    'service.maint.desc': 'Asegurando la longevidad y seguridad de las posesiones digitales.',
    'gallery.heading': 'Historias de Éxito: Empresas Propias',
    'gallery.lead': 'Modelos probados de éxito digital.',
    'portfolio.heading': 'Portafolio de Inversiones',
    'portfolio.lead': 'Un vistazo a las participaciones activas del Imperio Núñez.',
    'portfolio.apps': 'Apps Soberanas',
    'portfolio.website': 'Plataformas de Negocios',
    'portfolio.maintenance': 'Soporte Estratégico',
    'algo.heading': 'El Algoritmo de Riqueza',
    'algo.lead': 'Un sistema automatizado propietario para la generación de ingresos sostenibles.',
    'algo.profit.title': 'Ingresos Automatizados',
    'algo.profit.desc': '15% de comisión incrustada en cada transacción. Generación de riqueza en piloto automático.',
    'algo.p2p.title': 'Economía Autosostenible',
    'algo.p2p.desc': 'Un mercado descentralizado donde los usuarios impulsan el valor.',
    'algo.secure.title': 'Control Soberano',
    'algo.secure.desc': 'Supervisión administrativa absoluta. Nada se mueve sin aprobación.',
    'portfolio.domain': 'Adquisición de Dominios',
    'contact.getintouch': 'Iniciar Alianza',
    'contact.lead': 'Solo consultas serias. Si estás listo para construir riqueza o asociarte, contáctame.',
    'form.firstname': 'Nombre',
    'form.lastname': 'Apellido',
    'form.email': 'Correo Empresarial',
    'form.message': 'Propuesta',
    'form.send': 'Enviar Propuesta',
    'form.status': '',
    'form.placeholder.firstname': 'Tu nombre',
    'form.placeholder.lastname': 'Tu apellido',
    'form.placeholder.email': 'ceo@empresa.com',
    'form.placeholder.message': 'Describe tu proposición...',
    'apps.title': 'Activos de Apps Soberanas',
    'apps.paragraph': 'Desplegando aplicaciones de alta utilidad que sirven necesidades específicas del mercado y generan flujos de ingresos pasivos.',
    'apps.after': 'Protocolo de Despliegue',
    'website.title': 'Plataformas Digitales',
    'website.paragraph': 'Creando los bienes raíces digitales sobre los cuales se construyen negocios e imperios.',
    'website.after': 'Secuencia de Lanzamiento',
    'maint.title': 'Seguridad de Infraestructura',
    'maint.paragraph': 'Mantener la integridad y el tiempo de actividad de los activos generadores de ingresos no es negociable.',
    'maint.after': 'Protocolos continuos',
    'pricing.heading': 'Oportunidades de Inversión',
    'pricing.title': 'Despliegue de Capital',
    'stats.assets': 'Activos Propios',
    'stats.yield': 'Retorno de Inversión',
    'stats.reach': 'Alcance de Mercado',
    'portfolio.apps.desc': 'Aplicaciones de Alta Utilidad',
    'portfolio.web.desc': 'Soluciones de Mercado',
    'portfolio.maint.desc': 'Mantenimiento de Infraestructura',
    'portfolio.inspect': 'Inspeccionar Activos →',
    'portfolio.strategy': 'Ver Estrategia →',
    'pricing.lead': 'Inversiones estratégicas para el máximo ROI. Elige tu nivel.',
    'plan.web': 'Construcción de Plataforma',
    'plan.web.f1': 'Arquitectura responsiva',
    'plan.web.f2': 'Dominio SEO',
    'plan.web.f3': '2 rondas de refinamiento',
    'plan.apps': 'Lanzamiento de App',
    'plan.apps.f1': 'Nativo multiplataforma',
    'plan.apps.f2': 'Pruebas rigurosas',
    'plan.apps.f3': 'Dominio de tiendas',
    'plan.maint': 'Gestión de Activos',
    'plan.maint.f1': 'Actualizaciones y blindaje',
    'plan.maint.f2': 'Monitoreo de amenazas',
    'plan.maint.f3': 'Informe de rendimiento',
    'plan.domain': 'Adquisición de Dominio',
    'plan.domain.price': 'Tasa de Mercado',
    'plan.domain.f1': 'Registro seguro',
    'plan.domain.f2': 'Escudo de privacidad',
    'plan.web.premium': 'Suite Imperial',
    'plan.web.f2.premium': 'Optimización de Alta Frecuencia',
    'status.fill_required': 'Por favor completa los campos requeridos.',
    'status.opening_mail': 'Abriendo cliente de correo seguro...',
    'contact.whatsapp.title': 'Línea Directa',
    'contact.whatsapp.desc': 'Personal y Negocios. Para propuestas formales, por favor use el formulario a continuación.',
    'status.mail_fail': 'Si tu cliente de correo no abrió, envía un email a',
    'cta.secure_deploy': 'Despliegue Seguro',
    'cta.launch_platform': 'Lanzar Plataforma',
    'cta.subscribe': 'Suscribirse',
    'cta.subscribe': 'Suscribirse',
    'cta.contact': 'Contactar',
    'apps.step1.title': 'Requisitos y planificación',
    'apps.step1.desc': 'aclarar características, plataformas objetivo e hitos de entrega.',
    'apps.step2.title': 'Diseño y prototipado',
    'apps.step2.desc': 'wireframes y maquetas de UI con rondas de retroalimentación.',
    'apps.step3.title': 'Implementación',
    'apps.step3.desc': 'desarrollo de la app, integraciones y población de contenido según lo acordado.',
    'apps.step4.title': 'Pruebas',
    'apps.step4.desc': 'pruebas unitarias, de integración y de aceptación del usuario en dispositivos.',
    'apps.step5.title': 'Despliegue',
    'apps.step5.desc': 'publicar en tiendas o configurar hosting/CI, más dominio/SSL cuando sea necesario.',
    'apps.step6.title': 'Entrega y documentación',
    'apps.step6.desc': 'entrega de código fuente, credenciales y breve capacitación/documentación.',
    'apps.step7.title': 'Soporte post-lanzamiento',
    'apps.step7.desc': '30 días de soporte incluidos; planes de mantenimiento continuo disponibles.',
    'apps.timeline': 'Cronograma típico: 3–12 semanas dependiendo de la complejidad. Para una cotización a medida,',
    'apps.contact': 'contáctame',
    'maint.step1.title': 'Actualizaciones',
    'maint.step1.desc': 'mantener CMS, plugins y frameworks en las últimas versiones estables.',
    'maint.step2.title': 'Respaldos',
    'maint.step2.desc': 'respaldos regulares fuera del sitio para asegurar la seguridad de los datos.',
    'maint.step3.title': 'Seguridad',
    'maint.step3.desc': 'monitoreo de vulnerabilidades y corrección proactiva.',
    'maint.step4.title': 'Rendimiento',
    'maint.step4.desc': 'chequeos regulares para asegurar que el sitio cargue rápido.',
    'maint.step5.title': 'Informes',
    'maint.step5.desc': 'un resumen mensual de lo realizado y el rendimiento del sitio.',
    'maint.cta_text': 'Tranquilidad para tu negocio.',
    'maint.subscribe': 'Suscribirse ahora',
    'website.step1.title': 'Descubrimiento',
    'website.step1.desc': 'entender tu marca, audiencia y objetivos.',
    'website.step2.title': 'Diseño',
    'website.step2.desc': 'crear un estilo visual y diseño que se ajuste a tus necesidades.',
    'website.step3.title': 'Desarrollo',
    'website.step3.desc': 'codificar el sitio con mejores prácticas para velocidad y SEO.',
    'website.step4.title': 'Contenido',
    'website.step4.desc': 'agregar tu texto e imágenes (o ayudarte a crearlos).',
    'website.step5.title': 'Lanzamiento',
    'website.step5.desc': 'conectar tu dominio, configurar SSL y salir en vivo.',
    'website.step6.title': 'Capacitación',
    'website.step6.desc': 'mostrarte cómo actualizar el contenido si es necesario.',
    'website.timeline': 'Cronograma típico: 2–6 semanas. ¿Listo para comenzar?',
    'website.quote': 'Obtener cotización',
    'python.hero.title': 'Lógica Empresarial Python',
    'python.hero.lead': 'Aprovechando el poder puro de Python para automatizar, analizar y dominar procesos de negocios. Eficiencia pura, diseñada para la élite.',
    'python.cta.start': 'Desplegar Lógica',
    'python.cta.audit': 'Auditoría de Sistema',
    'python.feat.1.title': 'Dominio Algorítmico',
    'python.feat.1.desc': 'Algoritmos personalizados que superan la eficiencia humana por órdenes de magnitud.',
    'python.feat.2.title': 'Soberanía de Datos',
    'python.feat.2.desc': 'Tuberías de procesamiento de datos locales y seguras que aseguran control total.',
    'python.feat.3.title': 'Integración de IA',
    'python.feat.3.desc': 'Integración perfecta de modelos avanzados de IA para inteligencia de negocios predictiva.',
    'python.stats.1': 'Aumento Eficiencia',
    'python.stats.2': 'Reducción Costos',
    'python.stats.3': 'Tiempo de Lógica',
    'audit.title': 'Protocolo de Auditoría Soberana',
    'audit.lead': 'Inicie un análisis profundo de su activo digital. Identifique vulnerabilidades. Cuantifique la ineficiencia. Prepárese para la conquista.',
    'audit.input.placeholder': 'INGRESAR URL OBJETIVO',
    'audit.btn.scan': 'INICIAR ESCANEO',
    'audit.status.init': 'Inicializando Protocolo Soberano...',
    'audit.status.connect': 'Estableciendo Apretón de Manos Neural...',
    'audit.status.analyze': 'Analizando Superficies Vectoriales...',
    'audit.status.calc': 'Calculando Puntuación de Dominio...',
    'audit.result.title': 'AUDITORÍA COMPLETA',
    'audit.result.score': 'Puntuación de Dominio:',
    'audit.result.vuln': 'Vulnerabilidades Críticas Detectadas',
    'audit.result.msg': 'Su activo está expuesto. La eficiencia es subóptima. Se recomienda intervención inmediata.',
    'audit.cta.fix': 'DESPLEGAR SOLUCIONES',
    'game.title': 'Simulación de Imperio Soberano',
    'game.currency': 'Patrimonio Neto',
    'game.income': 'Ingreso Pasivo',
    'game.btn.mine': 'MINAR DATOS',
    'game.shop.title': 'Adquisición de Activos',
    'game.upg.server': 'Servidor Cloud',
    'game.upg.algo': 'Algoritmo de Trading',
    'game.upg.ai': 'Red Neuronal',
    'game.locked': 'Bloqueado',
  },
  fr: {
    'nav.home': 'Organisation',
    'nav.services': 'Entreprises',
    'nav.python': 'Solutions Python',
    'nav.audit': 'Protocole : AUDIT',
    'nav.game': 'Sim: EMPIRE',
    'nav.contact': 'Partenariats',
    'nav.languages': 'Langues :',
    'hero.title': 'Architecte de la Domination Numérique',
    'hero.lead': 'Propriétaire d\'un portefeuille d\'actifs numériques à haut rendement. Je construis, développe et monopolise des marchés de niche avec des plateformes P2P autonomes. Le succès n\'est pas un objectif ; c\'est mon infrastructure.',
    'cta.hire': 'Rejoindre l\'Empire',
    'cta.services': 'Voir les Actifs',
    'services.heading': 'Capacités d\'Entreprise',
    'services.lead': 'Déploiement de capacités souveraines pour la conquête numérique.',
    'service.web.title': 'Construction d\'Empire',
    'service.web.desc': 'Construction d\'infrastructures numériques robustes qui dominent les marchés de niche.',
    'service.apps.title': 'Déploiement Rapide',
    'service.apps.desc': 'Lancement d\'applications évolutives avec une précision militaire.',
    'service.maint.title': 'Protection des Actifs',
    'service.maint.desc': 'Assurer la longévité et la sécurité des avoirs numériques.',
    'gallery.heading': 'Histoires de Succès : Entreprises Propres',
    'gallery.lead': 'Modèles éprouvés de succès numérique.',
    'portfolio.heading': 'Portefeuille d\'Investissements',
    'portfolio.lead': 'Un aperçu des participations actives de l\'Empire Nunez.',
    'portfolio.apps': 'Apps Souveraines',
    'portfolio.website': 'Plateformes d\'Affaires',
    'portfolio.maintenance': 'Support Stratégique',
    'algo.heading': 'L\'Algorithme de Richesse',
    'algo.lead': 'Un système automatisé propriétaire pour la génération de revenus durables.',
    'algo.profit.title': 'Revenus Automatisés',
    'algo.profit.desc': '15% de commission intégrée à chaque transaction. Génération de richesse en pilote automatique.',
    'algo.p2p.title': 'Économie Autosuffisante',
    'algo.p2p.desc': 'Un marché décentralisé où les utilisateurs créent la valeur.',
    'algo.secure.title': 'Contrôle Souverain',
    'algo.secure.desc': 'Supervision administrative absolue. Rien ne bouge sans approbation.',
    'portfolio.domain': 'Acquisition de Domaine',
    'contact.getintouch': 'Initier un Partenariat',
    'contact.lead': 'Demandes sérieuses uniquement. Si vous êtes prêt à bâtir une richesse ou à vous associer, contactez-moi.',
    'form.firstname': 'Prénom',
    'form.lastname': 'Nom',
    'form.email': 'Email Professionnel',
    'form.message': 'Proposition',
    'form.send': 'Envoyer la Proposition',
    'form.status': '',
    'form.placeholder.firstname': 'Votre prénom',
    'form.placeholder.lastname': 'Votre nom',
    'form.placeholder.email': 'pdg@societe.com',
    'form.placeholder.message': 'Décrivez votre proposition...',
    'apps.title': 'Actifs d\'Apps Souveraines',
    'apps.paragraph': 'Déploiement d\'applications à haute utilité qui répondent à des besoins spécifiques du marché et génèrent des flux de revenus passifs.',
    'apps.after': 'Protocole de Déploiement',
    'website.title': 'Plateformes Numériques',
    'website.paragraph': 'Création de l\'immobilier numérique sur lequel les entreprises sont construites et les empires fondés.',
    'website.after': 'Séquence de Lancement',
    'maint.title': 'Sécurité de l\'Infrastructure',
    'maint.paragraph': 'Maintenir l\'intégrité et la disponibilité des actifs générateurs de revenus est non négociable.',
    'maint.after': 'Protocoles continus',
    'pricing.heading': 'Opportunités d\'Investissement',
    'pricing.title': 'Déploiement de Capital',
    'stats.assets': 'Actifs Détenus',
    'stats.yield': 'Rendement',
    'stats.reach': 'Portée du Marché',
    'portfolio.apps.desc': 'Applications à Haute Utilité',
    'portfolio.web.desc': 'Solutions de Marché',
    'portfolio.maint.desc': 'Maintenance d\'Infrastructure',
    'portfolio.inspect': 'Inspecter les Actifs →',
    'portfolio.strategy': 'Voir la Stratégie →',
    'pricing.lead': 'Investissements stratégiques pour un ROI maximal. Choisissez votre niveau.',
    'plan.web': 'Construction de Plateforme',
    'plan.web.f1': 'Architecture responsive',
    'plan.web.f2': 'Domination SEO',
    'plan.web.f3': '2 tours de raffinement',
    'plan.apps': 'Lancement d\'App',
    'plan.apps.f1': 'Natif multiplateforme',
    'plan.apps.f2': 'Tests rigoureux',
    'plan.apps.f3': 'Domination des stores',
    'plan.maint': 'Gestion d\'Actifs',
    'plan.maint.f1': 'Mises à jour & blindage',
    'plan.maint.f2': 'Surveillance des menaces',
    'plan.maint.f3': 'Rapport de performance',
    'plan.domain': 'Acquisition de Domaine',
    'plan.domain.price': 'Taux du Marché',
    'plan.domain.f1': 'Enregistrement sécurisé',
    'plan.domain.f2': 'Bouclier de confidentialité',
    'plan.web.premium': 'Suite Impériale',
    'plan.web.f2.premium': 'Optimisation Haute Fréquence',
    'status.fill_required': 'Veuillez remplir les champs requis.',
    'status.opening_mail': 'Ouverture du client mail sécurisé...',
    'contact.whatsapp.title': 'Ligne Directe',
    'contact.whatsapp.desc': 'Personnel et Affaires. Pour les propositions formelles, veuillez utiliser le formulaire ci-dessous.',
    'status.mail_fail': 'Si votre client mail ne s\'est pas ouvert, envoyez un email à',
    'cta.secure_deploy': 'Déploiement Sécurisé',
    'cta.launch_platform': 'Lancer la Plateforme',
    'cta.subscribe': 'S\'abonner',
    'cta.subscribe': 'S\'abonner',
    'cta.contact': 'Contact',
    'apps.step1.title': 'Exigences et planification',
    'apps.step1.desc': 'clarifier les fonctionnalités, les plateformes cibles et les étapes de livraison.',
    'apps.step2.title': 'Conception et prototypage',
    'apps.step2.desc': 'maquettes et modèles d\'interface utilisateur avec rondes de commentaires.',
    'apps.step3.title': 'Mise en œuvre',
    'apps.step3.desc': 'développement de l\'application, intégrations et population de contenu comme convenu.',
    'apps.step4.title': 'Tests',
    'apps.step4.desc': 'tests unitaires, d\'intégration et d\'acceptation utilisateur sur les appareils.',
    'apps.step5.title': 'Déploiement',
    'apps.step5.desc': 'publier sur les magasins ou configurer l\'hébergement/CI, plus domaine/SSL si nécessaire.',
    'apps.step6.title': 'Livraison et documentation',
    'apps.step6.desc': 'livraison du code source, des identifiants et brève formation/documentation.',
    'apps.step7.title': 'Support post-lancement',
    'apps.step7.desc': '30 jours de support inclus ; plans de maintenance continue disponibles.',
    'apps.timeline': 'Calendrier typique : 3–12 semaines selon la complexité. Pour un devis sur mesure,',
    'apps.contact': 'contactez-moi',
    'maint.step1.title': 'Mises à jour',
    'maint.step1.desc': 'maintenir CMS, plugins et frameworks sur les dernières versions stables.',
    'maint.step2.title': 'Sauvegardes',
    'maint.step2.desc': 'sauvegardes régulières hors site pour assurer la sécurité des données.',
    'maint.step3.title': 'Sécurité',
    'maint.step3.desc': 'surveillance des vulnérabilités et correction proactive.',
    'maint.step4.title': 'Performance',
    'maint.step4.desc': 'vérifications régulières pour assurer que le site se charge rapidement.',
    'maint.step5.title': 'Rapports',
    'maint.step5.desc': 'un résumé mensuel de ce qui a été fait et de la performance du site.',
    'maint.cta_text': 'Tranquillité d\'esprit pour votre entreprise.',
    'maint.subscribe': 'S\'abonner maintenant',
    'website.step1.title': 'Découverte',
    'website.step1.desc': 'comprendre votre marque, votre public et vos objectifs.',
    'website.step2.title': 'Conception',
    'website.step2.desc': 'créer un style visuel et une mise en page adaptés à vos besoins.',
    'website.step3.title': 'Développement',
    'website.step3.desc': 'coder le site avec les meilleures pratiques pour la vitesse et le SEO.',
    'website.step4.title': 'Contenu',
    'website.step4.desc': 'ajouter votre texte et vos images (ou vous aider à les créer).',
    'website.step5.title': 'Lancement',
    'website.step5.desc': 'connecter votre domaine, configurer le SSL et mettre en ligne.',
    'website.step6.title': 'Formation',
    'website.step6.desc': 'vous montrer comment mettre à jour le contenu si nécessaire.',
    'website.timeline': 'Calendrier typique : 2–6 semaines. Prêt à commencer ?',
    'website.quote': 'Obtenir un devis',
    'python.hero.title': 'Logique d\'Entreprise Python',
    'python.hero.lead': 'Exploiter la puissance brute de Python pour automatiser, analyser et dominer les processus d\'affaires. Efficacité pure, conçue pour l\'élite.',
    'python.cta.start': 'Déployer la Logique',
    'python.cta.audit': 'Audit Système',
    'python.feat.1.title': 'Domination Algorithmique',
    'python.feat.1.desc': 'Des algorithmes personnalisés qui surpassent l\'efficacité humaine de plusieurs ordres de grandeur.',
    'python.feat.2.title': 'Souveraineté des Données',
    'python.feat.2.desc': 'Pipelines de traitement de données sécurisés et localisés assurant un contrôle total.',
    'python.feat.3.title': 'Intégration IA',
    'python.feat.3.desc': 'Intégration transparente de modèles d\'IA avancés pour une intelligence d\'affaires prédictive.',
    'python.stats.1': 'Augm. Efficacité',
    'python.stats.2': 'Réd. Coûts',
    'python.stats.3': 'Dispo. Logique',
    'audit.title': 'Protocole d\'Audit Souverain',
    'audit.lead': 'Initiez une analyse approfondie de votre actif numérique. Identifiez les vulnérabilités. Quantifiez l\'inefficacité. Préparez-vous à la conquête.',
    'audit.input.placeholder': 'ENTRER L\'URL CIBLE',
    'audit.btn.scan': 'LANCER LE SCAN',
    'audit.status.init': 'Initialisation du Protocole Souverain...',
    'audit.status.connect': 'Établissement de la Liaison Neurale...',
    'audit.status.analyze': 'Analyse des Surfaces Vectorielles...',
    'audit.status.calc': 'Calcul du Score de Domination...',
    'audit.result.title': 'AUDIT TERMINÉ',
    'audit.result.score': 'Score de Domination:',
    'audit.result.vuln': 'Vulnérabilités Critiques Détectées',
    'audit.result.msg': 'Votre actif est exposé. L\'efficacité est sous-optimale. Intervention immédiate recommandée.',
    'audit.cta.fix': 'DÉPLOYER DES CORRECTIFS',
    'game.title': 'Simulation d\'Empire Souverain',
    'game.currency': 'Valeur Nette',
    'game.income': 'Revenu Passif',
    'game.btn.mine': 'MINER DES DONNÉES',
    'game.shop.title': 'Acquisition d\'Actifs',
    'game.upg.server': 'Serveur Cloud',
    'game.upg.algo': 'Algorithme de Trading',
    'game.upg.ai': 'Réseau de Neurones',
    'game.locked': 'Verrouillé',
  }
};

let _currentLang = null;
function _t(key) {
  const lang = _currentLang || localStorage.getItem('site_lang') || (navigator.language || 'en').split('-')[0];
  if (_i18n[lang] && _i18n[lang][key] !== undefined) return _i18n[lang][key];
  if (_i18n['en'] && _i18n['en'][key] !== undefined) return _i18n['en'][key];
  return '';
}

function applyTranslations(lang) {
  try {
    _currentLang = lang;
    const nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(n => {
      const key = n.getAttribute('data-i18n');
      const txt = _t(key);
      if (!txt) return;
      const tag = n.tagName.toLowerCase();
      if ((tag === 'input' || tag === 'textarea') && n.placeholder !== undefined) {
        n.placeholder = txt;
        return;
      }
      n.textContent = txt;
    });

    // placeholders using special attribute
    const elems = document.querySelectorAll('[data-i18n-placeholder]');
    elems.forEach(e => {
      const key = e.getAttribute('data-i18n-placeholder');
      const txt = _t(key);
      if (txt) e.placeholder = txt;
    });

    // set select(s) (any selector marked with data-lang-select)
    const selects = document.querySelectorAll('[data-lang-select]');
    selects.forEach(s => { try { s.value = lang; } catch (e) { } });
    localStorage.setItem('site_lang', lang);
  } catch (err) { console.error('i18n error', err); }
}

function initI18n() {
  const saved = localStorage.getItem('site_lang') || ((navigator.language || 'en').startsWith('es') ? 'es' : 'en');
  applyTranslations(saved);

  // Attach listeners to any language select in the page (data-lang-select)
  const selects = document.querySelectorAll('[data-lang-select]');
  selects.forEach(s => {
    s.addEventListener('change', (e) => {
      const val = e.target.value || 'en';
      applyTranslations(val);
    });
  });
}

// ---------- Contact form / mailto handler (uses translations above) ----------
function initContactForm() {
  console.log("Contact form initialized");
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("Form submission triggered");

    // Rate Limiting Logic (Client-side proxy for IP limit)
    const MAX_MESSAGES = 10;
    const today = new Date().toDateString();
    let storedDate = localStorage.getItem('contact_msg_date');
    let count = parseInt(localStorage.getItem('contact_msg_count') || '0', 10);

    if (storedDate !== today) {
      count = 0;
      localStorage.setItem('contact_msg_date', today);
      localStorage.setItem('contact_msg_count', '0');
    }

    console.log(`Rate limit check: ${count}/${MAX_MESSAGES}`);

    if (count >= MAX_MESSAGES) {
      console.warn("Rate limit exceeded");
      if (status) {
        status.classList.remove('hidden');
        status.style.color = '#ef4444';
        status.textContent = 'Daily message limit reached (10/10). Please try again tomorrow.';
      }
      return;
    }

    const fname = (form.firstname && form.firstname.value || '').trim();
    const email = (form.email && form.email.value || '').trim();
    const message = (form.subject && form.subject.value || '').trim();

    // simple validation
    if (!fname || !email || !message) {
      console.warn("Validation failed: missing fields");
      if (status) {
        status.classList.remove('hidden');
        status.style.color = '#ef4444';
        status.textContent = _t('status.fill_required') || 'Please fill the required fields.';
      }
      return;
    }

    // Prepare FormData for Formsubmit.co
    const formData = new FormData(form);
    // Add a custom subject field for the email
    formData.append('_subject', `New Lead: ${fname}`);
    // Disable captcha to keep it smooth (optional, remove if spam is high)
    formData.append('_captcha', 'false');
    // Set template to box (optional, looks nicer)
    formData.append('_template', 'table');

    if (status) {
      status.classList.remove('hidden');
      status.style.color = '#10b981';
      status.textContent = 'Sending message...';
    }

    console.log("Sending fetch request to FormSubmit...");

    fetch("https://formsubmit.co/ajax/juan.ant772@gmail.com", {
      method: "POST",
      body: formData
    })
      .then(response => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then(data => {
        console.log("FormSubmit data:", data);
        if (data.success === "true" || data.success === true) {
          // Increment count ONLY on success
          count++;
          localStorage.setItem('contact_msg_count', count.toString());

          status.textContent = 'Message sent successfully! We will be in touch.';
          status.style.color = '#10b981';
          form.reset();

          setTimeout(() => {
            alert("Message sent successfully! We will be in touch shortly.");
          }, 100);
        } else {
          // Handle specific FormSubmit errors
          let msg = data.message || 'Submission failed';

          if (msg.toLowerCase().includes('activate')) {
            status.textContent = 'Action Required: Check your email (juan.ant772@gmail.com) to Activate this form.';
            status.style.color = '#f59e0b'; // Orange/Yellow warning
            alert("Almost done! Please check your email to Activate the form.");
          } else {
            status.textContent = 'Error: ' + msg;
            status.style.color = '#ef4444';
          }
          // Don't throw here, just handled UI
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        status.textContent = 'Network Error. Please use WhatsApp: +1 (809) 729-2380';
        status.style.color = '#ef4444';
      });
  });
}

// ---------- Init on DOM ready ----------

// ---------- Golden Glance Experience (Particles, Reveal, Tilt) ----------
function initGoldenGlance() {
  // 1. Particle Network
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 150;
    const mouseDistance = 200;

    const mouse = { x: null, y: null };

    // Handle mouse relative to canvas/viewport correctly
    window.addEventListener('mousemove', (e) => {
      // If canvas is fixed/absolute in hero, we need relative coords? 
      // Actually hero is relative, canvas is absolute top 0 left 0. 
      // e.clientX is viewport. If hero is at top, clientX/Y works mostly.
      // But let's use getBoundingClientRect to be safe.
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function resize() {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#FFD700' : '#00f2ff'; // Gold or Cyber Blue
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const direction = -1; // -1 to repel, 1 to attract
            this.vx += forceDirectionX * force * direction * 0.05;
            this.vy += forceDirectionY * force * direction * 0.05;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      resize();
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connections
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 215, 0, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }

    // Debounce resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initParticles, 100);
    });

    initParticles();
    animateParticles();
  }

  // 2. Scroll Reveal
  const revealElements = document.querySelectorAll('.card, .section-header, .hero-text, .stats-bar, .gallery-item');
  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // 3. 3D Tilt Effect
  const cards = document.querySelectorAll('.card, .gallery-item');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}


// ---------- Init on DOM ready ----------
window.addEventListener('DOMContentLoaded', () => {
  initRain();
  // loadTawkOnce removed per user request
  // initialize i18n before other UI that may rely on text
  initI18n();
  // Then initialize fallback chat UI / safe API
  // contact form handler (if present)
  initContactForm();
  initChatUI();
  initTypingEffect();
  initGoldenGlance(); // Launch visual enhancements
});
