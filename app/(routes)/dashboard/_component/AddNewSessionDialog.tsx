"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DialogClose } from '@radix-ui/react-dialog'
import { ArrowRight } from 'lucide-react'
import axios from 'axios'
import { doctorAgent } from './DoctorAgentCard'


function AddNewSessionDialog() {

    const [note, setNote] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [suggestedDoctor, SetsuggestedDoctor] = useState<doctorAgent[]>()

    const OnclickNext = async () => {
        setLoading(true);
        const result = await axios.post('/api/suggest-doctors', {
            notes: note
        });
        console.log(result.data);
        SetsuggestedDoctor(result.data);
        setLoading(false)
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button className='mt-3'>+ Start a Consultation</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Basic Details</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <h2>Add Symtoms and any Other Details</h2>
                            <Textarea placeholder='Add more Details here...'
                                className='h-[200px] mt-2'
                                onChange={(e) => setNote(e.target.value)} />
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                    <Button disabled={!note} onClick={() => OnclickNext()}>Next <ArrowRight /></Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewSessionDialog