// Study Materials Module
const StudyMaterials = {
    currentMaterial: null,

    render() {
        const materials = Content.studyMaterials;
        const categories = [...new Set(materials.map(m => m.category))];

        return `
            <div class="study-materials-page">
                <div class="page-header">
                    <h1 class="gradient-text">Study Materials</h1>
                    <p class="text-secondary">Comprehensive guides with personal notes</p>
                </div>

                <div class="materials-grid">
                    ${materials.map(material => this.renderMaterialCard(material)).join('')}
                </div>
            </div>

            <style>
                .study-materials-page {
                    animation: fadeIn 0.3s ease-in;
                }

                .page-header {
                    margin-bottom: var(--spacing-lg);
                }

                .page-header h1 {
                    margin-bottom: var(--spacing-xs);
                }

                .materials-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: var(--spacing-md);
                }

                .material-card {
                    cursor: pointer;
                }

                .material-category {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    background: var(--gradient-primary);
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-bottom: var(--spacing-sm);
                }

                .material-card h3 {
                    margin-bottom: var(--spacing-xs);
                }

                .material-preview {
                    color: var(--text-tertiary);
                    font-size: 0.875rem;
                    line-height: 1.6;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            </style>
        `;
    },

    renderMaterialCard(material) {
        const preview = material.content.substring(0, 150).replace(/[#*]/g, '').trim();
        return `
            <div class="card material-card card-gradient" onclick="StudyMaterials.viewMaterial('${material.id}')">
                <span class="material-category">${material.category}</span>
                <h3>${material.title}</h3>
                <p class="material-preview">${preview}...</p>
            </div>
        `;
    },

    viewMaterial(id) {
        this.currentMaterial = Content.studyMaterials.find(m => m.id === id);
        if (this.currentMaterial) {
            this.renderMaterialView();
        }
    },

    renderMaterialView() {
        const material = this.currentMaterial;
        const userNotes = Storage.getUserNotes();
        const note = userNotes[material.id]?.content || '';

        const content = `
            <div class="material-view fade-in">
                <div class="material-header">
                    <button class="btn btn-ghost" onclick="StudyMaterials.backToList()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Materials
                    </button>
                    <span class="badge badge-primary">${material.category}</span>
                </div>

                <h1 class="gradient-text">${material.title}</h1>

                <div class="material-content card">
                    ${this.parseMarkdown(material.content)}
                </div>

                <div class="notes-section">
                    <h2>Your Personal Notes</h2>
                    <textarea 
                        class="textarea notes-textarea" 
                        placeholder="Add your personal notes here..."
                        onchange="StudyMaterials.saveNote('${material.id}', this.value)"
                    >${note}</textarea>
                    <p class="text-tertiary" style="font-size: 0.875rem; margin-top: 0.5rem;">
                        Notes are automatically saved and synced offline
                    </p>
                </div>
            </div>

            <style>
                .material-view {
                    max-width: 800px;
                }

                .material-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                }

                .material-content {
                    padding: var(--spacing-lg);
                    margin-bottom: var(--spacing-lg);
                    line-height: 1.8;
                }

                .material-content h1 {
                    color: var(--primary-light);
                    margin-top: var(--spacing-lg);
                    margin-bottom: var(--spacing-md);
                }

                .material-content h2 {
                    color: var(--primary-light);
                    margin-top: var(--spacing-md);
                    margin-bottom: var(--spacing-sm);
                }

                .material-content h3 {
                    color: var(--text-primary);
                    margin-top: var(--spacing-sm);
                    margin-bottom: var(--spacing-xs);
                }

                .material-content p {
                    margin-bottom: var(--spacing-sm);
                }

                .material-content ul, .material-content ol {
                    margin-left: var(--spacing-md);
                    margin-bottom: var(--spacing-sm);
                }

                .material-content li {
                    margin-bottom: var(--spacing-xs);
                }

                .material-content strong {
                    color: var(--primary-light);
                    font-weight: 600;
                }

                .notes-section {
                    margin-top: var(--spacing-xl);
                }

                .notes-section h2 {
                    margin-bottom: var(--spacing-md);
                }

                .notes-textarea {
                    min-height: 200px;
                    font-family: var(--font-primary);
                }
            </style>
        `;

        document.getElementById('main-content').innerHTML = content;

        // Log study session
        Storage.logStudySession(5, 'study-materials');
    },

    parseMarkdown(text) {
        // Simple markdown parser
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(?!<[hul])(.*$)/gim, '<p>$1</p>')
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<[hul])/g, '$1')
            .replace(/(<\/[hul][^>]*>)<\/p>/g, '$1');
    },

    saveNote(materialId, note) {
        Storage.saveUserNote(materialId, note);
    },

    backToList() {
        this.currentMaterial = null;
        App.navigate('home');
    }
};
