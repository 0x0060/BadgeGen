document.addEventListener('DOMContentLoaded', () => {
    const badgePreview = document.getElementById('badgePreview');
    const copyButton = document.getElementById('copyButton');
    const templateButtons = document.querySelectorAll('.template-btn');
    const advancedToggle = document.getElementById('advancedToggle');
    const advancedPanel = document.getElementById('advancedPanel');
    const linkUrl = document.getElementById('linkUrl');
    const labelIconBtn = document.getElementById('labelIconBtn');
    const messageIconBtn = document.getElementById('messageIconBtn');
    let currentBadgeMarkdown = '';

    // Template badge click handlers
    templateButtons.forEach(btn => {    
        btn.addEventListener('click', () => {
            const template = btn.dataset.template;
            const img = btn.querySelector('img');
            badgePreview.innerHTML = `<img src="${img.src}" alt="Badge preview">`;
            currentBadgeMarkdown = `![${template}](${img.src})`;
        });
    });

    // Custom badge generation
    const inputIds = ['label', 'message', 'labelColor', 'messageColor', 'style', 'logo', 'logoColor', 'linkUrl'];
    
    // Add event listeners to all inputs
    inputIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            ['input', 'change', 'keyup'].forEach(eventType => {
                element.addEventListener(eventType, updateCustomBadge);
            });
        }
    });

    // Add event listener for style select
    const styleSelect = document.getElementById('style');
    if (styleSelect) {
        styleSelect.addEventListener('change', updateCustomBadge);
    }

    function updateCustomBadge() {
        const label = document.getElementById('label').value;
        const message = document.getElementById('message').value;
        const labelColor = document.getElementById('labelColor').value;
        const messageColor = document.getElementById('messageColor').value;
        const style = document.getElementById('style').value;
        const logo = document.getElementById('logo')?.value || '';
        const logoColor = document.getElementById('logoColor')?.value || '';
        const color = messageColor.replace('#', '');
        const labelColorHex = labelColor.replace('#', '');
        
        // Update badge preview even when inputs are empty
        let badgeUrl = '';
        if (label || message) {
            badgeUrl = `https://img.shields.io/badge/${encodeURIComponent(label || ' ')}-${encodeURIComponent(message || ' ')}-${color}?style=${style}&labelColor=${labelColorHex}`;
            
            if (logo) {
                badgeUrl += `&logo=${encodeURIComponent(logo)}`;
                if (logoColor) {
                    badgeUrl += `&logoColor=${encodeURIComponent(logoColor.replace('#', ''))}`;            
                }
            }
        }
        
        const markdownEditor = document.getElementById('markdownEditor');
        if (badgeUrl) {
            badgePreview.innerHTML = `<img src="${badgeUrl}" alt="Custom badge preview">`;
            currentBadgeMarkdown = linkUrl.value
                ? `[![${label}](${badgeUrl})](${linkUrl.value})`
                : `![${label}](${badgeUrl})`;
        } else {
            badgePreview.innerHTML = '';
            currentBadgeMarkdown = '';
        }
        
        if (markdownEditor) {
            markdownEditor.value = currentBadgeMarkdown;
        }
    }

    // Copy markdown button
    copyButton.addEventListener('click', async () => {
        if (!currentBadgeMarkdown) return;

        try {
            await navigator.clipboard.writeText(currentBadgeMarkdown);
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });

    // Advanced options toggle
    advancedToggle.addEventListener('click', () => {
        advancedPanel.classList.toggle('hidden');
    });

    // URL input handler
    linkUrl.addEventListener('input', updateCustomBadge);

    // Icon picker buttons
    [labelIconBtn, messageIconBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icons = {
                github: 'fab fa-github',
                twitter: 'fab fa-twitter',
                npm: 'fab fa-npm',
                docker: 'fab fa-docker',
                linkedin: 'fab fa-linkedin',
                discord: 'fab fa-discord',
                youtube: 'fab fa-youtube',
                twitch: 'fab fa-twitch',
                reddit: 'fab fa-reddit',
                facebook: 'fab fa-facebook'
            };
            const iconKeys = Object.keys(icons);
            const selectedIcon = iconKeys[Math.floor(Math.random() * iconKeys.length)];
            input.value = selectedIcon;
            updateCustomBadge();
        });
    });

    // Initial badge preview
    updateCustomBadge();
});