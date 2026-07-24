import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import BlockEditor from '../components/blocks/BlockEditor';

const BLOCK_TYPES = ['header', 'paragraph', 'list', 'table', 'equation'];

const emptyDataFor = (type) => {
    switch (type) {
        case 'header': return { text: '' };
        case 'paragraph': return { text: '' };
        case 'list': return { items: [''] };
        case 'table': return { headers: ['Column 1'], rows: [['']] };
        case 'equation': return { equation: '', displayMode: false };
        default: return {};
    }
};

export default function PageEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            api.get(`/content/pages/id/${id}`)
                .then((res) => {
                    const page = res.data.page;
                    setTitle(page.title);
                    setSlug(page.slug);
                    setBlocks(page.blocks);
                })
                .catch(() => setError('Failed to load page'))
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode]);

    const addBlock = (type) => setBlocks([...blocks, { type, data: emptyDataFor(type), order: blocks.length }]);
    const updateBlock = (index, updatedBlock) => {
        const copy = [...blocks];
        copy[index] = updatedBlock;
        setBlocks(copy);
    };
    const deleteBlock = (index) => setBlocks(blocks.filter((_, i) => i !== index));
    const moveBlock = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= blocks.length) return;
        const copy = [...blocks];
        [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
        setBlocks(copy);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const payload = { title, slug, blocks: blocks.map((b, i) => ({ ...b, order: i })) };
            if (isEditMode) {
                await api.put(`/content/pages/${id}`, payload);
            } else {
                await api.post('/content/pages', payload);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save page');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p className="font-mono text-sm text-ink/60 px-6 py-10">Loading page...</p>;
    }

    return (
        <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
            <span className="font-mono text-xs text-accent tracking-widest uppercase">
                {isEditMode ? 'Edit' : 'New'} / Page 001
            </span>
            <h1 className="font-display text-3xl font-bold text-ink mt-1 mb-6">
                {isEditMode ? 'Edit Page' : 'New Page'}
            </h1>

            <input
                placeholder="Page Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border border-line px-3 py-2 text-ink font-body mb-3 focus:outline-none focus:border-accent"
            />
            <input
                placeholder="Slug (e.g. home)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-transparent border border-line px-3 py-2 text-ink font-mono text-sm mb-8 focus:outline-none focus:border-accent"
            />

            {blocks.map((block, i) => (
                <BlockEditor
                    key={i}
                    block={block}
                    onChange={(updated) => updateBlock(i, updated)}
                    onDelete={() => deleteBlock(i)}
                    onMoveUp={() => moveBlock(i, -1)}
                    onMoveDown={() => moveBlock(i, 1)}
                />
            ))}

            <div className="mb-8">
                <span className="font-mono text-xs text-ink/60 uppercase block mb-2">Add block</span>
                {BLOCK_TYPES.map((type) => (
                    <button
                        key={type}
                        onClick={() => addBlock(type)}
                        className="font-mono text-xs text-accentGreen border border-accentGreen px-2 py-1 hover:bg-accentGreen hover:text-bg transition-colors mr-2 mb-2"
                    >
                        + {type}
                    </button>
                ))}
            </div>

            {error && <p className="font-mono text-xs text-red-400 mb-4">{error}</p>}
            <button
                onClick={handleSave}
                disabled={saving}
                className="bg-accent text-bg font-mono uppercase text-sm tracking-wide px-6 py-2.5 hover:opacity-90 disabled:opacity-50"
            >
                {saving ? 'Saving...' : 'Save Page'}
            </button>
        </div>
    );
}