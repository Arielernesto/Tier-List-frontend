import { useEffect, useState } from "react"
import { useTierStore } from "../../store/TierStore"
import { useAuthStore } from "../../store/AuthStore"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { ChevronDown, Save, Upload, Camera, User, LogInIcon } from 'lucide-react'
import html2canvas from "html2canvas-pro"
import FormEditUser from "./FormEditUser"
import { Link } from "react-router-dom"
import FormCreateTier from "./FormCreateTier"
import useDragandDrop from "../../hooks/useDragAndDrop"
import { useNavigate } from "react-router-dom"


export default function GameAside() {
  
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [openModalCreateTier, setOpenModalCreateTier] = useState(false)
  const [openModalCreateTierToUpload, setOpenModalCreateTierToUpload] = useState(false)
  const tierContainer = useTierStore(state => state.tier)
  const imageQuantity = useTierStore(state => state.imageQuantity)
  const getSession = useAuthStore(state => state.getAuth)
  const session = useAuthStore(state => state.session)
  const logOut = useAuthStore(state => state.logOut)
  const rowRank = useTierStore(state => state.rowRank)
  const changes = useTierStore(state => state.changes)
  const [quantityNotCategorized, setQuantityNotCategorized] = useState(0)
  const average = useTierStore(state => state.average)
  const { rows } = useDragandDrop()
  const navigate = useNavigate()
  useEffect(() => {
    getSession()
  }, [])


  useEffect(() => {
    if (imageQuantity.length !== "0") {
      const array = Array.from(imageQuantity)
      const notCategorized = array.filter(item => item.parentNode.id == "selector-items")
      setQuantityNotCategorized(notCategorized.length)
    }
  }, [imageQuantity])

  function drawTier() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext("2d")

    html2canvas(tierContainer.current).then(canvas => {
      ctx.drawImage(canvas, 0, 0)
      const imgURL = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = 'tier.png'
      downloadLink.href = imgURL
      downloadLink.click()
    })
  }


  function Login(){
    navigate("/login")
  }
 
  return (
    <div className="flex w-full">
      <aside className="fixed inset-y-0 right-0 z-10 w-72 flex-col border-l border-[#222] bg-[#111] px-6 py-8 shadow-lg">
        {session && (
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-medium text-gray-300">Hola, <strong className="text-white">{session.name}</strong></span>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="relative">
                  {session.profile_photo == "" ? (
                    <User className="h-10 w-10 rounded-full bg-[#222] p-2 text-white" />
                  ) : (
                    <img src={session.profile} alt="" className="h-10 w-10 rounded-full object-cover" />
                  )}
                  <ChevronDown className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#222] text-white" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#222] text-white">
                <DropdownMenuItem onClick={() => setOpenModalCreate(true)} className="hover:bg-[#333]">
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#333]">

                  <Link to="/dashboard" className=" w-full h-full">Panel</Link>

                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#333]" onClick={logOut}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight text-white">Acciones</h2>
            <div className="grid gap-2">
              {session &&
                    <>
                    <Button className="w-full justify-start bg-[#222] text-white hover:bg-[#333]" size="sm" onClick={setOpenModalCreateTier}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Tier List
                    </Button>
                    <Button variant="secondary" className="w-full justify-start bg-[#222] text-white hover:bg-[#333]" size="sm" onClick={setOpenModalCreateTierToUpload}>
                    <Upload className="mr-2 h-4 w-4" />
                    Subir a la Web
                    </Button>
                    </>
              }
              {!session &&
               <Button variant="secondary" className="w-full justify-start bg-[#222] text-white hover:bg-[#333] border-[#333]" size="sm" onClick={Login}>
               <LogInIcon className="mr-2 h-4 w-4" />
               Inicia Sesión
             </Button>
              }
              <Button variant="secondary" className="w-full justify-start bg-[#222] text-white hover:bg-[#333] border-[#333]" size="sm" onClick={drawTier}>
                <Camera className="mr-2 h-4 w-4" />
                Crear una Foto
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight text-white">Estadísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Total" value={imageQuantity.length} />
              <StatCard title="Sin Categoria" value={quantityNotCategorized} />
              <StatCard title="Tier más alto" value={rowRank.hightest.length > 6 ? rowRank.hightest.slice(0,5) + "..." : rowRank.hightest} />
              <StatCard title="Tier mas bajo" value={rowRank.lowtest.length > 6 ? rowRank.lowtest.slice(0,5) + "..." : rowRank.lowtest} />
              <StatCard title="Tier promedio" value={average.length > 6 ? average.slice(0,5) + "..." : average} /> 
              <StatCard title="Cambios" value={changes} />
            </div>
          </div>
        </div>
      </aside>
      {/* Dialogo de Usuario */}
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

      {/* Dialogo de Guardar Tier */}
      <Dialog open={openModalCreateTier} onOpenChange={setOpenModalCreateTier}>
        <DialogContent className="sm:max-w-[625px] bg-[#222] text-white">
          <DialogHeader>
            <DialogTitle>Guardar TierMaker</DialogTitle>
            <DialogDescription className="text-gray-400">
               Guarda tu Ranking
            </DialogDescription>
          </DialogHeader>
          {session &&
          <FormCreateTier  setOpenModalCreate={setOpenModalCreateTier} rows={rows} isUpload={false} />
          }
        </DialogContent>
      </Dialog>

      {/* Dialogo de Guardar Tier */}
      <Dialog open={openModalCreateTierToUpload} onOpenChange={setOpenModalCreateTierToUpload}>
        <DialogContent className="sm:max-w-[625px] bg-[#222] text-white">
          <DialogHeader>
            <DialogTitle>Publica tu TierMaker</DialogTitle>
            <DialogDescription className="text-gray-400">
               Publica tu Ranking
            </DialogDescription>
          </DialogHeader>
          {session &&
          <FormCreateTier  setOpenModalCreate={setOpenModalCreateTierToUpload} rows={rows}  isUpload={true}/>
          }
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="flex flex-col items-start gap-1 rounded-lg bg-[#222] p-3">
      <div className="text-sm font-medium text-gray-400 text-nowrap">{title}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  )
}