// Simple markdown-to-HTML converter
class MarkdownRenderer {
    constructor() {
        this.rules = [
            // Headers
            { pattern: /^### (.*)/gm, replacement: '<h3>$1</h3>' },
            { pattern: /^## (.*)/gm, replacement: '<h2>$1</h2>' },
            { pattern: /^# (.*)/gm, replacement: '<h1>$1</h1>' },
            
            // Bold and Italic
            { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
            { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
            
            // Links
            { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2" target="_blank">$1</a>' },
            
            // Images
            { pattern: /!\[([^\]]*)\]\(([^)]+)\)/g, replacement: '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;" />' },
            
            // Code blocks
            { pattern: /```([\s\S]*?)```/g, replacement: '<pre><code>$1</code></pre>' },
            { pattern: /`([^`]+)`/g, replacement: '<code>$1</code>' },
            
            // Paragraphs (simple - just double line breaks)
            { pattern: /\n\n/g, replacement: '</p><p>' },
            
            // Line breaks
            { pattern: /\n/g, replacement: '<br>' }
        ];
    }

    render(markdown) {
        let html = markdown;
        
        // Apply all transformation rules
        this.rules.forEach(rule => {
            html = html.replace(rule.pattern, rule.replacement);
        });
        
        // Wrap in paragraph tags
        html = '<p>' + html + '</p>';
        
        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p><h([1-6])>/g, '<h$1>');
        html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
        html = html.replace(/<p><pre>/g, '<pre>');
        html = html.replace(/<\/pre><\/p>/g, '</pre>');
        
        return html;
    }
}

// Content loader class
class ContentLoader {
    constructor() {
        this.renderer = new MarkdownRenderer();
        this.cache = new Map();
    }

    async loadMarkdown(path) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load ${path}`);
            }
            const markdown = await response.text();
            const html = this.renderer.render(markdown);
            this.cache.set(path, html);
            return html;
        } catch (error) {
            console.error('Error loading markdown:', error);
            return `<p>Error loading content from ${path}</p>`;
        }
    }

    async loadBlogPosts() {
        const posts = [];
        const postFiles = [
            'strength-and-code.md',
            'arcade-restoration.md',
            'ai-retro-gaming.md'
        ];

        for (const file of postFiles) {
            try {
                const content = await this.loadMarkdown(`./content/blog/${file}`);
                const title = this.extractTitle(content);
                const excerpt = this.extractExcerpt(content);
                posts.push({
                    file,
                    title,
                    excerpt,
                    content,
                    date: this.getDateFromFilename(file)
                });
            } catch (error) {
                console.log(`Blog post ${file} not found yet`);
            }
        }
        return posts;
    }

    async loadProjects() {
        const projects = [];
        const projectFiles = [
            'arcade-chassis-repair.md',
            'ai-portfolio.md'
        ];

        for (const file of projectFiles) {
            try {
                const content = await this.loadMarkdown(`./content/projects/${file}`);
                const title = this.extractTitle(content);
                projects.push({
                    file,
                    title,
                    content
                });
            } catch (error) {
                console.log(`Project ${file} not found yet`);
            }
        }
        return projects;
    }

    extractTitle(html) {
        const titleMatch = html.match(/<h[1-3]>(.*?)<\/h[1-3]>/);
        return titleMatch ? titleMatch[1] : 'Untitled';
    }

    extractExcerpt(html, length = 150) {
        const textContent = html.replace(/<[^>]*>/g, '');
        return textContent.length > length 
            ? textContent.substring(0, length) + '...'
            : textContent;
    }

    getDateFromFilename(filename) {
        // Simple date extraction - you can enhance this
        return new Date().toLocaleDateString();
    }
}

// Initialize when DOM is loaded
window.contentLoader = new ContentLoader();
