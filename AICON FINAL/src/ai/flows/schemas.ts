
import { z } from 'genkit';

export const AnalysisTypeSchema = z.enum(['plagiarism', 'grammar', 'review']);
export type AnalysisType = z.infer<typeof AnalysisTypeSchema>;

export const ExtractTextAndAnalyzeInputSchema = z.object({
  dataUri: z.string().optional().describe("The file to be analyzed, encoded as a data URI."),
  analysisType: AnalysisTypeSchema.describe("The type of analysis to perform."),
  paperId: z.string().optional().describe("The ID of the paper document in Firestore."),
});
export type ExtractTextAndAnalyzeInput = z.infer<typeof ExtractTextAndAnalyzeInputSchema>;

export const ExtractTextAndAnalyzeOutputSchema = z.object({
  analysisResult: z.any().optional().describe("The result of the analysis."),
  error: z.string().optional().describe("An error message if the process fails."),
});
export type ExtractTextAndAnalyzeOutput = z.infer<typeof ExtractTextAndAnalyzeOutputSchema>;
