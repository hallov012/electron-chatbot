<template>
    <q-layout view="lHh Lpr lFf" class="iw-layout">
        <q-list class="iw-list-wrap">
            <q-item-label header> INNO Chat </q-item-label>
            <q-item
                v-ripple
                :active="currentChat === tab.id"
                v-for="tab in tabList"
                clickable
                :key="tab.title"
                class="iw-list-item"
                @click="currentChat = tab.id"
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
            <template v-for="chat in opendChatList" :key="chat">
                <ChatContainer
                    v-show="chat === currentChat"
                    class="iw-chat-page"
                    :page-key="currentChat"
                />
            </template>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ChatContainer from 'src/components/ChatContainer.vue';

defineOptions({
    name: 'MainLayout',
});

interface Tab {
    title: string;
    id: string;
    icon: string;
}

const tabList: Tab[] = [
    {
        title: 'Chat GPT-3',
        icon: 'school',
        id: 'gpt',
    },
    {
        title: 'XCAP Cloud',
        icon: 'cloud',
        id: 'xcap',
    },
];

const opendChatList = ref<string[]>([]);
const currentChat = ref<string>('');

onMounted(() => {
    currentChat.value = tabList[0].id;
    opendChatList.value = tabList.map((tab) => tab.id);
});
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
        width: 100%;
        height: 100%;
    }
}
</style>
