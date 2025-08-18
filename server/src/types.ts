export type RagChunk = {
  id: string;          // chunk id
  docId: string;       // source doc
  text: string;        // chunk text
  embedding: number[]; // vector
};
