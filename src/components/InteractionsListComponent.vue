<script setup lang="ts">
import { computed } from 'vue'
import { useInteractionStore } from '@/stores/interaction'
import { useInteractionTypeStore } from '@/stores/interactiontype'

const props = defineProps<{
  contactId?: number
}>()

const interactionStore = useInteractionStore()
const interactionTypeStore = useInteractionTypeStore()

const interactions = computed(() => {
  const list = props.contactId
    ? interactionStore.getByContactId(props.contactId)
    : interactionStore.sortedByDate
  return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

function getType(id: number) {
  return interactionTypeStore.getById(id)
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <strong>Historial de Interacciones</strong>
    </div>
    <div class="card-body">
      <ul class="list-group list-group-flush" v-if="interactions.length > 0">
        <li class="list-group-item" v-for="item in interactions" :key="item.id">
          <div class="d-flex w-100 justify-content-between">
            <h6 class="mb-1">{{ getType(item.interactionTypeId)?.name }}</h6>
            <small class="text-muted">{{ formatDate(item.date) }}</small>
          </div>
          <p class="mb-1 text-muted">{{ item.notes }}</p>
        </li>
      </ul>
      <div v-else class="text-center text-muted py-3">
        No hay interacciones registradas.
      </div>
    </div>
  </div>
</template>
