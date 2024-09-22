
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { LogOut } from 'lucide-react'
import CardsTier from './CardTier';
import { Suspense } from 'react';
import { useEffect } from 'react';
import { useAuthStore } from "../../store/AuthStore"
import { User } from 'lucide-react';
import { Toaster } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import FormEditUser from '../game/FormEditUser';
import { useState } from 'react';

export default function Dashboard() {
  const getSession = useAuthStore(state => state.getAuth)
  const session = useAuthStore(state => state.session)
  const logOut = useAuthStore(state => state.logOut)
  const loading = useAuthStore(state => state.loading)
  const [openModalCreate, setOpenModalCreate] = useState(false)
  
  useEffect(() => { 
    getSession()
  }, []);

  const handleLogout = () => {
    logOut()
  }



  if (!loading) {
    return <div className=' w-full h-[100vh] flex justify-center items-center'>
      <h1 className='font-bold text-2xl'>Acceso No Autorizado</h1>
    </div>
  }
  return (
    <>
    <Toaster />
    <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogContent className="sm:max-w-[625px] bg-[#222] text-white">
          <DialogHeader>
            <DialogTitle>Perfil</DialogTitle>
            <DialogDescription className="text-gray-400">
               Personaliza tu Perfil
            </DialogDescription>
          </DialogHeader>
          {session &&
          <FormEditUser session={session} setOpenModalCreate={setOpenModalCreate} />
          }
        </DialogContent>
      </Dialog>

    <div className="flex flex-col min-h-screen bg-[#111] text-gray-200">
      <header className="flex items-center justify-between p-4 bg-[#222] border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Dashboard de Tier Makers</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
           { session &&
            <div className='text-white flex items-center gap-x-2 font-bold'>
            Hola: {session.name}
            <Button variant="ghost" className="w-10 h-10 rounded-full p-0">
              {session.profile_photo ? (
                <img
                src={session.profile_photo}
                alt="Avatar del usuario"
                className="rounded-full"
              />
              ) : (
                <User className="h-10 w-10 rounded-full bg-[#111] p-2 text-white" />
              )

              }
              
            </Button>
            </div>
            }
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#222] border-gray-700">
          <DropdownMenuItem className="text-gray-200 cursor-pointer focus:bg-gray-700" onClick={() => setOpenModalCreate(true)}>
              <User className="mr-2 h-4 w-4"/>
              <span>Perfil</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout} className="text-gray-200 cursor-pointer focus:bg-gray-700">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>

            
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <Suspense fallback={ <div className="w-[100%] h-[300px] flex justify-center items-center">
          <div className="loader"></div>
        </div>}>
        <CardsTier />
      </Suspense>
      
     
    </div>
    </>
  )
}