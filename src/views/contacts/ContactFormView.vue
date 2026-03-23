<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CIcon } from '@coreui/icons-vue'
import { cilUser, cilPencil, cilSave, cilEnvelopeClosed, cilPhone } from '@coreui/icons'
import { useContactStore } from '@/stores/contact'
import { useCompanyStore } from '@/stores/company'

const router       = useRouter()
const route        = useRoute()
const contactStore = useContactStore()
const companyStore = useCompanyStore()

const id         = computed(() => route.params.id ? Number(route.params.id) : null)
const isEditMode = computed(() => id.value !== null)

const form    = reactive({ firstName: '', lastName: '', email: '', phone: '', companyId: null as number | null })
const touched = reactive({ firstName: false, lastName: false, email: false, companyId: false })
const submitted = ref(false)

onMounted(() => {
  if (isEditMode.value && id.value) {
    const c = contactStore.getById(id.value)
    if (c) Object.assign(form, c)
  }
})

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isFormValid() {
  return form.firstName.trim() !== '' &&
         form.lastName.trim()  !== '' &&
         isEmailValid(form.email) &&
         form.companyId !== null
}

function onSubmit() {
  submitted.value = true
  touched.firstName = true
  touched.lastName  = true
  touched.email     = true
  touched.companyId = true
  if (!isFormValid()) return

  const data = { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, companyId: Number(form.companyId) }

  if (isEditMode.value && id.value) {
    contactStore.update({ id: id.value, ...data })
  } else {
    contactStore.add(data)
  }
  router.push('/contacts')
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
                  <CIcon :icon="isEditMode ? cilPencil : cilUser" size="xl" />
                </div>
                <div>
                  <h4 class="mb-1 fw-bold text-dark">{{ isEditMode ? 'Editar Contacto' : 'Nuevo Contacto' }}</h4>
                  <p class="mb-0 text-muted small">Información personal y datos de contacto</p>
                </div>
              </div>
            </div>
            <hr class="text-muted opacity-25">

            <div class="card-body pt-3">
              <div class="row g-4">

                <div class="col-md-12">
                  <h6 class="text-uppercase text-secondary small fw-bold mb-3">Datos Personales</h6>
                </div>

                <div class="col-md-6">
                  <label class="fw-semibold text-dark small mb-1" for="firstName">
                    Nombre <span class="text-danger">*</span>
                  </label>
                  <input
                    id="firstName" v-model="form.firstName"
                    class="form-control"
                    :class="{ 'is-invalid': touched.firstName && !form.firstName.trim() }"
                    @blur="touched.firstName = true"
                    placeholder="Ej: Ana"
                  />
                  <div class="invalid-feedback">Nombre es obligatorio.</div>
                </div>

                <div class="col-md-6">
                  <label class="fw-semibold text-dark small mb-1" for="lastName">
                    Apellido <span class="text-danger">*</span>
                  </label>
                  <input
                    id="lastName" v-model="form.lastName"
                    class="form-control"
                    :class="{ 'is-invalid': touched.lastName && !form.lastName.trim() }"
                    @blur="touched.lastName = true"
                    placeholder="Ej: García"
                  />
                  <div class="invalid-feedback">Apellido es obligatorio.</div>
                </div>

                <div class="col-md-12 mt-4">
                  <h6 class="text-uppercase text-secondary small fw-bold mb-3">Información Corporativa</h6>
                </div>

                <div class="col-md-6">
                  <label class="fw-semibold text-dark small mb-1" for="email">
                    Email Corporativo <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted">
                      <CIcon :icon="cilEnvelopeClosed" size="sm" />
                    </span>
                    <input
                      id="email" type="email" v-model="form.email"
                      class="form-control border-start-0"
                      :class="{ 'is-invalid': touched.email && !isEmailValid(form.email) }"
                      @blur="touched.email = true"
                      placeholder="usuario@empresa.com"
                    />
                    <div class="invalid-feedback">
                      <span v-if="!form.email">Email obligatorio.</span>
                      <span v-else>Formato inválido.</span>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="fw-semibold text-dark small mb-1" for="companyId">
                    Empresa <span class="text-danger">*</span>
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
                  <div class="invalid-feedback">Seleccione una empresa.</div>
                </div>

                <div class="col-md-6">
                  <label class="fw-semibold text-dark small mb-1" for="phone">Teléfono</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted">
                      <CIcon :icon="cilPhone" size="sm" />
                    </span>
                    <input id="phone" v-model="form.phone" class="form-control border-start-0" placeholder="+XX (XXX) XXX-XXXX" />
                  </div>
                </div>

              </div>
            </div>

            <div class="d-flex justify-content-end mt-4 pt-3 border-top border-light">
              <RouterLink to="/contacts" class="btn btn-outline-secondary px-4 me-3">Cancelar</RouterLink>
              <button type="submit" class="btn btn-purple px-4 py-2 d-flex align-items-center">
                <CIcon :icon="cilSave" class="me-2" /> Guardar
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>
