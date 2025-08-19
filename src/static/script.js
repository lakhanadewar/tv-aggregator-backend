// Global variables
let allChannels = [];
let filteredChannels = [];
let currentPage = 1;
const channelsPerPage = 24;
let hls = null;

// DOM elements
const channelsGrid = document.getElementById('channels-grid');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const countryFilter = document.getElementById('country-filter');
const languageFilter = document.getElementById('language-filter');
const sectionTitle = document.getElementById('section-title');
const playerModal = document.getElementById('player-modal');
const videoPlayer = document.getElementById('video-player');
const channelName = document.getElementById('channel-name');
const channelCategory = document.getElementById('channel-category');
const channelLogo = document.getElementById('channel-logo');
const closePlayer = document.getElementById('close-player');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// API base URL
const API_BASE = '/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    try {
        await loadChannels();
        await loadFilters();
        displayChannels();
        updateStats();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to load channels. Please refresh the page.');
    }
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Search
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // Filters
    categoryFilter.addEventListener('change', handleFilters);
    countryFilter.addEventListener('change', handleFilters);
    languageFilter.addEventListener('change', handleFilters);

    // Player controls
    closePlayer.addEventListener('click', closePlayerModal);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Close modal on background click
    playerModal.addEventListener('click', function(e) {
        if (e.target === playerModal) {
            closePlayerModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && playerModal.classList.contains('active')) {
            closePlayerModal();
        }
    });
}

// API functions
async function loadChannels() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/channels`);
        const data = await response.json();
        
        if (data.success) {
            allChannels = data.channels;
            filteredChannels = [...allChannels];
        } else {
            throw new Error(data.error || 'Failed to load channels');
        }
    } catch (error) {
        console.error('Error loading channels:', error);
        throw error;
    } finally {
        showLoading(false);
    }
}

async function loadFilters() {
    try {
        // Load categories
        const categoriesResponse = await fetch(`${API_BASE}/channels/categories`);
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
            populateFilter(categoryFilter, categoriesData.categories);
        }

        // Load countries
        const countriesResponse = await fetch(`${API_BASE}/channels/countries`);
        const countriesData = await countriesResponse.json();
        
        if (countriesData.success) {
            populateFilter(countryFilter, countriesData.countries);
        }

        // Load languages
        const languagesResponse = await fetch(`${API_BASE}/channels/languages`);
        const languagesData = await languagesResponse.json();
        
        if (languagesData.success) {
            populateFilter(languageFilter, languagesData.languages);
        }
    } catch (error) {
        console.error('Error loading filters:', error);
    }
}

function populateFilter(selectElement, options) {
    // Clear existing options except the first one
    while (selectElement.children.length > 1) {
        selectElement.removeChild(selectElement.lastChild);
    }

    options.forEach(option => {
        if (option) { // Only add non-empty options
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        }
    });
}

// Display functions
function displayChannels() {
    const startIndex = (currentPage - 1) * channelsPerPage;
    const endIndex = startIndex + channelsPerPage;
    const channelsToShow = filteredChannels.slice(startIndex, endIndex);

    channelsGrid.innerHTML = '';

    if (channelsToShow.length === 0) {
        channelsGrid.innerHTML = '<div class="no-channels">No channels found matching your criteria.</div>';
        return;
    }

    channelsToShow.forEach((channel, index) => {
        const channelCard = createChannelCard(channel, startIndex + index);
        channelsGrid.appendChild(channelCard);
    });

    // Add load more button if there are more channels
    if (endIndex < filteredChannels.length) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.textContent = 'Load More Channels';
        loadMoreBtn.addEventListener('click', loadMoreChannels);
        channelsGrid.appendChild(loadMoreBtn);
    }
}

function createChannelCard(channel, index) {
    const card = document.createElement('div');
    card.className = 'channel-card';
    card.addEventListener('click', () => playChannel(channel, index));

    const logoUrl = channel.tvg_logo || 'https://via.placeholder.com/300x150/667eea/ffffff?text=No+Logo';
    
    card.innerHTML = `
        <img class="channel-logo" src="${logoUrl}" alt="${channel.name}" 
             onerror="this.src='https://via.placeholder.com/300x150/667eea/ffffff?text=No+Logo'">
        <div class="channel-info">
            <h3 class="channel-name">${channel.name}</h3>
            <div class="channel-meta">
                <span class="channel-category">${channel.category || 'Other'}</span>
                <span class="channel-country">${channel.country || ''}</span>
            </div>
            <div class="channel-language">${channel.language || ''}</div>
        </div>
    `;

    return card;
}

function loadMoreChannels() {
    currentPage++;
    displayChannels();
}

// Event handlers
function handleNavigation(e) {
    e.preventDefault();
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.target.closest('.nav-link').classList.add('active');

    const section = e.target.closest('.nav-link').dataset.section;
    
    // Reset filters and search
    resetFilters();
    
    // Filter channels based on section
    switch (section) {
        case 'live-tv':
            filteredChannels = allChannels.filter(ch => !isRadioChannel(ch));
            sectionTitle.textContent = 'Live TV Channels';
            break;
        case 'radio':
            filteredChannels = allChannels.filter(ch => isRadioChannel(ch));
            sectionTitle.textContent = 'Radio Channels';
            break;
        case 'categories':
            filteredChannels = [...allChannels];
            sectionTitle.textContent = 'Browse by Category';
            break;
        case 'countries':
            filteredChannels = [...allChannels];
            sectionTitle.textContent = 'Browse by Country';
            break;
        case 'languages':
            filteredChannels = [...allChannels];
            sectionTitle.textContent = 'Browse by Language';
            break;
        default:
            filteredChannels = [...allChannels];
            sectionTitle.textContent = 'All Channels';
    }

    currentPage = 1;
    displayChannels();
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredChannels = [...allChannels];
    } else {
        filteredChannels = allChannels.filter(channel =>
            channel.name.toLowerCase().includes(searchTerm) ||
            channel.category.toLowerCase().includes(searchTerm)
        );
    }

    currentPage = 1;
    displayChannels();
    sectionTitle.textContent = searchTerm ? `Search Results for "${e.target.value}"` : 'All Channels';
}

function handleFilters() {
    const category = categoryFilter.value;
    const country = countryFilter.value;
    const language = languageFilter.value;

    filteredChannels = allChannels.filter(channel => {
        return (!category || channel.category === category) &&
               (!country || channel.country === country) &&
               (!language || channel.language === language);
    });

    currentPage = 1;
    displayChannels();
    
    // Update section title
    const filters = [category, country, language].filter(f => f);
    if (filters.length > 0) {
        sectionTitle.textContent = `Filtered Channels (${filters.join(', ')})`;
    } else {
        sectionTitle.textContent = 'All Channels';
    }
}

// Player functions
function playChannel(channel, index) {
    // Update channel info in modal
    channelName.textContent = channel.name;
    channelCategory.textContent = channel.category || 'Other';
    
    const logoUrl = channel.tvg_logo || 'https://via.placeholder.com/50x50/667eea/ffffff?text=Logo';
    channelLogo.src = logoUrl;
    channelLogo.onerror = function() {
        this.src = 'https://via.placeholder.com/50x50/667eea/ffffff?text=Logo';
    };

    // Show modal
    playerModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Initialize HLS player
    initializePlayer(channel.url);
}

function initializePlayer(streamUrl) {
    // Clean up existing player
    if (hls) {
        hls.destroy();
        hls = null;
    }

    // Reset video element
    videoPlayer.src = '';
    videoPlayer.load();

    if (Hls.isSupported()) {
        hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(videoPlayer);

        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            console.log('HLS manifest parsed, starting playback');
            videoPlayer.play().catch(e => {
                console.log('Autoplay prevented:', e);
            });
        });

        hls.on(Hls.Events.ERROR, function(event, data) {
            console.error('HLS error:', data);
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('Network error, trying to recover...');
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log('Media error, trying to recover...');
                        hls.recoverMediaError();
                        break;
                    default:
                        console.log('Fatal error, destroying HLS instance');
                        hls.destroy();
                        showPlayerError('Unable to play this stream. Please try another channel.');
                        break;
                }
            }
        });
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoPlayer.src = streamUrl;
        videoPlayer.addEventListener('loadedmetadata', function() {
            videoPlayer.play().catch(e => {
                console.log('Autoplay prevented:', e);
            });
        });
    } else {
        showPlayerError('HLS is not supported in this browser.');
    }
}

function closePlayerModal() {
    playerModal.classList.remove('active');
    document.body.style.overflow = '';

    // Stop and clean up player
    if (hls) {
        hls.destroy();
        hls = null;
    }
    
    videoPlayer.pause();
    videoPlayer.src = '';
    videoPlayer.load();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        videoPlayer.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function showPlayerError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'player-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
    `;
    
    const playerWrapper = document.querySelector('.player-wrapper');
    playerWrapper.innerHTML = '';
    playerWrapper.appendChild(errorDiv);
}

