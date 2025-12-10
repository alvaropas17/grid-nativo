/**
 * Sistema avanzado de gestión de temas
 */
class ThemeManager {
    constructor() {
        // Obtener elementos del DOM como propiedades de la instancia
        this.htmlElement = document.documentElement;
        this.themeToggle = document.getElementById('theme-toggle');
        this.sunIcon = document.getElementById('sun-icon');
        this.moonIcon = document.getElementById('moon-icon');
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.currentTheme = this.getInitialTheme();
        this.init();
    }

    /**
     * Inicializa el gestor de temas
     */
    init() {
        // Aplicar tema inicial
        this.applyTheme(this.currentTheme);

        // Escuchar cambios en la preferencia del sistema
        this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));

        // Configurar el botón de cambio de tema
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Actualizar variables RGB
        this.updateRgbVariables();
    }

    /**
     * Obtiene el tema inicial basado en preferencias
     */
    getInitialTheme() {
        // 1. Verificar preferencia guardada
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            return savedTheme;
        }

        // 2. Usar preferencia del sistema
        return this.mediaQuery.matches ? 'dark' : 'light';
    }

    /**
     * Aplica el tema especificado
     */
    applyTheme(theme) {
        const isDark = theme === 'dark';

        // Aplicar clase CSS
        this.htmlElement.classList.toggle('dark-mode', isDark);

        // Actualizar iconos
        if (this.sunIcon && this.moonIcon) {
            this.sunIcon.classList.toggle('hidden', isDark);
            this.moonIcon.classList.toggle('hidden', !isDark);
        }

        // Guardar preferencia
        localStorage.setItem('theme', theme);

        // Actualizar estado interno
        this.currentTheme = theme;

        // Actualizar variables RGB
        this.updateRgbVariables();

        // Aplicar transición suave
        this.addTransitionClass();
    }

    /**
     * Cambia entre tema claro y oscuro
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    /**
     * Maneja cambios en la preferencia del sistema
     */
    handleSystemThemeChange(e) {
        // Solo cambiar si no hay preferencia manual guardada
        if (!localStorage.getItem('theme')) {
            this.applyTheme(e.matches ? 'dark' : 'light');
        }
    }

    /**
     * Actualiza las variables RGB para usar con rgba()
     */
    updateRgbVariables() {
        const style = getComputedStyle(this.htmlElement);

        // Colores principales
        const colors = {
            primary: style.getPropertyValue('--color-primary').trim(),
            secondary: style.getPropertyValue('--color-secondary').trim(),
            accent: style.getPropertyValue('--color-accent').trim(),
            gaming: style.getPropertyValue('--color-gaming').trim(),
            tech: style.getPropertyValue('--color-tech').trim(),
            media: style.getPropertyValue('--color-media').trim()
        };

        // Convertir a RGB y establecer variables
        Object.entries(colors).forEach(([name, hex]) => {
            const rgb = this.hexToRgb(hex);
            if (rgb) {
                this.htmlElement.style.setProperty(`--color-${name}-rgb`, rgb);
            }
        });
    }

    /**
     * Convierte color hex a RGB
     */
    hexToRgb(hex) {
        // Eliminar # si existe
        hex = hex.replace('#', '');

        // Manejar formato corto (#abc -> #aabbcc)
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        // Validar formato
        if (hex.length !== 6) return null;

        // Convertir a RGB
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        return `${r}, ${g}, ${b}`;
    }

    /**
     * Añade clase de transición temporal para suavizar cambios
     */
    addTransitionClass() {
        this.htmlElement.classList.add('theme-transition');
        setTimeout(() => {
            this.htmlElement.classList.remove('theme-transition');
        }, 300);
    }

    /**
     * API pública para cambiar tema
     */
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        }
    }

    /**
     * Obtener tema actual
     */
    getTheme() {
        return this.currentTheme;
    }
}

/**
 * Animaciones y efectos avanzados
 */
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParallaxEffects();
    }

    /**
     * Configurar animaciones de scroll
     */
    setupScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.animationDelay =
                                `${Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1}s`;
                            entry.target.classList.add('animate-in');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
            );

            document.querySelectorAll('.bento-item').forEach(item => {
                observer.observe(item);
            });
        }
    }

    /**
     * Efectos de hover mejorados
     */
    setupHoverEffects() {
        document.querySelectorAll('.bento-item').forEach(item => {
            item.addEventListener('mouseenter', this.handleHoverEnter);
            item.addEventListener('mouseleave', this.handleHoverLeave);
        });
    }

    handleHoverEnter(e) {
        const item = e.currentTarget;
        item.style.transform = 'translateY(-8px) scale(1.02)';
    }

    handleHoverLeave(e) {
        const item = e.currentTarget;
        item.style.transform = '';
    }

    /**
     * Efectos de parallax sutil
     */
    setupParallaxEffects() {
        const scrollProgressBar = document.querySelector('.scroll-progress-bar');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollProgress = (scrolled / maxScroll) * 100;

            // Actualizar barra de progreso
            if (scrollProgressBar) {
                scrollProgressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
            }

            // Efectos parallax en imágenes
            const parallaxItems = document.querySelectorAll('.hero-visual img, .screen-mockup img');
            parallaxItems.forEach(item => {
                const rate = scrolled * -0.2;
                item.style.transform = `translate3d(0, ${rate}px, 0)`;
            });
        });
    }
}

// Inicializar sistemas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {

    // Inicializar gestor de temas
    const themeManager = new ThemeManager();

    // Inicializar animaciones
    const animationManager = new AnimationManager();

    // Exponer API global para debugging
    window.themeManager = themeManager;

    console.log('🎨 Sistema de temas y animaciones inicializado');
});

// CSS dinámico para animaciones
const style = document.createElement('style');
style.textContent = `
            .theme-transition * {
                transition: background-color 0.3s ease-out, 
                           color 0.3s ease-out, 
                           border-color 0.3s ease-out,
                           box-shadow 0.3s ease-out !important;
            }
            
            .bento-item {
                opacity: 100;
                transform: translateY(30px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .bento-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            @media (prefers-reduced-motion: reduce) {
                .bento-item {
                    opacity: 1;
                    transform: none;
                }
            }
        `;
document.head.appendChild(style);