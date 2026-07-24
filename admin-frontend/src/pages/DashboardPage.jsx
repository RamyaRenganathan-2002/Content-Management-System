import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPages, deletePage } from '../store/slices/pagesSlice';
import LogoutButton from '../components/LogoutButton';

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { items, isLoading, error } = useSelector((state) => state.pages);
    const { admin } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchPages());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Delete this page? This cannot be undone.')) {
            dispatch(deletePage(id));
        }
    };

    return (
        <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
            <header className="flex items-center justify-between border-b border-line pb-6 mb-8">
                <div>
                    <span className="font-mono text-xs text-accent tracking-widest uppercase">Control Panel</span>
                    <h1 className="font-display text-3xl font-bold text-ink mt-1">Dashboard</h1>
                    <p className="font-mono text-xs text-ink/60 mt-1">Signed in as {admin?.username}</p>
                </div>
                <LogoutButton />
            </header>

            <Link to="/pages/new">
                <button className="bg-accent text-bg font-mono uppercase text-sm tracking-wide px-4 py-2 mb-6 hover:opacity-90">
                    + Create New Page
                </button>
            </Link>

            {isLoading && <p className="font-mono text-sm text-ink/60">Loading pages...</p>}
            {error && <p className="font-mono text-sm text-red-400">{error}</p>}

            <div className="blueprint-panel">
                <span className="blueprint-tag">PAGES</span>
                <table className="w-full text-sm font-mono">
                    <thead>
                        <tr className="border-b border-line text-left">
                            <th className="py-2 px-2 text-accent uppercase text-xs">Title</th>
                            <th className="py-2 px-2 text-accent uppercase text-xs">Slug</th>
                            <th className="py-2 px-2 text-accent uppercase text-xs">Updated</th>
                            <th className="py-2 px-2 text-accent uppercase text-xs">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((page) => {
                            const publicUrl = page.slug === 'home'
                                ? import.meta.env.VITE_PUBLIC_URL
                                : `${import.meta.env.VITE_PUBLIC_URL}/${page.slug}`;

                            return (
                                <tr key={page.id} className="border-b border-line/50">
                                    <td className="py-2 px-2 text-ink">
                                        <a
                                            href={publicUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-accent hover:underline"
                                        >
                                            {page.title}
                                        </a>
                                    </td>
                                    <td className="py-2 px-2 text-ink/70">{page.slug}</td>
                                    <td className="py-2 px-2 text-ink/70">{new Date(page.updatedAt).toLocaleDateString()}</td>
                                    <td className="py-2 px-2 space-x-3">
                                        <Link to={`/pages/edit/${page.id}`} className="text-accentGreen hover:underline">Edit</Link>
                                        <button onClick={() => handleDelete(page.id)} className="text-red-400 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {!isLoading && items.length === 0 && (
                    <p className="font-mono text-sm text-ink/50 pt-4">No pages yet. Create your first one.</p>
                )}
            </div>
        </div>
    );
}