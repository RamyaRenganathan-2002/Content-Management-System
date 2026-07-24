import { getPageBySlug } from '../../utils/api';
import { notFound } from 'next/navigation';
import BlockRenderer from '../../components/BlockRenderer';

export default async function DynamicPage({ params }) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) notFound();

    return (
        <main className="min-h-screen pb-24">
            <header className="max-w-3xl mx-auto px-6 pt-16 pb-8 border-b border-line">
                <span className="font-mono text-xs text-accent tracking-widest uppercase">RenewCred / {slug}</span>
                <h1 className="font-display text-5xl font-bold text-ink mt-3">{page.title}</h1>
            </header>
            <BlockRenderer blocks={page.blocks} />
        </main>
    );
}