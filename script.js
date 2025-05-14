document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.getElementById('typewriter-name');
    const realName = "Grant Dale Hortelano";
    const codeName = "0xblivion";
    let isRealName = true;
    let currentText = "";
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    function typeEffect() {
        const fullText = isRealName ? realName : codeName;
        if (isDeleting) {
            currentText = fullText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = fullText.substring(0, charIndex + 1);
            charIndex++;
        }
        if (typewriterElement) {
            typewriterElement.textContent = currentText;
        }
        
        let speed = isDeleting ? typeSpeed / 2 : typeSpeed;
        if (!isDeleting && charIndex === fullText.length) {
            speed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            isRealName = !isRealName;
            speed = 500;
        }
        setTimeout(typeEffect, speed);
    }
    if (typewriterElement) {
        setTimeout(typeEffect, 1000);
    }

    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark' && toggleSwitch) {
            toggleSwitch.checked = true;
        }
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (toggleSwitch) {
                toggleSwitch.checked = true;
            }
            localStorage.setItem('theme', 'dark');
        }
    }


    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', switchTheme, false);
    }
    
    const nodes = document.querySelectorAll('.node');
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    function handleScrollAnimation() {
        nodes.forEach(node => {
            if (isElementInViewport(node)) {
                const delay = node.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    node.classList.add('visible');
                }, parseInt(delay));
            }
        });
    }
    
    function handleParallaxEffect() {
        const scrollPosition = window.pageYOffset;
        const timelineSection = document.querySelector('.timeline-section');
        
        if (timelineSection) {
            const timelineBounds = timelineSection.getBoundingClientRect();
            if (timelineBounds.top < window.innerHeight && timelineBounds.bottom > 0) {
                document.querySelectorAll('.timeline-header').forEach((header) => {
                    const headerPosition = header.offsetTop + timelineSection.offsetTop;
                    const distance = scrollPosition - headerPosition;
                    if (Math.abs(distance) < window.innerHeight) {
                        const speed = 0.15;
                        header.style.transform = `translateY(${distance * speed}px)`;
                    }
                });
                document.querySelectorAll('.node-content').forEach(content => {
                    const rect = content.getBoundingClientRect();
                    const centerY = window.innerHeight / 2;
                    const fromCenter = (rect.top + rect.height / 2 - centerY) / centerY;
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const rotateAmount = fromCenter * 2;
                        const translateAmount = fromCenter * 5;
                        const glowIntensity = Math.min(Math.abs(fromCenter) * 8, 10);
                        content.style.transform = `translateY(${-translateAmount}px) rotateZ(${rotateAmount}deg)`;






                        let baseShadow = window.getComputedStyle(content).getPropertyValue('box-shadow').split(',')[0].trim();
                         if (baseShadow === "none") baseShadow = "0 10px 30px rgba(0, 0, 0, 0.1)"; // Fallback
                        content.style.boxShadow = `${baseShadow}, 0 0 ${glowIntensity}px rgba(230, 25, 25, 0.${Math.round(glowIntensity)})`;
                    }
                });
            }
        }
    }
    
    function setupInfiniteSlider() {
        const sliderContainer = document.querySelector('.tech-slider-container');

        const currentSliderContainer = document.querySelector('.tech-slider-container') || sliderContainer;
        const slider = currentSliderContainer.querySelector('.tech-slider');

        if (!slider || !currentSliderContainer) return;
        
        const originalItems = Array.from(slider.querySelectorAll('.tech-item'));
        if (originalItems.length === 0) {
             slider.style.animation = 'none'; // Stop animation if no items
            return;
        }

        slider.style.animation = 'none'; 
    
        let totalWidthOfOneSet = 0;
        originalItems.forEach(item => {
            const style = window.getComputedStyle(item);
            const marginRight = parseInt(style.marginRight) || 0;
            const marginLeft = parseInt(style.marginLeft) || 0;
            totalWidthOfOneSet += item.offsetWidth + marginRight + marginLeft;
        });
    
        const gapStyle = window.getComputedStyle(slider).gap;
        const gapValue = parseInt(gapStyle) || 80; 
        if (originalItems.length > 1) { 
            totalWidthOfOneSet += (originalItems.length -1) * gapValue;
        }

        const containerWidth = currentSliderContainer.offsetWidth;
        const numClonesNeeded = Math.max(2, Math.ceil(containerWidth / (totalWidthOfOneSet > 0 ? totalWidthOfOneSet : containerWidth))) + 2;

        slider.innerHTML = ''; 
        for (let i = 0; i < numClonesNeeded; i++) {
            originalItems.forEach(item => {
                const clone = item.cloneNode(true);
                slider.appendChild(clone);
            });
        }
        
        const duration = totalWidthOfOneSet > 0 ? totalWidthOfOneSet / 45 : 10; 
        
        let styleSheet = document.getElementById('infiniteScrollStyles');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'infiniteScrollStyles';
            document.head.appendChild(styleSheet);
        }
        
        const translateAmount = totalWidthOfOneSet > 0 ? totalWidthOfOneSet : 1000; 
        styleSheet.textContent = `
            @keyframes infiniteScroll {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-${translateAmount}px);
                }
            }
        `;
        
        void slider.offsetWidth; 
        slider.style.animation = `infiniteScroll ${duration}s linear infinite`;
        
        const finalSliderContainer = document.querySelector('.tech-slider-container');
        const finalSlider = finalSliderContainer ? finalSliderContainer.querySelector('.tech-slider') : null;

        if (finalSliderContainer && finalSlider) {
           finalSliderContainer.onmouseenter = () => {
                if(finalSlider) finalSlider.style.animationPlayState = 'paused';
            };
            
            finalSliderContainer.onmouseleave = () => {
                if(finalSlider) finalSlider.style.animationPlayState = 'running';
            };
        }
    }
    
    handleScrollAnimation(); 
    
    window.addEventListener('scroll', function() {
        handleScrollAnimation();
        handleParallaxEffect();
    });

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const debouncedResizeHandler = debounce(function() {
        handleScrollAnimation(); 
        setupInfiniteSlider(); 
    }, 250); 

    window.addEventListener('resize', debouncedResizeHandler);
    
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    function enhanceMobileInteraction() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
            document.querySelectorAll('.node-content').forEach(node => {
                node.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                });
                node.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 300);
                });
                node.style.webkitTapHighlightColor = 'transparent';
            });
            const timeline = document.querySelector('.timeline-section');
            if (timeline) {
                timeline.style.willChange = 'transform';
            }
        }
    }
    enhanceMobileInteraction();
    
    function setupPdfViewer() {
        const modal = document.getElementById('pdf-viewer-modal');
        const pdfIframe = document.getElementById('pdf-iframe');
        const pdfTitle = document.querySelector('.pdf-title');
        const closeBtn = document.querySelector('.pdf-close-btn');
        const viewButtons = document.querySelectorAll('.view-cert-btn');
        
        if (!modal || !pdfIframe || !pdfTitle || !closeBtn) return;

        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const pdfPath = this.getAttribute('data-cert');
                const certDetails = this.closest('.cert-details');
                if (!certDetails) return;
                const certNameElement = certDetails.querySelector('h3');
                if (!certNameElement) return;
                const certName = certNameElement.textContent;
                
                if(pdfIframe) pdfIframe.src = pdfPath;
                if(pdfTitle) pdfTitle.textContent = certName;
                if(modal) modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        if(closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeViewer();
            });
        }
        
        if(modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeViewer();
                }
            });
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeViewer();
            }
        });
        
        function closeViewer() {
            if(modal) modal.classList.remove('active');
            setTimeout(() => {
                if(pdfIframe) pdfIframe.src = '';
            }, 300);
            document.body.style.overflow = '';
        }
    }
    setupPdfViewer();
    setupInfiniteSlider(); 
});
