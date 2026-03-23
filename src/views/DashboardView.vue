<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CIcon } from '@coreui/icons-vue'
import {
  cilBuilding, cilPeople, cilGraph, cilDollar,
  cilList, cilArrowRight, cilDescription, cilInfo
} from '@coreui/icons'

import { useCompanyStore }     from '@/stores/company'
import { useContactStore }     from '@/stores/contact'
import { useDealStore }        from '@/stores/deal'
import { useInteractionStore } from '@/stores/interaction'

import InteractionFormComponent from '@/components/InteractionFormComponent.vue'
import type { Interaction } from '@/types'

const companyStore     = useCompanyStore()
const contactStore     = useContactStore()
const dealStore        = useDealStore()
const interactionStore = useInteractionStore()

// --- KPIs ---
const companyCount     = computed(() => companyStore.companies.length)
const contactCount     = computed(() => contactStore.contacts.length)
const activeDealsCount = computed(() => dealStore.activeDeals.length)
const activeDealsValue = computed(() =>
  dealStore.activeDeals.reduce((sum, d) => sum + (d.value || 0), 0)
)

// --- Actividad reciente ---
const recentInteractions = ref<Interaction[]>([])

onMounted(() => {
  recentInteractions.value = interactionStore.sortedByDate.slice(0, 5)
})

// --- Modal ---
const visibleModal     = ref(false)
const selectedContactId = ref<number | null>(null)

function toggleModal() {
  visibleModal.value = !visibleModal.value
  if (!visibleModal.value) selectedContactId.value = null
}

