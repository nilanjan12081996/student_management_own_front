/**
 * Utility to extract clean plain text from uploaded files (PDF, TXT, MD, CSV, DOC, etc.)
 * Runs entirely in the browser client using native Web APIs.
 */

export async function extractFileText(file) {
  if (!file) return '';

  const name = (file.name || '').toLowerCase();

  // 1. Plain text formats (.txt, .md, .csv, .json, .sql, source code)
  if (
    file.type.startsWith('text/') ||
    name.endsWith('.txt') ||
    name.endsWith('.md') ||
    name.endsWith('.csv') ||
    name.endsWith('.json') ||
    name.endsWith('.sql') ||
    name.endsWith('.py') ||
    name.endsWith('.java') ||
    name.endsWith('.js')
  ) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result || '').trim());
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  }

  // 2. PDF Files
  if (name.endsWith('.pdf') || file.type === 'application/pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binaryStr = '';
      const len = bytes.byteLength;
      const chunkSize = 16384;
      for (let i = 0; i < len; i += chunkSize) {
        binaryStr += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunkSize, len)));
      }

      let extracted = '';
      const tjRegex = /\(([\s\S]*?)\)\s*Tj/g;
      const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/g;

      // Extract uncompressed text
      let m;
      while ((m = tjRegex.exec(binaryStr)) !== null) {
        extracted += m[1] + ' ';
      }
      while ((m = tjArrayRegex.exec(binaryStr)) !== null) {
        const innerRegex = /\(([\s\S]*?)\)/g;
        let im;
        while ((im = innerRegex.exec(m[1])) !== null) {
          extracted += im[1] + ' ';
        }
      }

      // Extract compressed streams using native Web Stream DecompressionStream
      if (typeof window !== 'undefined' && typeof window.DecompressionStream !== 'undefined') {
        const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
        let streamMatch;
        let count = 0;
        while ((streamMatch = streamRegex.exec(binaryStr)) !== null && count < 25) {
          count++;
          const streamRaw = streamMatch[1];
          const streamBytes = new Uint8Array(streamRaw.length);
          for (let j = 0; j < streamRaw.length; j++) {
            streamBytes[j] = streamRaw.charCodeAt(j);
          }

          try {
            const ds = new DecompressionStream('deflate');
            const writer = ds.writable.getWriter();
            writer.write(streamBytes);
            writer.close();

            const reader = ds.readable.getReader();
            const chunks = [];
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              chunks.push(value);
            }

            let totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
            let decompBytes = new Uint8Array(totalLen);
            let offset = 0;
            for (const c of chunks) {
              decompBytes.set(c, offset);
              offset += c.length;
            }

            let decStr = '';
            for (let k = 0; k < decompBytes.length; k += chunkSize) {
              decStr += String.fromCharCode.apply(null, decompBytes.subarray(k, Math.min(k + chunkSize, decompBytes.length)));
            }

            while ((m = tjRegex.exec(decStr)) !== null) {
              extracted += m[1] + ' ';
            }
            while ((m = tjArrayRegex.exec(decStr)) !== null) {
              const innerRegex = /\(([\s\S]*?)\)/g;
              let im;
              while ((im = innerRegex.exec(m[1])) !== null) {
                extracted += im[1] + ' ';
              }
            }
          } catch (_) {
            // Stream was uncompressed or not standard deflate, skip gracefully
          }
        }
      }

      // Clean escape sequences and extra whitespace
      extracted = extracted
        .replace(/\\([()])/g, '$1')
        .replace(/\\[rn]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (extracted.length > 25) {
        return extracted;
      }
    } catch (err) {
      console.warn('PDF client text extraction note:', err);
    }
    return '';
  }

  return '';
}
