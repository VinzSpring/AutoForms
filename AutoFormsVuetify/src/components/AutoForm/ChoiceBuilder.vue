<template>
  <v-card class="pa-4" color="white">
    <h2 class="mb-3">Select a type</h2>
    <v-select :items="selectItems" v-model="selected" label="Select" />
    <FormBuilder
      v-if="selected"
      :mutator="props.mutator"
      :schema="props.schema"
      :schemaType="getNonPrimitive(selected)"
      :path="props.valuePath"
      :ctx="props.ctx"
      :context="ctx" 
    />
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { SchemaField, InitResult, Schema, SchemaType } from './AutoFormsSchema';
import { parseChoice } from './helpers/index';

const props = defineProps<{
  mutator: (valuePath: string, value: any) => void;
  schema: Schema;
  schemaField: SchemaField;
  valuePath: string;
  ctx: any;
}>();

const selected = ref<string>('');

const getNonPrimitive = (type: string): SchemaType<any> => {
  const res = props.schema.types[type];
  if (!res) {
    throw new Error(`Type ${type} not found in schema`);
  }
  return res;
};

const typeOptions: ComputedRef<string[]> = computed(() => {
  return parseChoice(props.schemaField.type);
});

const selectItems = typeOptions.value.map((option) => {
  // debugger;
  const type = getNonPrimitive(option);
  return {
    title: type.label,
    value: option,
  };
});

const formVal = ref<number | string>('');
const initResult = ref<InitResult<number>>();

let onValidate = (ctx: object, valuePath: string, value: number): string | true => {
  if (Number.isNaN(value) || !Number.isFinite(value)){
    return 'Value must be a valid number';
  }
  return true;
};

let onChanged = (ctx: object, valuePath: string, value: any, mutator: (valuePath: string, value: any) => void) => {
  mutator(valuePath, value);
};

onMounted(() => {
  initResult.value = props.schemaField.init(props.ctx, props.valuePath);
  formVal.value = initResult.value.value;
  onValidate = initResult.value.validate || onValidate;
  onChanged = initResult.value.onChanged || onChanged;
});
</script>

<style scoped lang="sass">

</style>
