// src/ai/flows/suggest-reviewers.ts
'use server';
/**
 * @fileOverview An AI agent for suggesting reviewers for a submission.
 *
 * - suggestReviewers - A function that suggests reviewers for a submission.
 * - SuggestReviewersInput - The input type for the suggestReviewers function.
 * - SuggestReviewersOutput - The return type for the suggestReviewers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestReviewersInputSchema = z.object({
  paperAbstract: z
    .string()
    .describe('The abstract of the research paper.'),
  paperKeywords: z.string().describe('Keywords associated with the research paper.'),
  conferenceName: z.string().describe('The name of the conference.'),
});
export type SuggestReviewersInput = z.infer<typeof SuggestReviewersInputSchema>;

const SuggestReviewersOutputSchema = z.object({
  suggestedReviewers: z
    .array(z.string())
    .describe('A list of suggested reviewers for the submission.'),
});
export type SuggestReviewersOutput = z.infer<typeof SuggestReviewersOutputSchema>;

export async function suggestReviewers(input: SuggestReviewersInput): Promise<SuggestReviewersOutput> {
  return suggestReviewersFlow(input);
}

const suggestReviewersPrompt = ai.definePrompt({
  name: 'suggestReviewersPrompt',
  input: {schema: SuggestReviewersInputSchema},
  output: {schema: SuggestReviewersOutputSchema},
  prompt: `You are an expert in suggesting reviewers for academic papers.
  Given the following information about a paper, suggest a list of reviewers who would be qualified to review the paper for the {{conferenceName}} conference.
  Make sure to provide reviewers with different expertise.

  Paper Abstract: {{{paperAbstract}}}
  Paper Keywords: {{{paperKeywords}}}

  Suggested Reviewers:`,
});

const suggestReviewersFlow = ai.defineFlow(
  {
    name: 'suggestReviewersFlow',
    inputSchema: SuggestReviewersInputSchema,
    outputSchema: SuggestReviewersOutputSchema,
  },
  async (input: SuggestReviewersInput) => {
    const {output} = await suggestReviewersPrompt(input);
    return output!;
  }
);
