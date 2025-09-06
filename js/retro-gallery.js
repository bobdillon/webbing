// Retro Gallery Loader - MySpace/GeoCities Style!
class RetroGallery {
    constructor() {
        this.images = [];
        this.container = null;
        this.init();
    }

    async init() {
        await this.loadImages();
        this.renderGallery();
        this.addRetroEffects();
    }

    async loadImages() {
        try {
            const response = await fetch('./content/gallery-images.json');
            this.images = await response.json();
        } catch (error) {
            console.log('Gallery images not found, using samples');
            this.images = this.getSampleImages();
        }
    }

    getSampleImages() {
        return [
            {
                url: "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=🕹️+Donkey+Kong",
                caption: "🕹️1982 Donkey Kong - Before Restoration",
                date: "2025-08-15",
                category: "before-after",
                rotation: "-3deg",
                size: "medium",
                isNew: false
            },
            {
                url: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=💾+Circuit+Board",
                caption: "💾 Circuit Board Surgery",
                date: "2025-09-01",
                category: "repair-process", 
                rotation: "2deg",
                size: "large",
                isNew: true
            },
            {
                url: "https://via.placeholder.com/250x200/45B7D1/FFFFFF?text=🔧+Workshop",
                caption: "🔧 My Retro Repair Station",
                date: "2025-07-20",
                category: "workshop",
                rotation: "-1deg", 
                size: "small",
                isNew: false
            },
            {
                url: "https://via.placeholder.com/350x250/96CEB4/FFFFFF?text=📺+CRT+Monitor",
                caption: "📺 CRT Monitor Restoration", 
                date: "2025-08-30",
                category: "monitors",
                rotation: "4deg",
                size: "medium",
                isNew: true
            },
            {
                url: "https://via.placeholder.com/400x250/FFEAA7/333333?text=🎮+Collection",
                caption: "🎮 Collection Display Wall",
                date: "2025-06-10", 
                category: "collection",
                rotation: "-2deg",
                size: "large",
                isNew: false
            },
            {
                url: "https://via.placeholder.com/280x180/DDA0DD/FFFFFF?text=⚡+Power+Supply",
                caption: "⚡ Power Supply Rebuild",
                date: "2025-09-03",
                category: "electronics", 
                rotation: "1deg",
                size: "small",
                isNew: true
            }
        ];
    }

    renderGallery() {
        this.container = document.getElementById('gallery-container');
        if (!this.container) return;

        // Create retro gallery HTML
        this.container.innerHTML = `
            <div class="retro-gallery-header">
                <h3>📸 ~*~ David's Retro + Arcade Photo Album ~*~ 📸</h3>
                <div class="retro-counter">
                    <img src="https://stuff.mit.edu/afs/sipb.mit.edu/project/www/dtd/images/new.gif" alt="NEW!" class="blink-gif">
                    Visitor #${this.getRandomVisitorCount()} 
                    <img src="https://web.archive.org/web/20091027071828im_/http://www.geocities.com/animationfactory2000/new-14.gif" alt="Under Construction" class="construction-gif">
                </div>
            </div>
            <div class="photo-collage">
                ${this.images.map((img, index) => this.createPhotoHTML(img, index)).join('')}
            </div>
            <div class="retro-footer">
                <marquee behavior="scroll" direction="left" scrollamount="3">
                    ✨ Add me to your favorites! ✨ Take something apart! ✨ Follow me on X! ✨
                </marquee>
            </div>
        `;
    }

    createPhotoHTML(image, index) {
        const newBadge = image.isNew ? '<img src="https://web.archive.org/web/20091027100705im_/http://geocities.com/new_cool.gif" alt="NEW!" class="new-badge">' : '';
        
        return `
            <div class="retro-photo photo-${image.size}" style="transform: rotate(${image.rotation});" data-category="${image.category}">
                ${newBadge}
                <div class="photo-frame">
                    <img src="${image.url}" alt="${image.caption}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200/FFB6C1/333333?text=📷+Photo+Loading...'">
                    <div class="photo-caption">
                        <div class="caption-text">${image.caption}</div>
                        <div class="photo-date">${this.formatRetroDate(image.date)}</div>
                    </div>
                </div>
                <div class="photo-shadow"></div>
            </div>
        `;
    }

    formatRetroDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: '2-digit' 
        });
    }

    getRandomVisitorCount() {
        return Math.floor(Math.random() * 999999) + 100000;
    }

    addRetroEffects() {
        // Dynamic positioning for unlimited photos
        this.positionPhotosRandomly();
        
        // Add click sound effects (optional)
        const photos = document.querySelectorAll('.retro-photo');
        photos.forEach(photo => {
            photo.addEventListener('click', () => {
                photo.style.transform += ' scale(1.05)';
                setTimeout(() => {
                    photo.style.transform = photo.style.transform.replace(' scale(1.05)', '');
                }, 200);
            });

            // Add hover effects
            photo.addEventListener('mouseenter', () => {
                photo.style.zIndex = '10';
                photo.querySelector('.photo-frame').style.boxShadow = '0 0 20px #FFD700';
            });

            photo.addEventListener('mouseleave', () => {
                photo.style.zIndex = '1';
                photo.querySelector('.photo-frame').style.boxShadow = '';
            });
        });

        // Blinking text effect
        this.addBlinkingEffect();
    }

    positionPhotosRandomly() {
        const photos = document.querySelectorAll('.retro-photo');
        const container = document.querySelector('.photo-collage');
        const containerPadding = 20;
        
        if (!container || photos.length === 0) return;
        
        // Calculate container dimensions
        const containerWidth = container.offsetWidth - (containerPadding * 2);
        const initialHeight = Math.max(700, Math.ceil(photos.length / 3) * 200);
        
        // Track occupied areas to prevent excessive overlap
        const occupiedAreas = [];
        
        photos.forEach((photo, index) => {
            // Get photo dimensions
            const photoWidth = photo.offsetWidth || 250; // fallback width
            const photoHeight = photo.offsetHeight || 200; // fallback height
            
            let attempts = 0;
            let positioned = false;
            
            while (!positioned && attempts < 50) {
                // Generate random position within initial bounds (we'll adjust container size later)
                const maxLeft = containerWidth - photoWidth;
                const maxTop = initialHeight - photoHeight - 50; // Leave space at bottom
                
                const left = Math.random() * maxLeft;
                const top = Math.random() * maxTop + 20; // Start 20px from top
                
                // Check for excessive overlap with existing photos
                const newArea = { left, top, right: left + photoWidth, bottom: top + photoHeight };
                const hasExcessiveOverlap = occupiedAreas.some(area => {
                    const overlapX = Math.max(0, Math.min(newArea.right, area.right) - Math.max(newArea.left, area.left));
                    const overlapY = Math.max(0, Math.min(newArea.bottom, area.bottom) - Math.max(newArea.top, area.top));
                    const overlapArea = overlapX * overlapY;
                    const newPhotoArea = photoWidth * photoHeight;
                    return (overlapArea / newPhotoArea) > 0.3; // Allow up to 30% overlap
                });
                
                if (!hasExcessiveOverlap || attempts > 40) {
                    // Position the photo
                    photo.style.left = `${left}px`;
                    photo.style.top = `${top}px`;
                    photo.style.position = 'absolute';
                    
                    // Use the rotation from JSON, don't override it!
                    // The rotation is already set in the HTML via createPhotoHTML()
                    // No need to add random rotation here
                    
                    // Track this area
                    occupiedAreas.push(newArea);
                    positioned = true;
                }
                
                attempts++;
            }
        });
        
        // IMPORTANT: After positioning all photos, calculate the actual boundaries needed
        this.adjustContainerToFitAllPhotos();
    }
    
    adjustContainerToFitAllPhotos() {
        const photos = document.querySelectorAll('.retro-photo');
        const container = document.querySelector('.photo-collage');
        
        if (!container || photos.length === 0) return;
        
        // Wait a bit for images to load and get proper dimensions
        setTimeout(() => {
            let maxRight = 0;
            let maxBottom = 0;
            
            photos.forEach(photo => {
                // Get the photo's actual boundaries including any transforms
                const photoLeft = parseInt(photo.style.left) || 0;
                const photoTop = parseInt(photo.style.top) || 0;
                const photoWidth = photo.offsetWidth;
                const photoHeight = photo.offsetHeight;
                
                // Calculate the actual bottom and right edges
                const photoRight = photoLeft + photoWidth;
                const photoBottom = photoTop + photoHeight;
                
                maxRight = Math.max(maxRight, photoRight);
                maxBottom = Math.max(maxBottom, photoBottom);
                
                console.log(`Photo ${photoLeft},${photoTop} size ${photoWidth}x${photoHeight} bottom: ${photoBottom}`);
            });
            
            // Add generous padding so content isn't touching edges
            const bottomPadding = 60; // Extra space below lowest photo
            const rightPadding = 40;  // Extra space to right of rightmost photo
            
            const neededHeight = maxBottom + bottomPadding;
            const currentMinHeight = parseInt(container.style.minHeight) || 700;
            
            // Always use the larger of current or calculated height
            const finalHeight = Math.max(currentMinHeight, neededHeight);
            
            container.style.minHeight = `${finalHeight}px`;
            
            console.log(`Gallery final dimensions: ${photos.length} photos, container height: ${finalHeight}px, max bottom was: ${maxBottom}px`);
        }, 100); // Small delay to ensure images are loaded
    }

    addBlinkingEffect() {
        const blinkElements = document.querySelectorAll('.blink-gif');
        blinkElements.forEach(element => {
            setInterval(() => {
                element.style.visibility = element.style.visibility === 'hidden' ? 'visible' : 'hidden';
            }, 500);
        });
    }
}

// Initialize retro gallery when content is loaded
window.retroGallery = new RetroGallery();
