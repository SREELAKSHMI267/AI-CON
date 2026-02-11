
'use client';

import { 
    collection, 
    query, 
    where,
    onSnapshot,
    doc,
    type Firestore,
    Timestamp
} from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import { useFirebase } from './provider';
import type { Paper } from './papers-actions';

export type { Paper };
export { updatePaper, addPaper } from './papers-actions';


/**
 * A React hook to fetch a user's papers from Firestore in real-time.
 * @param userId The ID of the user whose papers to fetch.
 * @returns An object containing the list of papers and a loading state.
 */
export const usePapers = (userId?: string) => {
    const { firestore, isUserLoading } = useFirebase();
    const [papers, setPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);

    const papersQuery = useMemo(() => {
        if (!firestore || !userId) return null;
        return query(collection(firestore, "papers"), where("userId", "==", userId));
    }, [firestore, userId]);

    useEffect(() => {
        if (isUserLoading) {
            setLoading(true);
            return;
        }
        if (!papersQuery) {
            setPapers([]);
            setLoading(false);
            return;
        };

        setLoading(true);
        
        const unsubscribe = onSnapshot(papersQuery, (querySnapshot) => {
            const papersData: Paper[] = [];
            querySnapshot.forEach((doc) => {
                papersData.push({ id: doc.id, ...doc.data() } as Paper);
            });
            // Sort by upload timestamp, newest first
            setPapers(papersData.sort((a, b) => (b.uploadTimestamp?.seconds || 0) - (a.uploadTimestamp?.seconds || 0)));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching papers: ", error);
            setPapers([]);
            setLoading(false);
        });

        return () => unsubscribe();

    }, [papersQuery, isUserLoading]);

    return { papers, loading };
}


/**
 * A React hook to fetch a single paper from Firestore in real-time.
 * @param paperId The ID of the paper to fetch.
 * @returns An object containing the paper data and a loading state.
 */
export const usePaper = (paperId: string | null) => {
    const { firestore } = useFirebase();
    const [paper, setPaper] = useState<Paper | null>(null);
    const [loading, setLoading] = useState(true);

    const paperDocRef = useMemo(() => {
        if (!firestore || !paperId) return null;
        return doc(firestore, 'papers', paperId);
    }, [firestore, paperId]);

    useEffect(() => {
        if (!paperDocRef) {
            setLoading(false);
            setPaper(null);
            return;
        }

        setLoading(true);

        const unsubscribe = onSnapshot(paperDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setPaper({ id: docSnap.id, ...docSnap.data() } as Paper);
            } else {
                setPaper(null);
                // This is not an error, it just means the doc hasn't been created yet.
            }
            setLoading(false);
        }, (error) => {
            console.error(`Error fetching paper ${paperId}:`, error);
            setPaper(null);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [paperDocRef, paperId]);

    return { paper, loading };
}
