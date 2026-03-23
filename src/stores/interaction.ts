import { defineStore } from 'pinia'
import type { Interaction } from '@/types'

export const useInteractionStore = defineStore('interaction', {
  state: (): { interactions: Interaction[] } => ({
    interactions: [
      { id: 1, interactionTypeId: 3, notes: 'Reunión inicial para discutir la renovación.',    date: '2025-11-10', dealId: 1, contactId: 1 },
      { id: 2, interactionTypeId: 1, notes: 'Llamada de seguimiento sobre la propuesta.',      date: '2025-11-12', dealId: 1, contactId: 1 },
      { id: 3, interactionTypeId: 2, notes: 'Correo de calificación enviado al cliente.',      date: '2025-11-05', contactId: 2 }
    ]
  }),
  getters: {
    getByContactId: (state) => (contactId: number) =>
      state.interactions.filter(i => i.contactId === contactId),
    getByDealId: (state) => (dealId: number) =>
      state.interactions.filter(i => i.dealId === dealId),
    sortedByDate: (state) =>
      [...state.interactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  actions: {
    add(data: Omit<Interaction, 'id'>): Interaction {
      const newId = this.interactions.length > 0 ? Math.max(...this.interactions.map(i => i.id)) + 1 : 1
      const interaction = { id: newId, ...data }
      this.interactions.push(interaction)
      return interaction
    }
  }
})
