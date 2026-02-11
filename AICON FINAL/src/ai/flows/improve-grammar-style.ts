
'use server';

/**
 * @fileOverview A flow to improve the grammar and style of a research paper.
 *
 * - improveGrammarAndStyle - A function that handles the grammar and style improvement process.
 * - ImproveGrammarAndStyleInput - The input type for the improveGrammarAndStyle function.
 * - ImproveGrammarAndStyleOutput - The return type for the improveGrammarAndStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  prompt: `You are an expert academic editor with a sharp eye for detail. Review the following research paper text. Your task is to perform a comprehensive grammar and style check.

You must provide two things in your response:
1.  **A list of changes**: Identify every error, including spelling, punctuation, verb tense, sentence structure, and subject-verb agreement. For each error, provide the original snippet, your suggested correction, and a clear explanation for the change. Also include suggestions for improving readability, clarity, conciseness, and academic tone.
2.  **The improved paper text**: Provide the complete, fully revised text with all your corrections and suggestions incorporated.

Do not provide mock or placeholder text. Every suggestion must be relevant and directly derived from the input text.

Original Paper Text: {{{paperText}}}`,
});

const improveGrammarAndStyleFlow = ai.defineFlow(
  {
    name: 'improveGrammarAndStyleFlow',
    inputSchema: ImproveGrammarAndStyleInputSchema,
    outputSchema: ImproveGrammarAndStyleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
