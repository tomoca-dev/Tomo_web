import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageShell from '@/components/tomoca/PageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/AuthContext';
import { ArrowLeft, Pencil, Trash2, BookOpen, Calendar, Tag } from 'lucide-react';
import { img } from '@/components/tomoca/Data';
// Simple inline markdown renderer — no external package needed
function SimpleMarkdown({ children }) {
  const md = children || '';
  const html = md
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^[\-\*] (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr />')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br />');
  return <div dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }} />;
}

const COVERS = [img.farm, img.drying, img.lady, img.store, img.harvest, img.tokens, img.poster, img.smile];
const CATEGORIES = ['Tomoca Stories', 'Industry News', 'Brewing Guides', 'Origin & Farm', 'Events & Culture'];

export default function JournalPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  const { data: post, isLoading } = useQuery({
    queryKey: ['journal', id],
    queryFn: async () => {
      const posts = await base44.entities.JournalPost.filter({ id });
      return posts[0];
    },
  });

  const update = useMutation({
    mutationFn: d => base44.entities.JournalPost.update(id, d),
    onSuccess: () => { qc.invalidateQueries(['journal']); qc.invalidateQueries(['journal', id]); setEditing(false); },
  });

  const remove = useMutation({
    mutationFn: () => base44.entities.JournalPost.delete(id),
    onSuccess: () => navigate('/journal'),
  });

  const startEdit = () => { setForm({ ...post }); setEditing(true); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (isLoading) return <PageShell><div className="flex min-h-screen items-center justify-center pt-32"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></PageShell>;
  if (!post) return <PageShell><div className="pt-48 text-center"><p className="text-2xl font-bold">Post not found.</p><Link to="/journal" className="mt-4 inline-block text-primary">← Back to Journal</Link></div></PageShell>;

  const cover = post.cover_image_url || COVERS[Math.abs(post.title.length) % COVERS.length];

  if (editing && form) {
    return (
      <PageShell>
        <main className="mx-auto max-w-4xl px-6 pt-36 pb-24">
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-2xl">
            <h3 className="mb-6 font-display text-3xl font-black">Edit Post</h3>
            <div className="grid gap-4">
              <Input placeholder="Title" value={form.title} onChange={e => set('title', e.target.value)} className="text-lg font-bold" />
              <Textarea placeholder="Excerpt" value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} />
              <Textarea placeholder="Full article body" value={form.body} onChange={e => set('body', e.target.value)} rows={12} />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Category</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <Input placeholder="Author" value={form.author} onChange={e => set('author', e.target.value)} />
              </div>
              <Input placeholder="Cover image URL" value={form.cover_image_url} onChange={e => set('cover_image_url', e.target.value)} />
              <Input placeholder="Tags (comma-separated)" value={form.tags} onChange={e => set('tags', e.target.value)} />
              <div className="flex gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="accent-primary h-4 w-4" />Published
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-primary h-4 w-4" />Featured
                </label>
              </div>
              <div className="flex gap-3">
                <Button className="rounded-full" onClick={() => update.mutate(form)}>Save Changes</Button>
                <Button variant="outline" className="rounded-full" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="pt-32 pb-24">
        {/* Cover */}
        <div className="relative h-[50vh] overflow-hidden">
          <img src={cover} alt={post.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
            <div className="mx-auto max-w-4xl">
              <span className="mb-3 inline-block rounded-full bg-primary px-4 py-1 text-xs font-black text-primary-foreground">{post.category}</span>
              <h1 className="font-display text-5xl font-black leading-tight text-white md:text-6xl">{post.title}</h1>
            </div>
          </div>
        </div>

        {/* Meta + Body */}
        <div className="mx-auto max-w-4xl px-6 pt-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-primary" />{post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />{new Date(post.created_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              {post.tags && post.tags.split(',').map(t => (
                <span key={t} className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs"><Tag className="h-3 w-3" />{t.trim()}</span>
              ))}
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full" onClick={startEdit}><Pencil className="mr-1.5 h-3.5 w-3.5" />Edit</Button>
                <Button size="sm" variant="destructive" className="rounded-full" onClick={() => remove.mutate()}><Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete</Button>
              </div>
            )}
          </div>

          {post.excerpt && <p className="mb-8 text-xl font-semibold leading-relaxed text-muted-foreground italic border-l-4 border-primary pl-6">{post.excerpt}</p>}

          {post.body ? (
            <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-a:text-primary">
              <SimpleMarkdown>{post.body}</SimpleMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No full article body added yet.</p>
          )}

          <div className="mt-14 border-t border-border pt-8">
            <Link to="/journal" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black hover:border-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />Back to Journal
            </Link>
          </div>
        </div>
      </main>
    </PageShell>
  );
}