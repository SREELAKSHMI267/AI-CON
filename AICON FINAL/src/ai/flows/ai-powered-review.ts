
'use server';

/**
 * @fileOverview An AI-powered review flow for conference submissions.
 *
 * - aiPoweredReview - A function that performs an AI-powered review of a submission.
 * - AiPoweredReviewInput - The input type for the aiPoweredReview function.
 * - AiPoweredReviewOutput - The return type for the aiPoweredReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AiPoweredReviewInputSchema = z.object({
  paperText: z.string().describe('The text of the research paper submission.'),
});
export type AiPoweredReviewInput = z.infer<typeof AiPoweredReviewInputSchema>;

const AiPoweredReviewOutputSchema = z.object({
  summary: z.string().describe("A high-level summary of the paper's strengths, weaknesses, and core contributions."),
  feedback: z.array(z.string()).describe("A list of specific, actionable feedback points for the author, covering methodology, contribution, and clarity."),
});
export type AiPoweredReviewOutput = z.infer<typeof AiPoweredReviewOutputSchema>;

export async function aiPoweredReview(input: AiPoweredReviewInput): Promise<AiPoweredReviewOutput> {
  return aiPoweredReviewFlow(input);
}

const aiPoweredReviewPrompt = ai.definePrompt({
  name: 'aiPoweredReviewPrompt',
  input: {schema: AiPoweredReviewInputSchema},
  output: {schema: AiPoweredReviewOutputSchema},
  prompt: `You are an expert academic reviewer. Read the following paper carefully and provide: (1) an overall summary of the paper’s quality, clarity, originality, and structure; (2) a numbered list of actionable feedback points that the author can implement to improve the paper, including suggestions for clarity, organization, argument strength, literature review, methodology, and figures. Do not give placeholder text. Ensure all feedback is specific, constructive, and relevant to the actual content of the paper.

Paper Text: {{{paperText}}}

Return the output as a JSON object with fields ‘summary’ and ‘feedback’.`,
});

const aiPoweredReviewFlow = ai.defineFlow(
  {
    name: 'aiPoweredReviewFlow',
    inputSchema: AiPoweredReviewInputSchema,
    outputSchema: AiPoweredReviewOutputSchema,
  },
  async (input: AiPoweredReviewInput) => {
    const {output} = await aiPoweredReviewPrompt(input);
    return output!;
  }
);
