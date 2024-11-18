<template>
    <router-view />
</template>

<script setup lang="ts">
defineOptions({
    name: 'App',
    mounted() {
        window.electron.ipcRenderer.receive(
            'updater-message',
            (message: string) => {
                console.log('Received message from main process:', message);
                if (message === '업데이트가 있습니다. 지금 설치하시겠습니까?') {
                    const userConfirm = confirm(message);
                    if (userConfirm) {
                        window.electron.ipcRenderer.send('install-update');
                    }
                } else {
                    alert(message);
                }
            }
        );
    },
});
</script>
