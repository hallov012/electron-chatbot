<template>
    <q-page class="iw-chat-page">
        <q-scroll-area class="iw-message-wrap">
            <q-chat-message
                v-for="(message, idx) in messageList"
                :key="idx"
                :name="message.isUser ? 'Me' : message.name"
                :text="message.text"
                :sent="message.isUser"
                :stamp="dateToStamp(message.timestamp)"
                :bg-color="message.isUser ? undefined : 'primary'"
                :text-color="message.isUser ? undefined : 'white'"
            />
        </q-scroll-area>
        <div class="iw-message-input-wrap">
            <q-input
                rounded
                standout
                v-model="message"
                @keyup.enter="sendMessage"
                color="primary"
                placeholder="Type a message..."
            />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { callGpt } from 'src/api/gpt';

defineOptions({
    name: 'ChatPage',
});

interface Message {
    text: string[];
    isUser: boolean;
    name?: string;
    timestamp: Date;
}

const messageList = ref<Message[]>([]);
const message = ref<string>('');

const sendMessage = async () => {
    if (message.value) {
        messageList.value.push({
            text: message.value.split('\n'),
            isUser: true,
            timestamp: new Date(),
        });

        const response = await callGpt(message.value);
        if (response.success) {
            messageList.value.push({
                name: 'Chat GPT-3',
                text: response.data.split('\n'),
                isUser: false,
                timestamp: new Date(),
            });

            window.electron.ipcRenderer.send('chat-message', {
                message: response.data,
                author: 'Chat GPT-3',
            });
        }

        message.value = '';
    }
};

const dateToStamp = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
};
</script>

<style lang="scss" scoped>
.iw-chat-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

    .iw-message-wrap {
        width: 100%;
        padding: 1rem;
        flex: 1;
    }

    .iw-message-input-wrap {
        width: 100%;
        padding: 1rem;
    }
}
</style>
