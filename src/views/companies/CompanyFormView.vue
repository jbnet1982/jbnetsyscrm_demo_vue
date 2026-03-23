<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CIcon } from '@coreui/icons-vue'
import { cilBriefcase, cilPencil, cilBuilding, cilSave } from '@coreui/icons'
import { useCompanyStore }      from '@/stores/company'
import { useIndustryTypeStore } from '@/stores/industrytype'

const router           = useRouter()
const route            = useRoute()
const companyStore     = useCompanyStore()
const industryTypeStore = useIndustryTypeStore()

const id         = computed(() => route.params.id ? Number(route.params.id) : null)
const isEditMode = computed(() => id.value !== null)

const form = reactive({ name: '', industryTypeId: null as number | null, address: '', phone: '', website: '' })
const touched = reactive({ name: false, industryTypeId: false, website: false })
const submitted = ref(false)

onMounted(() => {
  if (isEditMode.value && id.value) {
    const company = companyStore.getById(id.value)
    if (company) Object.assign(form, company)
  }
})

const websitePattern = /^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/

function isFormValid() {
  return form.name.trim() !== '' &&
         form.industryTypeId !== null &&
         (form.website === '' || websitePattern.test(form.website))
}

function onSubmit() {
  submitted.value = true
  touched.name = true
  touched.industryTypeId = true
  touched.website = true
  if (!isFormValid()) return

  const data = { name: form.name, industryTypeId: Number(form.industryTypeId), address: form.address, phone: form.phone, website: form.website }

  if (isEditMode.value && id.value) {
    companyStore.update({ id: id.value, ...data })
  } else {
    companyStore.add(data)
  }
  router.push('/companies')
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
                  <CIcon :icon="isEditMode ? cilPencil : cilBriefcase" size="xl" />
                </div>
                <div>
                  <h4 class="mb-1 fw-bold text-dark">{{ isEditMode ? 'Editar Información' : 'Registrar Empresa' }}</h4>
                  <p class="mb-0 text-muted small">
                    {{ isEditMode ? 'Actualice los datos necesarios' : 'Complete el formulario para dar de alta una nueva empresa' }}
                  </p>
                </div>
              </div>
            </div>
            <hr class="text-muted opacity-25">

            <div class="card-body pt-3">
              <div class="row g-4">

                <div class="col-md-6">
                  <label class="fw-semibold text-secondary small mb-1" for="name">
                    Nombre Comercial <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted">
                      <CIcon :icon="cilBuilding" size="sm" />
                    </span>
                    <input
                      id="name"
                      v-model="form.name"
                      class="form-control border-start-0"
                      :class="{ 'is-invalid': touched.name && !form.name.trim() }"
                      @blur="touched.name = true"
                      placeholder="Ej: Tech Solutions LLC"
                    />
                    <div class="invalid-feedback">Nombre es obligatorio.</div>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="fw-semibold text-secondary small mb-1" for="industryTypeId">
                    Industria <span class="text-danger">*</span>
                  </label>
                  <select
                    id="industryTypeId"
                    v-model="form.industryTypeId"
                    class="form-select"
                    :class="{ 'is-invalid': touched.industryTypeId && !form.industryTypeId }"
                    @blur="touched.industryTypeId = true"
                  >
                    <option :value="null" disabled>Seleccione opción...</option>
                    <option v-for="type in industryTypeStore.industryTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">Seleccione una industria.</div>
                </div>

                <div class="col-md-6">
                  <label class="fw-semibold text-secondary small mb-1" for="phone">Teléfono de contacto</label>
                  <input id="phone" v-model="form.phone" class="form-control" placeholder="+1 (555) 000-0000" />
                </div>

                <div class="col-md-6">
                  <label class="fw-semibold text-secondary small mb-1" for="website">Sitio Web</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light text-muted">https://</span>
                    <input
                      id="website"
                      v-model="form.website"
                      class="form-control"
                      :class="{ 'is-invalid': touched.website && form.website && !websitePattern.test(form.website) }"
                      @blur="touched.website = true"
                      placeholder="www.empresa.com"
                    />
                    <div class="invalid-feedback">Formato de sitio web inválido.</div>
                  </div>
                </div>

                <div class="col-md-12">
                  <label class="fw-semibold text-secondary small mb-1" for="address">Dirección Fiscal / Oficina</label>
                  <textarea id="address" v-model="form.address" class="form-control" rows="3" placeholder="Dirección completa"></textarea>
                </div>

              </div>
            </div>

            <div class="d-flex justify-content-end mt-4 pt-3 border-top border-light">
              <RouterLink to="/companies" class="btn btn-outline-secondary px-4 me-3">Cancelar</RouterLink>
              <button type="submit" class="btn btn-purple px-4 py-2 d-flex align-items-center" :disabled="submitted && !isFormValid()">
                <CIcon :icon="cilSave" class="me-2" />
                {{ isEditMode ? 'Guardar Cambios' : 'Crear Empresa' }}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>
