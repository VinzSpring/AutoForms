<template>
  <v-number-input
    v-model="formVal"
    :rules="[ (val) => onValidate(props.ctx, props.valuePath, val) ]"
    :label="initResult?.label"
    @update:modelValue="(value: number) => {
      const n = Number(value);
      if (Number.isNaN(n) || !Number.isFinite(n)){
        return;
      }
      if (onValidate(props.ctx, props.valuePath, n) === true) {
        onChanged(props.ctx, props.valuePath, value, props.mutator);
      }
    }"
    :disabled="initResult?.disabled"
    type="number"
  ></v-number-input>
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

const formVal = ref<number | string>('');
const initResult = ref<InitResult<number>>();

let onValidate = (ctx: object, valuePath: string, value: any): string | true => {
  const n = Number(value);
  if (!Number.isInteger(n)) {
    return 'Value must be a whole number';
  }
  return true;
};

let onChanged = (ctx: object, valuePath: string, value: any, mutator: (valuePath: string, value: any) => void) => {
  mutator(valuePath, value);
};

onMounted(() => {
  if (props.schema.type !== 'integer') {
    throw new Error('WholeNumberFormValue only supports integer schema');
  }
  initResult.value = props.schema.init(props.ctx, props.valuePath);
  formVal.value = initResult.value.value;
  onValidate = initResult.value.validate || onValidate;
  onChanged = initResult.value.onChanged || onChanged;
  onChanged(props.ctx, props.valuePath, formVal.value, props.mutator);
});

onUnmounted(() => {
  onChanged(props.ctx, props.valuePath, undefined, props.mutator);
});
</script>

<style scoped lang="sass">

</style>