// Utility functions
function isRadioChannel(channel) {
    const radioCategories = ['radio', 'music', 'audio'];
    return radioCategories.some(cat => 
        channel.category.toLowerCase().includes(cat) ||
        channel.name.toLowerCase().includes('radio') ||
        channel.name.toLowerCase().includes('fm') ||
        channel.name.toLowerCase().includes('am')
    );
}

function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    countryFilter.value = '';
    languageFilter.value = '';
}

function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    channelsGrid.innerHTML = '';
    channelsGrid.appendChild(errorDiv);
}

function updateStats() {
    const totalChannels = allChannels.length;
    const categories = new Set(allChannels.map(ch => ch.category).filter(c => c));
    const countries = new Set(allChannels.map(ch => ch.country).filter(c => c));

    document.getElementById('total-channels').textContent = totalChannels.toLocaleString();
    document.getElementById('total-categories').textContent = categories.size + '+';
    document.getElementById('total-countries').textContent = countries.size + '+';
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for error states
const style = document.createElement('style');
style.textContent = `
    .no-channels {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: #666;
        font-size: 1.1rem;
    }

    .error-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: #e74c3c;
        font-size: 1.1rem;
        background: #fdf2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        margin: 1rem;
    }

    .load-more-btn {
        grid-column: 1 / -1;
        background: #667eea;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        margin: 2rem auto;
        transition: all 0.3s ease;
    }

    .load-more-btn:hover {
        background: #5a6fd8;
        transform: translateY(-2px);
    }

    .player-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 500px;
        color: #e74c3c;
        text-align: center;
    }

    .player-error i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .player-error p {
        font-size: 1.1rem;
        margin: 0;
    }
`;
document.head.appendChild(style);

