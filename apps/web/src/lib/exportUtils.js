/**
 * Export and Print Utility Functions
 * Provides functionality for exporting data to Excel/CSV and printing
 */

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columns - Column definitions [{key: 'fieldName', label: 'Column Header'}]
 */
export function exportToCSV(data, filename, columns) {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Build CSV content
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(item =>
        columns.map(col => {
            let value = item[col.key];
            // Handle nested keys like 'category.name'
            if (col.key.includes('.')) {
                const keys = col.key.split('.');
                value = keys.reduce((obj, key) => obj?.[key], item);
            }
            // Format value for CSV
            if (value === null || value === undefined) value = '';
            if (typeof value === 'string' && value.includes(',')) {
                value = `"${value}"`;
            }
            if (col.format) {
                value = col.format(value);
            }
            return value;
        }).join(',')
    ).join('\n');

    const csvContent = `${headers}\n${rows}`;
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

/**
 * Export data to Excel-compatible format (CSV with BOM for Excel)
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columns - Column definitions [{key: 'fieldName', label: 'Column Header'}]
 */
export function exportToExcel(data, filename, columns) {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Build CSV content with BOM for Excel
    const headers = columns.map(col => col.label).join('\t');
    const rows = data.map(item =>
        columns.map(col => {
            let value = item[col.key];
            // Handle nested keys like 'category.name'
            if (col.key.includes('.')) {
                const keys = col.key.split('.');
                value = keys.reduce((obj, key) => obj?.[key], item);
            }
            // Format value
            if (value === null || value === undefined) value = '';
            if (col.format) {
                value = col.format(value, item);
            }
            return value;
        }).join('\t')
    ).join('\n');

    const excelContent = `\uFEFF${headers}\n${rows}`;
    downloadFile(excelContent, `${filename}.xls`, 'application/vnd.ms-excel');
}

/**
 * Download a file
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Print content with a styled template
 * @param {string} title - Title of the print document
 * @param {string} content - HTML content to print
 * @param {object} options - Additional options like storeName, date
 */
export function printContent(title, content, options = {}) {
    const { storeName = 'Store', date = new Date().toLocaleDateString() } = options;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups to print');
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #333; }
                .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #333; }
                .header h1 { font-size: 24px; margin-bottom: 5px; }
                .header p { color: #666; font-size: 14px; }
                .content { margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background: #f5f5f5; font-weight: 600; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
                @media print {
                    body { padding: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${storeName}</h1>
                <p>${title} - ${date}</p>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() { window.close(); }
                }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

/**
 * Print a table of data
 * @param {string} title - Title of the print document
 * @param {Array} data - Array of objects to print
 * @param {Array} columns - Column definitions [{key: 'fieldName', label: 'Column Header'}]
 * @param {object} options - Additional options
 */
export function printTable(title, data, columns, options = {}) {
    if (!data || data.length === 0) {
        alert('No data to print');
        return;
    }

    const tableRows = data.map(item => {
        const cells = columns.map(col => {
            let value = item[col.key];
            if (col.key.includes('.')) {
                const keys = col.key.split('.');
                value = keys.reduce((obj, key) => obj?.[key], item);
            }
            if (col.format) {
                value = col.format(value, item);
            }
            return `<td>${value ?? ''}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    }).join('');

    const tableHeaders = columns.map(col => `<th>${col.label}</th>`).join('');
    const tableContent = `
        <table>
            <thead><tr>${tableHeaders}</tr></thead>
            <tbody>${tableRows}</tbody>
        </table>
    `;

    printContent(title, tableContent, options);
}

/**
 * Format currency for export/print
 */
export function formatCurrency(value, currency = 'IDR') {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
    }).format(value);
}

/**
 * Format date for export/print
 */
export function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format datetime for export/print
 */
export function formatDateTime(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
