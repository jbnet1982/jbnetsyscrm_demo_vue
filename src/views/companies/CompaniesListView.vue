<script setup lang="ts">
import { CIcon } from '@coreui/icons-vue'
import { cilBuilding, cilPlus, cilPencil, cilTrash, cilPhone, cilLocationPin, cilExternalLink } from '@coreui/icons'
import { useCompanyStore }      from '@/stores/company'
import { useIndustryTypeStore } from '@/stores/industrytype'

const companyStore      = useCompanyStore()
const industryTypeStore = useIndustryTypeStore()

function deleteCompany(id: number) {
  if (confirm('¿Está seguro de que desea eliminar esta empresa?')) {
    companyStore.remove(id)
  }
}
</script>

<template>
  <div class="container-fluid fade-in p-4">
    <div class="card card-dashboard p-4">

      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 class="fw-bold text-dark mb-1">
            <CIcon :icon="cilBuilding" class="text-purple me-2" />
            Listado de Empresas
          </h4>
          <span class="text-muted small">Gestiona tu base de datos de clientes corporativos</span>
        </div>
        <div>
          <RouterLink to="/companies/new" class="btn btn-purple shadow-sm">
            <CIcon :icon="cilPlus" class="me-1" /> Nuevo
          </RouterLink>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover table-custom align-middle mb-0 border-white">
          <thead>
            <tr>
              <th class="border-top-0 py-3 ps-3">Empresa</th>
              <th class="border-top-0 py-3">Industria</th>
              <th class="border-top-0 py-3">Contacto</th>
              <th class="border-top-0 py-3 text-center">Sitio Web</th>
              <th class="border-top-0 py-3 text-end pe-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="company in companyStore.companies" :key="company.id">
              <td class="ps-3 py-3">
                <div class="fw-semibold text-dark">{{ company.name }}</div>
              </td>
              <td>
                <span class="badge bg-light text-secondary border">
                  {{ industryTypeStore.getNameById(company.industryTypeId) }}
                </span>
              </td>
              <td class="small text-muted">
                <div v-if="company.phone">
                  <CIcon :icon="cilPhone" size="sm" class="me-1" /> {{ company.phone }}
                </div>
                <div class="mt-1" v-if="company.address">
                  <CIcon :icon="cilLocationPin" size="sm" class="me-1" /> {{ company.address }}
                </div>
              </td>
              <td class="text-center">
                <a :href="'http://' + company.website" target="_blank" class="text-decoration-none text-purple small fw-bold">
                  Visitar <CIcon :icon="cilExternalLink" size="sm" class="ms-1" />
                </a>
              </td>
              <td class="text-end pe-3">
                <RouterLink :to="'/companies/edit/' + company.id" title="Editar" class="btn btn-icon text-info mx-1">
                  <CIcon :icon="cilPencil" />
                </RouterLink>
                <button @click="deleteCompany(company.id)" title="Eliminar" class="btn btn-icon text-danger mx-1">
                  <CIcon :icon="cilTrash" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="companyStore.companies.length === 0" class="text-center py-5">
        <p class="text-muted">No se encontraron empresas registradas.</p>
      </div>

    </div>
  </div>
</template>
