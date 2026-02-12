// Tulkošanas pārvaldnieks Anellija vietnei
class TranslationManager {
    constructor() {
        this.currentLanguage = 'ru';
        this.translations = this.getTranslations();
        this.storageKey = 'anellija_language';
    }

    // Inicializēt: noteikt pārlūka valodu vai ielādēt no krātuves
    init() {
        try {
            // Pārbaudīt, vai lietotājam ir saglabāta preference
            const savedLang = localStorage.getItem(this.storageKey);
            if (savedLang && ['ru', 'lv', 'en'].includes(savedLang)) {
                this.setLanguage(savedLang);
                return;
            }
        } catch (e) {
            console.warn('LocalStorage nav pieejams:', e);
        }

        // Noteikt pārlūka valodu
        const browserLang = this.detectBrowserLanguage();
        this.setLanguage(browserLang);
    }

    // Noteikt pārlūka valodas preferenci
    detectBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        const langCode = lang.split('-')[0].toLowerCase();
        
        // Kartēt uz atbalstītajām valodām
        if (langCode === 'lv') return 'lv';
        if (langCode === 'en') return 'en';
        return 'ru'; // Noklusējums - krievu valoda
    }

    // Pārslēgties uz jaunu valodu
    setLanguage(lang) {
        if (!['ru', 'lv', 'en'].includes(lang)) {
            console.error('Nederīgs valodas kods:', lang);
            return;
        }

        this.currentLanguage = lang;
        
        // Saglabāt localStorage
        try {
            localStorage.setItem(this.storageKey, lang);
        } catch (e) {
            console.warn('Nevarēja saglabāt valodas preferenci:', e);
        }

        // Atjaunināt DOM
        this.updateDOM();
        
        // Atjaunināt HTML lang atribūtu
        document.documentElement.lang = lang;
        
        // Atjaunināt aktīvās valodas pogu
        this.updateActiveLanguageButton();
    }

    // Atjaunināt visus tulkojamos elementus DOM
    updateDOM() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else if (el.tagName === 'OPTION') {
                el.textContent = translation;
            } else {
                el.textContent = translation;
            }
        });
        
        // Apstrādāt placeholder atribūtus atsevišķi
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.translate(key);
            el.placeholder = translation;
        });
        
        // Apstrādāt aria-label atribūtus
        const ariaElements = document.querySelectorAll('[data-i18n-aria]');
        ariaElements.forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const translation = this.translate(key);
            el.setAttribute('aria-label', translation);
        });
        
        // Atjaunināt garuma izvadi
        const lengthSlider = document.getElementById('length');
        const lengthOutput = document.getElementById('lengthValue');
        if (lengthSlider && lengthOutput) {
            const unit = this.translate('calculator.unit.meters');
            lengthOutput.textContent = `${lengthSlider.value} ${unit}`;
        }
    }

    // Iegūt tulkojumu atslēgai
    translate(key) {
        const translation = this.translations[this.currentLanguage]?.[key];
        if (!translation) {
            console.warn(`Trūkst tulkojuma atslēgai: ${key}`);
            return `[${key}]`;
        }
        return translation;
    }

    // Atjaunināt aktīvās valodas pogas stilu
    updateActiveLanguageButton() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === this.currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Iegūt visus tulkojumus
    getTranslations() {
        return {
            ru: {
                // Navigācija
                'nav.home': 'Главная',
                'nav.services': 'Услуги',
                'nav.portfolio': 'Проекты',
                'nav.calculator': 'Расчёт',
                'nav.contacts': 'Контакты',
                
                // Galvenā sadaļa
                'hero.title': 'Надёжные заборы',
                'hero.title.highlight': 'и интеллектуальные ворота для вашего пространства',
                'hero.subtitle': 'Производство, установка и автоматика «под ключ». Гарантия 5 лет на все работы.',
                'hero.cta': 'Рассчитать стоимость',
                
                // Pakalpojumi
                'services.title': 'Что мы делаем',
                'services.subtitle': 'Полный цикл работ — от проекта до установки и обслуживания.',
                'services.fences.title': 'Заборы',
                'services.fences.desc': 'Из профлиста, евроштакетника, 3D-сетки, дерева, сварные и кованые.',
                'services.gates.title': 'Ворота и калитки',
                'services.gates.desc': 'Распашные, откатные, секционные. Любой сложности и дизайна.',
                'services.automation.title': 'Автоматика',
                'services.automation.desc': 'Установка и настройка приводов, пультов, систем контроля доступа.',
                'services.installation.title': 'Монтаж «под ключ»',
                'services.installation.desc': 'Собственная бригада мастеров с опытом более 10 лет. Чёткие сроки по договору.',
                
                // Portfelis
                'portfolio.title': 'Наши работы',
                'portfolio.subtitle': 'Более 540 реализованных проектов с 2010 года.',
                'portfolio.prev': 'Предыдущее фото',
                'portfolio.next': 'Следующее фото',
                
                // Kalkulators
                'calculator.title': 'Рассчитайте стоимость онлайн',
                'calculator.subtitle': 'Ответьте на 4 вопроса и получите предварительную смету.',
                'calculator.benefit1': 'Гарантия точной цены — без скрытых платежей',
                'calculator.benefit2': 'Выезд замерщика — бесплатно',
                'calculator.benefit3': 'Скидка 10% при заказе с сайта',
                'calculator.step1.label': '1. Выберите тип ограждения:',
                'calculator.step1.placeholder': '-- Выберите --',
                'calculator.step1.profiled': 'Забор из профлиста (от 2600 р/м²)',
                'calculator.step1.euro': 'Евроштакетник (от 3200 р/м²)',
                'calculator.step1.3d': '3D-сетка (от 3200 р/м²)',
                'calculator.step1.wood': 'Деревянный (от 3400 р/м²)',
                'calculator.step2.label': '2. Нужны ли ворота/калитка?',
                'calculator.step2.yes': 'Да',
                'calculator.step2.no': 'Нет',
                'calculator.step3.label': '3. Примерная длина (метры):',
                'calculator.step4.label': '4. Ваш телефон для расчёта:',
                'calculator.step4.placeholder': '+7 (999) 123-45-67',
                'calculator.btn.prev': 'Назад',
                'calculator.btn.next': 'Далее',
                'calculator.btn.submit': 'Получить расчёт',
                'calculator.unit.meters': 'м',
                'calculator.result.title': 'Предварительный расчёт готов!',
                'calculator.result.cost': 'Примерная стоимость:',
                'calculator.result.contact': 'Наш менеджер свяжется с вами по номеру',
                'calculator.result.time': 'в течение 15 минут для уточнения деталей.',
                'calculator.alert.fill': 'Пожалуйста, заполните все обязательные поля.',
                'calculator.currency': 'руб.',
                
                // Kājene
                'footer.description': 'Изготовление и установка заборов, ворот, калиток и автоматики. Качество и надёжность с 2010 года.',
                'footer.contacts.title': 'Контакты',
                'footer.links.title': 'Быстрые ссылки',
                'footer.schedule': 'Пн-Сб: 9:00 - 17:00',
                'footer.copyright': '© 2026 Anellija. Все права защищены.',
                'footer.link.services': 'Услуги',
                'footer.link.portfolio': 'Наши работы',
                'footer.link.calculator': 'Калькулятор',
                'footer.link.contacts': 'Контакты'
            },
            
            lv: {
                // Navigācija
                'nav.home': 'Sākums',
                'nav.services': 'Pakalpojumi',
                'nav.portfolio': 'Projekti',
                'nav.calculator': 'Kalkulators',
                'nav.contacts': 'Kontakti',
                
                // Galvenā sadaļa
                'hero.title': 'Uzticami žogi',
                'hero.title.highlight': 'un inteliģenti vārti jūsu telpai',
                'hero.subtitle': 'Ražošana, uzstādīšana un automatizācija "atslēgas rokās". 5 gadu garantija visiem darbiem.',
                'hero.cta': 'Aprēķināt izmaksas',
                
                // Pakalpojumi
                'services.title': 'Ko mēs darām',
                'services.subtitle': 'Pilns darbu cikls — no projekta līdz uzstādīšanai un apkopei.',
                'services.fences.title': 'Žogi',
                'services.fences.desc': 'No profilētā metāla, eiroštaketa, 3D tīkla, koka, metināti un kalti.',
                'services.gates.title': 'Vārti un vārtiņi',
                'services.gates.desc': 'Divviru, bīdāmie, sekciju. Jebkuras sarežģītības un dizaina.',
                'services.automation.title': 'Automatizācija',
                'services.automation.desc': 'Piedziņu, pultu, piekļuves kontroles sistēmu uzstādīšana un iestatīšana.',
                'services.installation.title': 'Montāža "atslēgas rokās"',
                'services.installation.desc': 'Sava meistaru brigāde ar vairāk nekā 10 gadu pieredzi. Precīzi termiņi pēc līguma.',
                
                // Portfelis
                'portfolio.title': 'Mūsu darbi',
                'portfolio.subtitle': 'Vairāk nekā 540 realizēti projekti kopš 2010. gada.',
                'portfolio.prev': 'Iepriekšējais foto',
                'portfolio.next': 'Nākamais foto',
                
                // Kalkulators
                'calculator.title': 'Aprēķiniet izmaksas tiešsaistē',
                'calculator.subtitle': 'Atbildiet uz 4 jautājumiem un saņemiet provizorisko tāmi.',
                'calculator.benefit1': 'Precīzas cenas garantija — bez slēptām maksām',
                'calculator.benefit2': 'Mērnieka izbraukums — bez maksas',
                'calculator.benefit3': '10% atlaide, pasūtot no mājaslapas',
                'calculator.step1.label': '1. Izvēlieties žoga tipu:',
                'calculator.step1.placeholder': '-- Izvēlieties --',
                'calculator.step1.profiled': 'Žogs no profilētā metāla (no 2600 р/m²)',
                'calculator.step1.euro': 'Eiroštakets (no 3200 р/m²)',
                'calculator.step1.3d': '3D tīkls (no 3200 р/m²)',
                'calculator.step1.wood': 'Koka (no 3400 р/m²)',
                'calculator.step2.label': '2. Vai nepieciešami vārti/vārtiņi?',
                'calculator.step2.yes': 'Jā',
                'calculator.step2.no': 'Nē',
                'calculator.step3.label': '3. Aptuvens garums (metri):',
                'calculator.step4.label': '4. Jūsu tālrunis aprēķinam:',
                'calculator.step4.placeholder': '+371 (999) 123-45',
                'calculator.btn.prev': 'Atpakaļ',
                'calculator.btn.next': 'Tālāk',
                'calculator.btn.submit': 'Saņemt aprēķinu',
                'calculator.unit.meters': 'm',
                'calculator.result.title': 'Provizoriskais aprēķins ir gatavs!',
                'calculator.result.cost': 'Aptuvenas izmaksas:',
                'calculator.result.contact': 'Mūsu vadītājs sazināsies ar jums pa numuru',
                'calculator.result.time': '15 minūšu laikā, lai precizētu detaļas.',
                'calculator.alert.fill': 'Lūdzu, aizpildiet visus obligātos laukus.',
                'calculator.currency': 'р.',
                
                // Kājene
                'footer.description': 'Žogu, vārtu, vārtiņu un automātikas izgatavošana un uzstādīšana. Kvalitāte un uzticamība kopš 2010. gada.',
                'footer.contacts.title': 'Kontakti',
                'footer.links.title': 'Ātrās saites',
                'footer.schedule': 'P-S: 9:00 - 17:00',
                'footer.copyright': '© 2026 Anellija. Visas tiesības aizsargātas.',
                'footer.link.services': 'Pakalpojumi',
                'footer.link.portfolio': 'Mūsu darbi',
                'footer.link.calculator': 'Kalkulators',
                'footer.link.contacts': 'Kontakti'
            },
            
            en: {
                // Navigācija
                'nav.home': 'Home',
                'nav.services': 'Services',
                'nav.portfolio': 'Projects',
                'nav.calculator': 'Calculator',
                'nav.contacts': 'Contacts',
                
                // Galvenā sadaļa
                'hero.title': 'Reliable fences',
                'hero.title.highlight': 'and smart gates for your space',
                'hero.subtitle': 'Manufacturing, installation and automation turnkey. 5-year warranty on all work.',
                'hero.cta': 'Calculate cost',
                
                // Pakalpojumi
                'services.title': 'What we do',
                'services.subtitle': 'Full cycle of work — from design to installation and maintenance.',
                'services.fences.title': 'Fences',
                'services.fences.desc': 'From profiled metal, euro picket, 3D mesh, wood, welded and forged.',
                'services.gates.title': 'Gates and wickets',
                'services.gates.desc': 'Swing, sliding, sectional. Any complexity and design.',
                'services.automation.title': 'Automation',
                'services.automation.desc': 'Installation and configuration of drives, remotes, access control systems.',
                'services.installation.title': 'Turnkey installation',
                'services.installation.desc': 'Our own team of craftsmen with over 10 years of experience. Clear deadlines by contract.',
                
                // Portfelis
                'portfolio.title': 'Our work',
                'portfolio.subtitle': 'More than 540 completed projects since 2010.',
                'portfolio.prev': 'Previous photo',
                'portfolio.next': 'Next photo',
                
                // Kalkulators
                'calculator.title': 'Calculate cost online',
                'calculator.subtitle': 'Answer 4 questions and get a preliminary estimate.',
                'calculator.benefit1': 'Exact price guarantee — no hidden fees',
                'calculator.benefit2': 'Surveyor visit — free',
                'calculator.benefit3': '10% discount when ordering from the website',
                'calculator.step1.label': '1. Choose fence type:',
                'calculator.step1.placeholder': '-- Select --',
                'calculator.step1.profiled': 'Profiled metal fence (from 2600 р/m²)',
                'calculator.step1.euro': 'Euro picket (from 3200 р/m²)',
                'calculator.step1.3d': '3D mesh (from 3200 р/m²)',
                'calculator.step1.wood': 'Wooden (from 3400 р/m²)',
                'calculator.step2.label': '2. Do you need gates/wicket?',
                'calculator.step2.yes': 'Yes',
                'calculator.step2.no': 'No',
                'calculator.step3.label': '3. Approximate length (meters):',
                'calculator.step4.label': '4. Your phone for calculation:',
                'calculator.step4.placeholder': '+44 (999) 123-45-67',
                'calculator.btn.prev': 'Back',
                'calculator.btn.next': 'Next',
                'calculator.btn.submit': 'Get estimate',
                'calculator.unit.meters': 'm',
                'calculator.result.title': 'Preliminary estimate is ready!',
                'calculator.result.cost': 'Approximate cost:',
                'calculator.result.contact': 'Our manager will contact you at',
                'calculator.result.time': 'within 15 minutes to clarify details.',
                'calculator.alert.fill': 'Please fill in all required fields.',
                'calculator.currency': 'rub.',
                
                // Kājene
                'footer.description': 'Manufacturing and installation of fences, gates, wickets and automation. Quality and reliability since 2010.',
                'footer.contacts.title': 'Contacts',
                'footer.links.title': 'Quick links',
                'footer.schedule': 'Mon-Sat: 9:00 - 17:00',
                'footer.copyright': '© 2026 Anellija. All rights reserved.',
                'footer.link.services': 'Services',
                'footer.link.portfolio': 'Our work',
                'footer.link.calculator': 'Calculator',
                'footer.link.contacts': 'Contacts'
            }
        };
    }
}
