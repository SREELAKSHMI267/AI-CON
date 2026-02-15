
'use client';

import { useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, File as FileIcon, Loader2, AlertCircle } from 'lucide-react';
import { doc, collection } from 'firebase/firestore';

import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { addPaper } from '@/firebase/papers-actions';

export default function UploadPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleContinue = async () => {
    if (!selectedFile) {
      setError("Please select a file to continue.");
      return;
    }
    if (!user || !firestore) {
      setError("You must be logged in to upload a paper. Please wait or try refreshing.");
      toast({
        title: "Initialization Incomplete",
        description: "Authentication or database service is not yet ready. Please wait a moment.",
        variant: "destructive"
      });
      return;
    }

    if (isNavigating) return; // Prevent multiple rapid clicks
    setIsNavigating(true);

    try {
      // 1. Generate a client-side ID for the new paper.
      const newPaperRef = doc(collection(firestore, 'papers'));
      const paperId = newPaperRef.id;

      // 2. Prepare the paper data.
      const paperData = {
        id: paperId,
        title: selectedFile.name,
        fileType: selectedFile.type,
        status: 'Uploaded' as const,
        userId: user.uid,
      };
      
      // 3. Start the background Firestore write operation. We don't await it.
      addPaper(firestore, paperData).catch(err => {
          // The user has already navigated away. We can log this error.
          // The /submit page will handle the case where the document fails to appear.
          console.error("Background save failed:", err);
      });
      
      // 4. Immediately navigate to the analysis page.
      toast({
        title: "Paper Record Created",
        description: "Proceeding to the analysis page.",
      });
      router.push(`/submit?paperId=${paperId}`);
    } catch (err) {
      console.error("Navigation error:", err);
      setIsNavigating(false);
    }
  };

  const isButtonDisabled = !selectedFile || isUserLoading || isNavigating || !user || !firestore;

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Upload Your Research Paper</CardTitle>
              <CardDescription>
                Select your paper file to begin the analysis process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="paper-file">Paper File</Label>
                  <Input
                    id="paper-file"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="file:text-primary file:font-semibold"
                  />
                </div>

                {selectedFile && (
                  <div className="flex items-center rounded-md border border-dashed p-4">
                    <FileIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                    <p className="truncate text-sm font-medium text-muted-foreground">
                      {selectedFile.name}
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleContinue}
                  type="button"
                  disabled={isButtonDisabled}
                  className="w-full"
                  size="lg"
                >
                  {isNavigating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                 {isUserLoading && (
                    <p className="text-center text-sm text-muted-foreground flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating...
                    </p>
                )}
                 {!user && !isUserLoading && (
                    <p className="text-center text-sm text-muted-foreground">
                        You must be logged in to upload a paper.
                    </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
