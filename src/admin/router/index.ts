import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory('/admin'),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('../views/Dashboard.vue')
        },
        {
            path: '/news',
            name: 'news',
            component: () => import('../views/NewsList.vue')
        },
        {
            path: '/news/create',
            name: 'news-create',
            component: () => import('../views/NewsForm.vue')
        },
        {
            path: '/news/edit/:id',
            name: 'news-edit',
            component: () => import('../views/NewsForm.vue')
        },
        {
            path: '/wiki',
            name: 'wiki',
            component: () => import('../views/WikiList.vue')
        },
        {
            path: '/authors',
            name: 'authors',
            component: () => import('../views/AuthorList.vue')
        }
    ]
})

export default router
