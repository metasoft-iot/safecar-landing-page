// Variable global para usar en otros scripts si es necesario
let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.getElementById('lang_toggle');
    const langLabel = document.getElementById('current_lang_label');
    
    // Función para cargar JSON
    async function loadTranslations(lang) {
        try {
            // NOTA: Esto requiere un servidor local (Live Server)
            const response = await fetch(`assets/js/i18n/${lang}.json`);
            if (!response.ok) throw new Error(`Could not load ${lang}.json`);
            
            const translations = await response.json();
            applyTranslations(translations);
            
            // Actualizar etiqueta del botón
            langLabel.textContent = lang.toUpperCase();
            document.documentElement.lang = lang; // Accesibilidad
        } catch (error) {
            console.error("Error loading translations:", error);
            console.warn("Ensure you are running this on a local server (e.g., Live Server extension in VS Code).");
        }
    }

    // Función para aplicar textos al DOM
    function applyTranslations(translations) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[key];
                    // Truco para input material: también actualizar label si fuera necesario, 
                    // pero en CSS puro usamos el label hermano. El placeholder debe ser un espacio " " para que funcione el CSS de :placeholder-shown
                    if(el.placeholder === "") el.placeholder = " "; 
                } else {
                    el.innerText = translations[key];
                }
            }
        });
        
        // Actualizar labels de formularios manualmente si no usan data-i18n directamente (opcional)
    }

    // Event Listener del botón
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        loadTranslations(currentLang);
    });

    // Cargar idioma inicial (Inglés por defecto como pide la rúbrica)
    loadTranslations('en');
});