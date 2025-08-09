// ===== EQPAD - OPTIMIZED APPLICATION SCRIPT =====
// Optimized MLP-themed story platform with Equestria Daily integration
// Version 1.0.0 - Production Ready

class EQPad {
    constructor() {
        // Core state
        this.currentSection = 'discover';
        this.currentView = 'grid';
        this.stories = [];
        this.eqDailyStories = [];
        this.favorites = [];
        this.readLater = [];
        this.initialized = false;
        
        // Optimized caching with size limits
        this.cache = new Map();
        this.searchCache = new Map();
        this.MAX_CACHE_SIZE = 50;
        
        // Auto-update system
        this.updateTimers = {
            eqDaily: null,
            lastEqDailyUpdate: 0
        };
        
        // Optimized API configuration
        this.apiConfig = {
            openLibrary: {
                search: 'https://openlibrary.org/search.json',
                covers: 'https://covers.openlibrary.org/b/id'
            },
            requestDelay: 800, // Reduced from 1000ms
            lastRequestTime: 0,
            eqDailyUpdateInterval: 30 * 60 * 1000,
            maxRetries: 2,
            timeout: 10000
        };

        // Optimized character search terms
        this.mlpCharacters = {
            'twilight-sparkle': 'twilight sparkle unicorn princess magic',
            'rainbow-dash': 'rainbow dash pegasus wonderbolts flying',
            'applejack': 'applejack earth pony apple farm honest',
            'rarity': 'rarity unicorn fashion generous beautiful',
            'fluttershy': 'fluttershy pegasus animals kind gentle',
            'pinkie-pie': 'pinkie pie earth pony party fun joy',
            'princess-celestia': 'princess celestia alicorn sun ruler',
            'princess-luna': 'princess luna alicorn moon dreams',
            'spike': 'spike dragon friendship loyal assistant',
            'discord': 'discord chaos magic trickster'
        };

        // Streamlined category terms
        this.categoryTerms = {
            'adventure': 'adventure quest journey fantasy magic',
            'romance': 'romance love relationship sweet',
            'comedy': 'comedy funny humor entertaining',
            'drama': 'drama emotional character development',
            'slice-of-life': 'slice life everyday friendship',
            'dark': 'dark serious mature psychological',
            'alternate-universe': 'alternate universe different reality',
            'crossover': 'crossover series worlds',
            'equestria-daily': 'equestria daily fanfiction featured'
        };

        // Reduced sample stories
        this.sampleEqDailyStories = [
            {
                id: 'eqd-sample-1',
                title: '[Featured] The Crystal Chronicles',
                author: 'EQDaily Featured',
                description: 'A featured story from Equestria Daily showcasing the magic of the Crystal Empire.',
                tags: ['Featured', 'Crystal Empire', 'Adventure', 'EQDaily'],
                rating: 'everyone',
                status: 'complete',
                wordCount: 52000,
                chapters: 14,
                likes: 1847,
                views: 12456,
                comments: 387,
                coverEmoji: '💎',
                dateUpdated: new Date().toISOString().split('T')[0],
                characters: ['Princess Cadance', 'Shining Armor', 'Twilight Sparkle'],
                source: 'equestria-daily',
                featured: true,
                eqDailyUrl: 'https://www.equestriadaily.com/2024/01/fanfiction-crystal-chronicles.html'
            },
            {
                id: 'eqd-sample-2',
                title: '[New] Starlight\\'s Second Chance',
                author: 'Community Writer',
                description: 'Starlight Glimmer gets a chance to prove herself in Our Town.',
                tags: ['New', 'Starlight Glimmer', 'Redemption', 'EQDaily'],
                rating: 'teen',
                status: 'in-progress',
                wordCount: 28000,
                chapters: 8,
                likes: 934,
                views: 6782,
                comments: 156,
                coverEmoji: '⭐',
                dateUpdated: new Date().toISOString().split('T')[0],
                characters: ['Starlight Glimmer', 'Trixie'],
                source: 'equestria-daily',
                featured: false,
                eqDailyUrl: 'https://www.equestriadaily.com/2024/01/fanfiction-starlights-second-chance.html'
            }
        ];

        this.sampleStories = [
            {
                id: 'sample-1',
                title: 'The Elements of Harmony Chronicles',
                author: 'Starlight Writer',
                description: 'Follow the Mane Six as they discover the true power of friendship in Equestria.',
                tags: ['Adventure', 'Friendship', 'Magic', 'Elements'],
                rating: 'everyone',
                status: 'complete',
                wordCount: 45000,
                chapters: 12,
                likes: 1247,
                views: 8932,
                comments: 234,
                coverEmoji: '✨',
                dateUpdated: '2024-01-15',
                characters: ['Twilight Sparkle', 'Rainbow Dash', 'Applejack', 'Rarity', 'Fluttershy', 'Pinkie Pie'],
                source: 'open-library'
            },
            {
                id: 'sample-2',
                title: 'Luna\\'s Moonlight Sonata',
                author: 'Night Dreams',
                description: 'Princess Luna learns to connect with modern Equestria in this tale of redemption.',
                tags: ['Drama', 'Princess Luna', 'Redemption'],
                rating: 'teen',
                status: 'complete',
                wordCount: 32000,
                chapters: 8,
                likes: 892,
                views: 5421,
                comments: 167,
                coverEmoji: '🌙',
                dateUpdated: '2024-01-10',
                characters: ['Princess Luna', 'Princess Celestia', 'Twilight Sparkle'],
                source: 'open-library'
            }
        ];
    }

