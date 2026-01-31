// === mobile ===
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

// === gallery ===
const galleryImages = [
    'gallery/gates_1.png',
    'gallery/gates_2.png',
    'gallery/fence_1.png',
    'gallery/fence_2.png',
    'gallery/door_1.png',
];

let currentIndex = 0;
const totalImgEl = document.getElementById('totalImg');
const currentImgEl = document.getElementById('currentImg');
const galleryEl = document.querySelector('.gallery');

totalImgEl.textContent = galleryImages.length;

// gallery-update
function updateGalleryImage() {
    galleryEl.style.background = `url('${galleryImages[currentIndex]}') center/cover no-repeat`;
    currentImgEl.textContent = currentIndex + 1;
    galleryEl.innerHTML = '';
    const controls = document.createElement('div');
    controls.className = 'gallery-controls';
    controls.innerHTML = `
        <button id="prevBtn" aria-label="Предыдущее фото"><i class="fas fa-chevron-left"></i></button>
        <button id="nextBtn" aria-label="Следующее фото"><i class="fas fa-chevron-right"></i></button>
    `;
    galleryEl.appendChild(controls);
    attachGalleryEvents();
}

function attachGalleryEvents() {
    document.getElementById('nextBtn').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateGalleryImage();
    });
    document.getElementById('prevBtn').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateGalleryImage();
    });
}

updateGalleryImage();

// === calc ===
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
    lengthOutput.textContent = `${lengthSlider.value} м`;
});

// cost calc
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
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }

    let basePrice = priceMap[fenceType] || 3000;
    let total = basePrice * length;
    if (hasGate) total += 20000; // plus gate cost

    const resultEl = document.getElementById('formResult');
    resultEl.innerHTML = `
        <strong>Предварительный расчёт готов!</strong><br>
        Примерная стоимость: <strong>${total.toLocaleString('ru-RU')} руб.</strong><br>
        Наш менеджер свяжется с вами по номеру <strong>${phone}</strong> в течение 15 минут для уточнения деталей.
    `;
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth' });
});

showStep(0);