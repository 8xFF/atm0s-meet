'use client'

import { generateToken } from '@/app/actions/token'
import { env } from '@/config'
import { Layout } from '@/layouts'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { generateRandomString } from '@/lib'
import { RoomStore } from '@/stores/room'
import { useSetAtom } from 'jotai'
import { map } from 'lodash'
import { ArrowRight, Copy, CopyCheck, Link, Loader, Plus } from 'lucide-react'
import { useCopyToClipboard } from 'usehooks-ts'

type Inputs = {
  roomCode: string
  roomName: string
}

type Props = {}

export const NewRoom: React.FC<Props> = () => {
  const { user } = useUser()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>()
  const [gatewayIndex, setGatewayIndex] = useState('0')
  const [isLoadingJoin, setIsLoadingJoin] = useState(false)
  const [isLoadingCreate, setIsLoadingCreate] = useState(false)
  const [isCopy, setIsCopy] = useState(false)
  const [, onCopy] = useCopyToClipboard()
  const [roomSave, setRoomSave] = useState('')
  const [activeTab, setActiveTab] = useState('join')

  const onCreateRoomUseLater = useSetAtom(RoomStore.createRoomUseLater)

  const gateways = env.GATEWAYS

  const onGenerateToken = async (room: string) => {
    const token = await generateToken(room, user?.id as string)
    return router.push(`/${room}?gateway=${gatewayIndex}&peer=${user?.id}&token=${token}`)
  }

  const onJoin: SubmitHandler<Inputs> = async (data) => {
    setIsLoadingJoin(true)
    await onGenerateToken(data.roomCode)
    setIsLoadingJoin(false)
  }

  const onCreate: SubmitHandler<Inputs> = async (data) => {
    setIsLoadingCreate(true)
    await onGenerateToken(data.roomCode)
    setIsLoadingCreate(false)
  }

  const onCreateMeetRoom: SubmitHandler<Inputs> = async (data) => {
    onCreateRoomUseLater({
      code: data.roomCode,
      name: getValues('roomName'),
      users: [],
    })
    setIsLoadingCreate(true)
    await generateToken(data.roomCode, user?.id as string)
    setRoomSave(data.roomCode)
    setIsLoadingCreate(false)
  }

  const copyToClipboardMeetingLink = async (value: string) => {
    setIsCopy(true)
    await onCopy(value as string)
    setTimeout(() => {
      setIsCopy(false)
    }, 2000)
  }

  const meetingLink = useMemo(() => `${window?.origin}/${roomSave}`, [roomSave])

  return (
    <Layout>
      <form onSubmit={handleSubmit(onJoin)} className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center justify-center p-4 sm:p-6">
            <Card className="w-full max-w-md overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 shadow-xl backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-2 text-center">
                <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent">
                  Meeting Lounge
                </CardTitle>
                <CardDescription className="mt-2 text-lg text-foreground/80">
                  Connect, collaborate, and create together
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-6 w-full grid-cols-2 rounded-lg bg-muted/50 p-1">
                    <TabsTrigger
                      value="join"
                      className="flex-1 rounded-md text-sm transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm sm:text-base"
                    >
                      Join Room
                    </TabsTrigger>
                    <TabsTrigger
                      value="create"
                      className="flex-1 rounded-md text-sm transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm sm:text-base"
                    >
                      Create Room
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="join" className="space-y-4">
                    <div>
                      <label
                        htmlFor="gateway"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Gateway
                      </label>
                      <Select value={gatewayIndex} onValueChange={setGatewayIndex}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gateway" id="gateway" />
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
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="room-code"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Room Code
                      </label>
                      <Input
                        id="room-code"
                        placeholder="Enter room code"
                        className="w-full border-primary/20 bg-background/50 transition-shadow duration-200 focus:border-primary focus:shadow-md"
                        {...register('roomCode', { required: true })}
                      />
                      {errors.roomCode && <span className="text-xs text-red-500">This field is required</span>}
                    </div>
                    <Button
                      className="group w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      loading={isLoadingJoin}
                      type="submit"
                    >
                      Join Meeting
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </TabsContent>
                  <TabsContent value="create" className="space-y-4">
                    <div>
                      <label
                        htmlFor="gateway"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Gateway
                      </label>
                      <Select value={gatewayIndex} onValueChange={setGatewayIndex}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gateway" id="gateway" />
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
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="room-name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Room Name
                      </label>
                      <Input
                        id="room-name"
                        placeholder="Enter room name"
                        className="w-full border-primary/20 bg-background/50 transition-shadow duration-200 focus:border-primary focus:shadow-md"
                        {...register('roomName')}
                      />
                    </div>

                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="group w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            Create Room
                            <Plus className="ml-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-72">
                          <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer">
                              <DialogTrigger
                                asChild
                                onClick={() =>
                                  onCreateMeetRoom({
                                    roomCode: generateRandomString(8),
                                    roomName: '',
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
                                  roomCode: generateRandomString(8),
                                  roomName: '',
                                })
                              }
                            >
                              <Button
                                loading={isLoadingCreate}
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Layout>
  )
}

