<template>
    <q-layout view="lHh Lpr lFf" class="iw-layout">
        <q-list class="iw-list-wrap">
            <q-item-label header> INNO Chat </q-item-label>
            <q-item
                v-ripple
                v-for="tab in tabList"
                clickable
                :key="tab.title"
                class="iw-list-item"
                @click="$router.push(`/chat/${tab.path}`)"
            >
                <q-avatar
                    color="primary"
                    text-color="white"
                    :icon="tab.icon"
                    size="md"
                />
                <q-item-section class="iw-item-title">{{
                    tab.title
                }}</q-item-section>
            </q-item>
        </q-list>

        <q-page-container class="iw-page-container">
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

defineOptions({
    name: 'MainLayout',
});

interface Tab {
    title: string;
    path: string;
    icon: string;
}

const tabList: Tab[] = [
    {
        title: 'Chat GPT-3',
        icon: 'school',
        path: '/chat',
    },
    {
        title: 'XCAP Cloud',
        icon: 'cloud',
        path: '/xcap',
    },
];

const route = useRoute();
const path = computed(() => route.path);
console.log('path', path);
</script>

<style lang="scss" scoped>
.iw-layout {
    height: 100vh;
    display: flex;

    .iw-list-wrap {
        height: 100%;
        min-width: 250px;
        max-width: 350px;
        width: 20vw;
        border-right: 1px solid $grey-4;

        .iw-list-item {
            display: flex;
            align-items: center;
            gap: 10px;

            .iw-item-title {
                font-size: 1em;
            }
        }
    }

    .iw-page-container {
        flex: 1;
    }
}
</style>
