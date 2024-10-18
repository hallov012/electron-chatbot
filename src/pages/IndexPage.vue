<template>
  <q-page class="row items-center justify-evenly">
    0.0.7
    <QBtn @click="alertClick">Alert</QBtn>
    <QBtn @click="confirmClick">Confirm</QBtn>
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/ExampleComponent.vue';

defineOptions({
  name: 'IndexPage',
});

const alertClick = () => {
  alert('Hello, Quasar!');
};

const confirmClick = () => {
  const result = confirm('Are you sure?');
  if (result) {
    alert('You clicked OK!');
  } else {
    alert('You clicked Cancel!');
  }
};

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'ct1',
  },
  {
    id: 2,
    content: 'ct2',
  },
  {
    id: 3,
    content: 'ct3',
  },
  {
    id: 4,
    content: 'ct4',
  },
  {
    id: 5,
    content: 'ct5',
  },
]);

const meta = ref<Meta>({
  totalCount: 1200,
});
</script>
