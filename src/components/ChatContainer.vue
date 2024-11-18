<template>
    <q-page class="iw-chat-page">
        <q-scroll-area class="iw-message-wrap">
            <div
                class="iw-chat-message"
                :class="{ 'iw-sent-by-me': message.isUser }"
                v-for="(message, idx) in messageList"
                :key="idx"
            >
                <div class="iw-name">
                    {{ message.isUser ? 'Me' : message.name }}
                </div>
                <div class="iw-message-content">
                    <div class="iw-text" v-if="message.text">
                        {{ message.text }}
                    </div>
                    <div
                        class="iw-link"
                        v-if="message.link"
                        @click="openLink(message.link)"
                    >
                        Click And Move To XCAP-Cloud
                    </div>
                    <div class="iw-timestamp">
                        {{ dateToStamp(message.timestamp) }}
                    </div>
                </div>
            </div>
        </q-scroll-area>
        <div class="iw-message-input-wrap">
            <q-input
                rounded
                standout
                v-model="message"
                @keyup.enter="sendMessage"
                placeholder="Type a message..."
            />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { callGpt } from 'src/api/gpt';

defineOptions({
    name: 'ChatContainer',
});

const props = defineProps<{
    pageKey: string;
}>();

interface Message {
    text?: string;
    link?: string;
    isUser: boolean;
    name?: string;
    timestamp: Date;
}

const messageList = ref<Message[]>([]);
const message = ref<string>('');

const sendMessage = async () => {
    if (message.value) {
        messageList.value.push({
            text: message.value,
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
            text: response.data,
            isUser: false,
            timestamp: new Date(),
        });

        alertMessage(response.data, 'Chat GPT-3');
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

    setTimeout(() => {
        messageList.value.push({
            name: 'XCAP Cloud',
            link: url,
            isUser: false,
            timestamp: new Date(),
        });

        alertMessage('Click And Move To XCAP-Cloud', 'XCAP Cloud');
    }, 3000);
};

const alertMessage = (message: string, author: string) => {
    window.electron.ipcRenderer.send('chat-message', { message, author });
};

const dateToStamp = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const openLink = (link: string) => {
    window.electron.ipcRenderer.send('open-external', link);
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
        max-width: 100%;

        ::v-deep .q-scrollarea__content {
            display: flex;
            flex-direction: column;
        }

        .iw-chat-message {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 1rem;

            > .iw-message-content {
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                background-color: $primary;
                color: white;
                display: flex;
                flex-direction: column;
                max-width: 60%;

                > .iw-text {
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    white-space: pre-wrap;
                    cursor: pointer;
                }

                > .iw-link {
                    color: white;
                    text-decoration: underline;
                    cursor: pointer;
                }

                > .iw-timestamp {
                    font-size: 0.8rem;
                    opacity: 0.7;
                }
            }

            &.iw-sent-by-me {
                align-items: flex-end;

                > .iw-message-content {
                    background-color: #e0e0e0;
                    color: black;
                    align-items: flex-end;
                }
            }

            ::v-deep a {
                color: white;
                text-decoration: underline;
            }
        }
    }

    .iw-message-input-wrap {
        width: 100%;
        padding: 1rem;

        ::v-deep .q-field--highlighted {
            .q-field__control {
                background-color: $primary;
            }
        }
    }
}
</style>
