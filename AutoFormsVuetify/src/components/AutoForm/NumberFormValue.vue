<template>
  <v-text-field
    v-model="formVal"
    :rules="[ (val) => onValidate(props.ctx, props.valuePath, val) ]"
    :label="initResult?.label"
    @change="(value: string) => {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        return;
      }
      const result = onValidate(props.ctx, props.valuePath, parsedValue);
      if (result === true) {
        formVal = parsedValue;
        onChanged(props.ctx, props.valuePath, parsedValue, props.ctx.$set);
      }
    }"
    :disabled="initResult?.disabled"
    type="number"
  ></v-text-field>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue'
import { SchemaField, InitResult } from './AutoFormsSchema';

const props = defineProps<{
  schema: SchemaField;
  valuePath: string;
  ctx: any;
}>();

const formVal = ref<number | string>('');
const initResult = ref<InitResult<number>>();

let onValidate = (ctx: object, valuePath: string, value: number): string | true => {
  if (Number.isNaN(value) || !Number.isFinite(value)){
    return 'Value must be a valid number';
  }
  return true;
};

let onChanged = (ctx: object, valuePath: string, value: any, mutator: (valuePath: string, value: any) => void) => {
  // do nothing
};

onMounted(() => {
  if (props.schema.type !== 'number') {
    throw new Error('NumberFormValue only supports number schema');
  }
  initResult.value = props.schema.init(props.ctx, props.valuePath);
  formVal.value = initResult.value.value;
  onValidate = initResult.value.validate || onValidate;
  onChanged = initResult.value.onChanged || onChanged;
});
</script>

<style scoped lang="sass">

</style>
