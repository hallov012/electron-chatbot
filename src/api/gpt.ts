/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai';

interface GptResponse {
    success: boolean;
    data: any;
}

const configuration = {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
};

const openai = new OpenAI(configuration);
// const completion = await openai.createCompletion({
//     model: 'text-davinci-003',
//     prompt: 'Once upon a time',
// });

export const callGpt = async (msg: string): Promise<GptResponse> => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: msg,
                        },
                    ],
                },
            ],
        });
        return {
            success: true,
            data: response.choices[0].message.content,
        };
    } catch (error) {
        return {
            success: false,
            data: error,
        };
    }
};
