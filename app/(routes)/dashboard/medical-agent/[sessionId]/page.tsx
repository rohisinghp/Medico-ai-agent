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

function MedicalVoiceAgent() {

  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>()
  const [callStarted, setCallStarted] = useState(false)

  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);




  useEffect(() => {
    sessionId && GetSessionDetails()
  }, [sessionId])


  const GetSessionDetails = async () => {

    const result = await axios.get('/api/session-chat?sessionId=' + sessionId)
    // console.log("result is : "+result.data); //-------------------------------------------------------------------
    setSessionDetail(result.data)
  }

  const startCall = () => {
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
        console.log(`${message.role}: ${message.transcript}`);
      }
    });

  }


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

          <div className='mt-32'>
            <h2 className='text-gray-400'>Assistant Mesaag</h2>
            <h2 className='text-lg'>User Msg</h2>
          </div>

          {
            !callStarted ?
              <Button onClick={startCall} className='mt-20'> <PhoneCall /> Start Call </Button>
              :
              <Button variant={'destructive'}> <PhoneOff />  Disconnect Call</Button>

          }


        </div>
      }



    </div>
  )
}

export default MedicalVoiceAgent