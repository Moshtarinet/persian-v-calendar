<template>
  <div>
    <h1>V-Calendar Test Page</h1>

    <v-date-picker v-model="date" mode="date" locale="fa" />
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  setup() {
    const date = ref(new Date());

    watch(date, (newVal, oldVal) => {
      // conso/le.log('date changed', newVal, oldVal);
    });

    // Return the date so it can be used in the template
    return {
      date,
    };
  },
};
</script>

<style>
/* Add any styles for your test page here */
</style>
