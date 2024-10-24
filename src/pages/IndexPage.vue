<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="column items-center justify-center">
        <div class="iw-header">Version 0.0.7</div>
        <div class="iw-logo-wrap column items-center q-mb-lg">
          <q-icon
            name="chat"
            size="10em"
            color="primary"
            class="iw-logo-icon q-mb-xs"
          />
          <span class="iw-logo-text">INNO Chat</span>
        </div>

        <q-btn
          color="primary"
          label="Start Chatting"
          outline
          @click="() => $router.push('/chat')"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
});
</script>

<style lang="scss" scoped>
.iw-header {
  position: fixed;
  top: 4px;
  right: 4px;
  color: $secondary;
}

.iw-logo-icon {
  background: linear-gradient(to right, $primary, $secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.iw-logo-text {
  font-size: 2.5em;
  font-weight: 700;
  text-align: center;
  margin: 0;
  background: linear-gradient(to right, $primary, $secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
