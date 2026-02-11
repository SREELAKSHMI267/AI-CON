'use server';

import mammoth from 'mammoth';
import pdf from 'pdf-parse';

/**
 * Extracts text from a file buffer on the server-side.
 * Supports PDF, DOCX, and plain text files.
 * @param buffer The file content as a Buffer.
 * @param mimeType The MIME type of the file.
 * @returns A promise that resolves with the extracted text.
 * @throws An error if text extraction fails.
 */
export async function extractTextFromBuffer({
  buffer,
  mimeType,
}: {
  buffer: Buffer;
  mimeType: string;
}): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdf(buffer);
      return data.text;
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else if (mimeType.startsWith('text/')) {
      return buffer.toString('utf-8');
    } else {
      throw new Error(`Unsupported file type for text extraction: ${mimeType}. Please upload a PDF, DOCX, or TXT file.`);
    }
  } catch (error) {
    console.error('Error extracting text from buffer on server:', error);
    // Re-throw a more informative error that can be displayed to the user.
    const originalErrorMessage = error instanceof Error ? error.message : 'Unknown error during text extraction.';
    throw new Error(`Failed to process the document. It may be corrupted or in an unexpected format. (Details: ${originalErrorMessage})`);
  }
}
