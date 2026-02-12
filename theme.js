// Tēmas pārvaldnieks Anellija vietnei
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.storageKey = 'anellija_theme';
        this.themeConfig = this.getThemeConfig();
    }

    // Inicializēt: noteikt sistēmas preferenci vai ielādēt no krātuves
    init() {
        try {
            // Pārbaudīt, vai lietotājam ir saglabāta preference
            const savedTheme = localStorage.getItem(this.storageKey);
            if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
                this.applyTheme(savedTheme);
                return;
            }
        } catch (e) {
            console.warn('LocalStorage nav pieejams:', e);
        }

        // Noteikt sistēmas preferenci
        const systemTheme = this.detectSystemPreference();
        this.applyTheme(systemTheme);
    }

    // Noteikt sistēmas krāsu shēmas preferenci
    detectSystemPreference() {
        try {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        } catch (e) {
            console.warn('Nevarēja noteikt sistēmas preferenci:', e);
        }
        return 'light';
    }

    // Pārslēgties starp gaišo un tumšo tēmu
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    // Piemērot tēmu, atjauninot CSS mainīgos un klases
    applyTheme(theme) {
        if (!['light', 'dark'].includes(theme)) {
            console.error('Nederīga tēma:', theme);
            return;
        }

        this.currentTheme = theme;

        // Saglabāt localStorage
        try {
            localStorage.setItem(this.storageKey, theme);
        } catch (e) {
            console.warn('Nevarēja saglabāt tēmas preferenci:', e);
        }

        // Piemērot tēmas klasi body elementam
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);

        // Atjaunināt CSS mainīgos
        const config = this.themeConfig[theme];
        const root = document.documentElement;
        
        try {
            Object.keys(config).forEach(key => {
                root.style.setProperty(key, config[key]);
            });
        } catch (e) {
            console.error('Nevarēja piemērot CSS mainīgos:', e);
        }

        // Atjaunināt tēmas pārslēgšanas ikonu
        this.updateThemeIcon();
    }

    // Atjaunināt tēmas pārslēgšanas ikonu
    updateThemeIcon() {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            if (this.currentTheme === 'dark') {
                icon.className = 'fas fa-moon';
            } else {
                icon.className = 'fas fa-sun';
            }
        }
    }

    // Iegūt tēmas konfigurāciju
    getThemeConfig() {
        return {
            light: {
                '--primary': '#2563eb',
                '--primary-dark': '#1d4ed8',
                '--secondary': '#10b981',
                '--dark': '#1f2937',
                '--light': '#f9fafb',
                '--gray': '#6b7280',
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f9fafb',
                '--text-primary': '#1f2937',
                '--text-secondary': '#6b7280',
                '--card-bg': '#ffffff',
                '--card-border': '#f3f4f6',
                '--shadow': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                '--shadow-hover': '0 20px 40px -10px rgba(37, 99, 235, 0.25)',
                '--nav-bg': 'rgba(255, 255, 255, 0.95)',
                '--footer-bg': '#1f2937'
            },
            dark: {
                '--primary': '#3b82f6',
                '--primary-dark': '#2563eb',
                '--secondary': '#10b981',
                '--dark': '#f9fafb',
                '--light': '#1f2937',
                '--gray': '#9ca3af',
                '--bg-primary': '#111827',
                '--bg-secondary': '#1f2937',
                '--text-primary': '#f9fafb',
                '--text-secondary': '#d1d5db',
                '--card-bg': '#1f2937',
                '--card-border': '#374151',
                '--shadow': '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                '--shadow-hover': '0 20px 40px -10px rgba(59, 130, 246, 0.3)',
                '--nav-bg': 'rgba(31, 41, 55, 0.95)',
                '--footer-bg': '#0f172a'
            }
        };
    }
}
