
'use server';

/**
 * @fileOverview A flow to improve the grammar and style of a research paper.
 *
 * - improveGrammarAndStyle - A function that handles the grammar and style improvement process.
 * - ImproveGrammarAndStyleInput - The input type for the improveGrammarAndStyle function.
 * - ImproveGrammarAndStyleOutput - The return type for the improveGrammarAndStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ImproveGrammarAndStyleInputSchema = z.object({
  paperText: z
    .string()
    .describe('The text content of the research paper to be improved.'),
});

export type ImproveGrammarAndStyleInput = z.infer<
  typeof ImproveGrammarAndStyleInputSchema
>;

const ImproveGrammarAndStyleOutputSchema = z.object({
  improvedPaperText: z
    .string()
    .describe('The fully revised text incorporating all corrections and style suggestions.'),
  changes: z.array(z.object({
    original: z.string().describe("The original text snippet that was corrected or improved."),
    suggestion: z.string().describe("The suggested replacement for the original snippet."),
    explanation: z.string().describe("A brief explanation for the change (e.g., 'Corrected verb tense', 'Improved conciseness', 'Fixed punctuation').")
  })).describe("A detailed list of specific corrections and style improvements made to the text.")
});

export type ImproveGrammarAndStyleOutput = z.infer<
  typeof ImproveGrammarAndStyleOutputSchema
>;

export async function improveGrammarAndStyle(
  input: ImproveGrammarAndStyleInput
): Promise<ImproveGrammarAndStyleOutput> {
  return improveGrammarAndStyleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveGrammarAndStylePrompt',
  input: {schema: ImproveGrammarAndStyleInputSchema},
  output: {schema: ImproveGrammarAndStyleOutputSchema},
  prompt: `You are an expert academic editor. Review this research paper for grammar and style issues.

Identify and fix:
- Spelling, punctuation, grammar errors
- Verb tense issues, subject-verb agreement
- Clarity, conciseness, and academic tone improvements

Provide your response with:
1. A JSON array of changes with fields: original (the text snippet), suggestion (the correction), explanation (why)
2. improvedPaperText: The complete corrected text

Focus on the most impactful improvements. Be concise in explanations.

Paper Text: {{{paperText}}}`,
});

const improveGrammarAndStyleFlow = ai.defineFlow(
  {
    name: 'improveGrammarAndStyleFlow',
    inputSchema: ImproveGrammarAndStyleInputSchema,
    outputSchema: ImproveGrammarAndStyleOutputSchema,
  },
  async (input: ImproveGrammarAndStyleInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
