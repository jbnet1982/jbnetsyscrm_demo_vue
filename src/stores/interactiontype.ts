import { defineStore } from 'pinia'
import type { InteractionType } from '@/types'

export const useInteractionTypeStore = defineStore('interactiontype', {
  state: (): { interactionTypes: InteractionType[] } => ({
    interactionTypes: [
      { id: 1, name: 'Llamada',           icon: 'cil-phone' },
      { id: 2, name: 'Correo Electrónico', icon: 'cil-envelope-closed' },
      { id: 3, name: 'Reunión',           icon: 'cil-people' }
    ]
  }),
  getters: {
    getById: (state) => (id: number) => state.interactionTypes.find(t => t.id === id)
  }
})
