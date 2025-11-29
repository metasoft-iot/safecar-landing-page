document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. DARK MODE & THEME MANAGEMENT
       ========================================= */
    const themeBtn = document.getElementById('theme_toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('.material-icons') : null;
    const body = document.body;

    // Verificar preferencia guardada o preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = 'light_mode';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            
            // Cambiar icono
            if (themeIcon) themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
            
            // Guardar preferencia
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    /* =========================================
       2. NAVBAR SCROLL EFFECT & MOBILE MENU
       ========================================= */
    const navBar = document.querySelector('.app-bar');
    const menuBtn = document.getElementById('menu_btn');
    const navLinks = document.getElementById('nav-links');
    const menuIcon = menuBtn ? menuBtn.querySelector('.material-icons') : null;

    // Efecto de sombra en el navbar al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navBar.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
        }
    });

    // Toggle Menú Móvil
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Cambiar icono de hamburguesa a X
            if (menuIcon) {
                menuIcon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
            }
        });

        // Cerrar menú al hacer clic en un enlace (UX)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (menuIcon) menuIcon.textContent = 'menu';
            });
        });
    }

    /* =========================================
       3. TERMS & CONDITIONS MODAL (Accessible)
       ========================================= */
    const termsBtn = document.getElementById('termsBtn'); // Botón del Footer
    const termsModal = document.getElementById('termsModal');
    const closeModal = document.getElementById('closeModal'); // X en el header del modal
    const acceptTerms = document.getElementById('acceptTerms'); // Botón de aceptar

    const toggleModal = (show) => {
        if (!termsModal) return;

        if (show) {
            termsModal.classList.remove('hidden');
            termsModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
        } else {
            termsModal.classList.add('hidden');
            termsModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    // Event Listeners para el Modal
    if (termsBtn) {
        termsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal(true);
        });
    }
    if (closeModal) closeModal.addEventListener('click', () => toggleModal(false));
    if (acceptTerms) acceptTerms.addEventListener('click', () => toggleModal(false));

    // Cerrar al dar click fuera del contenido (Overlay)
    window.addEventListener('click', (e) => {
        if (e.target === termsModal) toggleModal(false);
    });

    // Cerrar con tecla ESC (Accesibilidad)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && termsModal && !termsModal.classList.contains('hidden')) {
            toggleModal(false);
        }
    });

    /* =========================================
       4. INTERNATIONALIZATION (i18n)
       ========================================= */
    const langBtn = document.getElementById('lang_toggle');
    const langLabel = document.getElementById('current_lang_label');
    let currentLang = 'en'; // Idioma por defecto (Requisito Rúbrica)

    async function loadTranslations(lang) {
        try {
            // Cargar el archivo JSON correspondiente
            const response = await fetch(`assets/js/i18n/${lang}.json`);
            if (!response.ok) throw new Error(`Could not load ${lang}.json`);
            
            const translations = await response.json();
            
            // Aplicar traducciones
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[key]) {
                    // Si es un input/textarea, cambiamos el placeholder
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translations[key];
                    } else {
                        element.textContent = translations[key];
                    }
                }
            });

            // Actualizar etiqueta del botón
            if (langLabel) langLabel.textContent = lang.toUpperCase();
            
            // Actualizar atributo lang del HTML (Accesibilidad/SEO)
            // Requisito: English (en_US), Latin American Spanish (es_419) 
            document.documentElement.lang = lang === 'es' ? 'es-419' : 'en-US';

        } catch (error) {
            console.error("Error loading translations:", error);
        }
    }

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            // Alternar idioma
            currentLang = currentLang === 'en' ? 'es' : 'en';
            loadTranslations(currentLang);
        });
    }

    // Cargar idioma por defecto al iniciar
    loadTranslations('en');
});