'use client'

import { generateToken } from '@/app/actions/token'
import { Logo } from '@/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { env } from '@/config'
import { Layout } from '@/layouts'
import { generateRandomString } from '@/lib'
import { useUser } from '@clerk/nextjs'
import { map } from 'lodash'
import { Copy, CopyCheck, Link, Loader, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import RoomManager from '@/lib/room'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { useCopyToClipboard } from 'usehooks-ts'

type Inputs = {
  room: string
}

type Props = {}

export const NewRoom: React.FC<Props> = () => {
  const { user } = useUser()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const [gatewayIndex, setGatewayIndex] = useState('0')
  const [isLoadingJoin, setIsLoadingJoin] = useState(false)
  const [isLoadingCreate, setIsLoadingCreate] = useState(false)
  const [isCopy, setIsCopy] = useState(false)
  const [, onCopy] = useCopyToClipboard()
  const [roomSave, setRoomSave] = useState('')

  const gateways = env.GATEWAYS

  const onGenerateToken = async (room: string) => {
    const token = await generateToken(room, user?.id as string)
    return router.push(`/${room}?gateway=${gatewayIndex}&peer=${user?.id}&token=${token}`)
  }

  const onJoin: SubmitHandler<Inputs> = async (data) => {
    setIsLoadingJoin(true)
    await onGenerateToken(data.room)
    setIsLoadingJoin(false)
  }

  const onCreate: SubmitHandler<Inputs> = async (data) => {
    setIsLoadingCreate(true)
    await onGenerateToken(data.room)
    setIsLoadingCreate(false)
  }

  const onCreateMeetRoom: SubmitHandler<Inputs> = async (data) => {
    RoomManager.createRoom(data.room, 'RoomFake.' + data.room)
    setIsLoadingCreate(true)
    await generateToken(data.room, user?.id as string)
    setRoomSave(data.room)
    setIsLoadingCreate(false)
  }

  const copyToClipboardMeetingLink = async (value: string) => {
    setIsCopy(true)
    await onCopy(value as string)
    setTimeout(() => {
      setIsCopy(false)
    }, 2000)
  }

  const meetingLink = useMemo(() => `${window?.origin}/invite/${roomSave}`, [roomSave])

  return (
    <Layout>
      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit(onJoin)} className="w-full max-w-xs md:max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>
                <Logo />
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Select value={gatewayIndex} onValueChange={setGatewayIndex}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {map([gateways], (gateway, index) => (
                      <SelectItem key={index} value={String(index)}>
                        {gateway}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* <Button
                loading={isLoadingCreate}
                type="button"
                className="w-full"
                variant="destructive"
                onClick={() =>
                  onCreate({
                    room: generateRandomString(8),
                  })
                }
              >
                Create new room
              </Button> */}
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="destructive" type="button" className="w-full">
                      Create new room
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer">
                        <DialogTrigger
                          asChild
                          onClick={() =>
                            onCreateMeetRoom({
                              room: generateRandomString(8),
                            })
                          }
                        >
                          <div className="flex flex-1 items-center gap-2 [&>svg]:size-4 [&>svg]:shrink-0">
                            <Link />
                            Create a meeting for later use
                          </div>
                        </DialogTrigger>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          onCreate({
                            room: generateRandomString(8),
                          })
                        }
                      >
                        <Button
                          loading={isLoadingCreate}
                          type="button"
                          className="h-full w-full justify-start p-0 font-normal"
                          variant="ghost"
                        >
                          <Plus />
                          Start an instant meeting
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Here is information on how to participate.</DialogTitle>
                    <DialogDescription>
                      Send this link to the people you want to meet with. Save the link for later use.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {isLoadingCreate && <Loader />}

                    {!isLoadingCreate && (
                      <div className="flex h-10 items-center gap-2 rounded bg-zinc-200 pl-3">
                        <div className="flex-1 text-sm">{meetingLink}</div>
                        <Button variant="link" size="icon" onClick={() => copyToClipboardMeetingLink(meetingLink)}>
                          {isCopy ? <CopyCheck size={16} className="text-green-500" /> : <Copy size={16} />}
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 border-t" />
                <div className="text-sm">Or join a room</div>
                <div className="flex-1 border-t" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="room">Room ID</Label>
                <Input id="room" type="room" placeholder="Enter room id" {...register('room', { required: true })} />
                {errors.room && <span className="text-xs text-red-500">This field is required</span>}
              </div>
            </CardContent>
            <CardFooter>
              <Button loading={isLoadingJoin} type="submit" className="w-full">
                Join
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  )
}
