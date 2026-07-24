'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function BlockRenderer({ blocks = [] }) {
    const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

    let figCount = 0;
    let tableCount = 0;
    let eqCount = 0;

    return (
        <div className="max-w-3xl mx-auto px-6">
            {sortedBlocks.map((block) => {
                switch (block.type) {
                    case 'header':
                        return (
                            <h2
                                key={block.id}
                                className="font-display text-3xl font-bold text-ink tracking-tight mt-12 mb-4"
                            >
                                {block.data.text}
                            </h2>
                        );

                    case 'paragraph':
                        return (
                            <div
                                key={block.id}
                                className="font-body text-ink/85 leading-relaxed mb-6"
                                dangerouslySetInnerHTML={{ __html: block.data.text }}
                            />
                        );

                    case 'list':
                        return (
                            <ul key={block.id} className="list-disc pl-6 space-y-2 text-ink/85 font-body mb-6">
                                {block.data.items.map((item, i) => (
                                    <li key={i}>
                                        {typeof item === 'string' ? item : item.text}
                                        {item?.children?.length > 0 && (
                                            <BlockRenderer
                                                blocks={[{ id: `${block.id}-${i}`, type: 'list', data: { items: item.children }, order: 0 }]}
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        );

                    case 'table': {
                        tableCount += 1;
                        return (
                            <div key={block.id} className="blueprint-panel">
                                <span className="blueprint-tag">TABLE {String(tableCount).padStart(2, '0')}</span>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm font-mono">
                                        <thead>
                                            <tr className="border-b border-line">
                                                {block.data.headers.map((h, i) => (
                                                    <th key={i} className="text-left py-2 px-3 text-accent uppercase tracking-wide text-xs">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {block.data.rows.map((row, r) => (
                                                <tr key={r} className="border-b border-line/50">
                                                    {row.map((cell, c) => (
                                                        <td key={c} className="py-2 px-3 text-ink/80">{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    }

                    case 'equation': {
                        eqCount += 1;
                        return (
                            <div key={block.id} className="blueprint-panel">
                                <span className="blueprint-tag">EQ. {String.fromCharCode(64 + eqCount)}</span>
                                <div className="text-ink py-2">
                                    {block.data.displayMode ? (
                                        <BlockMath math={block.data.equation} />
                                    ) : (
                                        <InlineMath math={block.data.equation} />
                                    )}
                                </div>
                            </div>
                        );
                    }

                    default:
                        return (
                            <div key={block.id} className="text-accent/70 font-mono text-xs">
                                Unsupported block type: {block.type}
                            </div>
                        );
                }
            })}
        </div>
    );
}