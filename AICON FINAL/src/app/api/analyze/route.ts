
import { NextResponse } from 'next/server';
import { extractTextAndAnalyze } from '@/ai/flows/extract-text-and-analyze';
import { ExtractTextAndAnalyzeInputSchema } from '@/ai/flows/schemas';

export async function POST(req: Request) {
  console.log('[API] Received POST request to /api/analyze.');
  try {
    const body = await req.json();

    // 1. Validate the incoming request body.
    const validationResult = ExtractTextAndAnalyzeInputSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('[API] Validation failed:', validationResult.error.flatten());
      return NextResponse.json({ error: "Invalid request body.", details: validationResult.error.flatten() }, { status: 400 });
    }
    
    const { analysisType, paperId } = validationResult.data;
    console.log(`[API] Validation successful for paper ${paperId}, analysis type: ${analysisType}`);

    // 2. Perform the analysis by calling the Genkit flow.
    // This is currently mocked and will return instantly.
    const result = await extractTextAndAnalyze(validationResult.data);

    // 3. Handle analysis errors.
    if (result.error) {
      console.error(`[API] Analysis failed for ${paperId}:`, result.error);
      return NextResponse.json({ error: `Analysis failed: ${result.error}` }, { status: 500 });
    }
    
    // 4. Return the successful analysis result directly to the client.
    console.log(`[API] Analysis successful for ${paperId}.`);
    return NextResponse.json(result.analysisResult, { status: 200 });

  } catch (error: any) {
    // This catches errors from req.json() or other unexpected issues.
    console.error('[API] Unhandled error in /api/analyze:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred on the server.' }, { status: 500 });
  }
}
