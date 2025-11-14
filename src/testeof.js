const fs = require('fs');

/**
 * Detecta el tipo de fin de línea (EOL) en un archivo de texto.
 * @param {string} filePath - Ruta absoluta o relativa del archivo.
 * @returns {Promise<string>} Tipo de EOL: 'LF', 'CRLF', 'CR', 'Mixto' o 'Desconocido'.
 */
async function detectarFinDeLineaUTF8(filePath) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');

        const tieneCRLF = /\r\n/.test(data);
        const tieneLF = /(?<!\r)\n/.test(data); // \n sin \r antes
        const tieneCR = /\r(?!\n)/.test(data);  // \r sin \n después

        if (tieneCRLF && !tieneLF && !tieneCR) return 'CRLF';  // Windows
        if (!tieneCRLF && tieneLF && !tieneCR) return 'LF';    // Unix / macOS moderno
        if (!tieneCRLF && !tieneLF && tieneCR) return 'CR';    // Mac antiguo
        if ((tieneCRLF && tieneLF) || (tieneCRLF && tieneCR) || (tieneLF && tieneCR))
            return 'Mixto';

        return 'Desconocido';
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return 'Error';
    }
}


/*
(async () => {
    let at02 = '/Users/arielherrera/WebstormProjects/unibank-validator-server/archive/data/236/20251031/AT02.csv';
    let other = '/Users/arielherrera/WebstormProjects/unibank-validator-server/archive/data/236/20251031/AT11.csv'

    const tipoEOL = await detectarFinDeLineaUTF8(other);
    console.log(`El archivo usa fin de línea: ${tipoEOL}`);
})();
*/


/**
 * Detecta el tipo de fin de línea (EOL) en un archivo de texto UTF-16LE con BOM.
 * @param {string} filePath - Ruta del archivo.
 * @returns {Promise<string>} Tipo de EOL: 'LF', 'CRLF', 'CR', 'Mixto' o 'Desconocido'.
 */
async function detectarFinDeLineaUTF16(filePath) {
    try {
        // Leemos el archivo como buffer (binario)
        const buffer = await fs.promises.readFile(filePath);

        // Verificamos si hay un BOM UTF-16 LE (0xFF 0xFE)
        let start = 0;
        if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
            start = 2; // Saltamos el BOM
        }

        // Decodificamos desde UTF-16LE manualmente
        const text = buffer.toString('utf16le', start);

        // Expresiones regulares para detectar finales de línea
        const tieneCRLF = /\r\n/.test(text);
        const tieneLF = /(?<!\r)\n/.test(text);
        const tieneCR = /\r(?!\n)/.test(text);
        const tieneN = /\n/.test(text);

        if (tieneCRLF && !tieneLF && !tieneCR) return 'CRLF';
        if (!tieneCRLF && tieneLF && !tieneCR) return 'LF';
        if (!tieneCRLF && !tieneLF && tieneCR) return 'CR';
        if (!tieneCRLF && !tieneLF && !tieneCR && tieneN) return 'N';
        if ((tieneCRLF && tieneLF) || (tieneCRLF && tieneCR) || (tieneLF && tieneCR))
            return 'Mixto';

        return 'Desconocido';
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return 'Error';
    }
}

// Ejemplo de uso
(async () => {
    let at02 = '/Users/arielherrera/WebstormProjects/unibank-validator-server/archive/data/236/20251031/AT02.csv';
    let ban01 = '/Users/arielherrera/WebstormProjects/unibank-validator-server/archive/data/236/20251031/AT11.csv'
    const tipoEOL = await detectarFinDeLineaUTF16(ban01);
    console.log(`El archivo usa fin de línea: ${tipoEOL}`);
})();