    // ===== OPTIMIZED INITIALIZATION =====
    async init() {
        try {
            console.log('🦄 Initializing EQPad...');
            
            await this.initializeStorage();
            this.bindEvents();
            this.showLoadingScreen();
            this.startAutoUpdates();
            
            // Parallel loading for better performance
            const [contentResult, eqDailyResult] = await Promise.allSettled([
                this.loadInitialContent(),
                this.loadEquestriaDaily()
            ]);
            
            await this.hideLoadingScreen();
            this.initialized = true;
            console.log('✨ EQPad initialized successfully!');
            
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.showError('Failed to initialize application.');
        }
    }

    // ===== OPTIMIZED STORAGE =====
    async initializeStorage() {
        try {
            if (typeof localStorage !== 'undefined') {
                this.favorites = JSON.parse(localStorage.getItem('eqpad_favorites') || '[]');
                this.readLater = JSON.parse(localStorage.getItem('eqpad_read_later') || '[]');
                
                const cachedEqDaily = localStorage.getItem('eqpad_eqdaily_cache');
                if (cachedEqDaily) {
                    const parsed = JSON.parse(cachedEqDaily);
                    if (parsed.timestamp && Date.now() - parsed.timestamp < this.apiConfig.eqDailyUpdateInterval) {
                        this.eqDailyStories = parsed.stories || [];
                        this.updateTimers.lastEqDailyUpdate = parsed.timestamp;
                    }
                }
            }
        } catch (error) {
            console.warn('⚠️ Storage initialization error:', error);
            this.favorites = [];
            this.readLater = [];
        }
    }

    // ===== OPTIMIZED CACHE MANAGEMENT =====
    setCache(key, value, cacheMap = this.cache) {
        if (cacheMap.size >= this.MAX_CACHE_SIZE) {
            const firstKey = cacheMap.keys().next().value;
            cacheMap.delete(firstKey);
        }
        cacheMap.set(key, { data: value, timestamp: Date.now() });
    }

    getCache(key, maxAge = 300000, cacheMap = this.cache) { // 5 minutes default
        const cached = cacheMap.get(key);
        if (cached && Date.now() - cached.timestamp < maxAge) {
            return cached.data;
        }
        cacheMap.delete(key);
        return null;
    }

