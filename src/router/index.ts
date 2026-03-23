import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/dashboard',
      component: () => import('@/views/DashboardView.vue')
    },
    {
      path: '/companies',
      component: () => import('@/views/companies/CompaniesListView.vue')
    },
    {
      path: '/companies/new',
      component: () => import('@/views/companies/CompanyFormView.vue')
    },
    {
      path: '/companies/edit/:id',
      component: () => import('@/views/companies/CompanyFormView.vue')
    },
    {
      path: '/contacts',
      component: () => import('@/views/contacts/ContactsListView.vue')
    },
    {
      path: '/contacts/new',
      component: () => import('@/views/contacts/ContactFormView.vue')
    },
    {
      path: '/contacts/edit/:id',
      component: () => import('@/views/contacts/ContactFormView.vue')
    },
    {
      path: '/deals',
      component: () => import('@/views/deals/DealsListView.vue')
    },
    {
      path: '/deals/new',
      component: () => import('@/views/deals/DealFormView.vue')
    },
    {
      path: '/deals/edit/:id',
      component: () => import('@/views/deals/DealFormView.vue')
    },
    {
      path: '/interactions',
      component: () => import('@/views/interactions/InteractionsView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

export default router
