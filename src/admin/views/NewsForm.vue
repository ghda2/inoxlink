<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Save, ArrowLeft, Loader2, Lock, Unlock } from 'lucide-vue-next'
import slugify from 'slugify'
import api from '../services/api'
import TipTapEditor from '../components/TipTapEditor.vue'
import ImageUpload from '../components/ImageUpload.vue'
import TagsInput from '../components/TagsInput.vue'
import SEOFields from '../components/SEOFields.vue'

const router = useRouter()
const route = useRoute()
const isEditing = route.params.id !== undefined

const form = ref({
  // Basic fields
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  published: false,

  // Images
  imageUrl: '',
  imageAlt: '',
  capaNova: null,
  ogImage: '',

  // SEO
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  twitterCard: 'summary_large_image',

  // Organization
  categoryId: null,
  authorId: null,
  tags: [],
  featuredLevel: 0,
  readingTime: 0
})

const categories = ref([])
const authors = ref([])
const loading = ref(false)
const saving = ref(false)
const slugManuallyEdited = ref(false)

// SEO fields grouped for the component
const seoFields = computed({
  get: () => ({
    metaTitle: form.value.metaTitle,
    metaDescription: form.value.metaDescription,
    keywords: form.value.keywords,
    canonicalUrl: form.value.canonicalUrl,
    ogTitle: form.value.ogTitle,
    ogDescription: form.value.ogDescription,
    ogImage: form.value.ogImage,
    twitterCard: form.value.twitterCard
  }),
  set: (value) => {
    Object.assign(form.value, value)
  }
})

const fetchOptions = async () => {
  try {
    const [categoriesRes, authorsRes] = await Promise.all([
      api.get('/categories'),
      api.get('/authors')
    ])
    categories.value = categoriesRes.data
    authors.value = authorsRes.data
  } catch (error) {
    console.error('Error loading options:', error)
  }
}

const fetchItem = async () => {
  if (!isEditing) return
  loading.value = true
  try {
    const { data } = await api.get(`/news/${route.params.id}`)
    form.value = {
      title: data.title || '',
      slug: data.slug || '',
      excerpt: data.excerpt || '',
      content: data.content || '',
      published: data.published || false,
      imageUrl: data.imageUrl || '',
      imageAlt: data.imageAlt || '',
      capaNova: data.capaNova || null,
      ogImage: data.ogImage || '',
      metaTitle: data.metaTitle || '',
      metaDescription: data.metaDescription || '',
      keywords: data.keywords || '',
      canonicalUrl: data.canonicalUrl || '',
      ogTitle: data.ogTitle || '',
      ogDescription: data.ogDescription || '',
      twitterCard: data.twitterCard || 'summary_large_image',
      categoryId: data.categoryId || null,
      authorId: data.authorId || null,
      tags: data.tags || [],
      featuredLevel: data.featuredLevel || 0,
      readingTime: data.readingTime || 0
    }
  } catch (error) {
    alert('Erro ao carregar notícia')
    router.push('/news')
  } finally {
    loading.value = false
  }
}

const autoSlug = () => {
  if (slugManuallyEdited.value || isEditing) return
  form.value.slug = slugify(form.value.title, {
    lower: true,
    strict: true,
    locale: 'pt'
  })
}

const toggleSlugLock = () => {
  slugManuallyEdited.value = !slugManuallyEdited.value
  if (!slugManuallyEdited.value) {
    autoSlug()
  }
}

const calculateReadingTime = () => {
  const text = form.value.content.replace(/<[^>]*>/g, '')
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length
  form.value.readingTime = Math.ceil(words / 200)
}

watch(() => form.value.content, calculateReadingTime)

const save = async () => {
  if (!form.value.title.trim()) {
    alert('Título é obrigatório')
    return
  }
  if (!form.value.slug.trim()) {
    alert('Slug é obrigatório')
    return
  }

  saving.value = true
  calculateReadingTime()

  try {
    const now = new Date().toISOString()
    const payload = {
      ...form.value,
      updatedAt: now,
      publishedAt: form.value.published ? (form.value.publishedAt || now) : null
    }

    if (isEditing) {
      await api.patch(`/news/${route.params.id}`, payload)
    } else {
      await api.post('/news', payload)
    }

    router.push('/news')
  } catch (error: any) {
    alert('Erro ao salvar: ' + (error.response?.data?.error || error.message))
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchOptions()
  fetchItem()
})
</script>

