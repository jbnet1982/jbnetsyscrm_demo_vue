<script setup lang="ts">
import { CIcon } from '@coreui/icons-vue'
import { cilList } from '@coreui/icons'
import { useInteractionStore }     from '@/stores/interaction'
import { useInteractionTypeStore } from '@/stores/interactiontype'
import { useContactStore }         from '@/stores/contact'

const interactionStore     = useInteractionStore()
const interactionTypeStore = useInteractionTypeStore()
const contactStore         = useContactStore()

function getTypeName(id: number): string {
  return interactionTypeStore.getById(id)?.name ?? 'N/A'
}

function getContactName(id: number): string {
  const c = contactStore.contacts.find(c => c.id === id)
  return c ? `${c.firstName} ${c.lastName}` : 'N/A'
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="container-fluid fade-in p-4">
    <div class="card card-dashboard p-4 shadow-sm">

      <div class="d-flex align-items-center mb-4">
        <div class="bg-light p-3 rounded-circle text-purple me-3">
          <CIcon :icon="cilList" size="xl" />
        </div>
        <div>
          <h4 class="fw-bold text-dark mb-1">Historial de Interacciones</h4>
          <span class="text-muted small">Todas las actividades registradas en el sistema</span>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover table-custom align-middle mb-0 border-white">
          <thead>
            <tr>
              <th class="border-top-0 py-3 ps-3">Tipo</th>
              <th class="border-top-0 py-3">Contacto</th>
              <th class="border-top-0 py-3">Notas</th>
              <th class="border-top-0 py-3 text-end pe-4">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in interactionStore.sortedByDate" :key="item.id">
              <td class="ps-3 py-3">
                <span class="badge bg-light text-secondary border">{{ getTypeName(item.interactionTypeId) }}</span>
              </td>
              <td class="text-dark fw-medium">{{ getContactName(item.contactId) }}</td>
              <td class="text-muted small">{{ item.notes }}</td>
              <td class="text-end pe-3 text-muted small">{{ formatDate(item.date) }}</td>
            </tr>
            <tr v-if="interactionStore.interactions.length === 0">
              <td colspan="4" class="text-center py-5 text-muted">No hay interacciones registradas.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>
