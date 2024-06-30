<template>
  <div>
    <h1>V-Calendar Test Page</h1>

    <VDatePicker v-model="date" mode="date" locale="fa" :popover="pop" />
    <hr />
    <h2>{{ date }}</h2>
    <input v-model="date" />
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  setup() {
    const date = ref(null);
    watch(date, (newVal, oldVal) => {
      console.log('date changed', newVal, oldVal,typeof newVal,typeof oldVal);
    });
    /// log all component registered in the app

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