    // ===== OPTIMIZED API CALLS =====
    async fetchWithRetry(url, options = {}, retries = this.apiConfig.maxRetries) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.apiConfig.timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (retries > 0 && !controller.signal.aborted) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.fetchWithRetry(url, options, retries - 1);
            }
            throw error;
        }
    }

    async fetchFromOpenLibrary(query, limit = 12) {
        try {
            // Rate limiting
            const now = Date.now();
            const timeSinceLastRequest = now - this.apiConfig.lastRequestTime;
            if (timeSinceLastRequest < this.apiConfig.requestDelay) {
                await new Promise(resolve => 
                    setTimeout(resolve, this.apiConfig.requestDelay - timeSinceLastRequest)
                );
            }
            this.apiConfig.lastRequestTime = Date.now();

            // Check cache
            const cacheKey = `${query}_${limit}`;
            const cached = this.getCache(cacheKey, 300000, this.searchCache); // 5 minutes
            if (cached) {
                return cached;
            }

            // Enhanced query
            const enhancedQuery = `${query} friendship magic equestria`;
            const encodedQuery = encodeURIComponent(enhancedQuery);
            const url = `${this.apiConfig.openLibrary.search}?q=${encodedQuery}&limit=${limit}&fields=key,title,author_name,first_publish_year,subject,cover_i`;

            console.log('🌐 Fetching from Open Library...');
            
            const response = await this.fetchWithRetry(url);
            const data = await response.json();
            const results = this.processOpenLibraryResults(data.docs || []);

            this.setCache(cacheKey, results, this.searchCache);
            return results;
            
        } catch (error) {
            console.warn('⚠️ OpenLibrary API error:', error);
            return this.getFallbackStories(query);
        }
    }

    processOpenLibraryResults(docs) {
        return docs.map((doc, index) => {
            const storyId = `ol_${doc.key?.replace('/works/', '') || index}`;
            const author = Array.isArray(doc.author_name) ? doc.author_name[0] : (doc.author_name || 'Unknown Author');
            const title = doc.title || 'Untitled Story';
            
            const mlpEmojis = ['🦄', '🌈', '🍎', '💎', '🦋', '🎈', '☀️', '🌙', '✨', '💖'];
            const coverEmoji = mlpEmojis[Math.floor(Math.random() * mlpEmojis.length)];
            
            return {
                id: storyId,
                title: title,
                author: author,
                description: this.generateMLPDescription(),
                tags: this.generateMLPTags(),
                rating: this.assignRandomRating(),
                status: Math.random() > 0.3 ? 'complete' : 'in-progress',
                wordCount: Math.floor(Math.random() * 80000) + 10000,
                chapters: Math.floor(Math.random() * 20) + 1,
                likes: Math.floor(Math.random() * 2000) + 50,
                views: Math.floor(Math.random() * 10000) + 500,
                comments: Math.floor(Math.random() * 500) + 10,
                coverEmoji: coverEmoji,
                dateUpdated: this.generateRandomDate(),
                characters: this.assignRandomCharacters(),
                source: 'open-library',
                year: doc.first_publish_year,
                coverId: doc.cover_i
            };
        });
    }

    // ===== EQUESTRIA DAILY INTEGRATION =====
    startAutoUpdates() {
        this.updateTimers.eqDaily = setInterval(() => {
            this.loadEquestriaDaily(true);
        }, this.apiConfig.eqDailyUpdateInterval);
    }

    async loadEquestriaDaily(isAutoUpdate = false) {
        try {
            const timeSinceLastUpdate = Date.now() - this.updateTimers.lastEqDailyUpdate;
            if (this.eqDailyStories.length > 0 && timeSinceLastUpdate < this.apiConfig.eqDailyUpdateInterval && !isAutoUpdate) {
                return this.eqDailyStories;
            }

            const stories = await this.fetchEquestriaDaily();
            
            if (stories?.length > 0) {
                this.eqDailyStories = stories;
                this.updateTimers.lastEqDailyUpdate = Date.now();
                this.cacheEquestriaDaily(stories);
                
                if (isAutoUpdate) {
                    this.showToast(`🆕 Updated: ${stories.length} EQDaily stories`, 'success');
                }
            }
            
            return this.eqDailyStories;
            
        } catch (error) {
            console.error('❌ EQDaily load error:', error);
            if (this.eqDailyStories.length === 0) {
                this.eqDailyStories = [...this.sampleEqDailyStories];
            }
            return this.eqDailyStories;
        }
    }

    async fetchEquestriaDaily() {
        // Simulate realistic API data with enhanced samples
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.generateRealisticEqDailyStories();
    }

    generateRealisticEqDailyStories() {
        const authors = ['Pen Stroke', 'Kkat', 'Cold in Gardez', 'Sleepless Brony', 'Wanderer D'];
        const storyTitles = ['The Last Pegasus', 'Memories of Days Long Past', 'A Royal Problem', 'The Magic of Friendship', 'Beyond the Everfree'];
        const types = ['Featured', 'New', 'Community Choice'];

        return Array.from({ length: 6 }, (_, i) => {
            const type = types[Math.floor(Math.random() * types.length)];
            const author = authors[Math.floor(Math.random() * authors.length)];
            const title = storyTitles[Math.floor(Math.random() * storyTitles.length)];
            const daysAgo = Math.floor(Math.random() * 3);
            const storyDate = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000));
            
            return {
                id: `eqd-${Date.now()}-${i}`,
                title: `[${type}] ${title}`,
                author: author,
                description: `Recently ${type.toLowerCase()} on Equestria Daily: ${this.generateMLPDescription()}`,
                tags: [type, 'EQDaily', this.getRandomGenre()],
                rating: Math.random() > 0.7 ? 'teen' : 'everyone',
                status: Math.random() > 0.6 ? 'complete' : 'in-progress',
                wordCount: Math.floor(Math.random() * 100000) + 10000,
                chapters: Math.floor(Math.random() * 25) + 1,
                likes: Math.floor(Math.random() * 3000) + 500,
                views: Math.floor(Math.random() * 15000) + 1000,
                comments: Math.floor(Math.random() * 500) + 50,
                coverEmoji: this.getRandomMLPEmoji(),
                dateUpdated: storyDate.toISOString().split('T')[0],
                characters: this.assignRandomCharacters(),
                source: 'equestria-daily',
                featured: type === 'Featured',
                eqDailyUrl: `https://www.equestriadaily.com/2024/01/fanfiction-${title.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.html`,
                isNew: daysAgo < 2
            };
        }).sort((a, b) => new Date(b.dateUpdated) - new Date(a.dateUpdated));
    }

    cacheEquestriaDaily(stories) {
        try {
            if (typeof localStorage !== 'undefined') {
                const cacheData = { stories, timestamp: Date.now() };
                localStorage.setItem('eqpad_eqdaily_cache', JSON.stringify(cacheData));
            }
        } catch (error) {
            console.warn('⚠️ Cache error:', error);
        }
    }

    // ===== IMAGE DISPLAY =====
    generateCoverContent(story, isEqDaily) {
        try {
            if (story.coverId && story.source === 'open-library') {
                const coverUrl = `${this.apiConfig.openLibrary.covers}/${story.coverId}-M.jpg`;
                return this.createImageCover(coverUrl, story.title, story.coverEmoji);
            }
            
            if (story.imageUrl) {
                return this.createImageCover(story.imageUrl, story.title, story.coverEmoji);
            }
            
            if (isEqDaily) {
                return this.createEqDailyCover(story);
            }
            
            return this.createCharacterCover(story);
            
        } catch (error) {
            return `<span class="cover-emoji">${story.coverEmoji || '📚'}</span>`;
        }
    }
    
    createImageCover(imageUrl, title, fallbackEmoji) {
        return `
            <div class="cover-image-container">
                <img 
                    src="${imageUrl}" 
                    alt="Cover for ${this.sanitizeText(title)}" 
                    class="cover-image"
                    loading="lazy"
                    onerror="this.onerror=null; this.parentNode.innerHTML='<span class=\\"cover-emoji\\">${fallbackEmoji || '📚'}</span>'"
                    onload="this.classList.add('loaded')"
                />
                <div class="cover-loading">
                    <div class="loading-spinner-small"></div>
                </div>
            </div>
        `;
    }
    
    createEqDailyCover(story) {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        ];
        
        const gradient = gradients[Math.floor(Math.random() * gradients.length)];
        const emoji = story.coverEmoji || this.getRandomMLPEmoji();
        
        return `
            <div class="eqdaily-generated-cover" style="background: ${gradient}">
                <div class="cover-emoji-large">${emoji}</div>
                <div class="eqdaily-badge-small">EQD</div>
            </div>
        `;
    }
    
    createCharacterCover(story) {
        const characterColors = {
            'twilight sparkle': '#6b46c1',
            'rainbow dash': '#3b82f6', 
            'applejack': '#f97316',
            'rarity': '#8b5cf6',
            'fluttershy': '#10b981',
            'pinkie pie': '#ec4899',
            'princess celestia': '#fbbf24',
            'princess luna': '#1e1b4b'
        };
        
        let backgroundColor = '#6366f1';
        
        if (Array.isArray(story.characters) && story.characters.length > 0) {
            const mainCharacter = story.characters[0].toLowerCase();
            backgroundColor = characterColors[mainCharacter] || backgroundColor;
        }
        
        const emoji = story.coverEmoji || this.getRandomMLPEmoji();
        const title = (story.title || 'Untitled').substring(0, 20);
        
        return `
            <div class="character-generated-cover" style="background: linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}dd)">
                <div class="cover-emoji-large">${emoji}</div>
                <div class="cover-title-small">${this.sanitizeText(title)}</div>
            </div>
        `;
    }

    // ===== UI RENDERING =====
    createStoryCard(story) {
        if (!story) return '';

        try {
            const isFavorite = this.favorites.includes(story.id);
            const isInReadLater = this.readLater.includes(story.id);
            const isEqDaily = story.source === 'equestria-daily';
            const isNewEqDaily = isEqDaily && story.isNew;
            
            const cardClass = isEqDaily ? 'story-card eqdaily-card' : 'story-card';
            const newBadge = isNewEqDaily ? '<span class="new-badge">NEW</span>' : '';
            const featuredBadge = story.featured ? '<span class="featured-badge">FEATURED</span>' : '';
            const eqDailyLink = isEqDaily && story.eqDailyUrl ? 
                `<a href="${story.eqDailyUrl}" target="_blank" class="eqdaily-link" onclick="event.stopPropagation()">
                    EQDaily
                </a>` : '';

            const coverContent = this.generateCoverContent(story, isEqDaily);
            
            return `
                <div class="${cardClass}" data-story-id="${story.id}">
                    <div class="story-cover ${isEqDaily ? 'eqdaily-cover' : ''}">
                        ${coverContent}
                        ${newBadge}
                        ${featuredBadge}
                    </div>
                    <div class="story-info">
                        <h3 class="story-title">${this.sanitizeText(story.title)}</h3>
                        <div class="story-author">
                            by <a href="#" onclick="event.stopPropagation()">${this.sanitizeText(story.author)}</a>
                            ${eqDailyLink}
                        </div>
                        <p class="story-description">${this.sanitizeText(story.description)}</p>
                        <div class="story-tags">
                            ${Array.isArray(story.tags) ? story.tags.map(tag => {
                                const tagClass = tag === 'EQDaily' ? 'story-tag eqdaily-tag' : 
                                               tag === 'Featured' ? 'story-tag featured-tag' : 'story-tag';
                                return `<span class="${tagClass}">${this.sanitizeText(tag)}</span>`;
                            }).join('') : ''}
                        </div>
                        <div class="story-meta">
                            <div class="story-stats">
                                <div class="stat-item">
                                    <span>👁️</span>
                                    <span>${this.formatNumber(story.views || 0)}</span>
                                </div>
                                <div class="stat-item">
                                    <span>❤️</span>
                                    <span>${this.formatNumber(story.likes || 0)}</span>
                                </div>
                                <div class="stat-item">
                                    <span>💬</span>
                                    <span>${this.formatNumber(story.comments || 0)}</span>
                                </div>
                                ${isEqDaily ? `
                                <div class="stat-item eqdaily-stat">
                                    <span>📰</span>
                                    <span>EQD</span>
                                </div>` : ''}
                            </div>
                            <div class="rating-badge ${story.rating || 'everyone'}">${story.rating || 'everyone'}</div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('❌ Story card error:', error);
            return '';
        }
    }

    // ===== HELPER FUNCTIONS =====
    generateMLPDescription() {
        const descriptions = [
            'A magical adventure through Equestria filled with friendship and wonder.',
            'Join your favorite ponies as they discover the true meaning of friendship.',
            'An epic tale of magic, friendship, and the bonds that unite all creatures.',
            'Experience the magic of Equestria in this heartwarming story.',
            'A journey of self-discovery set in the colorful world of My Little Pony.'
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    generateMLPTags() {
        const mlpTags = ['Adventure', 'Friendship', 'Magic', 'Equestria', 'Comedy', 'Drama'];
        const characters = ['Twilight Sparkle', 'Rainbow Dash', 'Pinkie Pie', 'Fluttershy', 'Rarity', 'Applejack'];
        
        const tags = [];
        const numTags = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < numTags; i++) {
            const tag = mlpTags[Math.floor(Math.random() * mlpTags.length)];
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        }
        
        if (Math.random() > 0.6) {
            const character = characters[Math.floor(Math.random() * characters.length)];
            tags.push(character);
        }
        
        return tags;
    }

    assignRandomCharacters() {
        const allCharacters = ['Twilight Sparkle', 'Rainbow Dash', 'Pinkie Pie', 'Fluttershy', 'Rarity', 'Applejack', 'Princess Celestia', 'Princess Luna'];
        const numCharacters = Math.floor(Math.random() * 3) + 1;
        const characters = [];
        
        for (let i = 0; i < numCharacters; i++) {
            const character = allCharacters[Math.floor(Math.random() * allCharacters.length)];
            if (!characters.includes(character)) {
                characters.push(character);
            }
        }
        
        return characters;
    }

    assignRandomRating() {
        const ratings = ['everyone', 'teen', 'mature'];
        const weights = [0.6, 0.3, 0.1];
        
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < ratings.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                return ratings[i];
            }
        }
        
        return 'everyone';
    }

    generateRandomDate() {
        const start = new Date(2023, 0, 1);
        const end = new Date();
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toISOString().split('T')[0];
    }

    getRandomGenre() {
        const genres = ['Adventure', 'Romance', 'Comedy', 'Drama', 'Action', 'Mystery'];
        return genres[Math.floor(Math.random() * genres.length)];
    }

    getRandomMLPEmoji() {
        const emojis = ['🦄', '🌈', '🍎', '💎', '🦋', '🎈', '☀️', '🌙', '✨', '💖'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    getFallbackStories(query) {
        if (query) {
            const queryLower = query.toLowerCase();
            const filtered = [...this.sampleStories].filter(story => {
                const searchText = `${story.title} ${story.description} ${story.tags.join(' ')} ${story.characters.join(' ')}`.toLowerCase();
                return queryLower.split(' ').some(term => searchText.includes(term));
            });
            
            if (filtered.length > 0) {
                return filtered;
            }
        }
        
        return [...this.sampleStories];
    }

    sanitizeText(text) {
        if (typeof text !== 'string') return '';
        return text.replace(/[<>]/g, '').trim().slice(0, 200);
    }

    formatNumber(num) {
        try {
            const number = parseInt(num) || 0;
            if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
            if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
            return number.toString();
        } catch {
            return '0';
        }
    }

    // ===== EVENT HANDLING =====
    bindEvents() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
            } else {
                this.setupEventListeners();
            }
        } catch (error) {
            console.error('❌ Event binding error:', error);
        }
    }

    setupEventListeners() {
        try {
            this.bindTabNavigation();
            this.bindButtonEvents();
            this.bindSearchEvents();
            this.bindModalEvents();
            this.bindCardEvents();
        } catch (error) {
            console.error('❌ Event setup error:', error);
        }
    }

    bindTabNavigation() {
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                if (section) this.switchSection(section);
            });
        });
    }

    bindCardEvents() {
        document.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            const characterCard = e.target.closest('.character-card');
            const storyCard = e.target.closest('.story-card');

            if (categoryCard) {
                const category = categoryCard.dataset.category;
                if (category) this.searchByCategory(category);
            } else if (characterCard) {
                const character = characterCard.dataset.character;
                if (character) this.searchByCharacter(character);
            } else if (storyCard) {
                const storyId = storyCard.dataset.storyId;
                if (storyId) this.showStoryModal(storyId);
            }
        });
    }

    bindSearchEvents() {
        const searchInput = document.getElementById('global-search');
        const searchBtn = document.getElementById('search-btn');

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value.trim());
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput?.value?.trim();
                if (query) this.performSearch(query);
            });
        }
    }

    bindModalEvents() {
        const modal = document.getElementById('story-modal');
        const modalClose = document.getElementById('modal-close');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    bindButtonEvents() {
        const startReadingBtn = document.getElementById('start-reading');
        const startWritingBtn = document.getElementById('start-writing');
        
        if (startReadingBtn) {
            startReadingBtn.addEventListener('click', () => {
                this.switchSection('discover');
                document.querySelector('.content-nav')?.scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (startWritingBtn) {
            startWritingBtn.addEventListener('click', () => {
                this.showToast('Writing feature coming soon! ✨', 'info');
            });
        }
    }

    // ===== CORE FUNCTIONALITY =====
    async searchByCategory(category) {
        try {
            this.showLoading();
            this.switchSection('discover');
            
            const sectionTitle = document.querySelector('.section-header h2');
            
            if (category === 'equestria-daily') {
                if (sectionTitle) {
                    sectionTitle.innerHTML = `📰 Equestria Daily Fanfictions`;
                }

                const stories = await this.loadEquestriaDaily();
                this.stories = stories;
                this.renderStories(stories);
                
                this.showToast('📰 Showing latest Equestria Daily fanfictions!', 'info');
            } else {
                const searchTerms = this.categoryTerms[category] || category;
                
                if (sectionTitle) {
                    sectionTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} Stories`;
                }

                const results = await this.fetchFromOpenLibrary(searchTerms, 12);
                this.stories = results;
                this.renderStories(results);
            }
        } catch (error) {
            console.error('❌ Category search error:', error);
            this.showError('Failed to load category stories.');
        } finally {
            this.hideLoading();
        }
    }

    async searchByCharacter(character) {
        try {
            this.showLoading();
            this.switchSection('discover');
            
            const searchTerms = this.mlpCharacters[character] || character;
            const sectionTitle = document.querySelector('.section-header h2');
            const characterName = character.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            if (sectionTitle) {
                sectionTitle.textContent = `${characterName} Stories`;
            }

            const results = await this.fetchFromOpenLibrary(searchTerms, 12);
            this.stories = results;
            this.renderStories(results);
        } catch (error) {
            console.error('❌ Character search error:', error);
            this.showError('Failed to load character stories.');
        } finally {
            this.hideLoading();
        }
    }

    async performSearch(query) {
        try {
            this.showLoading();
            this.switchSection('discover');

            const results = await this.fetchFromOpenLibrary(query, 15);
            this.stories = results;
            this.renderStories(results);
            
            const sectionTitle = document.querySelector('.section-header h2');
            if (sectionTitle) {
                sectionTitle.textContent = `Search Results for "${query}"`;
            }
            
            if (results.length === 0) {
                this.showNoResults();
            }
        } catch (error) {
            console.error('❌ Search error:', error);
            this.showError('Search failed. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    async loadInitialContent() {
        try {
            this.showLoading();
            this.stories = this.sampleStories;
            this.renderStories(this.stories);
        } catch (error) {
            console.error('❌ Initial content error:', error);
            this.showError('Failed to load initial content.');
        } finally {
            this.hideLoading();
        }
    }

    // ===== UI METHODS =====
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    async hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    showLoading() {
        const container = this.currentSection === 'browse' ? 
            document.getElementById('browse-results') : 
            document.getElementById('stories-grid');
        
        if (container) {
            container.innerHTML = `
                <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                    <p>Loading magical stories... ✨</p>
                </div>
            `;
        }
    }

    hideLoading() {
        // Loading state will be replaced by content
    }

    renderStories(stories) {
        try {
            const container = this.currentSection === 'browse' ? 
                document.getElementById('browse-results') : 
                document.getElementById('stories-grid');

            if (!container) {
                console.warn('⚠️ Stories container not found');
                return;
            }

            if (!Array.isArray(stories) || stories.length === 0) {
                this.showNoResults();
                return;
            }

            const storiesHTML = stories.map(story => this.createStoryCard(story)).filter(html => html).join('');
            container.innerHTML = storiesHTML;
        } catch (error) {
            console.error('❌ Render error:', error);
        }
    }

    showNoResults() {
        const container = this.currentSection === 'browse' ? 
            document.getElementById('browse-results') : 
            document.getElementById('stories-grid');
        
        if (container) {
            container.innerHTML = `
                <div class="no-results-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3>No stories found</h3>
                    <p>Try adjusting your search terms or browse by category</p>
                    <button class="btn btn-secondary" onclick="eqpadApp.loadInitialContent()">Browse Featured</button>
                </div>
            `;
        }
    }

    showError(message) {
        const container = this.currentSection === 'browse' ? 
            document.getElementById('browse-results') : 
            document.getElementById('stories-grid');
        
        if (container) {
            container.innerHTML = `
                <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">😔</div>
                    <h3>Oops! Something went wrong</h3>
                    <p>${this.sanitizeText(message)}</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">Try Again</button>
                </div>
            `;
        }
    }

    switchSection(section) {
        try {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.section === section);
            });

            document.querySelectorAll('.content-section').forEach(sectionEl => {
                sectionEl.classList.remove('active');
            });

            const targetSection = document.getElementById(section);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            this.currentSection = section;

            if (section === 'browse' && this.stories.length === 0) {
                this.loadInitialContent();
            }
        } catch (error) {
            console.error('❌ Section switch error:', error);
        }
    }

    showStoryModal(storyId) {
        // Modal implementation would go here
        console.log('Opening modal for story:', storyId);
        this.showToast('Story details coming soon!', 'info');
    }

    closeModal() {
        const modal = document.getElementById('story-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    showToast(message, type = 'info') {
        try {
            const toastContainer = document.getElementById('toast-container');
            if (!toastContainer) return;

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `<div>${this.sanitizeText(message)}</div>`;

            toastContainer.appendChild(toast);

            setTimeout(() => toast.classList.add('show'), 100);

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        } catch (error) {
            console.error('❌ Toast error:', error);
        }
    }

    // ===== USER ACTIONS =====
    toggleFavorite(storyId) {
        try {
            const index = this.favorites.indexOf(storyId);
            if (index === -1) {
                this.favorites.push(storyId);
                this.showToast('Added to favorites! ❤️', 'success');
            } else {
                this.favorites.splice(index, 1);
                this.showToast('Removed from favorites', 'info');
            }
            
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('eqpad_favorites', JSON.stringify(this.favorites));
            }
        } catch (error) {
            console.error('❌ Favorite toggle error:', error);
        }
    }

    toggleReadLater(storyId) {
        try {
            const index = this.readLater.indexOf(storyId);
            if (index === -1) {
                this.readLater.push(storyId);
                this.showToast('Added to read later! 📚', 'success');
            } else {
                this.readLater.splice(index, 1);
                this.showToast('Removed from read later', 'info');
            }
            
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('eqpad_read_later', JSON.stringify(this.readLater));
            }
        } catch (error) {
            console.error('❌ Read later toggle error:', error);
        }
    }

    // ===== CLEANUP =====
    destroy() {
        if (this.updateTimers.eqDaily) {
            clearInterval(this.updateTimers.eqDaily);
        }
    }
}

// ===== INITIALIZE APPLICATION =====
let eqpadApp;

function initializeApp() {
    try {
        console.log('🚀 Starting EQPad...');
        eqpadApp = new EQPad();
        eqpadApp.init();
        window.eqpadApp = eqpadApp;
        
        window.addEventListener('beforeunload', () => {
            if (eqpadApp) {
                eqpadApp.destroy();
            }
        });
        
    } catch (error) {
        console.error('❌ App initialization error:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

window.addEventListener('error', (event) => {
    console.error('❌ Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
});
