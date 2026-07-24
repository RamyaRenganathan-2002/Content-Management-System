export default function EquationBlockEditor({ data, onChange }) {
    return (
        <div>
            <input
                type="text"
                placeholder="LaTeX, e.g. E = mc^2"
                value={data.equation || ''}
                onChange={(e) => onChange({ ...data, equation: e.target.value })}
                className="w-full bg-transparent border border-line px-2 py-1.5 text-ink font-body text-sm focus:outline-none focus:border-accent mb-2"
            />
            <label className="flex items-center gap-2 font-mono text-xs text-ink/70">
                <input
                    type="checkbox"
                    checked={data.displayMode || false}
                    onChange={(e) => onChange({ ...data, displayMode: e.target.checked })}
                />
                Block display (centered, larger)
            </label>
        </div>
    );
}