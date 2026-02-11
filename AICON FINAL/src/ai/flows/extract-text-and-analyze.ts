'use server';
/**
 * @fileOverview A flow to extract text from a file and route it to a specified analysis AI.
 *
 * - extractTextAndAnalyze - A function that takes a file data URI, extracts text, and runs a specified analysis.
 */

import { ai } from '@/ai/genkit';
import {
  ExtractTextAndAnalyzeInputSchema,
  ExtractTextAndAnalyzeOutputSchema,
  type ExtractTextAndAnalyzeInput,
  type ExtractTextAndAnalyzeOutput,
} from './schemas';
import { extractTextFromBuffer } from '@/ai/lib/text-extractor';
import { checkPaperForPlagiarism } from './check-plagiarism';
import { improveGrammarAndStyle } from './improve-grammar-style';
import { aiPoweredReview } from './ai-powered-review';


const extractTextAndAnalyzeFlow = ai.defineFlow(
  {
    name: 'extractTextAndAnalyzeFlow',
    inputSchema: ExtractTextAndAnalyzeInputSchema,
    outputSchema: ExtractTextAndAnalyzeOutputSchema,
  },
  async ({ dataUri, analysisType }) => {
    try {
      if (!dataUri) {
        return { error: "File data URI is missing." };
      }
      
      const parts = dataUri.split(',');
      if (parts.length < 2 || !parts[0] || !parts[1]) {
          return { error: 'Invalid data URI format.' };
      }
      
      const meta = parts[0];
      const data = parts[1];

      const buffer = Buffer.from(data, 'base64');
      const mimeType = meta.split(';')[0].split(':')[1] || 'application/octet-stream';

      const paperText = await extractTextFromBuffer({ buffer, mimeType });


      if (!paperText) {
          return { error: 'Could not extract text from the provided file. The file might be empty, corrupted, or an unsupported format.' };
      }

      let analysisResult;

      switch (analysisType) {
        case 'plagiarism':
          analysisResult = await checkPaperForPlagiarism({ paperText });
          break;
        case 'grammar':
          analysisResult = await improveGrammarAndStyle({ paperText });
          break;
        case 'review':
          analysisResult = await aiPoweredReview({ paperText });
          break;
        default:
          return { error: `Unknown analysis type: ${analysisType}` };
      }

      return { analysisResult };

    } catch (error: any) {
        console.error(`[Flow] Error during ${analysisType} analysis:`, error);
        return { error: error.message || 'An unknown error occurred during analysis.' };
    }
  }
);

export async function extractTextAndAnalyze(input: ExtractTextAndAnalyzeInput): Promise<ExtractTextAndAnalyzeOutput> {
  return extractTextAndAnalyzeFlow(input);
}
