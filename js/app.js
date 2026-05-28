$(document).ready(function() {
    
    /* ==========================================================================
       1. AMBIENT MOUSE GLOW & NAVIGATION
       ========================================================================== */
    const $pointerGlow = $('#pointerGlow');
    
    $(window).on('mousemove', function(e) {
        // Soft lag effect for smooth tracking
        $pointerGlow.css({
            left: e.clientX + 'px',
            top: e.clientY + 'px'
        });
    });

    // Scrolled Header Effect
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 50) {
            $('.main-header').addClass('scrolled');
        } else {
            $('.main-header').removeClass('scrolled');
        }
        
        scrollSpy();
    });

    // Mobile Navbar Toggle
    const $mobileToggle = $('#mobileToggle');
    const $navMenu = $('#navMenu');
    
    $mobileToggle.on('click', function() {
        $(this).toggleClass('active');
        $navMenu.toggleClass('active');
    });

    // Close Mobile Menu on NavLink click
    $('.nav-link').on('click', function(e) {
        // Smooth scroll adjustment
        e.preventDefault();
        const target = $(this).attr('href');
        const offset = $('.main-header').height();
        
        $mobileToggle.removeClass('active');
        $navMenu.removeClass('active');
        
        $('html, body').animate({
            scrollTop: $(target).offset().top - offset + 1
        }, 800);
    });

    // Scroll Spy: Highlight Active Navbar Item
    function scrollSpy() {
        const scrollPos = $(window).scrollTop();
        const offset = $('.main-header').height() + 20;
        
        $('section').each(function() {
            const top = $(this).offset().top - offset;
            const bottom = top + $(this).outerHeight();
            const id = $(this).attr('id');
            
            if (scrollPos >= top && scrollPos < bottom) {
                $('.nav-link').removeClass('active');
                $(`.nav-link[href="#${id}"]`).addClass('active');
            }
        });
    }

    /* ==========================================================================
       2. DYNAMIC STATS TICKER & SKILL BARS (SCROLL OBSERVER)
       ========================================================================== */
    let statsAnimated = false;
    let skillsAnimated = false;
    
    function checkScrollTriggers() {
        const scrollPos = $(window).scrollTop() + $(window).height();
        
        // Stats Ticker Trigger
        if ($('#stats').length && !statsAnimated) {
            const statsTop = $('#stats').offset().top + 100;
            if (scrollPos > statsTop) {
                animateStats();
                statsAnimated = true;
            }
        }
        
        // Skill Progress Fill Trigger
        if ($('#skills').length && !skillsAnimated) {
            const skillsTop = $('#skills').offset().top + 150;
            if (scrollPos > skillsTop) {
                animateSkills();
                skillsAnimated = true;
            }
        }
    }

    // Dynamic numeric counter roll-up
    function animateStats() {
        $('.stat-number').each(function() {
            const $this = $(this);
            const target = parseInt($this.data('target'));
            let current = 0;
            const duration = 2000; // 2 seconds animation
            const stepTime = Math.abs(Math.floor(duration / 100)); // 100 steps
            const increment = target / 100;
            
            const timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Pretty format numbers (e.g. 14,208,450)
                $this.text(Math.floor(current).toLocaleString() + (target > 500 ? '+' : ''));
            }, stepTime);
        });
    }

    // Skills progressive expansion fill
    function animateSkills() {
        $('.skill-bar-fill').each(function() {
            const $this = $(this);
            const targetWidth = $this.data('width');
            $this.css('width', targetWidth);
        });
    }

    // Register scroll check
    $(window).on('scroll', checkScrollTriggers);
    checkScrollTriggers(); // Initial viewport check

    /* ==========================================================================
       3. JQUERY FILTERABLE ART GALLERY GRID
       ========================================================================== */
    $('.filter-btn').on('click', function() {
        // Active tab switch
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        const filterVal = $(this).data('filter');
        const $cards = $('.gallery-card');
        
        // Smooth scaling filter rearrangement
        $cards.each(function() {
            const $card = $(this);
            const cardCategory = $card.data('category');
            
            if (filterVal === 'all' || cardCategory === filterVal) {
                $card.show().css({
                    'transform': 'scale(1)',
                    'opacity': '1'
                });
            } else {
                $card.css({
                    'transform': 'scale(0.8)',
                    'opacity': '0'
                });
                // Wait for animation frame before complete removal
                setTimeout(function() {
                    if ($card.css('opacity') === '0') {
                        $card.hide();
                    }
                }, 400);
            }
        });
    });

    // Video Thumbnail hover play simulation
    $('.gallery-card').hover(
        function() {
            const $video = $(this).find('.card-video-preview');
            if ($video.length) {
                $video[0].play().catch(e => {/* Auto-play policies */});
            }
        }, 
        function() {
            const $video = $(this).find('.card-video-preview');
            if ($video.length) {
                $video[0].pause();
                $video[0].currentTime = 0; // Rewind
            }
        }
    );

    /* ==========================================================================
       4. INTERACTIVE TOPOLOGY DRAG SLIDER
       ========================================================================== */
    const $slider = $('#topologySlider');
    const $wireframe = $('#wireframeLayer');
    const $handle = $('#sliderHandle');
    let isDragging = false;

    // Split function based on client coordinate
    function moveSlider(clientX) {
        const sliderRect = $slider[0].getBoundingClientRect();
        const offsetX = clientX - sliderRect.left;
        let percentage = (offsetX / sliderRect.width) * 100;
        
        // Boundary limit 0% - 100%
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        
        // Update layer mask width & handle coordinate
        $wireframe.css('width', percentage + '%');
        $handle.css('left', percentage + '%');
    }

    // Desktop Mouse Drag actions
    $slider.on('mousedown', function(e) {
        isDragging = true;
        moveSlider(e.clientX);
    });

    $(window).on('mousemove', function(e) {
        if (!isDragging) return;
        moveSlider(e.clientX);
    });

    $(window).on('mouseup', function() {
        isDragging = false;
    });

    // Mobile Touch Drag support
    $slider.on('touchstart', function(e) {
        isDragging = true;
        moveSlider(e.touches[0].clientX);
    });

    $(window).on('touchmove', function(e) {
        if (!isDragging) return;
        moveSlider(e.touches[0].clientX);
    });

    $(window).on('touchend', function() {
        isDragging = false;
    });

    /* ==========================================================================
       5. TECHNICAL LIGHTBOX MODAL WITH TIMELINE VIDEO HUD
       ========================================================================== */
    const $modal = $('#lightboxModal');
    const $modalImg = $('#lightboxImg');
    const $modalVideo = $('#lightboxVideo');
    const $imgContainer = $('#lightboxImageContainer');
    const $videoContainer = $('#lightboxVideoContainer');
    
    // Technical Sidebar fields
    const $specsCategory = $('#specsCategory');
    const $specsTitle = $('#specsTitle');
    const $specsDesc = $('#specsDesc');
    const $specsPoly = $('#specsPoly');
    const $specsVerts = $('#specsVerts');
    const $specsEngine = $('#specsEngine');
    const $specsTextures = $('#specsTextures');
    const $specsSoftware = $('#specsSoftware');
    
    // Video HUD Elements
    const $hudFilename = $('#hudFilename');
    const $hudPlay = $('#hudPlay');
    const $hudProgressContainer = $('#hudProgressContainer');
    const $hudProgressBar = $('#hudProgressBar');
    const $hudTime = $('#hudTime');
    const $hudMute = $('#hudMute');
    const $hudFullscreen = $('#hudFullscreen');

    let currentGalleryIndex = 0;
    let visibleCards = [];

    // Helper to sync visible elements based on active filters
    function updateVisibleCards() {
        visibleCards = $('.gallery-card').filter(':visible').toArray();
    }

    // Launch Lightbox Modal
    $(document).on('click', '.gallery-card', function() {
        updateVisibleCards();
        currentGalleryIndex = visibleCards.indexOf(this);
        loadLightboxData(this);
        
        $modal.css('display', 'flex');
        setTimeout(() => {
            $modal.addClass('show');
        }, 10);
        
        // Prevent body background scrolling
        $('body').css('overflow', 'hidden');
    });

    // Fill Lightbox elements from card attributes
    function loadLightboxData(cardElement) {
        const $card = $(cardElement);
        const title = $card.data('title');
        const desc = $card.data('desc');
        const poly = $card.data('poly');
        const verts = $card.data('verts');
        const engine = $card.data('engine');
        const textures = $card.data('textures');
        const software = $card.data('software');
        const mediaType = $card.data('media-type');
        const src = $card.data('src');
        // Read text category straight from the card HTML for perfect adaptation
        const category = $card.find('.card-category').text().trim();

        // Populate Technical panel
        $specsTitle.text(title);
        $specsCategory.text(category ? category.toUpperCase() : '3D SHOWCASE');
        $specsDesc.text(desc);
        $specsPoly.text(poly);
        $specsVerts.text(verts);
        $specsEngine.text(engine);
        $specsTextures.text(textures);
        $specsSoftware.text(software);

        // Reset elements and clean playback
        $modalVideo[0].pause();
        $modalVideo[0].src = '';
        $hudProgressBar.css('width', '0%');
        $hudPlay.html('<i class="fa-solid fa-play"></i>');

        if (mediaType === 'image') {
            $videoContainer.removeClass('active');
            $imgContainer.addClass('active');
            $modalImg.attr('src', src);
        } else {
            $imgContainer.removeClass('active');
            $videoContainer.addClass('active');
            $modalVideo[0].src = src;
            $modalVideo[0].load();
            
            // Format overlay filename
            const filename = src.split('/').pop();
            $hudFilename.text(filename);
            
            // Auto play with muted bypass if needed
            $modalVideo[0].play().then(() => {
                $hudPlay.html('<i class="fa-solid fa-pause"></i>');
            }).catch(e => {
                console.log("Auto playback blocked: click play manually.");
            });
        }
    }

    // Modal Close
    function closeLightbox() {
        $modal.removeClass('show');
        $modalVideo[0].pause();
        $modalVideo[0].src = '';
        
        setTimeout(() => {
            $modal.css('display', 'none');
            $('body').css('overflow', 'auto');
        }, 400);
    }

    $('#lightboxClose').on('click', closeLightbox);
    
    // Close on background click
    $modal.on('click', function(e) {
        if ($(e.target).hasClass('lightbox-modal') || $(e.target).hasClass('lightbox-media-panel')) {
            closeLightbox();
        }
    });

    // Lightbox Prev/Next Navigation
    function navigateLightbox(direction) {
        if (visibleCards.length <= 1) return;
        
        // Modal slide animation transition
        const $container = $('.lightbox-container');
        $container.css('transform', 'scale(0.96) translateY(10px)');
        
        setTimeout(() => {
            if (direction === 'next') {
                currentGalleryIndex = (currentGalleryIndex + 1) % visibleCards.length;
            } else {
                currentGalleryIndex = (currentGalleryIndex - 1 + visibleCards.length) % visibleCards.length;
            }
            
            loadLightboxData(visibleCards[currentGalleryIndex]);
            
            $container.css('transform', 'scale(1) translateY(0)');
        }, 250);
    }

    $('#lightboxNext').on('click', function() { navigateLightbox('next'); });
    $('#lightboxPrev').on('click', function() { navigateLightbox('prev'); });

    // Keyboard Key Events support
    $(document).on('keydown', function(e) {
        if (!$modal.hasClass('show')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox('next');
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
        if (e.key === ' ') { // Space toggles playback if video is active
            if ($videoContainer.hasClass('active')) {
                e.preventDefault();
                toggleVideoPlayback();
            }
        }
    });

    // Smooth scroll to contact and close when specs CTA clicked
    $('#btnSpecsContact').on('click', function(e) {
        e.preventDefault();
        closeLightbox();
        setTimeout(() => {
            $('html, body').animate({
                scrollTop: $('#contact').offset().top - $('.main-header').height()
            }, 800);
        }, 450);
    });

    /* ==========================================================================
       6. CUSTOM HTML5 VIDEO CONTROLS
       ========================================================================== */
    function toggleVideoPlayback() {
        if ($modalVideo[0].paused) {
            $modalVideo[0].play();
            $hudPlay.html('<i class="fa-solid fa-pause"></i>');
        } else {
            $modalVideo[0].pause();
            $hudPlay.html('<i class="fa-solid fa-play"></i>');
        }
    }

    $hudPlay.on('click', toggleVideoPlayback);
    
    // Toggle on video viewport click
    $modalVideo.on('click', toggleVideoPlayback);

    // Update Progress bar & Time overlay
    $modalVideo.on('timeupdate', function() {
        const video = $modalVideo[0];
        if (video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            $hudProgressBar.css('width', percent + '%');
            
            // Format time metrics
            $hudTime.text(formatTime(video.currentTime) + ' / ' + formatTime(video.duration));
        }
    });

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // Video Scrubbing Seekbar action
    $hudProgressContainer.on('click', function(e) {
        const video = $modalVideo[0];
        if (video.duration) {
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = clickX / rect.width;
            
            video.currentTime = percent * video.duration;
            $hudProgressBar.css('width', (percent * 100) + '%');
        }
    });

    // HUD Video Sound volume toggle
    $hudMute.on('click', function() {
        const video = $modalVideo[0];
        video.muted = !video.muted;
        
        if (video.muted) {
            $hudMute.html('<i class="fa-solid fa-volume-xmark"></i>');
        } else {
            $hudMute.html('<i class="fa-solid fa-volume-high"></i>');
        }
    });

    // HUD Request Fullscreen
    $hudFullscreen.on('click', function() {
        const videoFrame = $('#customVideoPlayer')[0];
        
        if (!document.fullscreenElement) {
            if (videoFrame.requestFullscreen) {
                videoFrame.requestFullscreen();
            } else if (videoFrame.webkitRequestFullscreen) { /* Safari */
                videoFrame.webkitRequestFullscreen();
            } else if (videoFrame.msRequestFullscreen) { /* IE11 */
                videoFrame.msRequestFullscreen();
            }
            $hudFullscreen.html('<i class="fa-solid fa-compress"></i>');
        } else {
            document.exitFullscreen();
            $hudFullscreen.html('<i class="fa-solid fa-expand"></i>');
        }
    });

    // Update screen icon if exiting fullscreen natively
    $(document).on('fullscreenchange webkitfullscreenchange', function() {
        if (!document.fullscreenElement) {
            $hudFullscreen.html('<i class="fa-solid fa-expand"></i>');
        }
    });

    /* ==========================================================================
       7. CONTACT FORM PORTAL VALIDATION & TRANSMIT SIMULATION
       ========================================================================== */
    const $form = $('#contactForm');
    const $btnSubmit = $('#btnSubmit');
    const $successFeedback = $('#formSuccess');

    // Float labels helpers
    $form.find('input, textarea').on('blur', function() {
        if ($(this).val()) {
            $(this).addClass('has-value');
        } else {
            $(this).removeClass('has-value');
        }
    });

    // Submit Validation and dynamic mock transmittal
    $form.on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // 1. Name Check
        const $name = $('#formName');
        if (!$name.val().trim()) {
            $name.parent().addClass('has-error');
            isValid = false;
        } else {
            $name.parent().removeClass('has-error');
        }

        // 2. Email Validation
        const $email = $('#formEmail');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test($email.val().trim())) {
            $email.parent().addClass('has-error');
            isValid = false;
        } else {
            $email.parent().removeClass('has-error');
        }

        // 3. Service dropdown Selection Check
        const $service = $('#formService');
        if (!$service.val()) {
            $service.parent().addClass('has-error');
            isValid = false;
        } else {
            $service.parent().removeClass('has-error');
        }

        // 4. Message check
        const $message = $('#formMessage');
        if (!$message.val().trim()) {
            $message.parent().addClass('has-error');
            isValid = false;
        } else {
            $message.parent().removeClass('has-error');
        }

        if (!isValid) return;

        // Perform simulated premium transmit transition
        $btnSubmit.addClass('loading').prop('disabled', true);
        
        const nameVal = $name.val().trim();
        const emailVal = $email.val().trim();
        const serviceVal = $service.find('option:selected').text();
        const msgVal = $message.val().trim();

        setTimeout(function() {
            $btnSubmit.removeClass('loading');
            $successFeedback.fadeIn(300);
            
            // Construct functional mailto redirect with form inputs
            const recipient = "contact@vertexlab.art";
            const subject = encodeURIComponent(`Project Inquiry: ${serviceVal}`);
            const body = encodeURIComponent(
                `Hi Vertex Lab,\n\n` +
                `You have a new project request:\n\n` +
                `Name: ${nameVal}\n` +
                `Email: ${emailVal}\n` +
                `Service Needed: ${serviceVal}\n\n` +
                `Details:\n${msgVal}\n\n` +
                `Regards,\n` +
                `${nameVal}`
            );

            // Redirect to launch local mail client
            window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
            
            // Clean inputs and float active labels
            $form.find('input, textarea').val('').removeClass('has-value');
            $service.val('');
            
            setTimeout(function() {
                $successFeedback.fadeOut(500);
                $btnSubmit.prop('disabled', false);
            }, 5000); // feedback visual timer
            
        }, 1800); // transmit animation delay
    });

    // Clear active error highlights on keydown
    $form.find('input, textarea, select').on('input change', function() {
        if ($(this).val()) {
            $(this).parent().removeClass('has-error');
        }
    });

    /* ==========================================================================
       8. INSTAGRAM QR CODE LIGHTBOX MODAL POPUP
       ========================================================================== */
    const $qrModal = $('#qrModal');
    
    $('.instagram-qr-widget').on('click', function() {
        $qrModal.css('display', 'flex');
        setTimeout(() => {
            $qrModal.addClass('show');
        }, 10);
        $('body').css('overflow', 'hidden');
    });

    function closeQrModal() {
        $qrModal.removeClass('show');
        setTimeout(() => {
            $qrModal.css('display', 'none');
            $('body').css('overflow', 'auto');
        }, 400);
    }

    $('#qrModalClose').on('click', closeQrModal);
    
    $qrModal.on('click', function(e) {
        if ($(e.target).hasClass('qr-modal')) {
            closeQrModal();
        }
    });

    // ESC Key triggers QR close
    $(document).on('keydown', function(e) {
        if ($qrModal.hasClass('show') && e.key === 'Escape') {
            closeQrModal();
        }
    });

});
