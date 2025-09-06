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
