import { cookies } from 'next/headers'
import PreLaunchLanding from '@/components/home/PreLaunchLanding'
import AuthenticatedHome from '@/components/home/AuthenticatedHome'

export default async function HomePage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('mxwll-preview-auth')
  const isAuthenticated = authCookie?.value === process.env.PREVIEW_AUTH_TOKEN

  if (isAuthenticated) {
    return <AuthenticatedHome />
  }

  return <PreLaunchLanding />
}
