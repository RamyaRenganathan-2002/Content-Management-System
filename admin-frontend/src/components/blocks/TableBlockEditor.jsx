export default function TableBlockEditor({ data, onChange }) {
    const headers = data.headers || ['Column 1'];
    const rows = data.rows || [['']];

    const updateHeader = (i, value) => {
        const updated = [...headers];
        updated[i] = value;
        onChange({ ...data, headers: updated });
    };

    const updateCell = (r, c, value) => {
        const updated = rows.map((row) => [...row]);
        updated[r][c] = value;
        onChange({ ...data, rows: updated });
    };

    const addColumn = () => {
        onChange({
            ...data,
            headers: [...headers, `Column ${headers.length + 1}`],
            rows: rows.map((row) => [...row, ''])
        });
    };

    const addRow = () => onChange({ ...data, rows: [...rows, headers.map(() => '')] });

    return (
        <div>
            <table className="w-full">
                <thead>
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i}>
                                <input
                                    value={h}
                                    onChange={(e) => updateHeader(i, e.target.value)}
                                    className="w-full bg-transparent border border-line px-2 py-1.5 text-ink font-body text-sm focus:outline-none focus:border-accent mb-2"
                                />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, r) => (
                        <tr key={r}>
                            {row.map((cell, c) => (
                                <td key={c}>
                                    <input
                                        value={cell}
                                        onChange={(e) => updateCell(r, c, e.target.value)}
                                        className="w-full bg-transparent border border-line px-2 py-1.5 text-ink font-body text-sm focus:outline-none focus:border-accent mb-2"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={addColumn}
                className="font-mono text-xs text-accent border border-accent px-2 py-1 hover:bg-accent hover:text-bg transition-colors mr-2"
            >
                + Column
            </button>
            <button
                onClick={addRow}
                className="font-mono text-xs text-accent border border-accent px-2 py-1 hover:bg-accent hover:text-bg transition-colors mr-2"
            >
                + Row
            </button>
        </div>
    );
}