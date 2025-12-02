document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menu_btn');
    const navLinks = document.getElementById('nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('.material-icons');
            icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
        });
    }
    
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                if (menuBtn) {
                    const icon = menuBtn.querySelector('.material-icons');
                    icon.textContent = 'menu';
                }
            }
        });
    });
    
    navLinkItems.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.app-bar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + window.innerHeight / 3;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (correspondingLink) {
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    navLinkItems.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    let scrollTimer;
    window.addEventListener('scroll', function() {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(updateActiveNavLink, 10);
    });
    
    let lastScrollTop = 0;
    const header = document.querySelector('.app-bar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            if (menuBtn) {
                const icon = menuBtn.querySelector('.material-icons');
                icon.textContent = 'menu';
            }
        }
    });
    
    updateActiveNavLink();
});