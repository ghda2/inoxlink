<template>
  <div class="space-y-2">
    <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">
      {{ label }}
    </label>

    <!-- Image Preview -->
    <div v-if="modelValue" class="relative group">
      <img
        :src="modelValue"
        :alt="altValue || 'Preview'"
        class="w-full h-64 object-cover rounded-xl border-2 border-neutral-200"
      />
      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
        <button
          type="button"
          @click="openUploadWidget"
          class="px-4 py-2 bg-white text-black rounded-lg font-bold text-sm hover:bg-neutral-100 transition-colors"
        >
          Trocar Imagem
        </button>
        <button
          type="button"
          @click="removeImage"
          class="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-colors"
        >
          Remover
        </button>
      </div>
    </div>

    <!-- Upload Button (when no image) -->
    <button
      v-else
      type="button"
      @click="openUploadWidget"
      :disabled="uploading"
      class="w-full h-64 border-2 border-dashed border-neutral-300 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors flex flex-col items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg v-if="!uploading" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-400">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
      <div v-else class="animate-spin rounded-full h-12 w-12 border-4 border-neutral-300 border-t-black"></div>
      <span class="text-sm font-bold text-neutral-600">
        {{ uploading ? 'Enviando...' : 'Clique para fazer upload' }}
      </span>
    </button>

    <!-- Alt Text Input (optional, only show if showAlt is true) -->
    <input
      v-if="showAlt && modelValue"
      :value="altValue"
      @input="$emit('update:altValue', ($event.target as HTMLInputElement).value)"
      type="text"
      placeholder="Texto alternativo da imagem (alt)"
      class="w-full px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue?: string | null;
  altValue?: string;
  label?: string;
  folder?: string;
  showAlt?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  altValue: '',
  label: 'Imagem',
  folder: 'inox-link',
  showAlt: true
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:altValue': [value: string];
}>();

const uploading = ref(false);

const openUploadWidget = () => {
  // Check if Cloudinary widget is loaded
  if (typeof window === 'undefined' || !(window as any).cloudinary) {
    alert('Cloudinary não está carregado. Recarregue a página.');
    return;
  }

  const cloudName = 'djzqwht5b'; // From your .env

  uploading.value = true;

  // Try multiple preset names (unsigned presets that commonly exist)
  const possiblePresets = ['ml_default', 'unsigned', 'inox_link_unsigned'];
  let uploadConfig: any = {
    cloudName: cloudName,
    folder: props.folder,
    multiple: false,
    resourceType: 'image',
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    maxFileSize: 10000000, // 10MB
    cropping: true,
    croppingAspectRatio: 16 / 9,
    showSkipCropButton: true,
    sources: ['local', 'url', 'camera'],
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
  };

  // Check if upload preset is available in localStorage or use first preset
  const savedPreset = localStorage.getItem('cloudinary_upload_preset');
  if (savedPreset) {
    uploadConfig.uploadPreset = savedPreset;
  } else {
    // Try first preset, if it fails the error handler will show instructions
    uploadConfig.uploadPreset = possiblePresets[0];
  }

  (window as any).cloudinary.openUploadWidget(
    uploadConfig,
    (error: any, result: any) => {
      uploading.value = false;

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
        emit('update:modelValue', result.info.secure_url);
      }
    }
  );
};

const removeImage = () => {
  emit('update:modelValue', '');
  emit('update:altValue', '');
};
</script>
