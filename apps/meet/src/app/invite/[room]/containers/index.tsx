'use client'

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@atm0s-media-sdk/ui/components/index'
import { LoaderCircleIcon } from '@atm0s-media-sdk/ui/icons/index'
import { setCookie } from '@atm0s-media-sdk/ui/lib/cookies'
import { generateToken } from '@/app/actions/token'
import { Logo } from '@/components'

type Inputs = {
  username: string
}

type Props = {
  username?: RequestCookie
}

export const Invite: React.FC<Props> = ({ username }) => {
  const params = useParams()
  const searchParams = useSearchParams();
  // Lấy giá trị của tham số 'username'
  const name = searchParams.get('name');
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setCookie('username', data.username, 7)
    router.refresh()
  }

  const onGenerateToken = useCallback(async () => {
    const room = params.room as string;
    
    setCookie('username', name ? encodeURIComponent(name) : username, 7)
    const token = await generateToken(room, name || username?.value as string)
    let nameUser = name || username?.value;
    return router.push(`/${room}?gateway=0&peer=${nameUser}&token=${token}`)
  }, [params.room, router, username, name])

  useEffect(() => {
    if (username || name) {
      onGenerateToken()
    }
  }, [onGenerateToken, params.room, router, username, name])

  return !username ? (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs md:max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>
            <Logo />
          </CardTitle>
          <CardDescription>Enter your username to join the meeting</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="username"
              placeholder="Enter your username"
              {...register('username', { required: true })}
            />
            {errors.username && <span className="text-xs text-red-500">This field is required</span>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </form>
  ) : (
    <div className="w-full h-screen flex items-center justify-center">
      <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
    </div>
  )
}
