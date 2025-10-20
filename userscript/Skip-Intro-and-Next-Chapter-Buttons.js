// ==UserScript==
// @name         Skip Intro & Next Chapter Buttons
// @namespace    https://example.com/mundomangua
// @version      0.4.9
// @description  Añade botones para saltar la intro y para ir al siguiente capítulo.
// @author       Mundomangua
// @match        https://www.mundodonghua.com/*
// @match        https://www.dailymotion.com/*
// @downloadURL  https://github.com/URD0TH/mundomangua/releases/download/v0.4.9/Skip-Intro-and-Next-Chapter-Buttons.js
// @updateURL    https://github.com/URD0TH/mundomangua/releases/download/v0.4.9/Skip-Intro-and-Next-Chapter-Buttons.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- Banner to indicate script is loaded ---
    try {
        const banner = document.createElement('div');
        banner.id = 'tm-skip-banner';
        banner.style.position = 'fixed';
        banner.style.right = '8px';
        banner.style.top = '8px';
        banner.style.zIndex = '21474836470';
        banner.style.background = 'rgba(200,30,30,0.95)';
        banner.style.color = '#fff';
        banner.style.padding = '6px 10px';
        banner.style.borderRadius = '6px';
        banner.style.fontSize = '12px';
        banner.style.fontFamily = 'Arial, sans-serif';
        banner.innerHTML = '<strong>Skip/Next</strong> script cargado';
        if (document.body) {
            document.body.appendChild(banner);
        } else {
            document.addEventListener('DOMContentLoaded', () => document.body.appendChild(banner));
        }
    } catch(e) {
        console.warn('[Skip/Next] banner failed', e);
    }

    const SKIP_TIME_SECONDS = 150; // 2:30
    const NEXT_CHAPTER_TIME_SECONDS = 570; // 9:30

    function findNextChapterLink() {
        const selectors = ['a[rel="next"]', '.next a', 'a.next', 'a.button-next'];
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && el.href) return el.href;
        }

        const linkElements = document.getElementsByTagName('a');
        for (let i = 0; i < linkElements.length; i++) {
            const link = linkElements[i];
            const linkText = link.textContent.toLowerCase();
            if (linkText.includes('siguiente') || linkText.includes('next')) {
                if (link.href) {
                    return link.href;
                }
            }
        }
        return null;
    }

    function createPlayerButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'absolute';
        button.style.zIndex = '2147483647';
        button.style.background = 'rgba(20,20,20,0.9)';
        button.style.color = '#fff';
        button.style.padding = '10px 20px';
        button.style.borderRadius = '4px';
        button.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        button.style.fontSize = '14px';
        button.style.cursor = 'pointer';
        button.style.pointerEvents = 'auto';
        button.style.opacity = '0';
        button.style.transition = 'opacity 300ms ease-in-out';
        button.style.display = 'none'; // Initially hidden
        button.style.border = 'none';
        return button;
    }

    function initializeButtonsForVideo(video) {
        if (!video || video.hasAttribute('data-buttons-attached')) {
            return;
        }
        video.setAttribute('data-buttons-attached', 'true');

        const skipButton = createPlayerButton('Saltar Intro');
        skipButton.style.left = '20px';
        skipButton.style.bottom = '120px';

        const nextChapterButton = createPlayerButton('Siguiente Capítulo');
        nextChapterButton.style.right = '50px';
        nextChapterButton.style.bottom = '120px';

        const container = video.parentElement;
        if (container) {
            const containerStyle = window.getComputedStyle(container);
            if (containerStyle.position === 'static') {
                container.style.position = 'relative';
            }
            container.appendChild(skipButton);
            container.appendChild(nextChapterButton);
        } else {
            // Fallback to body if no parent
            document.body.appendChild(skipButton);
            skipButton.style.position = 'fixed';
            document.body.appendChild(nextChapterButton);
            nextChapterButton.style.position = 'fixed';
        }

        skipButton.addEventListener('click', (e) => {
            e.stopPropagation();
            video.currentTime = SKIP_TIME_SECONDS;
        });

        const nextChapterUrl = findNextChapterLink();
        if (nextChapterUrl) {
            nextChapterButton.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = nextChapterUrl;
            });
        }

        video.addEventListener('timeupdate', () => {
            const currentTime = video.currentTime;

            // Skip button logic
            if (currentTime > 0 && currentTime <= SKIP_TIME_SECONDS) {
                if (skipButton.style.display === 'none') {
                    skipButton.style.display = 'block';
                    setTimeout(() => skipButton.style.opacity = '1', 50);
                }
            } else {
                if (skipButton.style.display === 'block') {
                    skipButton.style.opacity = '0';
                    setTimeout(() => {
                        if (skipButton.style.opacity === '0') {
                            skipButton.style.display = 'none';
                        }
                    }, 300);
                }
            }

            // Next chapter button logic
            if (nextChapterUrl && currentTime >= NEXT_CHAPTER_TIME_SECONDS) {
                if (nextChapterButton.style.display === 'none') {
                    nextChapterButton.style.display = 'block';
                    setTimeout(() => nextChapterButton.style.opacity = '1', 50);
                }
            } else {
                if (nextChapterButton.style.display === 'block') {
                    nextChapterButton.style.opacity = '0';
                    setTimeout(() => {
                        if (nextChapterButton.style.opacity === '0') {
                            nextChapterButton.style.display = 'none';
                        }
                    }, 300);
                }
            }
        });

        console.log('[Skip/Next] Buttons attached to video.');
    }

    function findAndInitializeVideos() {
        document.querySelectorAll('video').forEach(initializeButtonsForVideo);
    }

    // Run on page load
    findAndInitializeVideos();

    // Also run when new video elements are added to the page
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        if (node.tagName === 'VIDEO') {
                            initializeButtonsForVideo(node);
                        } else if (node.querySelector) {
                            node.querySelectorAll('video').forEach(initializeButtonsForVideo);
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();