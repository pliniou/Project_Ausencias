/**
 * Util functions for exporting data in different formats
 */
import { type Leave } from "./types";

/**
 * Exporta afastamentos para formato TXT
 * @param {Array} leaves - Array de afastamentos
 * @returns {string} Conteúdo em formato TXT
 */
export function exportToTXT(leaves: Leave[]) {
    let content = '========================================\n';
    content += '      RELATÓRIO DE AFASTAMENTOS        \n';
    content += '========================================\n\n';
    content += `Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}\n`;
    content += `Total de registros: ${leaves.length}\n\n`;
    content += '========================================\n\n';

    leaves.forEach((leave, index) => {
        content += `[${index + 1}] ${leave.employeeName}\n`;
        content += `-`.repeat(40) + '\n';
        content += `Cargo: ${leave.employeeRole}\n`;
        content += `Tipo: ${leave.type}\n`;
        content += `Período: ${new Date(leave.startDate).toLocaleDateString('pt-BR')} até ${new Date(leave.endDate).toLocaleDateString('pt-BR')}\n`;
        content += `Dias: ${leave.daysOff} dias corridos (${leave.workDaysOff || 'N/A'} úteis)\n`;
        content += `Status: ${leave.status}\n`;
        if (leave.observations) {
            content += `Observações: ${leave.observations}\n`;
        }
        content += '\n';
    });

    content += '========================================\n';
    content += 'Fim do Relatório\n';
    content += '========================================\n';

    return content;
}

/**
 * Exporta afastamentos para formato CSV
 * @param {Array} leaves - Array de afastamentos
 * @returns {string} Conteúdo em formato CSV
 */
export function exportToCSV(leaves: Leave[]) {
    // Headers
    const headers = [
        'Colaborador',
        'Cargo',
        'Tipo',
        'Data Início',
        'Data Fim',
        'Dias Corridos',
        'Dias Úteis',
        'Status',
        'Observações'
    ];

    // Início do CSV
    let csvContent = headers.join(',') + '\n';

    // Linhas de dados
    leaves.forEach(leave => {
        const row = [
            escapeCSV(leave.employeeName),
            escapeCSV(leave.employeeRole),
            escapeCSV(leave.type),
            formatDate(leave.startDate),
            formatDate(leave.endDate),
            leave.daysOff,
            leave.workDaysOff || 'N/A',
            escapeCSV(leave.status),
            escapeCSV(leave.observations || '')
        ];

        csvContent += row.join(',') + '\n';
    });

    return csvContent;
}

/**
 * Escapa strings para CSV (adiciona aspas se necessário)
 * @param {string} value - Valor a escapar
 * @returns {string} Valor escapado
 */
function escapeCSV(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';

    const stringValue = String(value);

    // Se contém vírgula, aspas ou quebra de linha, envolver com aspas
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        // Duplicar aspas internas
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
}

/**
 * Formata data para formato brasileiro
 * @param {string} dateString - Data em formato ISO
 * @returns {string} Data formatada
 */
function formatDate(dateString: string) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
}

/**
 * Faz download de um arquivo
 * @param {string} content - Conteúdo do arquivo
 * @param {string} filename - Nome do arquivo
 * @param {string} mimeType - Tipo MIME do arquivo
 */
export function downloadFile(content: string, filename: string, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}
