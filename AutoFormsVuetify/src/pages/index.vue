<template>
  <div class="d-flex justify-center">
    <AutoForm :schema="testSchema"/>
    <div>
      {{ 
         }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import AutoForm from '@/components/AutoForm/AutoForm.vue'
  import { testSchema } from '@/components/AutoForm/AutoFormsSchema'
</script>
