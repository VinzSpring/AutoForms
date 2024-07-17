<template>
  <v-form v-model="valid" style="height: 100%;">
    <FormBuilder :mutator="mutator" :schemaType="entryType" :schema="props.schema" :context="ctx" :path="`${props.schema.defaultEntryType}`" />
  </v-form>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'
import { Schema, SchemaType } from './AutoFormsSchema';
import FormBuilder from './FormBuilder.vue';
import { updateObjectAtPath } from './helpers/index';

const props = defineProps<{
  schema: Schema
}>();
const valid = ref(false);

const ctx = {};

const mutator: (valuePath: string, value: any) => void = (valuePath, value) => {
  console.log('mutator', valuePath, value);
  updateObjectAtPath(ctx, valuePath, value);
};

const entryType: ComputedRef<SchemaType<any>> = computed(() => {
  return props.schema.types[props.schema.defaultEntryType];
});
</script>

<style scoped lang="sass">

</style>
