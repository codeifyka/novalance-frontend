import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import { JobPostVue } from '@/components/childcomponent/job_post';
import RestUserSession from '@/libs/RestUserSession';
import RestClientJobs from "@/libs/RestClientJobs";
import { inject, onMounted, ref, nextTick } from 'vue';

export default {
    components: { FreeLancerHeaderVue, JobPostVue },
    setup() {
        const ws = inject('ws');
        const userId = ref(null);
        const channelId = 'some-channel-id';
        const messages = ref([]);
        const newMessage = ref('');
        const messagesRef = ref(null);
        const colors = ref({
            'text': 'text-purple-700',
            'background': "bg-violet-50/60",
        })

        const axios = inject("axios");
        const restUserSession = new RestUserSession(axios);
        let user_info = ref({ user: { username: "undefined" }, services: 0, projects: 0, sells: 0 });

        let Jobs = ref([])
        let restClientJobs = new RestClientJobs(axios)
        const fetchData = async () => {
            try {
                const response = await restClientJobs.getAll();
                if (response.data) {
                    Jobs.value = response.data;
                    console.log(response.data)
                } else {
                    console.log(response);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        };

        const connect = () => {
            userId.value = Math.random().toString(36).substring(2);
            ws.send(JSON.stringify({ type: 'connect', userId: userId.value, channelId }));
        };

        const sendMessage = () => {
            if (newMessage.value.trim() !== '') {
                ws.send(JSON.stringify({ type: 'message', userId: userId.value, message: newMessage.value, channelId }));
                newMessage.value = '';
            }
        };

        onMounted(() => {
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log(message)
                if (message.channelId === channelId) {
                    messages.value.push(message);
                    nextTick(() => {
                        messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
                    });
                }
            };

            connect();
        });
        return {
            user_info, colors, fetchData, Jobs, sendMessage, messagesRef, userId, messages, newMessage,
        };

    }
}
