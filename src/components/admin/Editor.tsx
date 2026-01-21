import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import {
    Bold, Italic, List, ListOrdered, Quote,
    Link as LinkIcon, Image as ImageIcon,
    Heading1, Heading2, Undo, Redo, Code
} from 'lucide-react'
import { cn } from '../../scripts/utils'

const lowlight = createLowlight(common)

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MenuButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children
}: {
    onClick: () => void,
    isActive?: boolean,
    disabled?: boolean,
    children: React.ReactNode
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "p-2 rounded-md transition-colors",
            isActive ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white",
            disabled && "opacity-50 cursor-not-allowed"
        )}
    >
        {children}
    </button>
)

export default function Editor({ content, onChange }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Desativa o padrão para usar o lowlight
            }),
            Link.configure({ openOnClick: false }),
            Image.configure({ inline: true }),
            CodeBlockLowlight.configure({ lowlight }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[400px] p-6 focus:outline-none focus:ring-1 focus:ring-orange-500/50 rounded-b-xl bg-slate-900/50 [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:font-mono [&_code]:text-orange-400',
            },
        },
    })

    if (!editor) return null

    const addLink = () => {
        const url = window.prompt('URL do link:')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    return (
        <div className="border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-900 border-b border-slate-800 p-2 flex flex-wrap gap-1">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                >
                    <Heading1 size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 size={18} />
                </MenuButton>
                <div className="w-px h-6 bg-slate-800 mx-1 self-center" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                >
                    <Bold size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                >
                    <Italic size={18} />
                </MenuButton>
                <div className="w-px h-6 bg-slate-800 mx-1 self-center" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                >
                    <List size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                >
                    <ListOrdered size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                >
                    <Quote size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                >
                    <Code size={18} />
                </MenuButton>
                <div className="w-px h-6 bg-slate-800 mx-1 self-center" />
                <MenuButton onClick={addLink} isActive={editor.isActive('link')}>
                    <LinkIcon size={18} />
                </MenuButton>
                <div className="flex-1" />
                <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                    <Undo size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                    <Redo size={18} />
                </MenuButton>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}
