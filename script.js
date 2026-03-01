  document.addEventListener('DOMContentLoaded', () => {
            const body = document.body;
            const themeToggle = document.getElementById('theme-toggle');
            const tiltCard = document.getElementById('tilt-card');
            const glow = document.getElementById('cursor-glow');
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('nav-links');
            
            // Selector for all skill cards
            const skillCards = document.querySelectorAll('.skill-card'); 
            
            // Show More Projects Elements (Plain JS)
            const showMoreButton = document.getElementById('show-more-projects');
            const hiddenProjects = document.querySelectorAll('.portfolio-card-link.portfolio-hidden');
            let projectsVisible = false;

            // Animated Text Elements
            const animatedTextElement = document.getElementById('animated-text');
            const roles = [
                "Full-Stack Developer",
                "Java Developer",
                "Software Developer"
            ];
            let roleIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            const typingSpeed = 100; // Typing speed (ms)
            const deletingSpeed = 50; // Deleting speed (ms)
            const delayBeforeNext = 1500; // Delay before starting the next role (ms)


            // --- 0. Typewriter Effect Logic ---
            function typewriterEffect() {
                const currentRole = roles[roleIndex];
                
                if (isDeleting) {
                    // Deleting text
                    animatedTextElement.textContent = currentRole.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    // Typing text
                    animatedTextElement.textContent = currentRole.substring(0, charIndex + 1);
                    charIndex++;
                }

                // Determine the new delay for the next step
                let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

                if (!isDeleting && charIndex === currentRole.length) {
                    // Paused at the end of typing
                    currentSpeed = delayBeforeNext; 
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    // Paused at the end of deleting, move to next role
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    currentSpeed = typingSpeed; 
                }

                setTimeout(typewriterEffect, currentSpeed);
            }
            
            // Start the typewriter effect (delay to let DOM load)
            setTimeout(typewriterEffect, 500);


            // --- 1. Dark Mode Toggle Logic ---
            const currentTheme = localStorage.getItem('theme');
            if (currentTheme === 'dark') {
                body.classList.add('dark-mode');
                themeToggle.classList.replace('fa-moon', 'fa-sun');
            }

            themeToggle.addEventListener('click', () => {
                body.classList.toggle('dark-mode');
                const isDarkMode = body.classList.contains('dark-mode');
                localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

                if (isDarkMode) {
                    themeToggle.classList.replace('fa-moon', 'fa-sun');
                } else {
                    themeToggle.classList.replace('fa-sun', 'fa-moon');
                }
            });

            // --- 2. Hamburger Menu Logic ---
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close menu when a link is clicked (on mobile)
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });


            // --- 3. 3D Tilt Effect Logic (Hero Image Only) ---
            if (tiltCard) {
                const MAX_TILT = 5; 

                function handleTilt(e) {
                    const rect = tiltCard.getBoundingClientRect();
                    const width = rect.width;
                    const height = rect.height;
                    const x = (e.clientX - rect.left) - width / 2;
                    const y = (e.clientY - rect.top) - height / 2;
                    const tiltX = (y / (height / 2)) * MAX_TILT; 
                    const tiltY = -(x / (width / 2)) * MAX_TILT; 

                    tiltCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                }

                tiltCard.addEventListener('mousemove', handleTilt);

                tiltCard.addEventListener('mouseleave', () => {
                    tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                });
            }

            // --- 4. Custom Cursor Glow Logic (Applied to Hero Image AND Skill Cards) ---

            // Function to enable the glow effect
            function enableGlow() {
                // Check if running on a mobile device (where glow is disabled)
                if (window.matchMedia('(max-width: 768px)').matches) return;
                
                glow.style.opacity = '1';
                glow.style.transform = 'translate(-50%, -50%) scale(1)';
                glow.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; // Smooth entry
            }

            // Function to disable the glow effect
            function disableGlow() {
                glow.style.opacity = '0';
                glow.style.transform = 'translate(-50%, -50%) scale(0.5)';
            }
            
            // Helper function to bind mouse events to a target element
            function bindGlowTarget(element) {
                element.addEventListener('mouseenter', enableGlow);
                element.addEventListener('mouseleave', disableGlow);
            }
            
            // 4a. Apply glow binding to Hero Image
            if (tiltCard) {
                bindGlowTarget(tiltCard);
            }

            // 4b. Apply glow binding to all Skill Cards
            skillCards.forEach(card => {
                bindGlowTarget(card);
            });

            // 4c. Move the glow element with the mouse (position always updates)
            document.addEventListener('mousemove', (e) => {
                // Only update position if glow is potentially visible (non-mobile)
                if (!window.matchMedia('(max-width: 768px)').matches) {
                    glow.style.left = `${e.clientX}px`;
                    glow.style.top = `${e.clientY}px`;
                }
            });


            // --- 5. Show More Projects Logic (Plain JS) ---
            function toggleProjects() {
                projectsVisible = !projectsVisible;
                // Update button text
                showMoreButton.textContent = projectsVisible ? 'Show Less Projects' : 'Show More Projects';

                hiddenProjects.forEach((project, index) => {
                    if (projectsVisible) {
                        // 1. Set display to block/grid immediately to enable layout
                        project.style.display = 'block'; 
                        
                        // 2. Add class after a small delay to trigger CSS transition
                        // Stagger the animation for a cooler effect
                        setTimeout(() => {
                            project.classList.add('portfolio-visible');
                        }, 50 * index); 
                    } else {
                        // 1. Trigger exit animation
                        project.classList.remove('portfolio-visible');
                        
                        // 2. Hide element completely after transition (500ms from CSS)
                        setTimeout(() => {
                            // Ensure the element is completely hidden after the transition
                            project.style.display = 'none';
                        }, 500); 
                    }
                });
            }

            showMoreButton.addEventListener('click', toggleProjects);
            
            
            // ===============================================
            // === 6. Intersection Observer Scroll Animation ===
            // ===============================================

            // Create a new Intersection Observer
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    // When the element enters the viewport
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const delay = target.getAttribute('data-delay') || 0;
                        
                        // Add the 'visible' class after a small delay
                        setTimeout(() => {
                            target.classList.add('visible');
                        }, parseInt(delay, 10));

                        // Stop observing after it has animated once
                        observer.unobserve(target);
                    }
                });
            }, {
                // Trigger when 10% of the element is visible
                threshold: 0.1 
            });

            // Observe all elements with the 'animate-me' class
            document.querySelectorAll('.animate-me').forEach(element => {
                // Set CSS transition-delay here for staggered animation
                element.style.transitionDelay = `${element.getAttribute('data-delay') || 0}ms`;
                observer.observe(element);
            });
            
        });



        //  ======================================//
        //  ======== Responsive Form page ========//
        //  ======================================//


       

            

          

                document.addEventListener("DOMContentLoaded", function () {

            emailjs.init("ujN7Fbr2-gPP2uEY9");

            const form = document.getElementById("contact-form");

            form.addEventListener("submit", function (e) {
            e.preventDefault();   // THIS stops refresh

            emailjs.sendForm(
                "service_a6cbv7f",
                "template_d2qz9yo",
                form
            )
            .then(function () {
                alert("Message sent successfully!");
                form.reset();
            })
            .catch(function (error) {
                console.error(error);
                alert("Failed to send message.");
            });

            });

        });
