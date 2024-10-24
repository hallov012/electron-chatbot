<template>
  <router-view />
</template>

<script setup lang="ts">

defineOptions({
  name: 'App',
  mounted() {
    window.electron.ipcRenderer.receive('updater-message', (message : string) => {
      console.log('Received message from main process:', message);
      if (message === 'Update has been downloaded. You can install it now.') {
        const userConfirm = confirm(message);
        if (userConfirm) {
          window.electron.ipcRenderer.send('install-update');
        }
      } else {
        alert(message);
      }
    })
  }
});
</script>
