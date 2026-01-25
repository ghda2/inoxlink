import { useEditor, EditorContent } from '@tiptap/react'
import { useState, useEffect } from 'react'
import { StarterKit } from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import {
    Bold, Italic, List, ListOrdered, Quote,
    Link as LinkIcon, Image as ImageIcon,
    Heading1, Heading2, Undo, Redo, Code,
    Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight,
    Table as TableIcon, Columns, Rows, Plus, Trash2,
    Code2, Eye
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
    children,
    title
}: {
    onClick: () => void,
    isActive?: boolean,
    disabled?: boolean,
    children: React.ReactNode,
    title?: string
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "p-2 rounded-lg transition-all",
            isActive ? "bg-black text-white" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900",
            disabled && "opacity-30 cursor-not-allowed"
        )}
    >
        {children}
    </button>
)

export default function Editor({ content, onChange }: EditorProps) {
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [htmlContent, setHtmlContent] = useState(content);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({ openOnClick: false }),
            Image.configure({ inline: true }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            CodeBlockLowlight.configure({ lowlight }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setHtmlContent(html);
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-zinc max-w-none min-h-[500px] p-8 focus:outline-none rounded-b-2xl bg-white font-[\'Outfit\',sans-serif] [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:text-zinc-100 [&_code]:text-zinc-800 [&_table]:border-collapse [&_table]:w-full [&_table]:my-4 [&_td]:border [&_td]:border-zinc-200 [&_td]:p-3 [&_td]:relative [&_th]:border [&_th]:border-zinc-200 [&_th]:p-3 [&_th]:bg-zinc-50/50 [&_th]:font-bold [&_table_p]:m-0',
            },
        },
    })

    // Sync HTML mode content back to Tiptap when switching off HTML mode
    useEffect(() => {
        if (!isHtmlMode && editor) {
            const currentContent = editor.getHTML();
            if (currentContent !== htmlContent) {
                editor.commands.setContent(htmlContent);
            }
        }
    }, [isHtmlMode, editor, htmlContent]);

    if (!editor) return null

    const addLink = () => {
        const url = window.prompt('URL do link:')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    const addImage = () => {
        const url = window.prompt('URL da imagem:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    return (
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-zinc-100 p-2 flex flex-wrap gap-1">
                <MenuButton
                    onClick={() => setIsHtmlMode(!isHtmlMode)}
                    isActive={isHtmlMode}
                    title={isHtmlMode ? "Ver Visual" : "Ver código HTML"}
                >
                    {isHtmlMode ? <Eye size={16} /> : <Code2 size={16} />}
                </MenuButton>

                {!isHtmlMode && (
                    <>
                        <div className="w-px h-6 bg-zinc-100 mx-1 self-center" />

                        <MenuButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            isActive={editor.isActive('heading', { level: 1 })}
                            title="Título 1"
                        >
                            <Heading1 size={16} />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            isActive={editor.isActive('heading', { level: 2 })}
                            title="Título 2"
                        >
                            <Heading2 size={16} />
                        </MenuButton>

                        <div className="w-px h-6 bg-zinc-100 mx-1 self-center" />

                        <MenuButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            title="Negrito"
                        >
                            <Bold size={16} />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            title="Itálico"
                        >
                            <Italic size={16} />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            isActive={editor.isActive('underline')}
                            title="Sublinhado"
                        >
                            <UnderlineIcon size={16} />
                        </MenuButton>

                        <div className="w-px h-6 bg-zinc-100 mx-1 self-center" />

                        <MenuButton
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            isActive={editor.isActive({ textAlign: 'left' })}
                            title="Alinhar à Esquerda"
                        >
                            <AlignLeft size={16} />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            isActive={editor.isActive({ textAlign: 'center' })}
                            title="Centralizar"
                        >
                            <AlignCenter size={16} />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            isActive={editor.isActive({ textAlign: 'right' })}
                            title="Alinhar à Direita"
                        >
                            <AlignRight size={16} />
                        </MenuButton>

                        <div className="w-px h-6 bg-zinc-100 mx-1 self-center" />

                        <MenuButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive('bulletList')}
                            title="Lista"
                        >
                            <List size={16} />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive('orderedList')}
                            title="Lista Numerada"
                        >
                            <ListOrdered size={16} />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            isActive={editor.isActive('blockquote')}
                            title="Citação"
                        >
                            <Quote size={16} />
                        </MenuButton>

                        <div className="w-px h-6 bg-zinc-100 mx-1 self-center" />

                        <div className="flex items-center gap-0.5 bg-zinc-50/50 p-1 rounded-xl">
                            <MenuButton
                                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                                title="Inserir Tabela"
                                isActive={editor.isActive('table')}
                            >
                                <TableIcon size={16} />
                            </MenuButton>

                            {editor.isActive('table') && (
                                <>
                                    <div className="w-px h-4 bg-zinc-200 mx-1" />
                                    <MenuButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Adicionar Coluna">
                                        <Columns size={14} className="text-zinc-500" />
                                    </MenuButton>
                                    <MenuButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Adicionar Linha">
                                        <Rows size={14} className="text-zinc-500" />
                                    </MenuButton>
                                    <MenuButton onClick={() => editor.chain().focus().deleteTable().run()} title="Excluir Tabela" className="hover:bg-red-50 hover:text-red-600 transition-colors">
                                        <Trash2 size={14} />
                                    </MenuButton>
                                </>
                            )}
                        </div>

                        <div className="w-px h-6 bg-zinc-100 mx-1 self-center" />

                        <MenuButton onClick={addLink} isActive={editor.isActive('link')} title="Inserir Link">
                            <LinkIcon size={16} />
                        </MenuButton>
                        <MenuButton onClick={addImage} isActive={editor.isActive('image')} title="Inserir Imagem por URL">
                            <ImageIcon size={16} />
                        </MenuButton>

                        <div className="flex-1" />

                        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Desfazer">
                            <Undo size={16} />
                        </MenuButton>
                        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Refazer">
                            <Redo size={16} />
                        </MenuButton>
                    </>
                )}
            </div>

            {/* Editor Content */}
            <div className="min-h-[600px] bg-white">
                {isHtmlMode ? (
                    <textarea
                        value={htmlContent}
                        onChange={(e) => {
                            setHtmlContent(e.target.value);
                            onChange(e.target.value);
                        }}
                        className="w-full h-[600px] p-8 font-mono text-sm bg-zinc-50 focus:outline-none resize-none"
                        spellCheck={false}
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}
            </div>
        </div>
    )
}
