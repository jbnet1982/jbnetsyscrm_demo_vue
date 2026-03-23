import { defineStore } from 'pinia'
import type { Contact } from '@/types'

export const useContactStore = defineStore('contact', {
  state: (): { contacts: Contact[] } => ({
    contacts: [
      { id: 1, firstName: 'Ana',   lastName: 'García',    email: 'ana.garcia@innovatech.com',  phone: '310-555-0104', companyId: 1 },
      { id: 2, firstName: 'Juan',  lastName: 'Martinez',  email: 'juan.martinez@securebank.com', phone: '310-555-0105', companyId: 2 },
      { id: 3, firstName: 'Lucía', lastName: 'Hernández', email: 'lucia.h@healthwell.com',       phone: '310-555-0106', companyId: 3 }
    ]
  }),
  getters: {
    getById: (state) => (id: number) => state.contacts.find(c => c.id === id),
    getByCompanyId: (state) => (companyId: number) => state.contacts.filter(c => c.companyId === companyId)
  },
  actions: {
    add(data: Omit<Contact, 'id'>): Contact {
      const newId = this.contacts.length > 0 ? Math.max(...this.contacts.map(c => c.id)) + 1 : 1
      const contact = { id: newId, ...data }
      this.contacts.push(contact)
      return contact
    },
    update(updated: Contact): Contact {
      const i = this.contacts.findIndex(c => c.id === updated.id)
      if (i !== -1) this.contacts[i] = updated
      return updated
    },
    remove(id: number) {
      this.contacts = this.contacts.filter(c => c.id !== id)
    }
  }
})
