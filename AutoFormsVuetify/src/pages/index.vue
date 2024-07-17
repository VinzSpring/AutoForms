<template>
  <AutoForm :schema="testSchema"/>
</template>

<script lang="ts" setup>
  import AutoForm from '@/components/AutoForm/AutoForm.vue'
  import { testSchema } from '@/components/AutoForm/AutoFormsSchema'
</script>
