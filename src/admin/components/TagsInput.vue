<template>
  <div class="space-y-2">
    <label class="text-[10px] font-black uppercase tracking-widest text-neutral-400">
      Tags
    </label>
    <div class="flex flex-wrap gap-2 mb-2" v-if="modelValue && modelValue.length > 0">
      <span
        v-for="(tag, index) in modelValue"
        :key="index"
        class="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full text-sm font-medium"
      >
        {{ tag }}
        <button
          type="button"
          @click="removeTag(index)"
          class="hover:bg-white/20 rounded-full p-0.5 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </span>
    </div>
    <div class="flex gap-2">
      <input
        v-model="newTag"
        @keydown.enter.prevent="addTag"
        @keydown.comma.prevent="addTag"
        type="text"
        placeholder="Digite uma tag e pressione Enter"
        class="flex-1 px-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-sm"
      />
      <button
        type="button"
        @click="addTag"
        class="px-4 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-neutral-800 transition-colors"
      >
        Adicionar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
});

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const newTag = ref('');

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !props.modelValue.includes(tag)) {
    emit('update:modelValue', [...props.modelValue, tag]);
    newTag.value = '';
  }
};

const removeTag = (index: number) => {
  const updatedTags = [...props.modelValue];
  updatedTags.splice(index, 1);
  emit('update:modelValue', updatedTags);
};
</script>
