<template>
  <details class="bg-white border border-neutral-200 rounded-3xl overflow-hidden" open>
    <summary class="px-6 py-4 cursor-pointer font-black uppercase text-xs tracking-widest text-neutral-600 hover:bg-neutral-50 transition-colors">
      SEO e Redes Sociais
    </summary>

    <div class="px-6 pb-6 space-y-4">
      <!-- Auto-fill Button -->
      <button
        type="button"
        @click="autoFill"
        class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg font-bold text-sm transition-colors"
      >
        Auto-preencher com título e resumo
      </button>

      <!-- Meta Title -->
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex justify-between">
          <span>Meta Título</span>
          <span :class="{ 'text-red-500': metaTitleLength > 60 }">
            {{ metaTitleLength }}/60
          </span>
        </label>
        <input
          :value="localValue.metaTitle"
          @input="updateField('metaTitle', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Título otimizado para SEO (máx 60 caracteres)"
          class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
        />
      </div>

      <!-- Meta Description -->
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex justify-between">
          <span>Meta Descrição</span>
          <span :class="{ 'text-red-500': metaDescriptionLength > 160 }">
            {{ metaDescriptionLength }}/160
          </span>
        </label>
        <textarea
          :value="localValue.metaDescription"
          @input="updateField('metaDescription', ($event.target as HTMLInputElement).value)"
          rows="3"
          placeholder="Descrição para motores de busca (máx 160 caracteres)"
          class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
        ></textarea>
      </div>

      <!-- Keywords -->
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          Palavras-chave
        </label>
        <input
          :value="localValue.keywords"
          @input="updateField('keywords', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="palavras, separadas, por, vírgulas"
          class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
        />
      </div>

      <!-- Canonical URL -->
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          URL Canônica
        </label>
        <input
          :value="localValue.canonicalUrl"
          @input="updateField('canonicalUrl', ($event.target as HTMLInputElement).value)"
          type="url"
          placeholder="https://exemplo.com/pagina-original"
          class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
        />
      </div>

      <hr class="border-neutral-200 my-6" />

      <!-- Open Graph Title -->
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          Open Graph - Título
        </label>
        <input
          :value="localValue.ogTitle"
          @input="updateField('ogTitle', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Título para redes sociais (Facebook, LinkedIn)"
          class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
        />
      </div>

      <!-- Open Graph Description -->
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          Open Graph - Descrição
        </label>
        <textarea
          :value="localValue.ogDescription"
          @input="updateField('ogDescription', ($event.target as HTMLInputElement).value)"
          rows="2"
          placeholder="Descrição para redes sociais"
          class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
        ></textarea>
      </div>

      <!-- Open Graph Image -->
      <ImageUpload
        :modelValue="localValue.ogImage"
        @update:modelValue="updateField('ogImage', $event)"
        label="Open Graph - Imagem"
        folder="inox-link/og-images"
        :showAlt="false"
      />

      <hr class="border-neutral-200 my-6" />

      <!-- Twitter Card -->
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          Twitter Card
        </label>
        <select
          :value="localValue.twitterCard"
          @change="updateField('twitterCard', ($event.target as HTMLSelectElement).value)"
          class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
        >
          <option value="summary">Summary</option>
          <option value="summary_large_image">Summary Large Image</option>
          <option value="app">App</option>
          <option value="player">Player</option>
        </select>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ImageUpload from './ImageUpload.vue';

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
}

interface Props {
  modelValue: SEOData;
  mainTitle?: string;
  mainExcerpt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mainTitle: '',
  mainExcerpt: ''
});

const emit = defineEmits<{
  'update:modelValue': [value: SEOData];
}>();

const localValue = computed(() => props.modelValue);

const updateField = (field: keyof SEOData, value: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  });
};

// Character counters
const metaTitleLength = computed(() => (localValue.value.metaTitle || '').length);
const metaDescriptionLength = computed(() => (localValue.value.metaDescription || '').length);

// Auto-fill from main content
const autoFill = () => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  emit('update:modelValue', {
    ...props.modelValue,
    metaTitle: props.mainTitle ? truncateText(props.mainTitle, 60) : localValue.value.metaTitle,
    metaDescription: props.mainExcerpt ? truncateText(props.mainExcerpt, 160) : localValue.value.metaDescription,
    ogTitle: props.mainTitle || localValue.value.ogTitle,
    ogDescription: props.mainExcerpt || localValue.value.ogDescription
  });
};
</script>
