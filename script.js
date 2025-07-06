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

// Traducción simple ES <-> EN usando claves fijas
const translations = {
  es: {
    welcome: 'Bienvenidos a CERO S.A.',
    intro: 'Somos una empresa de logística internacional con base en <strong>San Clemente del Tuyú, Argentina</strong>. Conectamos América y Europa ofreciendo soluciones personalizadas, rápidas y seguras para tus envíos.',
    whyChoose: '¿Por qué elegirnos?',
    reason1: 'En constante aprendizaje y mejoria.',
    reason2: 'Seguimiento en tiempo real y atención personalizada 24/7.',
    reason3: 'Presencia en América y Europa.',
    commitment: 'Nuestro compromiso',
    commitmentText: 'Operamos con estándares de calidad ISO 9001, prácticas sostenibles y vehículos eficientes para cuidar el medio ambiente y tu carga.',
    selectCountry: 'Selecciona un país',
    infoText: 'Aquí aparecerán los precios estimados y los días hábiles de envío.',
    weightLabel: 'Peso de la mercadería (kg):',
    calcBtn: 'Calcular envío',
    businessDays: 'Días hábiles: ',
    estimatedPrice: 'Precio estimado: USD ',
    selectCountryError: 'Por favor selecciona un país primero.',
    invalidWeightError: 'Ingresa un peso válido mayor que cero.'
  },
  en: {
    welcome: 'Welcome to CERO S.A.',
    intro: 'We are an international logistics company based in <strong>San Clemente del Tuyú, Argentina</strong>. Connecting America and Europe with personalized, fast, and secure shipping solutions.',
    whyChoose: 'Why choose us?',
    reason1: 'Constantly learning and improving.',
    reason2: 'Real-time tracking and 24/7 personalized support.',
    reason3: 'Presence in America and Europe.',
    commitment: 'Our commitment',
    commitmentText: 'We operate with ISO 9001 quality standards, sustainable practices, and efficient vehicles to protect the environment and your cargo.',
    selectCountry: 'Select a country',
    infoText: 'Estimated prices and shipping days will appear here.',
    weightLabel: 'Weight of merchandise (kg):',
    calcBtn: 'Calculate shipping',
    businessDays: 'Business days: ',
    estimatedPrice: 'Estimated price: USD ',
    selectCountryError: 'Please select a country first.',
    invalidWeightError: 'Enter a valid weight greater than zero.'
  }
};

let currentLang = 'es';

const translateBtn = document.getElementById('translateBtn');
translateBtn.addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  translatePage(currentLang);
});

function translatePage(lang) {
  document.querySelector('.intro h2').textContent = translations[lang].welcome;
  document.querySelector('.intro p').innerHTML = translations[lang].intro;
  document.querySelector('.why-choose .card:nth-child(1) h3').textContent = translations[lang].whyChoose;
  const reasons = document.querySelectorAll('.why-choose .card:nth-child(1) ul li');
  reasons[0].textContent = translations[lang].reason1;
  reasons[1].textContent = translations[lang].reason2;
  reasons[2].textContent = translations[lang].reason3;

  document.querySelector('.why-choose .card:nth-child(2) h3').textContent = translations[lang].commitment;
  document.querySelector('.why-choose .card:nth-child(2) p').textContent = translations[lang].commitmentText;

  document.getElementById('info-title').textContent = translations[lang].selectCountry;
  document.getElementById('info-content').textContent = translations[lang].infoText;
  document.querySelector('label[for="pesoInput"]').textContent = translations[lang].weightLabel;
  document.querySelector('#calcBtn').textContent = translations[lang].calcBtn;

  // Actualizar resultado y contenido país seleccionado en traducción si hay alguno
  const pesoInput = document.getElementById('pesoInput');
  const paisSeleccionado = pesoInput.dataset.pais;
  if (paisSeleccionado && countries[paisSeleccionado]) {
    mostrarInfoPais(paisSeleccionado);
  } else {
    document.getElementById('resultadoPrecio').textContent = '';
  }
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
  marker.bindPopup(`<strong>${country}</strong><br>${translations[currentLang].businessDays}${info.days}<br>${translations[currentLang].estimatedPrice}${info.basePrice}`);
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
  content.textContent = `${translations[currentLang].businessDays}${info.days}\n${translations[currentLang].estimatedPrice}${info.basePrice}`;
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
    resultado.textContent = translations[currentLang].selectCountryError;
    return;
  }

  if (isNaN(peso) || peso <= 0) {
    resultado.textContent = translations[currentLang].invalidWeightError;
    return;
  }

  const basePrice = countries[pais].basePrice;

  // Precio ficticio: basePrice + 12 USD por kg extra
  const precioTotal = basePrice + (peso - 1) * 12;

  resultado.textContent = translations[currentLang].estimatedPrice + precioTotal.toFixed(2);
});

// Traducción inicial
translatePage(currentLang);