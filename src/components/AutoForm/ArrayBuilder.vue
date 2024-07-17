<template>
  <v-card class="pa-4" color="white">
    <h2 class="mb-3">{{ initResult?.label }}</h2>
    <v-row>
      <v-col cols="auto">
        <v-btn @click="addItem" class="ml-2">Add</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="clearItems" class="ml-2">Clear</v-btn>
      </v-col>
    </v-row>
    <v-list>
      <v-list-item 
        v-for="item in formVal" 
        :key="item.key"
        draggable="true" 
        @dragstart="dragStart($event, item.key)" 
        @dragover.prevent 
        @drop="drop($event, item.key)"
      >
        <v-row>
          <v-col cols="auto">
            <v-icon class="drag-handle" >mdi-drag</v-icon>
          </v-col>
          <v-col>
            <FormFieldBuilder
              :mutator="props.mutator"
              :schema="props.schema"
              :field="schemaFieldWithoutArray"
              :keyName="item.key"
              :path="appendPath(props.valuePath, item.key)"
              :context="ctx" 
            />
          </v-col>
          <v-col cols="auto">
            <v-list-item-action>
              <v-btn icon @click="removeSpecificItem(item.key)">
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
  mutator: (valuePath: string, value: any) => void;
  schema: Schema;
  schemaField: SchemaField;
  valuePath: string;
  ctx: any;
}>();

type FormItemWrapper = {
  key: string;
  value: any;
};

const formVal = ref<FormItemWrapper[]>([]);
const initResult = ref<InitResult<any>>();

const schemaFieldWithoutArray = {...props.schemaField, isArray: false};

let draggedItemKey: string | null = null;

const dragStart = (event: DragEvent, key: string) => {
  draggedItemKey = key;
};

const drop = (event: DragEvent, key: string) => {
  if (draggedItemKey !== null) {
    const draggedIndex = formVal.value.findIndex(item => item.key === draggedItemKey);
    const dropIndex = formVal.value.findIndex(item => item.key === key);
    const [draggedItem] = formVal.value.splice(draggedIndex, 1);
    formVal.value.splice(dropIndex, 0, draggedItem);
    draggedItemKey = null;
    updateFormVal();
  }
};

const updateFormVal = () => {
  const values = formVal.value.map(item => item.value);
  onChanged(props.ctx, props.valuePath, values, props.mutator);
};

let onValidate = (ctx: object, valuePath: string, value: number): string | true => {
  if (Number.isNaN(value) || !Number.isFinite(value)){
    return 'Value must be a valid number';
  }
  return true;
};

let onChanged = (ctx: object, valuePath: string, value: any, mutator: (valuePath: string, value: any) => void) => {
  mutator(valuePath, value);
};

const generateKey = () => Math.random().toString(36).substr(2, 9);

const addItem = () => {
  formVal.value.push({ key: generateKey(), value: {} });
  updateFormVal();
};

const clearItems = () => {
  formVal.value = [];
  updateFormVal();
};

const removeSpecificItem = (key: string) => {
  const index = formVal.value.findIndex(item => item.key === key);
  if (index !== -1) {
    formVal.value.splice(index, 1);
    updateFormVal();
  }
};

onMounted(() => {
  initResult.value = props.schemaField.init(props.ctx, props.valuePath);
  formVal.value = initResult.value.value.map((item: any) => ({ key: generateKey(), value: item }));
  onValidate = initResult.value.validate || onValidate;
  onChanged = initResult.value.onChanged || onChanged;
  updateFormVal();
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
.drag-handle {
  cursor: grab;
}
</style>
