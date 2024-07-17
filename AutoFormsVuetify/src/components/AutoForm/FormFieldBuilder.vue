<template>
<template v-if="isPrimitive(field.type)">
    <template v-if="field.type === 'string'">
    <StringFormValue :mutator="mutator" :schema="field" :field="field" :ctx="context" :value-path="path" />
    </template>
    <template v-else-if="field.type === 'number'">
    <NumberFormValue :mutator="mutator" :schema="field" :field="field" :ctx="context" :value-path="path" />
    </template>
    <template v-else-if="field.type === 'integer'">
    <IntegerFormValue :mutator="mutator" :schema="field" :field="field" :ctx="context" :value-path="path" />
    </template>
</template>
<template v-else-if="field.isArray">
    <ArrayBuilder :mutator="mutator" :schema="schema" :schema-field="field" :value-path="path" :ctx="context" />
</template>
<template v-else-if="isChoice(field.type)">
    <ChoiceBuilder :mutator="mutator" :schema="schema" :schema-field="field" :value-path="path" :ctx="context" />
</template>
<template v-else>
    <FormBuilder :mutator="mutator" :schema="schema" :schema-type="getNonPrimitive(field.type)" :context="context" :path="path" />
</template>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { SchemaType, Schema } from './AutoFormsSchema';
import StringFormValue from './StringFormValue.vue';
import NumberFormValue from './NumberFormValue.vue';
import IntegerFormValue from './IntegerFormValue.vue';
import FormBuilder from './FormBuilder.vue';
import ChoiceBuilder from './ChoiceBuilder.vue';
import { isChoice } from './helpers/index';
import ArrayBuilder from './ArrayBuilder.vue';

const props = defineProps<{
    schema: Schema;
    field: any;
    context: any;
    path: string;
    mutator: (valuePath: string, value: any) => void;
}>();

const isPrimitive = (type: string): boolean => {
    return !props.schema.types[type] && !isChoice(type);
};

const getNonPrimitive = (type: string): SchemaType<any> => {
    return props.schema.types[type];
};
</script>

<style scoped lang="sass">
</style>
