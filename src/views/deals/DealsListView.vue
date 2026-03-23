<script setup lang="ts">
import { CIcon } from '@coreui/icons-vue'
import { cilGraph, cilPlus, cilPencil, cilBuilding, cilUser, cilCalendar, cilFolderOpen } from '@coreui/icons'
import { useDealStore }    from '@/stores/deal'
import { useCompanyStore } from '@/stores/company'
import { useContactStore } from '@/stores/contact'
import type { Deal } from '@/types'

const dealStore    = useDealStore()
const companyStore = useCompanyStore()
const contactStore = useContactStore()

function getCompanyName(id: number): string {
  return companyStore.companies.find(c => c.id === id)?.name ?? 'N/A'
}

function getContactName(id: number): string {
  const c = contactStore.contacts.find(c => c.id === id)
  return c ? `${c.firstName} ${c.lastName}` : 'N/A'
}

function getBadgeColor(stage: Deal['stage']): string {
  switch (stage) {
    case 'Won':      return 'success'
    case 'Lost':     return 'danger'
    case 'Proposal': return 'info'
    case 'Qualified':return 'warning'
    default:         return 'secondary'
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="container-fluid fade-in p-4">
    <div class="card card-dashboard p-4 shadow-sm">

      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <div class="bg-light p-3 rounded-circle text-purple me-3">
            <CIcon :icon="cilGraph" size="xl" />
          </div>
          <div>
            <h4 class="fw-bold text-dark mb-1">Pipeline de Oportunidades</h4>
            <span class="text-muted small">Seguimiento y gestión de ventas en curso</span>
          </div>
        </div>
        <div>
          <RouterLink to="/deals/new" class="btn btn-purple shadow-sm d-flex align-items-center">
            <CIcon :icon="cilPlus" class="me-2" /> Nueva Oportunidad
          </RouterLink>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover table-custom align-middle mb-0 border-white">
          <thead>
            <tr>
              <th class="border-top-0 py-3 ps-3">Oportunidad</th>
              <th class="border-top-0 py-3">Cliente / Empresa</th>
              <th class="border-top-0 py-3 text-end">Valor Estimado</th>
              <th class="border-top-0 py-3 text-center">Etapa</th>
              <th class="border-top-0 py-3 text-end">Cierre Previsto</th>
              <th class="border-top-0 py-3 text-end pe-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deal in dealStore.deals" :key="deal.id">
              <td class="ps-3 py-3">
                <div class="fw-bold text-dark">{{ deal.name }}</div>
                <div class="small text-muted" v-if="deal.contactId">
                  <CIcon :icon="cilUser" size="sm" class="me-1" /> {{ getContactName(deal.contactId) }}
                </div>
              </td>
              <td>
                <div class="d-flex align-items-center text-secondary">
                  <CIcon :icon="cilBuilding" size="sm" class="me-2 text-purple opacity-50" />
                  <span>{{ getCompanyName(deal.companyId) }}</span>
                </div>
              </td>
              <td class="text-end fw-semibold text-dark">{{ formatCurrency(deal.value) }}</td>
              <td class="text-center">
                <CBadge :color="getBadgeColor(deal.stage)" shape="rounded-pill" class="px-3 py-2 fw-normal">
                  {{ deal.stage }}
                </CBadge>
              </td>
              <td class="text-end text-muted small">
                <div class="d-flex justify-content-end align-items-center">
                  <CIcon :icon="cilCalendar" size="sm" class="me-2" />
                  {{ formatDate(deal.closeDate) }}
                </div>
              </td>
              <td class="text-end pe-3">
                <RouterLink :to="'/deals/edit/' + deal.id" title="Editar" class="btn btn-icon text-info mx-1">
                  <CIcon :icon="cilPencil" />
                </RouterLink>
              </td>
            </tr>
            <tr v-if="dealStore.deals.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">
                <CIcon :icon="cilFolderOpen" size="4xl" class="text-muted opacity-25 mb-3" />
                <p>No hay oportunidades en el pipeline actualmente.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>
