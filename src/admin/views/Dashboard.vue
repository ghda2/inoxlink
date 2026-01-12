<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Newspaper, BookOpen, Users, TrendingUp } from 'lucide-vue-next'
import api from '../services/api'

const statsData = ref({ news: 0, wiki: 0, authors: 0, views: '0' })
const loading = ref(true)

const fetchStats = async () => {
  try {
    const { data } = await api.get('/stats')
    statsData.value = data
  } catch (error) {
    console.error('Erro ao buscar stats:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>

<template>
  <div class="space-y-12">
    <div>
      <h3 class="text-3xl font-black tracking-tighter uppercase italic">Resumo Geral</h3>
      <p class="text-neutral-500 font-medium">Bem-vindo de volta, Gabriel. Aqui está o status do Inox Link hoje.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Notícias -->
      <div class="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div class="flex items-start justify-between">
          <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Newspaper :size="24" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest">Notícias</p>
          <p class="text-3xl font-black tracking-tight mt-1">{{ statsData.news }}</p>
        </div>
      </div>

      <!-- Wiki -->
      <div class="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div class="flex items-start justify-between">
          <div class="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <BookOpen :size="24" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest">Wiki</p>
          <p class="text-3xl font-black tracking-tight mt-1">{{ statsData.wiki }}</p>
        </div>
      </div>

      <!-- Autores -->
      <div class="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div class="flex items-start justify-between">
          <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Users :size="24" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest">Autores</p>
          <p class="text-3xl font-black tracking-tight mt-1">{{ statsData.authors }}</p>
        </div>
      </div>

      <!-- Views -->
      <div class="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div class="flex items-start justify-between">
          <div class="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
            <TrendingUp :size="24" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest">Visualizações</p>
          <p class="text-3xl font-black tracking-tight mt-1">{{ statsData.views }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-3xl border border-neutral-200 p-8 space-y-6">
        <h4 class="font-black tracking-tighter text-xl uppercase italic">Últimas Notícias</h4>
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100">
            <div class="w-16 h-16 bg-neutral-100 rounded-xl overflow-hidden grayscale">
               <div class="w-full h-full bg-neutral-200 animate-pulse"></div>
            </div>
            <div class="flex-1">
              <p class="font-bold text-sm line-clamp-1 italic">Lançamento da nova liga AISI 316L High-Chrome</p>
              <p class="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">Postado há 2 horas</p>
            </div>
            <button class="text-xs font-bold px-4 py-2 bg-neutral-100 rounded-full hover:bg-black hover:text-white transition-all">Editar</button>
          </div>
        </div>
      </div>

      <div class="bg-black text-white rounded-3xl p-10 relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
           <TrendingUp :size="200" />
        </div>
        <div class="relative z-10 space-y-6">
          <span class="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase italic border border-white/20">Dica Pró</span>
          <h4 class="text-3xl font-black tracking-tighter italic leading-tight">MANTENHA A WIKI ATUALIZADA</h4>
          <p class="text-neutral-400 font-medium leading-relaxed">Artigos técnicos aumentam a autoridade do seu site e melhoram drasticamente o SEO no Google.</p>
          <button class="px-8 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-neutral-200 transition-all">Novo Artigo Wiki</button>
        </div>
      </div>
    </div>
  </div>
</template>
