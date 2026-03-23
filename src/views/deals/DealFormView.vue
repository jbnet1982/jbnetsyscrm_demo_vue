<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CIcon } from '@coreui/icons-vue'
import { cilPencil, cilDollar, cilSave } from '@coreui/icons'
import { useDealStore }    from '@/stores/deal'
import { useCompanyStore } from '@/stores/company'
import { useContactStore } from '@/stores/contact'
import type { Contact, Deal } from '@/types'

const router       = useRouter()
const route        = useRoute()
const dealStore    = useDealStore()
const companyStore = useCompanyStore()
const contactStore = useContactStore()

const id         = computed(() => route.params.id ? Number(route.params.id) : null)
const isEditMode = computed(() => id.value !== null)

const stages: Deal['stage'][] = ['Lead', 'Qualified', 'Proposal', 'Won', 'Lost']

const form = reactive({
  name: '',
  stage: 'Lead' as Deal['stage'],
  value: 0,
  closeDate: '',
  companyId: null as number | null,
  contactId: null as number | null
})
const touched   = reactive({ name: false, companyId: false, contactId: false })
const submitted = ref(false)

const filteredContacts = ref<Contact[]>([])

function formatDateForInput(date: Date | string): string {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

onMounted(() => {
  if (isEditMode.value && id.value) {
    const deal = dealStore.getById(id.value)
    if (deal) {
      form.name      = deal.name
      form.stage     = deal.stage
      form.value     = deal.value
      form.closeDate = formatDateForInput(deal.closeDate)
      form.companyId = deal.companyId
      form.contactId = deal.contactId
      filteredContacts.value = contactStore.getByCompanyId(deal.companyId)
    }
  }
})

watch(() => form.companyId, (companyId) => {
  if (companyId) {
    filteredContacts.value = contactStore.getByCompanyId(Number(companyId))
    const stillValid = filteredContacts.value.some(c => c.id === form.contactId)
    if (!stillValid) form.contactId = null
  } else {
    filteredContacts.value = []
    form.contactId = null
  }
})

function isFormValid() {
  return form.name.trim() !== '' && form.companyId !== null && form.contactId !== null
}

function onSubmit() {
  submitted.value = true
  touched.name      = true
  touched.companyId = true
  touched.contactId = true
  if (!isFormValid()) return

  const data = {
    name:      form.name,
    stage:     form.stage,
    value:     Number(form.value),
    closeDate: form.closeDate,
    companyId: Number(form.companyId),
    contactId: Number(form.contactId)
  }

  if (isEditMode.value && id.value) {
    dealStore.update({ id: id.value, ...data } as Deal)
  } else {
    dealStore.add(data as Omit<Deal, 'id'>)
  }
  router.push('/deals')
}
</script>

<template>
  <div class="container fade-in p-4">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <form @submit.prevent="onSubmit" novalidate>
          <div class="card card-dashboard p-4 shadow-sm">

            <div class="card-header bg-white border-0 pb-3 ps-0">
              <div class="d-flex align-items-center">
                <div class="bg-light p-3 rounded-circle text-purple me-3">
                  <CIcon :icon="isEditMode ? cilPencil : cilDollar" size="xl" />
                </div>
                <div>
                  <h4 class="mb-1 fw-bold text-dark">
                    {{ isEditMode ? 'Editar Oportunidad' : 'Nueva Oportunidad Comercial' }}
                  </h4>
                  <p class="mb-0 text-muted small">Registra los detalles para gestionar el pipeline</p>
                </div>
              </div>
            </div>
            <hr class="text-muted opacity-25">

            <div class="card-body pt-3">
              <div class="row g-4">

                <div class="col-md-12">
                  <label class="fw-semibold text-secondary small mb-1" for="name">
                    Nombre de la Oportunidad <span class="text-danger">*</span>
                  </label>
                  <input
                    id="name" v-model="form.name"
                    class="form-control"
                    :class="{ 'is-invalid': touched.name && !form.name.trim() }"
                    @blur="touched.name = true"
                    placeholder="Ej: Contrato Renovación Q3 - [Cliente]"
                  />
                  <div class="invalid-feedback">Nombre de la oportunidad es obligatorio.</div>
                </div>

                <div class="col-md-12 mt-4">
                  <h6 class="text-uppercase text-secondary small fw-bold mb-3 border-bottom pb-2">Cliente y Contacto</h6>
                </div>

                <div class="col-md-6">
                  <label class="fw-semibold text-dark small mb-1" for="companyId">
                    Empresa Cliente <span class="text-danger">*</span>
                  </label>
                  <select
                    id="companyId" v-model="form.companyId"
                    class="form-select"
                    :class="{ 'is-invalid': touched.companyId && !form.companyId }"
                    @blur="touched.companyId = true"
                  >
                    <option :value="null" disabled>Seleccione empresa...</option>
                    <option v-for="c in companyStore.companies" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                  <div class="invalid-feedback">Requerido.</div>
                </div>

                <div class="col-md-6">
                  <label class="fw-semibold text-dark small mb-1" for="contactId">Contacto Principal</label>
                  <select
                    id="contactId" v-model="form.contactId"
                    class="form-select"
                    :disabled="!form.companyId"
                    :class="{ 'is-invalid': touched.contactId && !form.contactId }"
                    @blur="touched.contactId = true"
                  >
                    <option :value="null" disabled>
                      {{ form.companyId ? 'Seleccione contacto...' : '← Seleccione empresa primero' }}
                    </option>
                    <option v-for="c in filteredContacts" :key="c.id" :value="c.id">
                      {{ c.firstName }} {{ c.lastName }}
                    </option>
                  </select>
                  <div class="invalid-feedback">Seleccione un contacto.</div>
                </div>

                <div class="col-md-12 mt-4">
                  <h6 class="text-uppercase text-secondary small fw-bold mb-3 border-bottom pb-2">Proyección de Venta</h6>
                </div>

                <div class="col-md-4">
                  <label class="fw-semibold text-dark small mb-1" for="value">Valor Estimado ($)</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light text-muted fw-bold">$</span>
                    <input id="value" type="number" v-model="form.value" class="form-control text-end" placeholder="0.00" />
                  </div>
                </div>

                <div class="col-md-4">
                  <label class="fw-semibold text-dark small mb-1" for="stage">Etapa Actual</label>
                  <select id="stage" v-model="form.stage" class="form-select fw-semibold text-purple">
                    <option v-for="s in stages" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>

                <div class="col-md-4">
                  <label class="fw-semibold text-dark small mb-1" for="closeDate">Fecha Cierre Estimada</label>
                  <input id="closeDate" type="date" v-model="form.closeDate" class="form-control" />
                </div>

              </div>
            </div>

            <div class="d-flex justify-content-end mt-4 pt-3 border-top border-light">
              <RouterLink to="/deals" class="btn btn-outline-secondary px-4 me-3">Cancelar</RouterLink>
              <button type="submit" class="btn btn-purple px-4 py-2 d-flex align-items-center shadow-sm">
                <CIcon :icon="cilSave" class="me-2" />
                {{ isEditMode ? 'Actualizar Deal' : 'Crear Deal' }}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>
