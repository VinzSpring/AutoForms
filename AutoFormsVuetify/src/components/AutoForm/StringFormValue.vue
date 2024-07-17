<template>
  <v-text-field
    v-model="formVal"
    :rules="[ (val) => onValidate(props.ctx, props.valuePath, val) ]"
    :label="initResult?.label"
    @update:modelValue="(value: string) => {
      if (onValidate(props.ctx, props.valuePath, value) === true) {
        onChanged(props.ctx, props.valuePath, value, props.mutator);
      }
    }"
    :disabled="initResult?.disabled"
  ></v-text-field>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue'
import { SchemaField, InitResult } from './AutoFormsSchema';

const props = defineProps<{
  mutator: (valuePath: string, value: any) => void;
  schema: SchemaField;
  valuePath: string;
  ctx: any;
}>();

const formVal = ref('');
const initResult = ref<InitResult<string>>();

let onValidate = (ctx: object, valuePath: string, value: any): string | true => {
  if (typeof formVal.value !== 'string') {
    return 'Value must be a string';
  }
  return true;
};

let onChanged = (ctx: object, valuePath: string, value: any, mutator: (valuePath: string, value: any) => void) => {
  mutator(valuePath, value);
};

onMounted(() => {
  if (props.schema.type !== 'string') {
    throw new Error('TextFormValue only supports string schema');
  }
  initResult.value = props.schema.init(props.ctx, props.valuePath);
  formVal.value = initResult.value.value;
  onValidate = initResult.value.validate || onValidate;
  onChanged = initResult.value.onChanged || onChanged;
});
</script>

<style scoped lang="sass">

</style>
