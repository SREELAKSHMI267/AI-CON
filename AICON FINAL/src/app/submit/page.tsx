'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Search, SpellCheck2, Bot, FileText, Loader2, AlertCircle, Upload, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AnalysisResult from '@/components/analysis-result';
import type { ImproveGrammarAndStyleOutput } from '@/ai/flows/improve-grammar-style';
import type { CheckPaperForPlagiarismOutput } from '@/ai/flows/check-plagiarism';
import type { AiPoweredReviewOutput } from '@/ai/flows/ai-powered-review';
import { useFirebase } from '@/firebase';
import { usePaper, updatePaper, type Paper } from '@/firebase/papers';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

type AnalysisFlow = 'plagiarism' | 'grammar' | 'review';
type AnalysisResultData = ImproveGrammarAndStyleOutput | CheckPaperForPlagiarismOutput | AiPoweredReviewOutput;

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function InvalidSessionMessage({ message, actionLink, actionText }: { message: string; actionLink: string, actionText: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <div className="mx-auto grid max-w-4xl gap-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                Invalid Session
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <p className="text-lg text-muted-foreground mb-6">{message}</p>
              <Button asChild>
                <Link href={actionLink}>
                  <Upload className="mr-2 h-4 w-4" />
                  {actionText}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function SubmitPageContent() {
  const { firestore } = useFirebase();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const paperId = searchParams.get('paperId');
  const { paper, loading: paperLoading } = usePaper(paperId);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewingAnalysis, setViewingAnalysis] = useState<AnalysisFlow | null>(null);
  const [runningAnalysis, setRunningAnalysis] = useState<AnalysisFlow | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChangeForAnalysis = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(null);
      toast({ title: "File Selected", description: `${file.name} is ready for analysis.` });
    }
  };
  
 const handleAnalysis = async (analysisType: AnalysisFlow) => {
    if (!selectedFile) {
        toast({ title: "No File Selected", description: "Please select the paper file again to run analysis.", variant: "destructive" });
        return;
    }
    if (!paperId || !firestore) {
        toast({ title: "Session or Database is invalid", description: "Could not find the paper record or connect to the database.", variant: "destructive" });
        return;
    }
    
    setErrorMessage(null);
    setViewingAnalysis(analysisType);
    setRunningAnalysis(analysisType);
    updatePaper(firestore, paperId, { status: 'Analyzing' });

    try {
        toast({ title: "Preparing file for analysis...", description: "This may take a moment for large documents." });
        const dataUri = await fileToDataUri(selectedFile);

        toast({ title: `Running ${analysisType} analysis...`, description: "Communicating with AI. This may take some time." });
        
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUri, analysisType, paperId }),
        });

        if (!response.ok) {
          let errorMsg = "An unexpected error occurred on the server.";
          try {
            const errorBody = await response.json();
            errorMsg = errorBody.error || errorMsg;
          } catch {
             errorMsg = `Server responded with status ${response.status}. The response was not in the expected JSON format.`
          }
          throw new Error(errorMsg);
        }

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        const statusMap: Record<AnalysisFlow, Paper['status']> = {
            plagiarism: 'Plagiarism Checked',
            grammar: 'Grammar Checked',
            review: 'AI Reviewed'
        };

        const updatePayload: Partial<Paper> = {
            status: statusMap[analysisType],
            [`${analysisType}Result`]: result,
        };
        
        await updatePaper(firestore, paperId, updatePayload);

        toast({
            title: "Analysis Complete",
            description: `The ${analysisType} analysis has finished. Results are now available.`
        });

    } catch (e: any) {
        console.error("Analysis process failed:", e);
        const errorMsg = e.message || "An unexpected error occurred during the analysis.";
        setErrorMessage(errorMsg);
        if (paperId && firestore) {
            updatePaper(firestore, paperId, { status: 'Failed' });
        }
    } finally {
        setRunningAnalysis(null);
    }
  };

  const getResultForDisplay = (analysisType: AnalysisFlow | null): AnalysisResultData | null => {
      if (!analysisType || !paper) return null;
      switch (analysisType) {
          case 'plagiarism': return paper.plagiarismResult || null;
          case 'grammar': return paper.grammarResult || null;
          case 'review': return paper.reviewResult || null;
          default: return null;
      }
  }

  const areActionsDisabled = runningAnalysis !== null || !selectedFile;
  const analysisResult = getResultForDisplay(viewingAnalysis);
  
  if (paperLoading) {
    return (
        <div className="flex min-h-screen flex-col bg-muted/40">
          <Header />
          <main className="flex-1 p-4 sm:px-6 sm:py-0">
            <div className="mx-auto grid max-w-4xl gap-8 py-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="mr-4 h-8 w-8 animate-spin text-primary" />
                    <p className="text-lg text-muted-foreground">Loading paper details...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      );
  }

  if (!paperId) {
    return (
      <InvalidSessionMessage
        message="No paper was specified for this session."
        actionLink="/upload"
        actionText="Upload a New Paper"
      />
    );
  }
    
  if (!paper) {
    return (
      <InvalidSessionMessage
        message="The specified paper could not be found. It may have been deleted."
        actionLink="/dashboard"
        actionText="Return to Dashboard"
      />
    );
  }

  const getStatusVariant = () => {
    if (!paper.status) return 'default';
    if (paper.status === 'Failed') return 'destructive';
    if (paper.status === 'Analyzing') return 'secondary';
    if (paper.status.includes('Checked') || paper.status.includes('Reviewed')) return 'default';
    return 'outline';
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <div className="mx-auto grid max-w-4xl gap-8 py-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    Analysis for "{paper.title}"
                  </CardTitle>
                  <CardDescription>
                    To run a new analysis, please re-select your paper file. The AI will then provide feedback.
                  </CardDescription>
                </div>
                 <Badge variant={getStatusVariant()}>
                    {paper.status.includes('Checked') || paper.status.includes('Reviewed') ? <CheckCircle className="mr-2 h-4 w-4" /> : null}
                    {paper.status === 'Analyzing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Status: {paper.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div>
                  <label htmlFor="file-reselect" className="text-sm font-medium">Select paper file</label>
                  <Input id="file-reselect" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChangeForAnalysis} className="mt-1" />
               </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <Button onClick={() => handleAnalysis('plagiarism')} disabled={areActionsDisabled}>
                  {runningAnalysis === 'plagiarism' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Check Plagiarism
                </Button>
                <Button onClick={() => handleAnalysis('grammar')} disabled={areActionsDisabled}>
                  {runningAnalysis === 'grammar' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SpellCheck2 className="mr-2 h-4 w-4" />}
                  Check Grammar & Style
                </Button>
                <Button onClick={() => handleAnalysis('review')} disabled={areActionsDisabled}>
                  {runningAnalysis === 'review' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                  AI-Powered Review
                </Button>
              </div>
            </CardContent>
          </Card>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {viewingAnalysis && analysisResult ? (
            <AnalysisResult result={analysisResult} type={viewingAnalysis} />
          ) : (
             <Card>
                <CardHeader>
                  <CardTitle>View Analysis Results</CardTitle>
                  <CardDescription>Select a previous analysis to view its results, or run a new one above.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Button variant="outline" onClick={() => setViewingAnalysis('plagiarism')} disabled={!paper.plagiarismResult}>View Plagiarism Results</Button>
                      <Button variant="outline" onClick={() => setViewingAnalysis('grammar')} disabled={!paper.grammarResult}>View Grammar Results</Button>
                      <Button variant="outline" onClick={() => setViewingAnalysis('review')} disabled={!paper.reviewResult}>View AI Review</Button>
                  </div>
                </CardContent>
              </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={
        <div className="flex min-h-screen flex-col bg-muted/40">
            <Header />
            <main className="flex-1 p-4 sm:px-6 sm:py-0">
            <div className="mx-auto grid max-w-4xl gap-8 py-8">
                <Card>
                <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="mr-4 h-8 w-8 animate-spin text-primary"/>
                        <p className="text-lg text-muted-foreground">Loading Page...</p>
                    </div>
                </CardContent>
                </Card>
            </div>
            </main>
        </div>
    }>
      <SubmitPageContent />
    </Suspense>
  );
}
