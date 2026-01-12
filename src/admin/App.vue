<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { LayoutDashboard, Newspaper, BookOpen, Users, LogOut, Link2 } from 'lucide-vue-next'
import router from './router'
import { getCurrentInstance } from 'vue'

const app = getCurrentInstance()?.appContext.app
if (app && !app.config.globalProperties.$router) {
  app.use(router)
}
</script>

<template>
  <div class="flex h-screen bg-neutral-50 text-neutral-900 font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-neutral-200 flex flex-col">
      <div class="p-6 border-b border-neutral-100 flex items-center gap-3">
        <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <span class="text-white font-black text-lg italic">IL</span>
        </div>
        <h1 class="font-black tracking-tighter text-xl uppercase italic">Inox Link</h1>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <RouterLink 
          to="/" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-neutral-100 group"
          active-class="bg-black text-white shadow-lg shadow-black/10 hover:bg-black/90"
        >
          <LayoutDashboard :size="20" />
          <span class="font-bold text-sm">Dashboard</span>
        </RouterLink>

        <RouterLink 
          to="/news" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-neutral-100"
          active-class="bg-black text-white shadow-lg shadow-black/10 hover:bg-black/90"
        >
          <Newspaper :size="20" />
          <span class="font-bold text-sm">Notícias</span>
        </RouterLink>

        <RouterLink 
          to="/wiki" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-neutral-100"
          active-class="bg-black text-white shadow-lg shadow-black/10 hover:bg-black/90"
        >
          <BookOpen :size="20" />
          <span class="font-bold text-sm">Wiki</span>
        </RouterLink>

        <RouterLink 
          to="/authors" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-neutral-100"
          active-class="bg-black text-white shadow-lg shadow-black/10 hover:bg-black/90"
        >
          <Users :size="20" />
          <span class="font-bold text-sm">Autores</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-neutral-100 space-y-2">
        <a href="/" target="_blank" class="flex items-center gap-3 px-4 py-3 text-neutral-500 hover:text-black transition-colors">
          <Link2 :size="20" />
          <span class="font-bold text-sm">Ver Site</span>
        </a>
        <button class="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
          <LogOut :size="20" />
          <span class="font-bold text-sm">Sair</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <header class="h-16 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-neutral-200 px-8 flex items-center justify-between">
        <h2 class="font-black text-sm uppercase tracking-widest text-neutral-400">Painel de Controle</h2>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm font-bold leading-none">Gabriel Santos</p>
            <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">Administrador</p>
          </div>
          <div class="w-10 h-10 bg-neutral-200 rounded-full overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Gabriel+Santos" alt="Avatar">
          </div>
        </div>
      </header>

      <div class="p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
