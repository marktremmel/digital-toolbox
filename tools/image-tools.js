/**
 * Image Compressor Tool
 * Compresses images using the Canvas API
 */

class ImageCompressor {
    constructor() {
        this.file = null;
        this.originalSize = 0;
        this.compressedBlob = null;
        this.quality = 0.8;
        this.maxWidth = 1920;
        this.maxHeight = 1080;
    }

    init() {
        // Register tool
        if (window.registerTool) {
            window.registerTool('image-compressor', () => this.render());
        }
    }

    render() {
        const container = document.createElement('div');
        container.className = 'tool-container image-compressor';

        container.innerHTML = `
            <div class="tool-header">
                <h2>📸 Image Compressor</h2>
                <p>Compress PNG and JPG images locally in your browser.</p>
            </div>

            <div class="compressor-workspace">
                <!-- Upload Area -->
                <div class="upload-area" id="drop-zone">
                    <input type="file" id="image-input" accept="image/png, image/jpeg" hidden>
                    <div class="upload-content">
                        <span class="upload-icon">📁</span>
                        <h3>Click or Drag Image Here</h3>
                        <p>Supports PNG, JPG (Max 10MB)</p>
                    </div>
                </div>

                <!-- Editor Area (Hidden initially) -->
                <div class="editor-area" id="editor-area" style="display: none;">
                    <div class="preview-container">
                        <div class="preview-box original">
                            <h4>Original</h4>
                            <img id="original-preview" alt="Original">
                            <div class="file-info" id="original-info">0 KB</div>
                        </div>
                        <div class="preview-box compressed">
                            <h4>Compressed</h4>
                            <img id="compressed-preview" alt="Compressed">
                            <div class="file-info" id="compressed-info">0 KB</div>
                            <div class="badge" id="savings-badge">-0%</div>
                        </div>
                    </div>

                    <div class="controls-container">
                        <div class="control-group">
                            <label>Quality: <span id="quality-value">80%</span></label>
                            <input type="range" id="quality-slider" min="1" max="100" value="80">
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn secondary" id="reset-btn">New Image</button>
                            <button class="btn primary" id="download-btn" disabled>Download Compressed</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners(container);
        return container;
    }

    attachEventListeners(container) {
        const dropZone = container.querySelector('#drop-zone');
        const fileInput = container.querySelector('#image-input');
        const qualitySlider = container.querySelector('#quality-slider');
        const qualityValue = container.querySelector('#quality-value');
        const downloadBtn = container.querySelector('#download-btn');
        const resetBtn = container.querySelector('#reset-btn');

        // File Upload Handling
        dropZone.addEventListener('click', () => fileInput.click());
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                this.handleFile(e.dataTransfer.files[0], container);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                this.handleFile(e.target.files[0], container);
            }
        });

        // Quality Slider
        qualitySlider.addEventListener('input', (e) => {
            this.quality = e.target.value / 100;
            qualityValue.textContent = `${e.target.value}%`;
            if (this.file) {
                this.compressImage(container);
            }
        });

        // Download
        downloadBtn.addEventListener('click', () => {
            if (this.compressedBlob) {
                const url = URL.createObjectURL(this.compressedBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `compressed_${this.file.name}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Haptic feedback
                if (window.haptics) window.haptics.success();
            }
        });

        // Reset
        resetBtn.addEventListener('click', () => {
            this.file = null;
            this.compressedBlob = null;
            container.querySelector('#editor-area').style.display = 'none';
            container.querySelector('#drop-zone').style.display = 'flex';
            fileInput.value = '';
        });
    }

    handleFile(file, container) {
        if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
            alert('Please upload a PNG or JPG image.');
            return;
        }

        this.file = file;
        this.originalSize = file.size;

        // Show editor, hide upload
        container.querySelector('#drop-zone').style.display = 'none';
        container.querySelector('#editor-area').style.display = 'block';

        // Display original info
        container.querySelector('#original-info').textContent = this.formatSize(this.originalSize);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            container.querySelector('#original-preview').src = e.target.result;
            this.compressImage(container);
        };
        reader.readAsDataURL(file);
    }

    compressImage(container) {
        const img = new Image();
        img.src = container.querySelector('#original-preview').src;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Resize if too large (optional, but good for performance)
            // Keeping original dimensions for now unless massive
            
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Compress
            canvas.toBlob((blob) => {
                this.compressedBlob = blob;
                
                // Update UI
                const compressedPreview = container.querySelector('#compressed-preview');
                compressedPreview.src = URL.createObjectURL(blob);
                
                const sizeInfo = container.querySelector('#compressed-info');
                sizeInfo.textContent = this.formatSize(blob.size);

                const savings = ((this.originalSize - blob.size) / this.originalSize * 100).toFixed(1);
                const badge = container.querySelector('#savings-badge');
                badge.textContent = `-${savings}%`;
                
                // Color code savings
                if (savings > 0) {
                    badge.style.background = '#10B981'; // Green
                } else {
                    badge.style.background = '#EF4444'; // Red (larger)
                }

                container.querySelector('#download-btn').disabled = false;

            }, this.file.type, this.quality);
        };
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize
const imageCompressor = new ImageCompressor();
imageCompressor.init();
