export default function HeaderBlockEditor({ data, onChange }) {
    return (
        <input
            type="text"
            placeholder="Header text"
            value={data.text || ''}
            onChange={(e) => onChange({ ...data, text: e.target.value })}
            className="w-full bg-transparent border border-line px-2 py-1.5 text-ink font-body text-sm focus:outline-none focus:border-accent mb-2"
        />
    );
}