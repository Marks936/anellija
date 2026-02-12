// === Inicializēt tulkošanas pārvaldnieku ===
const translationManager = new TranslationManager();

// === Inicializēt tēmas pārvaldnieku ===
const themeManager = new ThemeManager();

// === Mobilā izvēlne ===
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.innerHTML = navMenu.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// === Valodas pārslēdzēja notikumu klausītāji ===
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        translationManager.setLanguage(lang);
    });
});

// === Tēmas pārslēgšanas notikumu klausītājs ===
document.querySelector('.theme-toggle').addEventListener('click', () => {
    themeManager.toggleTheme();
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

// === Galerija ===
const galleryImages = [
    'gallery/gates_1.png',
    'gallery/gates_2.png',
    'gallery/fence_1.png',
    'gallery/fence_2.png',
    'gallery/door_1.png',
];

const galleryEl = document.querySelector('.gallery');
const totalImgEl = document.getElementById('totalImg');
const animationController = new AnimationController(galleryEl, galleryImages);

totalImgEl.textContent = galleryImages.length;

// Inicializēt galeriju
animationController.init();

// Pievienot notikumu klausītājus galerijas vadīklām
document.getElementById('nextBtn').addEventListener('click', () => {
    animationController.next();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    animationController.previous();
});

// === Kalkulators ===
const formSteps = document.querySelectorAll('.form-step');
const nextBtn = document.getElementById('nextStep');
const prevBtn = document.getElementById('prevStep');
const submitBtn = document.getElementById('submitForm');
const form = document.getElementById('costCalcForm');
const lengthSlider = document.getElementById('length');
const lengthOutput = document.getElementById('lengthValue');
let currentStep = 0;

function showStep(step) {
    formSteps.forEach((s, idx) => {
        s.classList.toggle('active', idx === step);
    });
    prevBtn.style.display = step === 0 ? 'none' : 'inline-block';
    nextBtn.style.display = step === formSteps.length - 1 ? 'none' : 'inline-block';
    submitBtn.style.display = step === formSteps.length - 1 ? 'inline-block' : 'none';
}

nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentInputs = formSteps[currentStep].querySelectorAll('select, input[type="radio"]:checked, input[type="tel"]');
    let isValid = true;
    currentInputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.style.borderColor = '#ef4444';
        } else {
            input.style.borderColor = '#e5e7eb';
        }
    });
    if (isValid && currentStep < formSteps.length - 1) {
        currentStep++;
        showStep(currentStep);
    }
});

prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
});

lengthSlider.addEventListener('input', () => {
    const unit = translationManager.translate('calculator.unit.meters');
    lengthOutput.textContent = `${lengthSlider.value} ${unit}`;
});

// Izmaksu aprēķins
const priceMap = {
    profiled: 2600,
    euro: 3200,
    '3d': 3200,
    wood: 3400
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fenceType = document.getElementById('fenceType').value;
    const length = parseInt(lengthSlider.value);
    const hasGate = document.querySelector('input[name="gate"]:checked')?.value === 'yes';
    const phone = document.getElementById('phone').value;

    if (!fenceType || !phone) {
        alert(translationManager.translate('calculator.alert.fill'));
        return;
    }

    let basePrice = priceMap[fenceType] || 3000;
    let total = basePrice * length;
    if (hasGate) total += 20000; // pievienot vārtu izmaksas

    const resultEl = document.getElementById('formResult');
    const title = translationManager.translate('calculator.result.title');
    const costLabel = translationManager.translate('calculator.result.cost');
    const contact = translationManager.translate('calculator.result.contact');
    const time = translationManager.translate('calculator.result.time');
    const currency = translationManager.translate('calculator.currency');
    
    resultEl.innerHTML = `
        <strong>${title}</strong><br>
        ${costLabel} <strong>${total.toLocaleString('ru-RU')} ${currency}</strong><br>
        ${contact} <strong>${phone}</strong> ${time}
    `;
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth' });
});

showStep(0);

// === Inicializēt visus moduļus lapas ielādē ===
document.addEventListener('DOMContentLoaded', () => {
    translationManager.init();
    themeManager.init();
});
