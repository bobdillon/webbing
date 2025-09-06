// Main application logic
class PersonalSite {
    constructor() {
        this.contentLoader = window.contentLoader;
        this.modal = null;
        this.init();
    }

    async init() {
        this.createModal();
        await this.loadProjects();
        await this.loadBlogPosts();
        this.setupEventListeners();
    }

    createModal() {
        // Create modal for blog post details
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div id="modal-body"></div>
            </div>
        `;
        document.body.appendChild(this.modal);

        // Close modal when clicking X or outside
        this.modal.querySelector('.close').onclick = () => this.closeModal();
        this.modal.onclick = (e) => {
            if (e.target === this.modal) this.closeModal();
        };
    }

    async loadProjects() {
        const container = document.getElementById('projects-container');
        
        try {
            const projects = await this.contentLoader.loadProjects();
            
            if (projects.length === 0) {
                // Show a single card for the actual project
                container.innerHTML = `
                    <div class="project-card">
                        <h3>🕹️ Arcade Chassis Repair Assistant</h3>
                        <p>AI-powered RAG system that helps diagnose and repair arcade machine chassis issues. Built with modern AI techniques to preserve gaming history.</p>
                        <a href="https://chassis-repair-app-r3rnc.ondigitalocean.app/" target="_blank" class="project-link">View Live Demo</a>
                    </div>
                `;
                return;
            }

            // Show projects as clean single card per project
            container.innerHTML = projects.map(project => `
                <div class="project-card clickable-project" data-project="${project.file}">
                    <h3>${project.title}</h3>
                    <p>Click to read more about this project...</p>
                    <div class="project-link">View Details</div>
                </div>
            `).join('');

            // Add click handlers for project cards
            container.querySelectorAll('.clickable-project').forEach(card => {
                card.addEventListener('click', () => {
                    const projectFile = card.dataset.project;
                    const project = projects.find(p => p.file === projectFile);
                    if (project) {
                        this.showProject(project);
                    }
                });
            });
            
        } catch (error) {
            console.error('Error loading projects:', error);
            container.innerHTML = `
                <div class="project-card">
                    <h3>🕹️ Arcade Chassis Repair Assistant</h3>
                    <p>AI-powered RAG system that helps diagnose and repair arcade machine chassis issues. Built with modern AI techniques to preserve gaming history.</p>
                    <a href="https://chassis-repair-app-r3rnc.ondigitalocean.app/" target="_blank" class="project-link">View Live Demo</a>
                </div>
            `;
        }
    }

    showProject(project) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `<div class="markdown-content">${project.content}</div>`;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    async loadBlogPosts() {
        const container = document.getElementById('blog-container');
        
        try {
            const posts = await this.contentLoader.loadBlogPosts();
            
            if (posts.length === 0) {
                container.innerHTML = `
                    <div class="blog-card">
                        <div class="blog-date">Coming Soon</div>
                        <h3>💪 Building Strength & Code</h3>
                        <p class="blog-excerpt">Exploring the parallels between weight training discipline and software development mastery.</p>
                    </div>
                    <div class="blog-card">
                        <div class="blog-date">Coming Soon</div>
                        <h3>🔧 Arcade Restoration Techniques</h3>
                        <p class="blog-excerpt">Deep dive into the art and science of bringing classic arcade machines back to life.</p>
                    </div>
                    <div class="blog-card">
                        <div class="blog-date">Coming Soon</div>
                        <h3>🤖 AI in Retro Gaming</h3>
                        <p class="blog-excerpt">How modern AI can help preserve and enhance vintage gaming experiences.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = posts.map(post => {
                const cardClass = post.status === 'draft' ? 'blog-card draft-card' : 'blog-card';
                const clickable = post.status === 'published' ? `data-post="${post.file}"` : '';
                
                return `
                    <div class="${cardClass}" ${clickable}>
                        <div class="blog-date">${post.date}</div>
                        <h3>${post.title}</h3>
                        <p class="blog-excerpt">${post.excerpt}</p>
                        ${post.status === 'draft' ? '<div class="draft-badge">✍️ Draft</div>' : ''}
                    </div>
                `;
            }).join('');

            // Add click handlers only for published blog cards
            container.querySelectorAll('.blog-card:not(.draft-card)').forEach(card => {
                card.addEventListener('click', () => {
                    const postFile = card.dataset.post;
                    const post = posts.find(p => p.file === postFile);
                    if (post && post.status === 'published') {
                        this.showBlogPost(post);
                    }
                });
            });
            
        } catch (error) {
            console.error('Error loading blog posts:', error);
            container.innerHTML = '<div class="loading">Error loading blog posts</div>';
        }
    }

    showBlogPost(post) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `<div class="markdown-content">${post.content}</div>`;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    setupEventListeners() {
        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PersonalSite();
});
