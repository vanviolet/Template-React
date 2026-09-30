export interface EditorFormState {
  title: string;
  category: string;
  author: string;
  summary: string;
  content: string;
  status: 'draft' | 'published';
}
