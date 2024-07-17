<template>
  <v-card class="pa-4" color="white">
    <h2>{{ schemaType.label }}</h2>
    <template v-for="(field, key) in schemaType.fields" :key="field.name">
      <template v-if="isPrimitive(field.type)">
        <template v-if="field.type === 'string'">
          <StringFormValue :schema="field" :field="field" :ctx="context" :value-path="appendPath(path, key as string)" />
        </template>
        <template v-else-if="field.type === 'number'">
          <NumberFormValue :schema="field" :field="field" :ctx="context" :value-path="appendPath(path, key as string)" />
        </template>
        <template v-else-if="field.type === 'integer'">
          <IntegerFormValue :schema="field" :field="field" :ctx="context" :value-path="appendPath(path, key as string)" />
        </template>
      </template>
      <template v-else-if="isChoice(field.type)">
        <ChoiceBuilder :schema="schema" :schema-field="field" :value-path="appendPath(path, key as string)" :ctx="context" />
      </template>
      <template v-else>
        <FormBuilder :schema="schema" :schema-type="getNonPrimitive(field.type)" :context="context" :path="appendPath(path, key as string)" />
      </template>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { SchemaType, Schema } from './AutoFormsSchema';
import StringFormValue from './StringFormValue.vue';
import NumberFormValue from './NumberFormValue.vue';
import IntegerFormValue from './IntegerFormValue.vue';
import FormBuilder from './FormBuilder.vue'; // Ensure FormBuilder is imported
// import ChoiceBuilder from './ChoiceBuilder.vue'; // Ensure ChoiceBuilder is imported
import { isChoice, appendPath } from './helpers/index';

const props = defineProps<{
  schema: Schema;
  schemaType: SchemaType<any>;
  context: any;
  path: string;
}>();

const isPrimitive = (type: string): boolean => {
  return !props.schema.types[type] && !isChoice(type);
  // return true;
};

const getNonPrimitive = (type: string): SchemaType<any> => {
  return props.schema.types[type];
};
</script>

<style scoped lang="sass">

</style>
