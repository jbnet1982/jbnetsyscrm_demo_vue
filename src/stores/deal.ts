import { defineStore } from 'pinia'
import type { Deal } from '@/types'

export const useDealStore = defineStore('deal', {
  state: (): { deals: Deal[] } => ({
    deals: [
      { id: 1, name: 'Renovación de Licencia Innovatech',    stage: 'Proposal',  value: 15000, closeDate: '2025-12-15', contactId: 1, companyId: 1 },
      { id: 2, name: 'Consultoría Financiera SecureBank',    stage: 'Qualified', value: 25000, closeDate: '2026-01-20', contactId: 2, companyId: 2 },
      { id: 3, name: 'Equipamiento Médico para HealthWell', stage: 'Lead',      value: 75000, closeDate: '2026-02-10', contactId: 3, companyId: 3 }
    ]
  }),
  getters: {
    getById: (state) => (id: number) => state.deals.find(d => d.id === id),
    getByCompanyId: (state) => (companyId: number) => state.deals.filter(d => d.companyId === companyId),
    activeDeals: (state) => state.deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost')
  },
  actions: {
    add(data: Omit<Deal, 'id'>): Deal {
      const newId = this.deals.length > 0 ? Math.max(...this.deals.map(d => d.id)) + 1 : 1
      const deal = { id: newId, ...data }
      this.deals.push(deal)
      return deal
    },
    update(updated: Deal): Deal {
      const i = this.deals.findIndex(d => d.id === updated.id)
      if (i !== -1) this.deals[i] = updated
      return updated
    },
    updateStage(dealId: number, newStage: Deal['stage']) {
      const deal = this.deals.find(d => d.id === dealId)
      if (deal) deal.stage = newStage
    }
  }
})