function onInteractionSaved(newInteraction: Interaction) {
  visibleModal.value = false
  selectedContactId.value = null
  recentInteractions.value.unshift(newInteraction)
  if (recentInteractions.value.length > 5) {
    recentInteractions.value = recentInteractions.value.slice(0, 5)
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function formatShortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('es')
}
</script>

<template>
  <div class="container-fluid p-4 fade-in">

    <!-- HEADER -->
    <div class="mb-5 text-center">
      <div class="d-inline-block p-3 rounded-circle bg-white shadow-sm mb-3">
        <CIcon :icon="cilBuilding" size="3xl" class="text-purple" />
      </div>
      <h2 class="fw-bold text-dark">Panel de Control CRM</h2>
      <p class="text-muted">Bienvenido al sistema de gestión de JBNetsys</p>
    </div>

    <!-- KPI CARDS -->
    <div class="row mb-5">
      <div class="col-sm-6 col-xl-3">
        <div class="card card-metric bg-gradient-blue h-100 p-3 shadow">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="text-white opacity-75 small fw-bold text-uppercase">Empresas</div>
            <CIcon :icon="cilBuilding" size="xl" class="text-white opacity-50" />
          </div>
          <div class="h2 mb-3 fw-bold">{{ companyCount }}</div>
          <div class="mt-auto">
            <RouterLink to="/companies" class="btn btn-glass btn-sm w-100 py-2 fw-semibold">
              Ver Directorio <CIcon :icon="cilArrowRight" class="ms-2" />
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xl-3">
        <div class="card card-metric bg-gradient-cyan h-100 p-3 shadow">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="text-white opacity-75 small fw-bold text-uppercase">Contactos</div>
            <CIcon :icon="cilPeople" size="xl" class="text-white opacity-50" />
          </div>
          <div class="h2 mb-3 fw-bold">{{ contactCount }}</div>
          <div class="mt-auto">
            <RouterLink to="/contacts" class="btn btn-glass btn-sm w-100 py-2 fw-semibold">
              Ver Lista <CIcon :icon="cilArrowRight" class="ms-2" />
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xl-3">
        <div class="card card-metric bg-gradient-orange h-100 p-3 shadow">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="text-white opacity-75 small fw-bold text-uppercase">Oportunidades</div>
            <CIcon :icon="cilGraph" size="xl" class="text-white opacity-50" />
          </div>
          <div class="h2 mb-3 fw-bold">{{ activeDealsCount }}</div>
          <div class="mt-auto">
            <RouterLink to="/deals" class="btn btn-glass btn-sm w-100 py-2 fw-semibold">
              Gestionar Pipeline
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xl-3">
        <div class="card card-metric bg-gradient-green h-100 p-3 shadow">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="text-white opacity-75 small fw-bold text-uppercase">Valor en Pipeline</div>
            <CIcon :icon="cilDollar" size="xl" class="text-white opacity-50" />
          </div>
          <div class="h2 mb-3 fw-bold">{{ formatCurrency(activeDealsValue) }}</div>
        </div>
      </div>
    </div>

    <!-- ACTIVIDAD RECIENTE -->
    <div class="row justify-content-center">
      <div class="col-md-10 col-xl-8">
        <div class="card card-dashboard shadow-sm bg-white">

          <div class="card-header bg-white border-0 pt-4 px-4 pb-2">
            <h5 class="fw-bold mb-0 text-dark">Actividad Reciente</h5>
            <p class="text-muted small mt-1">Últimas interacciones registradas en el sistema</p>
          </div>

          <div class="card-body px-4 pb-4">
            <ul class="list-group list-group-flush" v-if="recentInteractions.length > 0">
              <li class="list-group-item border-0 border-bottom py-3" v-for="item in recentInteractions" :key="item.id">
                <div class="d-flex align-items-center">
                  <div class="bg-light p-2 rounded-circle me-3 text-purple">
                    <CIcon :icon="cilList" />
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-0 text-dark fw-semibold">{{ item.notes }}</h6>
                    <small class="text-muted">Contacto ID: #{{ item.contactId }}</small>
                  </div>
                  <div class="text-end">
                    <span class="badge bg-light text-dark fw-normal border">
                      {{ formatShortDate(item.date) }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>

            <div v-else class="text-center py-5">
              <CIcon :icon="cilDescription" size="4xl" class="text-muted opacity-25 mb-3" />
              <p class="text-muted">No hay actividad reciente para mostrar.</p>
              <button class="btn btn-purple px-4 mt-2" @click="toggleModal">
                Crear nueva nota
              </button>
            </div>
          </div>

          <div class="card-footer bg-white border-0 text-center pb-4" v-if="recentInteractions.length > 0">
            <button class="btn btn-purple px-5 py-2 shadow-sm text-uppercase fw-semibold" @click="toggleModal" style="letter-spacing: 0.5px;">
              Crear Nueva Nota
            </button>
          </div>

        </div>
      </div>
    </div>

  </div>

  <!-- MODAL: Registrar Interacción -->
  <CModal :visible="visibleModal" @update:visible="visibleModal = $event" size="lg" alignment="center">
    <CModalHeader>
      <CModalTitle class="fw-bold text-dark ps-2 pt-2">Registrar Actividad Rápida</CModalTitle>
    </CModalHeader>
    <CModalBody class="p-4">

      <!-- Selector de contacto -->
      <div class="mb-4 bg-light p-3 rounded border">
        <label class="small fw-bold text-secondary mb-2 text-uppercase">1. Seleccionar Contacto / Cliente</label>
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0 text-muted">
            <CIcon :icon="cilPeople" size="sm" />
          </span>
          <select v-model="selectedContactId" class="form-select border-start-0">
            <option :value="null" disabled>-- Buscar contacto en la lista --</option>
            <option v-for="c in contactStore.contacts" :key="c.id" :value="c.id">
              {{ c.firstName }} {{ c.lastName }}
            </option>
          </select>
        </div>
        <div v-if="!selectedContactId" class="text-muted small mt-2 d-flex align-items-center">
          <CIcon :icon="cilInfo" size="sm" class="me-1" />
          Seleccione un contacto arriba para habilitar el formulario.
        </div>
      </div>

      <!-- Formulario (solo si hay contacto seleccionado) -->
      <div v-if="selectedContactId" class="fade-in mt-2">
        <InteractionFormComponent
          :contact-id="selectedContactId"
          @interaction-saved="onInteractionSaved"
        />
      </div>

    </CModalBody>
  </CModal>
</template>
