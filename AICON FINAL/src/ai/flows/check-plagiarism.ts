
'use server';

/**
 * @fileOverview Plagiarism detection flow for academic papers.
 *
 * - checkPaperForPlagiarism - A function that checks a paper for plagiarism.
 * - CheckPaperForPlagiarismInput - The input type for the checkPaperForPlagiarism function.
 * - CheckPaperForPlagiarismOutput - The return type for the checkPaperForPlagiarism function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckPaperForPlagiarismInputSchema = z.object({
  paperText: z.string().describe('The text content of the research paper to be checked for plagiarism.'),
});

export type CheckPaperForPlagiarismInput = z.infer<typeof CheckPaperForPlagiarismInputSchema>;

const CheckPaperForPlagiarismOutputSchema = z.object({
  similarityScore: z
    .number()
    .describe(
      'A score from 0 to 100 indicating the percentage of the paper that appears to be non-original. A higher score means more potential plagiarism.'
    ),
  flaggedSections: z
    .array(z.string())
    .describe(
      'An array of exact quotes from the paper that show significant similarity to existing sources. If no sections are flagged, return an empty array.'
    ),
  sources: z
    .array(z.string())
    .describe(
      'An array of URLs or academic citations for the sources that the flagged sections are similar to. If no sources are found, return an empty array.'
    ),
  summary: z
    .string()
    .describe(
      'A brief summary of the plagiarism analysis, explaining the similarity score and highlighting the main areas of concern.'
    ),
});

export type CheckPaperForPlagiarismOutput = z.infer<typeof CheckPaperForPlagiarismOutputSchema>;

export async function checkPaperForPlagiarism(input: CheckPaperForPlagiarismInput): Promise<CheckPaperForPlagiarismOutput> {
  return checkPaperForPlagiarismFlow(input);
}

const plagiarismCheckPrompt = ai.definePrompt({
  name: 'plagiarismCheckPrompt',
  input: {schema: CheckPaperForPlagiarismInputSchema},
  output: {schema: CheckPaperForPlagiarismOutputSchema},
  prompt: `You are an AI-powered plagiarism detection expert for an academic conference. Your task is to analyze a research paper for originality.

Analyze the following paper text. Compare it against a vast database of academic publications and web sources.

Paper Text: {{{paperText}}}

Your analysis must be thorough and you must provide the output in the exact requested schema.

1.  **Calculate a Similarity Score**: Provide a score from 0-100 representing the percentage of text that is likely copied. This should be a realistic and critical assessment.
2.  **Identify Flagged Sections**: List the specific sentences or paragraphs that are identical or highly similar to known sources. Return at least 3 examples if plagiarism is detected.
3.  **List Sources**: For each flagged section, provide the original source (URL or publication).
4.  **Write a Summary**: Briefly explain your findings, highlighting the most significant areas of content overlap.

Be critical and precise in your analysis. If no plagiarism is found, the similarity score should be low (e.g., under 5%), and flaggedSections and sources should be empty arrays.`,
});

const checkPaperForPlagiarismFlow = ai.defineFlow(
  {
    name: 'checkPaperForPlagiarismFlow',
    inputSchema: CheckPaperForPlagiarismInputSchema,
    outputSchema: CheckPaperForPlagiarismOutputSchema,
  },
  async input => {
    const {output} = await plagiarismCheckPrompt(input);
    return output!;
  }
);
