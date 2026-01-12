<template>
  <div class="space-y-2">
    <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">
      Conteúdo
    </label>

    <!-- Toolbar -->
    <div v-if="editor" class="bg-white border border-neutral-200 rounded-t-xl p-2 flex flex-wrap gap-1">
      <!-- Headings -->
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'bg-black text-white': editor.isActive('heading', { level: 1 }) }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 font-bold text-sm transition-colors"
      >
        H1
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-black text-white': editor.isActive('heading', { level: 2 }) }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 font-bold text-sm transition-colors"
      >
        H2
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-black text-white': editor.isActive('heading', { level: 3 }) }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 font-bold text-sm transition-colors"
      >
        H3
      </button>

      <div class="w-px bg-neutral-300 mx-1"></div>

      <!-- Text Formatting -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'bg-black text-white': editor.isActive('bold') }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 font-bold text-sm transition-colors"
      >
        B
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'bg-black text-white': editor.isActive('italic') }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 italic text-sm transition-colors"
      >
        I
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'bg-black text-white': editor.isActive('underline') }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 underline text-sm transition-colors"
      >
        U
      </button>

      <div class="w-px bg-neutral-300 mx-1"></div>

      <!-- Lists -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-black text-white': editor.isActive('bulletList') }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 text-sm transition-colors"
        title="Lista com marcadores"
      >
        • List
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-black text-white': editor.isActive('orderedList') }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 text-sm transition-colors"
        title="Lista numerada"
      >
        1. List
      </button>

      <div class="w-px bg-neutral-300 mx-1"></div>

      <!-- Alignment -->
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="{ 'bg-black text-white': editor.isActive({ textAlign: 'left' }) }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 text-sm transition-colors"
        title="Alinhar à esquerda"
      >
        ←
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="{ 'bg-black text-white': editor.isActive({ textAlign: 'center' }) }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 text-sm transition-colors"
        title="Centralizar"
      >
        ↔
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="{ 'bg-black text-white': editor.isActive({ textAlign: 'right' }) }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 text-sm transition-colors"
        title="Alinhar à direita"
      >
        →
      </button>

      <div class="w-px bg-neutral-300 mx-1"></div>

      <!-- Link -->
      <button
        type="button"
        @click="addLink"
        :class="{ 'bg-black text-white': editor.isActive('link') }"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 text-sm transition-colors"
        title="Adicionar link"
      >
        🔗 Link
      </button>

      <!-- Image -->
      <button
        type="button"
        @click="addImage"
        class="px-3 py-1.5 rounded-lg hover:bg-neutral-100 text-sm transition-colors"
        title="Adicionar imagem"
      >
        🖼️ Imagem
      </button>
    </div>

    <!-- Editor Content -->
    <EditorContent
      :editor="editor"
      class="bg-white border border-neutral-200 rounded-b-xl min-h-[400px] prose prose-sm max-w-none p-4 focus-within:ring-2 focus-within:ring-black outline-none"
    />

    <!-- Stats -->
    <div class="flex gap-4 text-xs text-neutral-500">
      <span>{{ wordCount }} palavras</span>
      <span>{{ readingTime }} min de leitura</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

interface Props {
  modelValue?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Escreva o conteúdo da notícia aqui...'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const editor = useEditor({
  extensions: [
    StarterKit,
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg',
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 underline hover:text-blue-800',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Underline,
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
  editorProps: {
    attributes: {
      class: 'focus:outline-none',
    },
  },
});

// Update editor content when prop changes
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue);
  }
});

// Word count and reading time
const wordCount = computed(() => {
  if (!editor.value) return 0;
  const text = editor.value.getText();
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
});

const readingTime = computed(() => {
  return Math.ceil(wordCount.value / 200); // 200 words per minute
});

// Add link
const addLink = () => {
  const url = window.prompt('Digite a URL:');
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run();
  }
};

// Add image via Cloudinary
const addImage = () => {
  if (typeof window === 'undefined' || !(window as any).cloudinary) {
    alert('Cloudinary não está carregado. Recarregue a página.');
    return;
  }

  const cloudName = 'djzqwht5b';

  (window as any).cloudinary.openUploadWidget(
    {
      cloudName: cloudName,
      uploadPreset: 'ml_default',
      folder: 'inox-link/content',
      multiple: false,
      resourceType: 'image',
      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      maxFileSize: 10000000,
      styles: {
        palette: {
          window: '#FFFFFF',
          windowBorder: '#000000',
          tabIcon: '#000000',
          menuIcons: '#5A616A',
          textDark: '#000000',
          textLight: '#FFFFFF',
          link: '#000000',
          action: '#FF620C',
          inactiveTabIcon: '#0E2F5A',
          error: '#F44235',
          inProgress: '#0078FF',
          complete: '#20B832',
          sourceBg: '#F4F4F5'
        }
      }
    },
    (error: any, result: any) => {
      if (error) {
        console.error('Upload error:', error);

        // Check if it's a preset error
        if (error.message && error.message.includes('preset')) {
          alert(
            '❌ Upload Preset não encontrado!\n\n' +
            'Você precisa criar um Upload Preset no Cloudinary:\n\n' +
            '1. Acesse: https://console.cloudinary.com/settings/upload\n' +
            '2. Clique em "Add upload preset"\n' +
            '3. Nome: ml_default ou unsigned\n' +
            '4. Signing Mode: Unsigned\n' +
            '5. Salve\n\n' +
            'Erro: ' + error.message
          );
        } else {
          alert('Erro ao fazer upload da imagem: ' + (error.message || 'Erro desconhecido'));
        }
        return;
      }

      if (result && result.event === 'success') {
        editor.value?.chain().focus().setImage({ src: result.info.secure_url }).run();
      }
    }
  );
};

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style>
/* TipTap Editor Styles */
.ProseMirror {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.ProseMirror h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.ProseMirror h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.ProseMirror h3 {
  font-size: 1.25em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.ProseMirror ul,
.ProseMirror ol {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1em 0;
}

.ProseMirror a {
  color: #2563eb;
  text-decoration: underline;
}

.ProseMirror a:hover {
  color: #1e40af;
}
</style>
