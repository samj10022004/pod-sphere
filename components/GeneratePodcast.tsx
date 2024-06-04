// import React, { useState } from 'react'
// import { GeneratePodcastProps } from '@/types'
// import { Label } from './ui/label'
// import { Textarea } from './ui/textarea'
// import { Button } from './ui/button'
// import { Loader } from 'lucide-react'
// import { useAction, useMutation } from 'convex/react'
// import { api } from '@/convex/_generated/api'
// import { v4 as uuidv4 } from 'uuid'
// import { useUploadFiles } from '@xixixao/uploadstuff/react'
// import { toast, useToast } from "@/components/ui/use-toast"

// const useGeneratePodcast = ({ voicePrompt, voiceType, setAudio, setAudioStorageId }: GeneratePodcastProps) => {
//   const [isGenerating, setIsGenerating] = useState(false);
//   const generateUploadUrl = useMutation(api.files.generateUploadUrl)
//   const { startUpload } = useUploadFiles(generateUploadUrl)
//   const getPodcastAudio = useAction(api.openai.generateAudioAction)
//   const getAudioUrl = useMutation(api.podcasts.getUrl)

//   const generatePodcast = async () => {
//     setIsGenerating(true);
//     setAudio('');
//     if (!voicePrompt) {
//       toast({
//         title: "Error",
//         description: "Please enter a prompt to generate a podcast from",
//       })
//       setIsGenerating(false);
//       return;
//     }
//     try {
//       const response = await getPodcastAudio({
//         voice: voiceType,
//         input: voicePrompt
//       })

//       const blob = new Blob([response], { type: 'audio/mpeg' });
//       const fileName = `podcast-${uuidv4()}.mp3`;
//       const file = new File([blob], fileName, { type: 'audio/mpeg' });
//       const uploaded = await startUpload([file]);
//       const storageId = (uploaded[0].response as any).storageId;

//       setAudioStorageId(storageId);
//       const audioUrl = await getAudioUrl({ storageId });
//       setAudio(audioUrl!);
//       toast({
//         title: "Podcast generated successfully",
//       })
//     } catch (error) {
//       console.log('Error generating podcast', error);
//       toast({
//         title: "Error creating a podcast",
//         variant: 'destructive',
//       })
//     } finally {
//       setIsGenerating(false);
//     }
//   }

//   return {
//     isGenerating,
//     generatePodcast
//   }
// }

// const GeneratePodcast = (props: GeneratePodcastProps) => {
//   const { isGenerating, generatePodcast } = useGeneratePodcast(props);

//   return (
//     <div>
//       <div className='flex flex-col gap-2.5'>
//         <Label className="text-16 font-bold text-white-1">
//           AI Prompt to generate podcast
//         </Label>
//         <Textarea
//           className='input-class font-light focus-visible:ring-offset-orange-1'
//           placeholder='Provide text to generate audio'
//           rows={5}
//           value={props.voicePrompt}
//           onChange={(e) => props.setVoicePrompt(e.target.value)}
//         />
//       </div>
//       <div className="mt-5 w-full max-w-[200px]">
//         <Button type="button" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
//           {isGenerating ? (
//             <>
//               <Loader size={20} className="animate-spin ml-2" />
//               Generating...
//             </>
//           ) : "Generate"}
//         </Button>
//       </div>
//       {props.audio && (
//         <audio
//           controls
//           src={props.audio}
//           autoPlay
//           className='mt-5'
//           onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
//         />
//       )}
//     </div>
//   )
// }

// export default GeneratePodcast;




import React, { useState, useRef } from 'react'
import { GeneratePodcastProps } from '@/types'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { toast, useToast } from "@/components/ui/use-toast"
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

const useGeneratePodcast = ({ voicePrompt, voiceType, setAudio, setAudioStorageId }: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getPodcastAudio = useAction(api.openai.generateAudioAction)
  const getAudioUrl = useMutation(api.podcasts.getUrl)

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio('');
    if (!voicePrompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate a podcast from",
      })
      setIsGenerating(false);
      return;
    }
    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt
      })

      const blob = new Blob([response], { type: 'audio/mpeg' });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      toast({
        title: "Podcast generated successfully",
      })
    } catch (error) {
      console.log('Error generating podcast', error);
      toast({
        title: "Error creating a podcast",
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false);
    }
  }

  return {
    isGenerating,
    generatePodcast
  }
}

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  const [isAiPodcast, setIsAiPodcast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getAudioUrl = useMutation(api.podcasts.getUrl)

  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      const fileName = `podcast-${uuidv4()}.mp3`;
      const uploaded = await startUpload([new File([blob], fileName, { type: 'audio/mpeg' })]);
      const storageId = (uploaded[0].response as any).storageId;

      props.setAudioStorageId(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      props.setAudio(audioUrl!);
      toast({
        title: "Audio uploaded successfully",
      });
    } catch (error) {
      console.log('Error uploading audio', error);
      toast({
        title: "Error uploading audio",
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="generate_thumbnail">
        <Button type="button" variant="plain" onClick={() => setIsAiPodcast(true)} className={cn('', { 'bg-black-6': isAiPodcast })}>
          Use AI to generate podcast
        </Button>
        <Button type="button" variant="plain" onClick={() => setIsAiPodcast(false)} className={cn('', { 'bg-black-6': !isAiPodcast })}>
          Upload custom audio
        </Button>
      </div>
      {isAiPodcast ? (
        <div className='flex flex-col gap-5'>
          <div className='mt-5 flex flex-col gap-2.5'>
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate podcast
            </Label>
            <Textarea
              className='input-class font-light focus-visible:ring-offset-orange-1'
              placeholder='Provide text to generate audio'
              rows={5}
              value={props.voicePrompt}
              onChange={(e) => props.setVoicePrompt(e.target.value)}
            />
          </div>
          <div className="mt-5 w-full max-w-[200px]">
            <Button type="button" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
              {isGenerating ? (
                <>
                  <Loader size={20} className="animate-spin ml-2" />
                  Generating...
                </>
              ) : "Generate"}
            </Button>
          </div>
        </div>
      ) : (
        <div className='image_div' onClick={() => audioRef?.current?.click()}>
          <Input type="file" className='hidden' ref={audioRef} onChange={uploadAudio} accept="audio/*" />
          {!isUploading ? (
            <div className='text-16 flex-center font-medium text-white-1'>
              Click to upload audio
            </div>
          ) : (
            <div className='text-16 flex-center font-medium text-white-1'>
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className='text-12 font-bold text-orange-1'>
              Click to upload
            </h2>
            <p className='text-12 font-normal text-gray-1'>MP3 or WAV (max. 10MB)</p>
          </div>
        </div>
      )}
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className='mt-5'
          onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  )
}

export default GeneratePodcast;
