document.addEventListener('DOMContentLoaded', () => {
    let mantras = [];
    let selectedId = '';
    let fontSize = 20;

    // DOM Elements
    const appContainer = document.getElementById('app');
    const sidebar = document.getElementById('sidebar');
    const homeBtn = document.getElementById('home-btn');
    const mantraListEl = document.getElementById('mantra-list');
    
    const defaultView = document.getElementById('default-view');
    const detailView = document.getElementById('detail-view');
    
    const mantraTitleEl = document.getElementById('mantra-title');
    const mobileBackBtn = document.getElementById('mobile-back-btn');
    const fontDecreaseBtn = document.getElementById('font-decrease');
    const fontIncreaseBtn = document.getElementById('font-increase');
    const fontSizeDisplay = document.getElementById('font-size-display');
    
    const mantraImageEl = document.getElementById('mantra-image');
    const imageZoomBtn = document.getElementById('image-zoom-btn');
    const mantraScrollContainer = document.getElementById('mantra-scroll-container');
    const mantraBodyEl = document.getElementById('mantra-body');
    
    const prevBtn = document.getElementById('prev-btn');
    const prevTitleEl = document.getElementById('prev-title');
    const nextBtn = document.getElementById('next-btn');
    const nextTitleEl = document.getElementById('next-title');
    
    const imageModal = document.getElementById('image-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalImage = document.getElementById('modal-image');

    // Load Data
    if (typeof mantrasData !== 'undefined') {
        mantras = mantrasData;
        renderMantraList();
    } else {
        console.error('Error: mantrasData is not defined. Ensure data/menu.js is loaded.');
    }

    // Functions
    function renderMantraList() {
        mantraListEl.innerHTML = '';
        mantras.forEach(mantra => {
            const itemWrapper = document.createElement('div');
            itemWrapper.className = 'group';

            const btn = document.createElement('button');
            btn.className = `list-item-btn ${selectedId === mantra.id ? 'selected' : ''}`;
            btn.onclick = () => selectMantra(mantra.id);
            
            btn.innerHTML = `
                <span class="list-icon-left">›</span>
                ${mantra.title}
                <span class="list-icon-right">↗</span>
            `;

            itemWrapper.appendChild(btn);
            mantraListEl.appendChild(itemWrapper);
        });
    }

    function selectMantra(id) {
        selectedId = id;
        const mantra = mantras.find(m => m.id === id);
        
        if (mantra) {
            // Update List Selection
            renderMantraList();

            // Update Detail Content
            mantraTitleEl.textContent = mantra.title;
            
            // Handle image error fallback
            const imgPath = `images/${mantra.id}.jpg`;
            mantraImageEl.src = imgPath;
            mantraImageEl.style.display = 'block';
            mantraImageEl.onerror = () => { mantraImageEl.style.display = 'none'; };
            
            // Build body
            mantraBodyEl.innerHTML = '';
            mantra.body.forEach(line => {
                if (line === "🕉️") {
                    const hr = document.createElement('hr');
                    hr.className = 'mantra-divider';
                    mantraBodyEl.appendChild(hr);
                } else {
                    const p = document.createElement('p');
                    p.textContent = line;
                    mantraBodyEl.appendChild(p);
                }
            });

            // Update Navigation
            const currentIndex = mantras.findIndex(m => m.id === id);
            const prevMantra = currentIndex > 0 ? mantras[currentIndex - 1] : null;
            const nextMantra = currentIndex < mantras.length - 1 ? mantras[currentIndex + 1] : null;

            if (prevMantra) {
                prevBtn.classList.remove('hidden');
                prevTitleEl.textContent = prevMantra.title;
                prevBtn.onclick = () => selectMantra(prevMantra.id);
            } else {
                prevBtn.classList.add('hidden');
            }

            if (nextMantra) {
                nextBtn.classList.remove('hidden');
                nextTitleEl.textContent = nextMantra.title;
                nextBtn.onclick = () => selectMantra(nextMantra.id);
            } else {
                nextBtn.classList.add('hidden');
            }

            // Show views
            defaultView.classList.add('hidden');
            detailView.classList.remove('hidden');
            appContainer.classList.add('mobile-detail-active');

            // Scroll to top
            if (mantraScrollContainer) {
                mantraScrollContainer.scrollTop = 0;
            }
        } else {
            // Go home
            selectedId = '';
            renderMantraList();
            defaultView.classList.remove('hidden');
            detailView.classList.add('hidden');
            appContainer.classList.remove('mobile-detail-active');
        }
    }

    function updateFontSize() {
        mantraBodyEl.style.fontSize = `${fontSize}px`;
        fontSizeDisplay.textContent = fontSize;
        fontDecreaseBtn.disabled = fontSize <= 18;
        fontIncreaseBtn.disabled = fontSize >= 32;
    }

    // Event Listeners
    homeBtn.addEventListener('click', () => {
        selectMantra('');
    });

    mobileBackBtn.addEventListener('click', () => {
        selectMantra('');
    });

    fontIncreaseBtn.addEventListener('click', () => {
        if (fontSize < 32) {
            fontSize = Math.min(fontSize + 2, 32);
            updateFontSize();
        }
    });

    fontDecreaseBtn.addEventListener('click', () => {
        if (fontSize > 18) {
            fontSize = Math.max(fontSize - 2, 18);
            updateFontSize();
        }
    });

    // Sidebar scrolling class for autohide scrollbar
    let scrollTimeout;
    sidebar.addEventListener('scroll', () => {
        sidebar.classList.add('scrolling');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            sidebar.classList.remove('scrolling');
        }, 1000);
    });

    // Image Zoom functionality
    imageZoomBtn.addEventListener('click', () => {
        if (mantraImageEl.style.display !== 'none' && mantraImageEl.src) {
            modalImage.src = mantraImageEl.src;
            imageModal.classList.remove('hidden');
        }
    });

    closeModalBtn.addEventListener('click', () => {
        imageModal.classList.add('hidden');
    });

    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
            imageModal.classList.add('hidden');
        }
    });

    // Initialize font size display
    updateFontSize();
});
