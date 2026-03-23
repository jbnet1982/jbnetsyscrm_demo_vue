<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { CIcon } from '@coreui/icons-vue'
import { cilCommentSquare, cilSave, cilCalendar } from '@coreui/icons'
import { useInteractionStore } from '@/stores/interaction'
import { useInteractionTypeStore } from '@/stores/interactiontype'
import type { Interaction } from '@/types'

const props = defineProps<{
  contactId: number
  dealId?: number
}>()

const emit = defineEmits<{
  interactionSaved: [interaction: Interaction]
}>()

const interactionStore = useInteractionStore()
const interactionTypeStore = useInteractionTypeStore()

function getTodayString(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const form = reactive({ interactionTypeId: null as number | null, notes: '', date: getTodayString() })
const touched = reactive({ interactionTypeId: false, notes: false })
const submitted = ref(false)

onMounted(() => {
  interactionTypeStore.$state // ensure store loaded
})

function isValid() {
  return form.interactionTypeId !== null && form.notes.trim() !== '' && form.date !== ''
}

function onSubmit() {
  submitted.value = true
  touched.interactionTypeId = true
  touched.notes = true
  if (!isValid()) return

  const data: Omit<Interaction, 'id'> = {
    interactionTypeId: form.interactionTypeId!,
    notes: form.notes,
    date: form.date,
    contactId: props.contactId,
    ...(props.dealId ? { dealId: props.dealId } : {})
  }

  const saved = interactionStore.add(data)
  emit('interactionSaved', saved)
  resetForm()
}

function resetForm() {
  form.interactionTypeId = null
  form.notes = ''
  form.date = getTodayString()
  touched.interactionTypeId = false
  touched.notes = false
  submitted.value = false
}
</script>

<template>
  <div class="card card-dashboard p-4 shadow-sm">
    <div class="card-header bg-white border-0 pb-3 ps-0">
      <div class="d-flex align-items-center">
        <div class="bg-light p-3 rounded-circle text-purple me-3">
          <CIcon :icon="cilCommentSquare" size="xl" />
        </div>
        <div>
          <h4 class="mb-1 fw-bold text-dark">Nueva Interacción</h4>
          <p class="mb-0 text-muted small">Registra los detalles de la actividad realizada</p>
        </div>
      </div>
    </div>
    <hr class="text-muted opacity-25">

    <form @submit.prevent="onSubmit" novalidate>
      <div class="row g-4 pt-2">
        <div class="col-md-12">
          <h6 class="text-uppercase text-secondary small fw-bold mb-3 border-bottom pb-2">Datos de la Actividad</h6>
        </div>

        <div class="col-md-6">
          <label class="fw-semibold text-secondary small mb-1" for="interactionTypeId">
            Tipo de Interacción <span class="text-danger">*</span>
          </label>
          <select
            id="interactionTypeId"
            v-model="form.interactionTypeId"
            class="form-select"
            :class="{ 'is-invalid': touched.interactionTypeId && !form.interactionTypeId }"
            @blur="touched.interactionTypeId = true"
          >
            <option :value="null" disabled>Seleccione tipo...</option>
            <option v-for="type in interactionTypeStore.interactionTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
          <div class="invalid-feedback" v-if="touched.interactionTypeId && !form.interactionTypeId">
            Debes seleccionar un tipo.
          </div>
        </div>

        <div class="col-md-6">
          <label class="fw-semibold text-secondary small mb-1" for="date">Fecha de Ejecución</label>
          <div class="input-group">
            <input type="date" id="date" v-model="form.date" class="form-control border-end-0" />
            <span class="input-group-text bg-white border-start-0 text-muted">
              <CIcon :icon="cilCalendar" size="sm" />
            </span>
          </div>
        </div>

        <div class="col-md-12 mt-4">
          <h6 class="text-uppercase text-secondary small fw-bold mb-3 border-bottom pb-2">Contenido</h6>
        </div>

        <div class="col-md-12">
          <label class="fw-semibold text-secondary small mb-1" for="notes">
            Notas / Comentarios <span class="text-danger">*</span>
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="5"
            class="form-control"
            :class="{ 'is-invalid': touched.notes && !form.notes.trim() }"
            @blur="touched.notes = true"
            placeholder="Escriba aquí el resumen de la interacción, acuerdos o tareas pendientes..."
            style="resize: none;"
          ></textarea>
          <div class="invalid-feedback" v-if="touched.notes && !form.notes.trim()">
            El contenido de la nota es obligatorio.
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-4 pt-3 border-top border-light">
        <button type="button" class="btn btn-outline-secondary px-4 me-3" @click="resetForm">
          Limpiar
        </button>
        <button type="submit" class="btn btn-purple px-4 py-2 d-flex align-items-center shadow-sm text-uppercase fw-semibold text-white">
          <CIcon :icon="cilSave" class="me-2" />
          Guardar Interacción
        </button>
      </div>
    </form>
  </div>
</template>
