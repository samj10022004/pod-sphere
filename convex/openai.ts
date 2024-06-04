import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from 'openai'
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai=new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
});
export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler:async (_, {voice,input}) => {

    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice as SpeechCreateParams['voice'],
        input,
      });
    const buffer = await mp3.arrayBuffer();
    return buffer;

  },
});
// import { action } from "./_generated/server";
// import { v } from "convex/values";
// import textToSpeech from '@google-cloud/text-to-speech';
// import { Readable } from 'stream';

// const client = new textToSpeech.TextToSpeechClient();

// export const generateAudioAction = action({
//   args: { input: v.string(), voice: v.string() },
//   handler: async (_, { voice, input }) => {
//     const request = {
//       input: { text: input },
//       voice: {
//         languageCode: 'en-US',
//         ssmlGender: 'NEUTRAL'// Ensure this matches the Google Text-to-Speech format.
//       },
//       audioConfig: {
//         audioEncoding: 'MP3',
//       },
//     };

//     const [response] = await client.synthesizeSpeech(request);
//     const buffer = response.audioContent;

//     if (!buffer) {
//       throw new Error('No audio content received from the API.');
//     }

//     return buffer;
//   },
// });
export const generateThumbnailAction=action({
  args:{prompt:v.string()},
  handler:async(_,{prompt})=>{
    const response = await openai.images.generate({
      prompt,
      size:'1024x1024',
      quality:'standard',
      n:1,
    })
    const url = response.data[0].url;
    if(!url){
      throw new Error('Error generating thumbnail');
    }
    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  }
})