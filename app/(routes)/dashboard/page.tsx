import React from 'react'
import HistoryList from './_component/HistoryList'
import { Button } from '@/components/ui/button'
import DoctorAgentList from './_component/DoctorAgentList'
import AddNewSessionDialog from './_component/AddNewSessionDialog'

const Dashboard = () => {
    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl'>My Dashboard</h2>
                <AddNewSessionDialog/>
            </div>
            <HistoryList />

            <DoctorAgentList/>

        </div>
    )
}

export default Dashboard