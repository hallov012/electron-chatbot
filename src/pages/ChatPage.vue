<template>
    <q-page class="iw-chat-page">
        <q-scroll-area class="iw-message-wrap">
            <q-chat-message
                class="iw-chat-message"
                v-for="(message, idx) in messageList"
                :key="idx"
                :name="message.isUser ? 'Me' : message.name"
                :text="message.text"
                :sent="message.isUser"
                text-html
                :stamp="dateToStamp(message.timestamp)"
                :bg-color="message.isUser ? undefined : 'primary'"
                :text-color="message.isUser ? undefined : 'white'"
            >
            </q-chat-message>
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

const props = defineProps<{
    pageKey: string;
}>();

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

        if (props.pageKey === 'gpt') {
            await sendMessageToGpt();
        } else if (props.pageKey === 'xcap') {
            await sendMessageToXcap();
        }

        message.value = '';
    }
};

const sendMessageToGpt = async () => {
    const response = await callGpt(message.value);
    if (response.success) {
        messageList.value.push({
            name: 'Chat GPT-3',
            text: [`<span>${response.data}</span>`],
            isUser: false,
            timestamp: new Date(),
        });

        window.electron.ipcRenderer.send('chat-message', {
            message: response.data,
            author: 'Chat GPT-3',
        });
    }
};

const sendMessageToXcap = async () => {
    const widgetData = {
        period: {
            start: '20160101090000',
            end: '20240830085900',
        },
        data: {
            widgetType: 'Graph',
            aggr: 'sum',
            cdrDbTableName: 'voicecall_statistics',
            dbColumnName: 'common_success_cnt',
            columnName: '기본 SUCCESS CNT',
            chartTypeId: 'line_1',
        },
    };

    const url =
        import.meta.env.VITE_XCAP_CLOUD_URL +
        '?widgetData=' +
        JSON.stringify(widgetData);
    messageList.value.push({
        name: 'XCAP Cloud',
        text: [
            `<a class="iw-link" href="${url}" target="_blank">Click here to view the XCAP Cloud</a>`,
        ],
        isUser: false,
        timestamp: new Date(),
    });
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

        .iw-chat-message {
            margin-bottom: 1rem;

            ::v-deep a {
                color: white;
                text-decoration: underline;
            }
        }
    }

    .iw-message-input-wrap {
        width: 100%;
        padding: 1rem;
    }
}
</style>
