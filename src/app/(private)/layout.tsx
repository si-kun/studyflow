import AuthGurad from '@/components/auth/AuthGurad'
import { ReactNode } from 'react'

const PrivateLayout = ({children}: {children: ReactNode}) => {

  return (
    <AuthGurad>{children}</AuthGurad>
  )
}

export default PrivateLayout