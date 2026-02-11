
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bot, ThumbsUp } from 'lucide-react';
import type { ImproveGrammarAndStyleOutput } from '@/ai/flows/improve-grammar-style';
import type { CheckPaperForPlagiarismOutput } from '@/ai/flows/check-plagiarism';
import type { AiPoweredReviewOutput } from '@/ai/flows/ai-powered-review';
import { Separator } from './ui/separator';

type AnalysisType = 'plagiarism' | 'grammar' | 'review';

interface AnalysisResultProps {
  type: AnalysisType;
  result: any; // The result can be one of the three output types
}

const AnalysisResult = ({ type, result }: AnalysisResultProps) => {
  const renderContent = () => {
    switch (type) {
      case 'plagiarism':
        return <PlagiarismResult data={result as CheckPaperForPlagiarismOutput} />;
      case 'grammar':
        return <GrammarResult data={result as ImproveGrammarAndStyleOutput} />;
      case 'review':
        return <AiReviewResult data={result as AiPoweredReviewOutput} />;
      default:
        return <p>Unknown analysis type.</p>;
    }
  };
  
  const getSubTitle = () => {
    return "Review the AI-generated feedback below.";
  }

  return (
     <Card className="shadow-lg animate-in fade-in-50">
        <CardHeader>
            <CardTitle>Analysis Results: {getFriendlyTitle(type)}</CardTitle>
            <CardDescription>{getSubTitle()}</CardDescription>
        </CardHeader>
        <CardContent>
            {renderContent()}
        </CardContent>
     </Card>
  )
};

const getFriendlyTitle = (type: AnalysisType) => {
    switch (type) {
        case 'plagiarism': return 'Plagiarism Check';
        case 'grammar': return 'Grammar & Style';
        case 'review': return 'AI-Powered Review';
    }
}


const PlagiarismResult = ({ data }: { data: CheckPaperForPlagiarismOutput }) => {
  const scoreColor = data.similarityScore > 20 ? 'text-red-500' : data.similarityScore > 5 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Similarity Score</h3>
        <div className="flex items-center gap-4">
            <span className={`text-4xl font-bold ${scoreColor}`}>{data.similarityScore.toFixed(2)}%</span>
            <Progress value={data.similarityScore} className="w-full" />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{data.summary}</p>
      </div>

      {data.flaggedSections && data.flaggedSections.length > 0 && (
        <>
        <Separator />
        <div>
          <h3 className="text-lg font-semibold mb-2">Flagged Sections</h3>
          <div className="space-y-4">
            {data.flaggedSections.map((section, index) => (
              <blockquote key={index} className="border-l-4 border-primary pl-4 py-2 bg-muted/50 rounded-r-md">
                <p className="italic">"{section}"</p>
                {data.sources?.[index] && (
                    <footer className="text-xs text-muted-foreground mt-2">Source: {data.sources[index]}</footer>
                )}
              </blockquote>
            ))}
          </div>
        </div>
        </>
      )}
       {data.flaggedSections?.length === 0 && (
          <div className="text-center py-8 bg-green-50/50 rounded-lg border border-dashed border-green-200">
             <ThumbsUp className="mx-auto h-12 w-12 text-green-500 mb-4" />
             <h4 className="text-lg font-semibold text-green-700">No Significant Plagiarism Detected</h4>
             <p className="text-sm text-muted-foreground mt-1">Great! The paper appears to be original.</p>
          </div>
       )}
    </div>
  );
};

const GrammarResult = ({ data }: { data: ImproveGrammarAndStyleOutput }) => {
  return (
    <div className="space-y-6">
       <div>
        <h3 className="text-lg font-semibold mb-2">Suggested Changes</h3>
        <p className="text-sm text-muted-foreground mb-4">
            The AI has identified the following areas for improvement to enhance clarity, conciseness, and academic tone.
        </p>
        <div className="space-y-4 max-h-[400px] overflow-y-auto p-2 rounded-md bg-muted/30">
            {data.changes.map((change, index) => (
                <Card key={index}>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <div>
                            <p className="text-xs font-semibold text-red-600 uppercase mb-1">Original</p>
                            <p className="text-sm text-muted-foreground line-through">{change.original}</p>
                        </div>
                         <div>
                            <p className="text-xs font-semibold text-green-600 uppercase mb-1">Suggestion</p>
                            <p className="text-sm">{change.suggestion}</p>
                        </div>
                        <div className="md:col-span-2 mt-2">
                             <Badge variant="outline">{change.explanation}</Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold mb-2">Revised Paper Text</h3>
        <div className="p-4 border rounded-md bg-muted/30 max-h-[400px] overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{data.improvedPaperText}</p>
        </div>
      </div>
    </div>
  );
};

const AiReviewResult = ({ data }: { data: AiPoweredReviewOutput }) => {
  return (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Bot className="h-5 w-5" /> Overall Summary</h3>
             <div className="p-4 border rounded-md bg-muted/50">
                <p className="text-sm leading-relaxed">{data.summary}</p>
            </div>
        </div>
        <Separator />
        <div>
            <h3 className="text-lg font-semibold mb-2">Actionable Feedback</h3>
            <ul className="space-y-3">
            {data.feedback.map((item, index) => (
                <li key={index} className="flex items-start">
                    <span className="text-primary font-bold text-lg mr-3">{index + 1}.</span>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">{item}</p>
                </li>
            ))}
            </ul>
        </div>
    </div>
  );
};


export default AnalysisResult;
