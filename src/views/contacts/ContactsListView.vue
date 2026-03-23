<script setup lang="ts">
import { CIcon } from '@coreui/icons-vue'
import { cilPeople, cilUserPlus, cilPencil, cilTrash, cilEnvelopeClosed, cilBuilding } from '@coreui/icons'
import { useContactStore } from '@/stores/contact'
import { useCompanyStore } from '@/stores/company'

const contactStore = useContactStore()
const companyStore = useCompanyStore()

function getCompanyName(companyId: number): string {
  return companyStore.companies.find(c => c.id === companyId)?.name ?? 'Sin Empresa'
}

function deleteContact(id: number) {
  if (confirm('¿Está seguro de que desea eliminar este contacto?')) {
    contactStore.remove(id)
  }
}
</script>

<template>
  <div class="container-fluid fade-in p-4">
    <div class="card card-dashboard p-4 shadow-sm">

      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <div class="bg-light p-3 rounded-circle text-purple me-3">
            <CIcon :icon="cilPeople" size="xl" />
          </div>
          <div>
            <h4 class="fw-bold text-dark mb-1">Listado de Contactos</h4>
            <span class="text-muted small">Administra las personas clave de tus cuentas</span>
          </div>
        </div>
        <div>
          <RouterLink to="/contacts/new" class="btn btn-purple shadow-sm d-flex align-items-center">
            <CIcon :icon="cilUserPlus" class="me-2" /> Nuevo Contacto
          </RouterLink>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover table-custom align-middle mb-0 border-white">
          <thead>
            <tr>
              <th class="border-top-0 py-3 ps-3">Nombre Completo</th>
              <th class="border-top-0 py-3">Contacto Digital</th>
              <th class="border-top-0 py-3">Teléfono</th>
              <th class="border-top-0 py-3">Empresa Asignada</th>
              <th class="border-top-0 py-3 text-end pe-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contact in contactStore.contacts" :key="contact.id">
              <td class="ps-3 py-3">
                <div class="d-flex align-items-center">
                  <div class="avatar me-3 rounded-circle d-flex align-items-center justify-content-center fw-bold"
                       style="width:36px; height:36px; background-color:#e0e7ff; color:#5856d6;">
                    {{ contact.firstName.charAt(0) }}{{ contact.lastName.charAt(0) }}
                  </div>
                  <div class="fw-semibold text-dark">{{ contact.firstName }} {{ contact.lastName }}</div>
                </div>
              </td>
              <td>
                <div class="small text-muted" v-if="contact.email">
                  <CIcon :icon="cilEnvelopeClosed" size="sm" class="me-1 text-secondary" />
                  {{ contact.email }}
                </div>
              </td>
              <td>
                <span class="text-dark small" v-if="contact.phone">{{ contact.phone }}</span>
                <span class="text-muted small fst-italic" v-else>--</span>
              </td>
              <td>
                <div class="d-flex align-items-center text-secondary">
                  <CIcon :icon="cilBuilding" size="sm" class="me-2 text-purple opacity-50" />
                  <span class="fw-medium">{{ getCompanyName(contact.companyId) }}</span>
                </div>
              </td>
              <td class="text-end pe-3">
                <RouterLink :to="'/contacts/edit/' + contact.id" title="Editar" class="btn btn-icon text-info mx-1">
                  <CIcon :icon="cilPencil" />
                </RouterLink>
                <button @click="deleteContact(contact.id)" title="Eliminar" class="btn btn-icon text-danger mx-1">
                  <CIcon :icon="cilTrash" />
                </button>
              </td>
            </tr>
            <tr v-if="contactStore.contacts.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">
                <p>No se encontraron contactos registrados.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>
