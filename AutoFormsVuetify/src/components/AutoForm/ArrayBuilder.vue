<template>
  <v-card class="pa-4" color="white">
    <v-row class="mb-4">
      <v-col>
        <h2>Add items</h2>
      </v-col>
    </v-row>
    <v-row class="mb-4">
      <v-col cols="auto">
        <v-btn @click="addItem" class="ma-2">Add</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="clearItems" class="ma-2">Clear</v-btn>
      </v-col>
    </v-row>
    <v-list>
      <v-list-item v-for="(_, index) in formVal" :key="index">
        <v-row>
          <v-col>
            <v-list-item-content>
              <FormFieldBuilder
                :schema="props.schema"
                :field="schemaFieldWithoutArray"
                :keyName="index.toString()"
                :path="appendPath(props.valuePath, index.toString())"
                :context="ctx" 
              />
            </v-list-item-content>
          </v-col>
          <v-col cols="auto">
            <v-list-item-action>
              <v-btn icon @click="removeSpecificItem(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineProps } from 'vue';
import { SchemaField, InitResult, Schema } from './AutoFormsSchema';
import FormFieldBuilder from './FormFieldBuilder.vue';
import { appendPath } from './helpers/index';

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

const addItem = () => {
  formVal.value.push({});
};

const clearItems = () => {
  formVal.value = [];
};

const removeSpecificItem = (index: number) => {
  formVal.value.splice(index, 1);
};

onMounted(() => {
  initResult.value = props.schemaField.init(props.ctx, props.valuePath);
  formVal.value = initResult.value.value;
  onValidate = initResult.value.validate || onValidate;
  onChanged = initResult.value.onChanged || onChanged;
});
</script>

<style scoped lang="scss">
.v-row {
  display: flex;
  align-items: center;
}
.v-btn {
  margin: 4px;
}
</style>
