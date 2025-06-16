import { ReactNode } from 'react'

const AuthLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='w-full h-full flex items-center justify-center bg-indigo-100'>{children}</div>
  )
}

export default AuthLayout