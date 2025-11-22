/**
 * Component Loader - Loads header and footer components into pages
 * Replaces {BASE_PATH} placeholder with the correct relative path
 */
(function() {
    'use strict';

    // Calculate base path based on current page location
    function getBasePath() {
        const path = window.location.pathname;
        // Count how many directory levels deep we are
        // Example: /blogs/blog.html = depth 1, /index.html = depth 0
        const pathParts = path.split('/').filter(part => part && !part.includes('.html'));
        const depth = pathParts.length;
        
        if (depth === 0) {
            return './'; // Root level
        }
        
        // For pages in subdirectories (e.g., blogs/, services/)
        return '../';
    }

    // Replace BASE_PATH placeholder in HTML content
    function replaceBasePath(html, basePath) {
        return html.replace(/{BASE_PATH}/g, basePath);
    }

    // Load component from file
    async function loadComponent(componentPath) {
        // Try fetch first (modern browsers)
        try {
            const response = await fetch(componentPath);
            if (response.ok) {
                return await response.text();
            }
        } catch (fetchError) {
            console.warn('Fetch failed, trying XMLHttpRequest:', fetchError);
        }
        
        // Fallback to XMLHttpRequest if fetch fails
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', componentPath, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    } else {
                        console.error('Failed to load component:', componentPath, 'Status:', xhr.status);
                        resolve(null);
                    }
                }
            };
            xhr.onerror = function() {
                console.error('Error loading component:', componentPath);
                resolve(null);
            };
            xhr.send();
        });
    }

    // Initialize components when DOM is ready
    async function initComponents() {
        const basePath = getBasePath();
        const componentsPath = basePath + 'components/';

        // Load header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerPath = componentsPath + 'header.html';
            const headerHtml = await loadComponent(headerPath);
            if (headerHtml) {
                const processedHtml = replaceBasePath(headerHtml, basePath);
                headerPlaceholder.outerHTML = processedHtml;
                
                // Re-initialize header functionality after loading
                if (typeof initHeader === 'function') {
                    initHeader();
                }
            } else {
                // Show error if component failed to load
                console.error('Failed to load header component from:', headerPath);
                headerPlaceholder.innerHTML = '<!-- Header component failed to load. Please ensure you are using a local server (not opening file directly). -->';
            }
        }

        // Load footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerPath = componentsPath + 'footer.html';
            const footerHtml = await loadComponent(footerPath);
            if (footerHtml) {
                const processedHtml = replaceBasePath(footerHtml, basePath);
                footerPlaceholder.outerHTML = processedHtml;
            } else {
                // Show error if component failed to load
                console.error('Failed to load footer component from:', footerPath);
                footerPlaceholder.innerHTML = '<!-- Footer component failed to load. Please ensure you are using a local server (not opening file directly). -->';
            }
        }

        // Dispatch custom event when components are loaded
        // This event can be listened to by other scripts to re-apply translations
        document.dispatchEvent(new CustomEvent('componentsLoaded', {
            detail: { basePath: basePath }
        }));
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }
})();