<template>
  <div class="space-y-8 max-w-5xl mx-auto pb-10">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="p-2 hover:bg-neutral-100 rounded-full transition-colors">
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h3 class="text-3xl font-black tracking-tighter uppercase italic">
            {{ isEditing ? 'Editar Notícia' : 'Nova Notícia' }}
          </h3>
          <p class="text-neutral-500 font-medium">Preencha os campos abaixo para publicar.</p>
        </div>
      </div>
      <button
        @click="save"
        :disabled="saving"
        class="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-bold text-sm shadow-xl shadow-black/20 hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
      >
        <Loader2 v-if="saving" class="animate-spin" :size="18" />
        <Save v-else :size="18" />
        {{ saving ? 'Salvando...' : 'Salvar Notícia' }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-20 flex justify-center">
      <Loader2 class="animate-spin text-neutral-300" :size="48" />
    </div>

    <!-- Form -->
    <div v-else class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
        <h4 class="text-xs font-black uppercase tracking-widest text-neutral-600">Informações Básicas</h4>

        <!-- Title -->
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">Título da Notícia</label>
          <input
            v-model="form.title"
            @input="autoSlug"
            type="text"
            placeholder="Ex: O futuro do aço inox..."
            class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-bold text-lg"
          >
        </div>

        <!-- Slug with Lock -->
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">Slug (URL)</label>
          <div class="flex gap-2">
            <input
              v-model="form.slug"
              type="text"
              placeholder="o-futuro-do-aco-inox"
              :disabled="!isEditing && !slugManuallyEdited"
              class="flex-1 px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm text-neutral-500 disabled:opacity-50"
            >
            <button
              v-if="!isEditing"
              type="button"
              @click="toggleSlugLock"
              class="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
              :title="slugManuallyEdited ? 'Desbloquear (auto-gerar)' : 'Bloquear (edição manual)'"
            >
              <Lock v-if="!slugManuallyEdited" :size="18" />
              <Unlock v-else :size="18" />
            </button>
          </div>
        </div>

        <!-- Excerpt -->
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">Resumo (Excerpt)</label>
          <textarea
            v-model="form.excerpt"
            rows="3"
            placeholder="Uma breve descrição para a listagem..."
            class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
          ></textarea>
        </div>
      </div>

      <!-- Featured Image -->
      <div class="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
        <h4 class="text-xs font-black uppercase tracking-widest text-neutral-600 mb-6">Imagem Destaque</h4>
        <ImageUpload
          v-model="form.imageUrl"
          v-model:altValue="form.imageAlt"
          label="Imagem Principal"
          folder="inox-link/news"
          :showAlt="true"
        />
      </div>

      <!-- Content Editor -->
      <div class="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
        <h4 class="text-xs font-black uppercase tracking-widest text-neutral-600 mb-6">Conteúdo</h4>
        <TipTapEditor
          v-model="form.content"
          placeholder="Escreva o conteúdo da notícia aqui..."
        />
      </div>

      <!-- Organization -->
      <div class="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
        <h4 class="text-xs font-black uppercase tracking-widest text-neutral-600">Organização</h4>

        <div class="grid grid-cols-2 gap-4">
          <!-- Category -->
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">Categoria</label>
            <select
              v-model="form.categoryId"
              class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
            >
              <option :value="null">Selecione uma categoria</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Author -->
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">Autor</label>
            <select
              v-model="form.authorId"
              class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
            >
              <option :value="null">Selecione um autor</option>
              <option v-for="author in authors" :key="author.id" :value="author.id">
                {{ author.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Tags -->
        <TagsInput v-model="form.tags" />

        <!-- Featured Level -->
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">Nível de Destaque</label>
          <input
            v-model.number="form.featuredLevel"
            type="number"
            min="0"
            max="3"
            placeholder="0 = Normal, 1-3 = Níveis de destaque"
            class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
          />
          <p class="text-xs text-neutral-500">0 = Normal, 1 = Destaque baixo, 2 = Destaque médio, 3 = Destaque alto</p>
        </div>
      </div>

      <!-- SEO -->
      <SEOFields
        v-model="seoFields"
        :mainTitle="form.title"
        :mainExcerpt="form.excerpt"
      />

      <!-- Additional Images -->
      <details class="bg-white border border-neutral-200 rounded-3xl overflow-hidden">
        <summary class="px-6 py-4 cursor-pointer font-black uppercase text-xs tracking-widest text-neutral-600 hover:bg-neutral-50 transition-colors">
          Imagens Adicionais
        </summary>
        <div class="px-6 pb-6">
          <ImageUpload
            v-model="form.capaNova"
            label="Capa Nova"
            folder="inox-link/capa"
            :showAlt="false"
          />
        </div>
      </details>

      <!-- Publish Settings -->
      <div class="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
        <h4 class="text-xs font-black uppercase tracking-widest text-neutral-600 mb-6">Publicação</h4>
        <div class="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl">
          <input
            v-model="form.published"
            type="checkbox"
            id="published"
            class="w-5 h-5 accent-black cursor-pointer"
          >
          <label for="published" class="font-bold text-sm cursor-pointer select-none">Publicar imediatamente</label>
        </div>
      </div>
    </div>
  </div>
</template>
