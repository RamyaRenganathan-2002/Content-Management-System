import HeaderBlockEditor from './HeaderBlockEditor';
import ParagraphBlockEditor from './ParagraphBlockEditor';
import ListBlockEditor from './ListBlockEditor';
import TableBlockEditor from './TableBlockEditor';
import EquationBlockEditor from './EquationBlockEditor';

const EDITORS = {
    header: HeaderBlockEditor,
    paragraph: ParagraphBlockEditor,
    list: ListBlockEditor,
    table: TableBlockEditor,
    equation: EquationBlockEditor
};

export default function BlockEditor({ block, onChange, onDelete, onMoveUp, onMoveDown }) {
    const Editor = EDITORS[block.type];

    return (
        <div className="blueprint-panel">
            <span className="blueprint-tag">{block.type.toUpperCase()}</span>
            <div className="flex justify-end gap-2 mb-3">
                <button onClick={onMoveUp} className="font-mono text-xs text-ink/60 hover:text-accent">↑</button>
                <button onClick={onMoveDown} className="font-mono text-xs text-ink/60 hover:text-accent">↓</button>
                <button onClick={onDelete} className="font-mono text-xs text-red-400 hover:underline">Delete</button>
            </div>
            {Editor ? (
                <Editor data={block.data} onChange={(data) => onChange({ ...block, data })} />
            ) : (
                <p className="font-mono text-xs text-red-400">Unsupported block type: {block.type}</p>
            )}
        </div>
    );
}