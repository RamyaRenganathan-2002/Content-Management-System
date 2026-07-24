export default function ListBlockEditor({ data, onChange }) {
    const items = data.items || [''];

    const updateItem = (index, value) => {
        const updated = [...items];
        updated[index] = value;
        onChange({ ...data, items: updated });
    };

    const addItem = () => onChange({ ...data, items: [...items, ''] });
    const removeItem = (index) => onChange({ ...data, items: items.filter((_, i) => i !== index) });

    return (
        <div>
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                    <input
                        value={item}
                        onChange={(e) => updateItem(i, e.target.value)}
                        className="w-full bg-transparent border border-line px-2 py-1.5 text-ink font-body text-sm focus:outline-none focus:border-accent mb-2"
                    />
                    <button
                        onClick={() => removeItem(i)}
                        className="font-mono text-xs text-accent border border-accent px-2 py-1 hover:bg-accent hover:text-bg transition-colors mr-2"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                onClick={addItem}
                className="font-mono text-xs text-accent border border-accent px-2 py-1 hover:bg-accent hover:text-bg transition-colors mr-2"
            >
                + Add Item
            </button>
        </div>
    );
}