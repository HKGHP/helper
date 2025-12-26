// Reference Materials Module
const Reference = {
    searchTerm: '',

    render() {
        const glossary = Content.glossary;
        const categories = [...new Set(glossary.map(item => item.category))];

        return `
            <div class="reference-page">
                <div class="page-header">
                    <h1 class="gradient-text">Quick Reference</h1>
                      </div>

                <div class="search-box card glass-card">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Search terms..."
                        oninput="Reference.search(this.value)"
                        value="${this.searchTerm}"
                    >
                    ${this.searchTerm ? `
                        <button class="btn btn-icon btn-ghost" onclick="Reference.clearSearch()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    ` : ''}
                </div>

                <div class="reference-content">
                    ${this.renderGlossary(glossary, categories)}
                </div>
            </div>

            <style>
                .reference-page {
                    animation: fadeIn 0.3s ease-in;
                }

                .search-box {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                }

                .search-box svg {
                    color: var(--primary-light);
                    flex-shrink: 0;
                }

                .search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    font-size: 1rem;
                    outline: none;
                }

                .search-input::placeholder {
                    color: var(--text-tertiary);
                }

                .category-section {
                    margin-bottom: var(--spacing-xl);
                }

                .category-title {
                    color: var(--primary-light);
                    font-size: 1.5rem;
                    margin-bottom: var(--spacing-md);
                    padding-bottom: var(--spacing-sm);
                    border-bottom: 2px solid var(--primary);
                }

                .glossary-grid {
                    display: grid;
                    gap: var(--spacing-md);
                }

                .glossary-item {
                    padding: var(--spacing-md);
                    background: var(--bg-card);
                    border-left: 4px solid var(--primary);
                    border-radius: var(--radius-sm);
                    transition: all var(--transition-base);
                }

                .glossary-item:hover {
                    transform: translateX(4px);
                    background: var(--bg-tertiary);
                }

                .glossary-term {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--primary-light);
                    margin-bottom: var(--spacing-xs);
                }

                .glossary-definition {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }

                .glossary-category-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    background: var(--bg-glass);
                    border-radius: 999px;
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                    margin-top: var(--spacing-xs);
                }

                .search-highlight {
                    background: var(--primary);
                    color: white;
                    padding: 0 0.25rem;
                    border-radius: 2px;
                }

                .no-results {
                    text-align: center;
                    padding: var(--spacing-xl);
                    color: var(--text-tertiary);
                }

                .no-results-icon {
                    font-size: 3rem;
                    margin-bottom: var(--spacing-md);
                }

                @media (max-width: 768px) {
                    .category-title {
                        font-size: 1.25rem;
                    }

                    .glossary-term {
                        font-size: 1.125rem;
                    }
                }
            </style>
        `;
    },

    renderGlossary(glossary, categories) {
        let filteredGlossary = glossary;

        // Filter by search term
        if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            filteredGlossary = glossary.filter(item =>
                item.term.toLowerCase().includes(searchLower) ||
                item.definition.toLowerCase().includes(searchLower)
            );

            if (filteredGlossary.length === 0) {
                return `
                    <div class="no-results">
                        <div class="no-results-icon">🔍</div>
                        <h3>No results found</h3>
                        <p>Try a different search term</p>
                    </div>
                `;
            }

            // Show all results without categories when searching
            return `
                <div class="glossary-grid">
                    ${filteredGlossary.map(item => this.renderGlossaryItem(item)).join('')}
                </div>
            `;
        }

        // Show by categories when not searching
        return categories.map(category => {
            const items = glossary.filter(item => item.category === category);
            return `
                <div class="category-section">
                    <h2 class="category-title">${category}</h2>
                    <div class="glossary-grid">
                        ${items.map(item => this.renderGlossaryItem(item)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    },

    renderGlossaryItem(item) {
        let term = item.term;
        let definition = item.definition;

        // Highlight search term
        if (this.searchTerm) {
            const regex = new RegExp(`(${this.searchTerm})`, 'gi');
            term = term.replace(regex, '<span class="search-highlight">$1</span>');
            definition = definition.replace(regex, '<span class="search-highlight">$1</span>');
        }

        return `
            <div class="glossary-item fade-in">
                <div class="glossary-term">${term}</div>
                <div class="glossary-definition">${definition}</div>
                <span class="glossary-category-badge">${item.category}</span>
            </div>
        `;
    },

    search(term) {
        this.searchTerm = term;
        App.navigate('reference');
    },

    clearSearch() {
        this.searchTerm = '';
        App.navigate('reference');
    }
};



