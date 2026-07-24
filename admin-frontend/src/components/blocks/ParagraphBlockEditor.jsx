import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export default function ParagraphBlockEditor({ data, onChange }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: data.text || '',
        onUpdate: ({ editor }) => {
            onChange({ ...data, text: editor.getHTML() });
        }
    });

    // Keep editor in sync if switching between blocks
    useEffect(() => {
        if (editor && data.text !== editor.getHTML()) {
            editor.commands.setContent(data.text || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return <EditorContent editor={editor} />;
}