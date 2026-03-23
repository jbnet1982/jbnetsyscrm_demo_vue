import { defineStore } from 'pinia'
import type { IndustryType } from '@/types'

export const useIndustryTypeStore = defineStore('industrytype', {
  state: (): { industryTypes: IndustryType[] } => ({
    industryTypes: [
      { id: 1, name: 'Tecnología' },
      { id: 2, name: 'Finanzas' },
      { id: 3, name: 'Salud' },
      { id: 4, name: 'Comercio Minorista' },
      { id: 5, name: 'Educación' }
    ]
  }),
  getters: {
    getNameById: (state) => (id: number) => state.industryTypes.find(t => t.id === id)?.name ?? 'N/A'
  }
})
