<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-vue-next'
import api from '../services/api'

interface NewsItem {
  id: number;
  title: string;
  published: boolean;
  createdAt: string;
}

const newsList = ref<NewsItem[]>([])
const loading = ref(true)

const fetchNews = async () => {
  try {
    const { data } = await api.get('/news')
    newsList.value = data
  } catch (error) {
    console.error('Erro ao buscar notícias:', error)
  } finally {
    loading.value = false
  }
}

const deleteNews = async (id: number) => {
  if (!confirm('Tem certeza que deseja excluir esta notícia?')) return
  try {
    await api.delete(`/news/${id}`)
    await fetchNews()
  } catch (error) {
    alert('Erro ao excluir notícia')
  }
}

onMounted(fetchNews)
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-3xl font-black tracking-tighter uppercase italic">Notícias</h3>
        <p class="text-neutral-500 font-medium">Gerencie e publique notícias no portal Inox Link.</p>
      </div>
      <RouterLink 
        to="/news/create"
        class="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold text-sm shadow-xl shadow-black/20 hover:scale-105 transition-all active:scale-95"
      >
        <Plus :size="18" />
        Nova Notícia
      </RouterLink>
    </div>

    <!-- ... (Filters code) ... -->

    <!-- Table -->
    <div class="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
      <div v-if="loading" class="p-20 flex flex-col items-center justify-center space-y-4">
        <div class="w-10 h-10 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
        <p class="text-neutral-400 font-bold text-xs uppercase tracking-widest">Carregando Notícias...</p>
      </div>
      
      <table v-else class="w-full text-left border-collapse">
        <!-- ... (Header code) ... -->
        <tbody class="divide-y divide-neutral-100">
          <tr v-for="item in newsList" :key="item.id" class="group hover:bg-neutral-50 transition-colors">
            <td class="px-6 py-5">
              <span class="font-bold text-sm italic group-hover:text-black transition-colors">{{ item.title }}</span>
            </td>
            <td class="px-6 py-5">
              <div class="flex items-center gap-2">
                <span :class="`w-2 h-2 rounded-full ${item.published ? 'bg-green-500' : 'bg-orange-500'}`"></span>
                <span class="text-xs font-bold">{{ item.published ? 'Publicado' : 'Rascunho' }}</span>
              </div>
            </td>
            <td class="px-6 py-5 text-xs font-medium text-neutral-500">
              {{ new Date(item.createdAt).toLocaleDateString('pt-BR') }}
            </td>
            <td class="px-6 py-5">
              <div class="flex items-center justify-end gap-2">
                <RouterLink 
                  :to="`/news/edit/${item.id}`"
                  class="p-2 hover:bg-white rounded-lg transition-colors text-neutral-400 hover:text-black"
                >
                  <Edit :size="18" />
                </RouterLink>
                <button 
                  @click="deleteNews(item.id)"
                  class="p-2 hover:bg-white rounded-lg transition-colors text-neutral-400 hover:text-red-500"
                >
                  <Trash2 :size="18" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="newsList.length === 0">
            <td colspan="4" class="px-6 py-10 text-center text-neutral-400 font-medium italic">
              Nenhuma notícia encontrada. Comece criando uma nova!
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
