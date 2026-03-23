import { defineStore } from 'pinia'
import type { Company } from '@/types'

export const useCompanyStore = defineStore('company', {
  state: (): { companies: Company[] } => ({
    companies: [
      { id: 1, name: 'Innovatech Solutions', industryTypeId: 1, address: '123 Tech Ave', phone: '555-0101', website: 'innovatech.com' },
      { id: 2, name: 'SecureBank Corp',      industryTypeId: 2, address: '456 Finance Blvd', phone: '555-0102', website: 'securebank.com' },
      { id: 3, name: 'HealthWell Group',     industryTypeId: 3, address: '789 Wellness Rd',  phone: '555-0103', website: 'healthwell.com' }
    ]
  }),
  getters: {
    getById: (state) => (id: number) => state.companies.find(c => c.id === id)
  },
  actions: {
    add(data: Omit<Company, 'id'>): Company {
      const newId = this.companies.length > 0 ? Math.max(...this.companies.map(c => c.id)) + 1 : 1
      const company = { id: newId, ...data }
      this.companies.push(company)
      return company
    },
    update(updated: Company): Company {
      const i = this.companies.findIndex(c => c.id === updated.id)
      if (i !== -1) this.companies[i] = updated
      return updated
    },
    remove(id: number) {
      this.companies = this.companies.filter(c => c.id !== id)
    }
  }
})
