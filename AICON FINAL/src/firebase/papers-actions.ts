
import { 
    collection, 
    serverTimestamp, 
    addDoc,
    doc,
    setDoc,
    type Firestore,
    Timestamp
} from "firebase/firestore";
import type { CheckPaperForPlagiarismOutput } from "@/ai/flows/check-plagiarism";
import type { ImproveGrammarAndStyleOutput } from "@/ai/flows/improve-grammar-style";
import type { AiPoweredReviewOutput } from "@/ai/flows/ai-powered-review";

// Defines the core structure for a Paper document in Firestore.
export interface Paper {
    id?: string;
    title: string;
    fileType: string;
    status: 'Uploaded' | 'Analyzing' | 'Plagiarism Checked' | 'Grammar Checked' | 'AI Reviewed' | 'Failed';
    userId: string;
    uploadTimestamp?: Timestamp;
    updatedAt?: Timestamp;
    // Fields to store analysis results
    plagiarismResult?: CheckPaperForPlagiarismOutput;
    grammarResult?: ImproveGrammarAndStyleOutput;
    reviewResult?: AiPoweredReviewOutput;
}

/**
 * Adds a new paper document to the 'papers' collection in Firestore.
 * If an ID is provided, it uses that ID for the document. Otherwise, Firestore auto-generates one.
 * @param db The Firestore instance.
 * @param paper The paper metadata to save.
 * @returns The ID of the document.
 */
export const addPaper = async (db: Firestore, paper: Omit<Paper, 'uploadTimestamp' | 'updatedAt'>): Promise<string> => {
    if (!db) {
        throw new Error("Firestore is not initialized");
    }
    try {
        const paperWithTimestamps = {
            ...paper,
            uploadTimestamp: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        if (paper.id) {
            // Use the provided ID to set the document
            const docRef = doc(db, "papers", paper.id);
            await setDoc(docRef, paperWithTimestamps);
            return paper.id;
        } else {
            // Let Firestore generate the ID
            const docRef = await addDoc(collection(db, "papers"), paperWithTimestamps);
            return docRef.id;
        }
    } catch (error: any) {
        console.error("Error adding/setting document in Firestore: ", error);
        throw new Error("Could not save paper details to database.");
    }
};

/**
 * Updates an existing paper document in Firestore.
 * @param db The Firestore instance.
 * @param paperId The ID of the paper document to update.
 * @param updates A partial object of the paper fields to update.
 */
export const updatePaper = async (db: Firestore, paperId: string, updates: Partial<Omit<Paper, 'id'>>) => {
    if (!db) {
        throw new Error("Firestore is not initialized");
    }
    try {
        const docRef = doc(db, "papers", paperId);
        await setDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        }, { merge: true });
    } catch (error: any) {
        console.error("Error updating document: ", error);
        throw new Error("Could not update paper status.");
    }
};
