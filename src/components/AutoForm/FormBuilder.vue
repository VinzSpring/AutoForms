<template>
  <v-card class="pa-4" color="white">
    <h2 class="mb-3">{{ schemaType.label }}</h2>
    <template v-for="(field, key) in schemaType.fields" :key="field.name" class="mb-3">
      <FormFieldBuilder :mutator="mutator" :schema="schema" :field="field" :context="context" :path="appendPath(path, key as string)"/>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { SchemaType, Schema } from './AutoFormsSchema';
import FormFieldBuilder from './FormFieldBuilder.vue';
import { appendPath } from './helpers/index';

const props = defineProps<{
  mutator: (valuePath: string, value: any) => void;
  schema: Schema;
  schemaType: SchemaType<any>;
  context: any;
  path: string;
}>();
</script>

<style scoped lang="sass">
</style>
