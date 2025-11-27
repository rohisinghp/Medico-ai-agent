'use client'

import React, {  useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { UserDatailContext } from '@/context/UserDetailContext';

export type UsersDetail = {
  name: string,
  email: string,
  credit: number
}

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  const { user } = useUser();

  const [userDetail, setUserDetail]= useState<any>(undefined)

  useEffect(() => {
    CreateNewUser();
  }, [user])

  const CreateNewUser = async() => {
    const result = await axios.post('/api/users');
    setUserDetail(result.data);
  }


  return (
    <div>
      <UserDatailContext.Provider value={{userDetail, setUserDetail}}>

        {children}

      </UserDatailContext.Provider>

    </div>
  )
}

export default Provider;