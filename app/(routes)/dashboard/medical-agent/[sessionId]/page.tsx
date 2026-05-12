'use client'

import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { doctorAgent } from '../../_component/DoctorAgentCard';
import { Circle, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';


type SessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  report: JSON,
  selectedDoctor: doctorAgent,
  createdOn: string
}

type messages  ={
  role: string,
  text: string
}

function MedicalVoiceAgent() {

  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>()
  const [callStarted, setCallStarted] = useState(false)
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRoll, setCurrentRoll] = useState<string| null>()
  const [liveTranscript, setLiveTranscript] = useState<string>()
  const [messages, setMessages] = useState<messages[]>([])


  useEffect(() => {
    sessionId && GetSessionDetails()
  }, [sessionId])


  const GetSessionDetails = async () => {

    const result = await axios.get('/api/session-chat?sessionId=' + sessionId)
    // console.log("result is : "+result.data); //-------------------------------------------------------------------
    setSessionDetail(result.data)
  }

  const startCall = () => {
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
      setVapiInstance(vapi);

    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID);

    vapi.on('call-start', () => {
      setCallStarted(true)
      console.log('Call started')
    });

    vapi.on('call-end', () => {
      setCallStarted(false)
      console.log('Call ended')
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        const {role, transcriptType, transcript} = message;
        console.log(`${message.role}: ${message.transcript}`);

        if(transcriptType=='partial'){
          setLiveTranscript(transcript)
          setCurrentRoll(role)
        }
        else if(transcriptType=='final'){
          // final transcript
          setMessages((prev: any)=> [...prev, {role: role, text: transcript}])
          setLiveTranscript("");
          setCurrentRoll(null)

        }
      }
    });
  }

    // vapiInstance.on('speech-start', () => {
    //   console.log('Assistant started speaking');
    //   setCurrentRoll('assistant')
    // });
    // vapiInstance.on('speech-end', () => {
    //   console.log('Assistant stopped speaking');
    //   setCurrentRoll('user')
    // });

    useEffect(() => {
  if (!vapiInstance) return;

  const handleSpeechStart = () => {
    console.log("Assistant started speaking");
    setCurrentRoll("assistant");
  };

  const handleSpeechEnd = () => {
    console.log("Assistant stopped speaking");
    setCurrentRoll("user");
  };

  vapiInstance.on("speech-start", handleSpeechStart);
  vapiInstance.on("speech-end", handleSpeechEnd);

  return () => {
    // Cleanup on unmount OR new instance
    vapiInstance.off("speech-start", handleSpeechStart);
    vapiInstance.off("speech-end", handleSpeechEnd);
  };
}, [vapiInstance]);


  const endCall = ()=>{
    if(!vapiInstance) return

      vapiInstance.stop();

      vapiInstance.off('call-start');
      vapiInstance.off('call-end');
      vapiInstance.off('message');


      setCallStarted(false)
      setVapiInstance(null)
    
  };

  return (
    <div className='p-5 border rounded-2xl bg-secondary '>

      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'><Circle className={`h-4 w-4 rounded-full border-none ${callStarted ? 'bg-green-400' : 'bg-red-600'}`} />{callStarted? 'Connected...' : 'Not Connected'}</h2>
        <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
      </div>

      {
        sessionDetail && <div className='flex items-center flex-col mt-10'>
          <Image src={sessionDetail?.selectedDoctor?.image}
            alt={sessionDetail?.selectedDoctor?.specialist}
            width={120}
            height={120}
            className='h-[100px] w-[100px] object-cover rounded-full'
          />
          <h2 className='font-bold text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
          <p className='text-sm text-gray-400'>AI Medical Voice Assistant</p>

          <div className='mt-12 overflow-y-auto flex flex-col items-center md:px-28 lg:px-52 xl-px-72'>
             {messages?.slice(-4).map((msg , index)=>(
              
                <h2 className='text-gray-400 p-2' key={index}>
                  {msg.role === 'user' ? 'You' : 'Assistant'} : {msg.text}
                </h2>
              
             ))}
            <h2 className='text-gray-400 text-bold'>Assistant Message</h2>
           {liveTranscript &&  liveTranscript?.length >0 && 
            <h2 className='text-lg'>{currentRoll} : {liveTranscript}</h2>
           }
          </div>

          {
            !callStarted ?
              <Button onClick={startCall} className='mt-20 cursor-pointer'> <PhoneCall /> Start Call </Button>
              :
              <Button variant={'destructive'} className='cursor-pointer' onClick={endCall}> <PhoneOff />  Disconnect Call</Button>

          }

        </div>
      }

    </div>
  )
}

export default MedicalVoiceAgent