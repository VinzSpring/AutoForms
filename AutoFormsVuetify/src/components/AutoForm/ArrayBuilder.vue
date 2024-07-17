<template>
  <v-card class="pa-4" color="white">
    <h2>Add items</h2>
    <!-- crud controls -->
    <v-btn @click="formVal.push({})">Add</v-btn>
    <v-btn @click="formVal.pop()">Remove</v-btn>
    <v-btn @click="formVal = []">Clear</v-btn>
    <v-list>
      <v-list-item v-for="(_, index) in [1,2]" :key="index">
        <v-list-item-content>
          <FormFieldBuilder
            :schema="props.schema"
            :field="schemaFieldWithoutArray"
            :keyName="index.toString()"
            :path="props.valuePath"
            :context="ctx" 
          />
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { SchemaField, InitResult, Schema } from './AutoFormsSchema';
import FormFieldBuilder from './FormFieldBuilder.vue';

const props = defineProps<{
  schema: Schema;
  schemaField: SchemaField;
  valuePath: string;
  ctx: any;
}>();

const formVal = ref<any[]>([]);
const initResult = ref<InitResult<any>>();

const schemaFieldWithoutArray = {...props.schemaField, isArray: false};

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
  initResult.value = props.schemaField.init(props.ctx, props.valuePath);
  formVal.value = initResult.value.value;
  onValidate = initResult.value.validate || onValidate;
  onChanged = initResult.value.onChanged || onChanged;
});
</script>

<style scoped lang="sass">

</style>