// <form onSubmit={handleSubmit(onJoin)} className="w-full max-w-xs md:max-w-sm">
// <Card>
//   <CardHeader>
//     <CardTitle>
//       <Logo />
//     </CardTitle>
//     <CardDescription></CardDescription>
//   </CardHeader>
//   <CardContent className="grid gap-4">
//     <Select value={gatewayIndex} onValueChange={setGatewayIndex}>
//       <SelectTrigger>
//         <SelectValue placeholder="Select gateway" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           {map([gateways], (gateway, index) => (
//             <SelectItem key={index} value={String(index)}>
//               {gateway}
//             </SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//     {/* <Button
//       loading={isLoadingCreate}
//       type="button"
//       className="w-full"
//       variant="destructive"
//       onClick={() =>
//         onCreate({
//           room: generateRandomString(8),
//         })
//       }
//     >
//       Create new room
//     </Button> */}
//     <Dialog>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="destructive" type="button" className="w-full">
//             Create new room
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-72">
//           <DropdownMenuGroup>
//             <DropdownMenuItem className="cursor-pointer">
//               <DialogTrigger
//                 asChild
//                 onClick={() =>
//                   onCreateMeetRoom({
//                     room: generateRandomString(8),
//                   })
//                 }
//               >
//                 <div className="flex flex-1 items-center gap-2 [&>svg]:size-4 [&>svg]:shrink-0">
//                   <Link />
//                   Create a meeting for later use
//                 </div>
//               </DialogTrigger>
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               className="cursor-pointer"
//               onClick={() =>
//                 onCreate({
//                   room: generateRandomString(8),
//                 })
//               }
//             >
//               <Button
//                 loading={isLoadingCreate}
//                 type="button"
//                 className="h-full w-full justify-start p-0 font-normal"
//                 variant="ghost"
//               >
//                 <Plus />
//                 Start an instant meeting
//               </Button>
//             </DropdownMenuItem>
//           </DropdownMenuGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Here is information on how to participate.</DialogTitle>
//           <DialogDescription>
//             Send this link to the people you want to meet with. Save the link for later use.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           {isLoadingCreate && <Loader />}

//           {!isLoadingCreate && (
//             <div className="flex h-10 items-center gap-2 rounded bg-zinc-200 pl-3">
//               <div className="flex-1 text-sm">{meetingLink}</div>
//               <Button variant="link" size="icon" onClick={() => copyToClipboardMeetingLink(meetingLink)}>
//                 {isCopy ? <CopyCheck size={16} className="text-green-500" /> : <Copy size={16} />}
//               </Button>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//     <div className="flex items-center justify-between gap-2">
//       <div className="flex-1 border-t" />
//       <div className="text-sm">Or join a room</div>
//       <div className="flex-1 border-t" />
//     </div>
//     <div className="grid gap-2">
//       <Label htmlFor="room">Room ID</Label>
//       <Input id="room" type="room" placeholder="Enter room id" {...register('room', { required: true })} />
//       {errors.room && <span className="text-xs text-red-500">This field is required</span>}
//     </div>
//   </CardContent>
//   <CardFooter>
//     <Button loading={isLoadingJoin} type="submit" className="w-full">
//       Join
//     </Button>
//   </CardFooter>
// </Card>
// </form>
