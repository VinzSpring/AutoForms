<template>
  <v-form v-model="valid" style="max-height: 100vh; width: 50%; overflow-y: scroll;">
    <FormBuilder :mutator="mutator" :schemaType="entryType" :schema="props.schema" :context="ctx" :path="`${props.schema.defaultEntryType}`" />
  </v-form>
  <pre :key="ctxString" style="width: 50%;">
{{ctxString}}
  </pre>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'
import { Schema, SchemaType } from './AutoFormsSchema';
import FormBuilder from './FormBuilder.vue';
import { updateObjectAtPath, deleteObjectAtPath } from './helpers/index';

const props = defineProps<{
  schema: Schema
}>();
const valid = ref(false);

const ctx = {};
let ctxString = ref(JSON.stringify(ctx, null, 2));

const mutator: (valuePath: string, value: any) => void = (valuePath, value) => {
  if (value === undefined) {
    deleteObjectAtPath(ctx, valuePath);
  } else {
    updateObjectAtPath(ctx, valuePath, value);
  }
  ctxString.value = JSON.stringify(ctx, null, 2);
};

const entryType: ComputedRef<SchemaType<any>> = computed(() => {
  return props.schema.types[props.schema.defaultEntryType];
});
</script>

<style scoped lang="sass">

</style>
