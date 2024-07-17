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
        v-for="(val, index) in formVal" 
        :key="val.id" 
        draggable="true" 
        @dragstart="dragStart($event, index)" 
        @dragover.prevent 
        @drop="drop($event, index)"
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
              :keyName="index.toString()"
              :path="appendPath(props.valuePath, index.toString())"
              :context="ctx" 
            />
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
  mutator: (valuePath: string, value: any) => void;
  schema: Schema;
  schemaField: SchemaField;
  valuePath: string;
  ctx: any;
}>();

type ArrayEntry = {
  id: string;
  value: any;
};

const formVal = ref<ArrayEntry[]>([]);
const initResult = ref<InitResult<any>>();

const schemaFieldWithoutArray = {...props.schemaField, isArray: false};

let draggedItemIndex: number | null = null;

const dragStart = (event: DragEvent, index: number) => {
  draggedItemIndex = index;
};

const drop = (event: DragEvent, index: number) => {
  if (draggedItemIndex !== null) {
    const draggedItem = formVal.value.splice(draggedItemIndex, 1)[0];
    formVal.value.splice(index, 0, draggedItem);
    draggedItemIndex = null;
    updateFormVal();
  }
};

const updateFormVal = () => {
  onChanged(props.ctx, props.valuePath, formVal.value, props.mutator);
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

const addItem = () => {
  formVal.value.push({id: Math.random().toString(), value: {}});
  updateFormVal();
};

const clearItems = () => {
  formVal.value = [];
  updateFormVal();
};

const removeSpecificItem = (index: number) => {
  formVal.value.splice(index, 1);
  updateFormVal();
};

onMounted(() => {
  initResult.value = props.schemaField.init(props.ctx, props.valuePath);
  formVal.value = initResult.value.value;
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
