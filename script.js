// Variables globales para menús desplegables
const menus = ['dropdown-envios', 'dropdown-contacto', 'dropdown-info', 'dropdown-ayuda', 'dropdown-trabajo'];

function toggleMenu(id) {
  menus.forEach(menuId => {
    if (menuId === id) {
      const el = document.getElementById(menuId);
      el.style.display = (el.style.display === 'block') ? 'none' : 'block';
    } else {
      document.getElementById(menuId).style.display = 'none';
    }
  });
}

// Cerrar menús al hacer clic fuera
document.addEventListener('click', e => {
  if (!e.target.matches('button')) {
    menus.forEach(menuId => {
      document.getElementById(menuId).style.display = 'none';
    });
  }
});

// Traducción simple ES <-> EN
const translations = {
  es: {
    'Bienvenidos a CERO S.A.': 'Welcome to CERO S.A.',
    'Somos una empresa de logística internacional con base en <strong>San Clemente del Tuyú, Argentina</strong>. Conectamos América y Europa ofreciendo soluciones personalizadas, rápidas y seguras para tus envíos.':
      'We are an international logistics company based in <strong>San Clemente del Tuyú, Argentina</strong>. Connecting America and Europe with personalized, fast, and secure shipping solutions.',
    '¿Por qué elegirnos?': 'Why choose us?',
    'Más de 10 años de experiencia en transporte internacional.': 'Over 10 years of experience in international shipping.',
    'Seguimiento en tiempo real y atención personalizada 24/7.': 'Real-time tracking and 24/7 personalized support.',
    'Presencia en América y Europa.': 'Presence in America and Europe.',
    'Nuestro compromiso': 'Our commitment',
    'Operamos con estándares de calidad ISO 9001, prácticas sostenibles y vehículos eficientes para cuidar el medio ambiente y tu carga.':
      'We operate with ISO 9001 quality standards, sustainable practices, and efficient vehicles to protect the environment and your cargo.',
    'Selecciona un país': 'Select a country',
    'Aquí aparecerán los precios estimados y los días hábiles de envío.': 'Estimated prices and shipping days will appear here.',
    'Peso de la mercadería (kg): ': 'Weight of merchandise (kg):',
    'Calcular envío': 'Calculate shipping',
    'Días hábiles: ': 'Business days: ',
    'Precio estimado: USD ': 'Estimated price: USD ',
  },
  en: {}
};
translations.en = Object.fromEntries(
  Object.entries(translations.es).map(([k, v]) => [v, k])
);

let currentLang = 'es';

const translateBtn = document.getElementById('translateBtn');
translateBtn.addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  translatePage(currentLang);
});

function translatePage(lang) {
  // Textos fijos
  document.querySelector('.intro h2').textContent = translations[lang]['Bienvenidos a CERO S.A.'];
  document.querySelector('.intro p').innerHTML = translations[lang]['Somos una empresa de logística internacional con base en <strong>San Clemente del Tuyú, Argentina</strong>. Conectamos América y Europa ofreciendo soluciones personalizadas, rápidas y seguras para tus envíos.'];
  document.querySelector('.why-choose .card:nth-child(1) h3').textContent = translations[lang]['¿Por qué elegirnos?'];
  const reasons = document.querySelectorAll('.why-choose .card:nth-child(1) ul li');
  reasons[0].textContent = translations[lang]['Más de 10 años de experiencia en transporte internacional.'];
  reasons[1].textContent = translations[lang]['Seguimiento en tiempo real y atención personalizada 24/7.'];
  reasons[2].textContent = translations[lang]['Presencia en América y Europa.'];

  document.querySelector('.why-choose .card:nth-child(2) h3').textContent = translations[lang]['Nuestro compromiso'];
  document.querySelector('.why-choose .card:nth-child(2) p').textContent = translations[lang]['Operamos con estándares de calidad ISO 9001, prácticas sostenibles y vehículos eficientes para cuidar el medio ambiente y tu carga.'];

  document.getElementById('info-title').textContent = translations[lang]['Selecciona un país'];
  document.getElementById('info-content').textContent = translations[lang]['Aquí aparecerán los precios estimados y los días hábiles de envío.'];
  document.querySelector('label[for="pesoInput"]').textContent = translations[lang]['Peso de la mercadería (kg): '];
  document.querySelector('#calcBtn').textContent = translations[lang]['Calcular envío'];
}

// Datos de países: precio base y días hábiles
const countries = {
  Argentina: { days: 3, basePrice: 30 },
  Brasil: { days: 6, basePrice: 45 },
  Chile: { days: 5, basePrice: 40 },
  México: { days: 8, basePrice: 50 },
  Colombia: { days: 7, basePrice: 48 },
  'Estados Unidos': { days: 8, basePrice: 55 },
  España: { days: 10, basePrice: 60 },
  Francia: { days: 10, basePrice: 60 },
  Alemania: { days: 11, basePrice: 62 },
};

// Inicializar mapa Leaflet
const map = L.map('map', { zoomControl: false }).setView([-34.5, -58.4], 3);

// Capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 10,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marcadores con popup y evento clic para mostrar info
Object.entries(countries).forEach(([country, info]) => {
  // Coordenadas aproximadas
  const coords = {
    Argentina: [-34.6, -58.4],
    Brasil: [-14.2, -51.9],
    Chile: [-33.4, -70.6],
    México: [23.6, -102.5],
    Colombia: [4.6, -74.1],
    'Estados Unidos': [39.8, -98.6],
    España: [40.4, -3.7],
    Francia: [46.2, 2.2],
    Alemania: [51.2, 10.4],
  };

  const marker = L.marker(coords[country]).addTo(map);
  marker.bindPopup(`<strong>${country}</strong><br>Días hábiles: ${info.days}<br>Precio base: USD ${info.basePrice}`);
  marker.on('click', () => {
    mostrarInfoPais(country);
  });
});

function mostrarInfoPais(country) {
  const info = countries[country];
  if (!info) return;

  const title = document.getElementById('info-title');
  const content = document.getElementById('info-content');
  const resultado = document.getElementById('resultadoPrecio');
  const pesoInput = document.getElementById('pesoInput');

  title.textContent = country;
  content.textContent = `${(currentLang === 'es') ? 'Días hábiles: ' : 'Business days: '}${info.days}\n${(currentLang === 'es') ? 'Precio base: USD ' : 'Estimated price: USD '}${info.basePrice}`;
  resultado.textContent = '';

  pesoInput.value = 1;

  // Guardar país seleccionado para cálculo
  pesoInput.dataset.pais = country;
}

// Función para calcular precio envío
document.getElementById('calcBtn').addEventListener('click', () => {
  const pesoInput = document.getElementById('pesoInput');
  const resultado = document.getElementById('resultadoPrecio');
  const peso = parseFloat(pesoInput.value);
  const pais = pesoInput.dataset.pais;

  if (!pais) {
    resultado.textContent = (currentLang === 'es') ? 'Por favor selecciona un país primero.' : 'Please select a country first.';
    return;
  }

  if (isNaN(peso) || peso <= 0) {
    resultado.textContent = (currentLang === 'es') ? 'Ingresa un peso válido mayor que cero.' : 'Enter a valid weight greater than zero.';
    return;
  }

  const basePrice = countries[pais].basePrice;

  // Precio ficticio: basePrice + 12 USD por kg extra
  const precioTotal = basePrice + (peso - 1) * 12;

  resultado.textContent = (currentLang === 'es' ? 'Precio estimado: USD ' : 'Estimated price: USD ') + precioTotal.toFixed(2);
});

// Traducción inicial
translatePage(currentLang);