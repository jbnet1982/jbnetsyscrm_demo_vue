<script setup lang="ts">
import { CIcon } from '@coreui/icons-vue'
import { cilHome } from '@coreui/icons'
</script>

<template>
  <div class="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center">
    <div>
      <h1 class="display-1 fw-bold">404</h1>
      <h4 class="fw-normal mt-3 mb-4">¡Oops! Página no encontrada.</h4>
      <p class="text-muted mb-4">La página que estás buscando no existe o ha sido movida.</p>
      <RouterLink to="/dashboard" class="btn btn-primary">
        <CIcon :icon="cilHome" class="me-2" />
        Volver al Dashboard
      </RouterLink>
    </div>
  </div>
</template>
