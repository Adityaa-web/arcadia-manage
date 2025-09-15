/**
 * UI Components and Utilities
 * Reusable components and helper functions for the application
 */

// Toast notification system
function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-fade-in`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <div class="flex-shrink-0">
                ${icon}
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <button class="flex-shrink-0 toast-close" onclick="closeToast(this)">
                <svg class="w-4 h-4 icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        if (toast.parentNode) {
            closeToast(toast.querySelector('.toast-close'));
        }
    }, duration);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 400px;
    `;
    document.body.appendChild(container);
    return container;
}

function getToastIcon(type) {
    const icons = {
        success: `<svg class="w-5 h-5 text-success icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>`,
        error: `<svg class="w-5 h-5 text-destructive icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>`,
        warning: `<svg class="w-5 h-5 text-warning icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>`,
        info: `<svg class="w-5 h-5 text-primary icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`
    };
    return icons[type] || icons.info;
}

function closeToast(closeButton) {
    const toast = closeButton.closest('.toast');
    if (toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// Modal system
function createModal(title, content, options = {}) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay animate-fade-in';
    modal.onclick = (e) => {
        if (e.target === modal && !options.preventClose) {
            closeModal(modal);
        }
    };
    
    modal.innerHTML = `
        <div class="modal-content academic-card animate-scale-in">
            <div class="card-header">
                <h3 class="card-title">${title}</h3>
                ${!options.hideClose ? `
                    <button class="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onclick="closeModal(this.closest('.modal-overlay'))">
                        <svg class="w-5 h-5 icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                ` : ''}
            </div>
            <div class="card-content">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

function closeModal(modal) {
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Confirmation dialog
function showConfirm(title, message, onConfirm, onCancel = null) {
    const content = `
        <p class="mb-6 text-muted-foreground">${message}</p>
        <div class="flex justify-end space-x-2">
            <button class="btn btn-outline" onclick="closeModal(this.closest('.modal-overlay')); ${onCancel ? onCancel : ''}()">
                Cancel
            </button>
            <button class="btn btn-primary" onclick="closeModal(this.closest('.modal-overlay')); (${onConfirm})()">
                Confirm
            </button>
        </div>
    `;
    
    createModal(title, content, { hideClose: true });
}

// Progress bar component
function createProgressBar(value, max = 100, className = '') {
    const percentage = Math.min((value / max) * 100, 100);
    return `
        <div class="progress ${className}">
            <div class="progress-bar" style="width: ${percentage}%"></div>
        </div>
    `;
}

// Badge component
function createBadge(text, variant = 'default') {
    return `<span class="badge badge-${variant}">${text}</span>`;
}

// Icon component
function createIcon(name, className = 'icon') {
    const icons = {
        user: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>`,
        graduation: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>`,
        book: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>`,
        chart: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v17m-6 0a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10z" />
        </svg>`,
        settings: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>`,
        logout: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>`,
        home: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>`,
        students: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>`,
        reports: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10V7a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2z" />
        </svg>`,
        plus: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>`,
        edit: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>`,
        delete: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>`,
        download: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>`,
        upload: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>`,
        search: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>`,
        filter: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>`,
        calendar: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>`,
        award: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>`,
        trending: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>`,
        clock: `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`
    };
    
    return icons[name] || icons.user;
}

// Table component
function createTable(data, columns, options = {}) {
    if (!data || data.length === 0) {
        return `<div class="text-center py-8 text-muted-foreground">No data available</div>`;
    }
    
    const tableClass = `table ${options.className || ''}`;
    
    const headerRow = columns.map(col => 
        `<th class="${col.sortable ? 'cursor-pointer hover:bg-muted/70' : ''}" 
         ${col.sortable ? `onclick="handleSort('${col.key}')"` : ''}>
            ${col.title}
            ${col.sortable ? '<span class="sort-indicator"></span>' : ''}
         </th>`
    ).join('');
    
    const bodyRows = data.map((row, index) => {
        const cells = columns.map(col => {
            let value = row[col.key];
            
            // Apply formatter if provided
            if (col.formatter) {
                value = col.formatter(value, row, index);
            }
            
            return `<td>${value}</td>`;
        }).join('');
        
        return `<tr class="table-row">${cells}</tr>`;
    }).join('');
    
    return `
        <div class="overflow-x-auto">
            <table class="${tableClass}">
                <thead>
                    <tr>${headerRow}</tr>
                </thead>
                <tbody>
                    ${bodyRows}
                </tbody>
            </table>
        </div>
    `;
}

// Pagination component
function createPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return '';
    
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pages.push(`
        <button class="btn btn-outline ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" 
                ${currentPage === 1 ? 'disabled' : `onclick="${onPageChange}(${currentPage - 1})"`}>
            Previous
        </button>
    `);
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        pages.push(`
            <button class="btn ${i === currentPage ? 'btn-primary' : 'btn-outline'}" 
                    onclick="${onPageChange}(${i})">
                ${i}
            </button>
        `);
    }
    
    // Next button
    pages.push(`
        <button class="btn btn-outline ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" 
                ${currentPage === totalPages ? 'disabled' : `onclick="${onPageChange}(${currentPage + 1})"`}>
            Next
        </button>
    `);
    
    return `
        <div class="flex items-center justify-center space-x-2 mt-6">
            ${pages.join('')}
        </div>
    `;
}

// Loading spinner
function showLoading(text = 'Loading...') {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.className = 'modal-overlay';
    loading.innerHTML = `
        <div class="text-center">
            <div class="loading-spinner mb-4"></div>
            <p class="text-muted-foreground">${text}</p>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

// File download utility
function downloadFile(content, filename, contentType = 'text/plain') {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// File upload utility
function createFileUpload(accept, onFile, multiple = false) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = 'none';
    
    input.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            onFile(multiple ? files : files[0]);
        }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

// Theme management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme toggle icon if it exists
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.innerHTML = newTheme === 'dark' ? 
            createIcon('sun', 'icon') : 
            createIcon('moon', 'icon');
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Format utilities
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatNumber(number, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    createToastContainer();
});

// Make functions globally available
window.showToast = showToast;
window.closeToast = closeToast;
window.createModal = createModal;
window.closeModal = closeModal;
window.showConfirm = showConfirm;
window.createProgressBar = createProgressBar;
window.createBadge = createBadge;
window.createIcon = createIcon;
window.createTable = createTable;
window.createPagination = createPagination;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.downloadFile = downloadFile;
window.createFileUpload = createFileUpload;
window.toggleTheme = toggleTheme;
window.formatDate = formatDate;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;