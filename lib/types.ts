export type Material = { id?: string; title: string; url: string; storage_path?: string | null; file_name?: string | null };
export type Lesson = { id: string; course_id: string; title: string; description: string | null; video_url: string | null; position: number; materials?: Material[] };
export type Course = { id: string; title: string; description: string | null; category: string | null; cover_url: string | null; published: boolean; created_at?: string; lessons?: Lesson[] };
