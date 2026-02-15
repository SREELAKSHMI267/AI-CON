'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import Header from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Loader2, Upload } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { usePapers, type Paper } from '@/firebase/papers';
import { format } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { papers, loading: papersLoading } = usePapers(user?.uid);
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Show loading while user is being authenticated AND before papers finish loading
  if (isUserLoading || (papersLoading)) {
    return (
       <div className="flex min-h-screen flex-col bg-muted/40">
        <Header />
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          <div className="mx-auto grid max-w-5xl gap-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your submitted papers and view their analysis status.
                </p>
              </div>
              <Button asChild>
                <Link href="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Submit New Paper
                </Link>
              </Button>
            </div>
            <Card>
                <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="mr-4 h-8 w-8 animate-spin text-primary"/>
                        <p className="text-lg text-muted-foreground">Loading your papers...</p>
                    </div>
                </CardContent>
              </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <div className="mx-auto grid max-w-5xl gap-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your submitted papers and view their analysis status.
              </p>
            </div>
            <Button asChild>
              <Link href="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Submit New Paper
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>My Papers</CardTitle>
              <CardDescription>
                A list of your recently uploaded papers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">
                      <span className="sr-only">Icon</span>
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {papers && papers.length > 0 ? (
                    papers.map((paper: Paper) => (
                      <TableRow key={paper.id}>
                        <TableCell>
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </TableCell>
                        <TableCell className="font-medium">
                          {paper.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Badge variant={paper.status === 'Failed' ? 'destructive' : 'outline'}>{paper.status}</Badge>
                            <div className="text-xs text-muted-foreground">
                              Submitted: {paper.uploadTimestamp?.seconds ? format(new Date(paper.uploadTimestamp.seconds * 1000), 'MMM dd, yyyy') : 'N/A'}
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {paper.plagiarismResult && <Badge variant="secondary" className="text-xs">✓ Plagiarism Checked</Badge>}
                              {paper.grammarResult && <Badge variant="secondary" className="text-xs">✓ Grammar Checked</Badge>}
                              {paper.reviewResult && <Badge variant="secondary" className="text-xs">✓ AI Review Checked</Badge>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {paper.uploadTimestamp?.seconds ? format(new Date(paper.uploadTimestamp.seconds * 1000), 'yyyy-MM-dd') : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/submit?paperId=${paper.id}`}>View Details</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <h3 className="text-lg font-semibold">
                          No papers uploaded yet
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          Click the button above to submit your first paper.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
