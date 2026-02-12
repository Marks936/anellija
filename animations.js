// Animācijas kontrolieris galerijai
class AnimationController {
    constructor(galleryElement, images) {
        this.gallery = galleryElement;
        this.images = images;
        this.currentIndex = 0;
        this.isAnimating = false;
        this.animationType = 'fade';
        this.animationDuration = 500;
    }

    // Inicializēt galeriju ar attēliem
    init() {
        this.showImage(0, false);
        this.updateCounter();
    }

    // Pāriet uz nākamo attēlu ar animāciju
    next() {
        if (this.isAnimating) return;
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(nextIndex, true);
    }

    // Pāriet uz iepriekšējo attēlu ar animāciju
    previous() {
        if (this.isAnimating) return;
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showImage(prevIndex, true);
    }

    // Parādīt konkrētu attēlu ar animāciju
    showImage(index, animate = true) {
        if (index < 0 || index >= this.images.length) {
            console.warn('Nederīgs attēla indekss:', index);
            return;
        }

        if (animate && !this.prefersReducedMotion()) {
            this.animate(this.currentIndex, index);
        } else {
            // Bez animācijas, vienkārši mainīt attēlu
            this.gallery.style.backgroundImage = `url('${this.images[index]}')`;
            this.gallery.style.backgroundSize = 'contain';
            this.gallery.style.backgroundPosition = 'center';
            this.gallery.style.backgroundRepeat = 'no-repeat';
            this.currentIndex = index;
            this.updateCounter();
        }
    }

    // Veikt animāciju starp attēliem
    animate(fromIndex, toIndex) {
        this.isAnimating = true;
        
        // Pievienot animācijas klasi
        this.gallery.classList.add('animating');
        
        // Izbalināt pašreizējo attēlu
        this.gallery.style.opacity = '0';
        
        setTimeout(() => {
            // Mainīt attēlu
            this.gallery.style.backgroundImage = `url('${this.images[toIndex]}')`;
            this.gallery.style.backgroundSize = 'contain';
            this.gallery.style.backgroundPosition = 'center';
            this.gallery.style.backgroundRepeat = 'no-repeat';
            this.currentIndex = toIndex;
            this.updateCounter();
            
            // Iekrāsot jauno attēlu
            setTimeout(() => {
                this.gallery.style.opacity = '1';
                this.gallery.classList.remove('animating');
                this.isAnimating = false;
            }, 50);
        }, this.animationDuration);
    }

    // Atjaunināt galerijas skaitītāju
    updateCounter() {
        const currentEl = document.getElementById('currentImg');
        if (currentEl) {
            currentEl.textContent = this.currentIndex + 1;
        }
    }

    // Pārbaudīt, vai lietotājs vēlas samazinātu kustību
    prefersReducedMotion() {
        try {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (e) {
            return false;
        }
    }
}
