import { getPageBySlug } from '../utils/api';
import BlockRenderer from '../components/BlockRenderer';

export default async function HomePage() {
  const page = await getPageBySlug('home');

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="blueprint-panel max-w-md text-center">
          <span className="blueprint-tag">STATUS</span>
          <p className="font-mono text-sm text-ink/70">
            No home page content yet. Create one in the admin panel with slug "home".
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-8 border-b border-line">
        <span className="font-mono text-xs text-accent tracking-widest uppercase">RenewCred / Doc 001</span>
        <h1 className="font-display text-5xl font-bold text-ink mt-3">{page.title}</h1>
      </header>
      <BlockRenderer blocks={page.blocks} />
    </main>
  );
}