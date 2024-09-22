/* eslint-disable react/prop-types */
import { useState } from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useEffect } from "react"
import { Button } from "../ui/button"
import { User } from "lucide-react"
import { UserSchemaRegister } from "../../utils/Auth"
import { API_HOST } from "../../../config"
import { toast } from "sonner"
import { useAuthStore } from "../../store/AuthStore"

export default function FormEditUser({ session, setOpenModalCreate }) {
  const [password, setPassword] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [name, setName] = useState(session.name)
  const [photo, setPhoto] = useState("")
  const [picture, setPicture] = useState(session.profile_photo)
  const getSession = useAuthStore(state => state.getAuth)
  const [passwordError, setPasswordError] = useState(false)
  const [nameError, setNameError] = useState(false)

  useEffect(() => {
    if (photo) {    
    const reader = new FileReader()
            reader.onload = (eventReader) => {
      
              const url = eventReader.target.result
              setPicture(url)
           }
            reader.readAsDataURL(photo)
    }

  }, [photo]);


  async function onSubmit(e){
    e.preventDefault()
    const values = {}
    if (password != "") {
      values.password = password
    }
    if (name != "") {
      values.name = name
    }
    values.oldPassword = oldPassword
    values.photo = photo
    const results = UserSchemaRegister.partial().safeParse(values)
    if (results.error) {
        results.error.issues.map(err => {
          if (err.path == "password") {
              setPasswordError(err.message)    
          }
          if (err.path == "name") {
              setNameError(err.message)
          }
        })
      } else {
          setPasswordError("")
          setNameError("")
      }

    const pet = await fetch(`${API_HOST}/auth/user/edit`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
    })
    const res = await pet.json()
    if (res.error) {
        return toast.error(res.error)
    }
    getSession()
    setOpenModalCreate(false)
    return toast.success("Perfil actualizado con éxito")
  }

  return (
    <form action="" onSubmit={onSubmit}>
    <div className=" grid grid-cols-1  md:grid-cols-2 gap-x-4">
    {/* Nombre de usuario */}

    <div className="space-y-2">
    <Label htmlFor="password">Nombre de usuario</Label>
    <Input
      id="name"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Ingresa su nombre de usuario"
    />
     {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
    </div>
    {/* Email */}

    <div className="space-y-2">
    <Label htmlFor="password">Correo Electrónico</Label>
    <Input
      id="email"
      type="email"
      value={session.email}
      readOnly
    />

    {/* {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>} */}
    </div>

    {/* Contraseña antigua */}
    <div className="space-y-2 mt-3">
    <Label htmlFor="password">Contraseña Anterior</Label>
    <Input
      id="password"
      type="password"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
      placeholder="Ingresa tu contraseña anterior"
    />
    
  </div>

   {/* Contraseña nueva */}
   <div className="space-y-2 mt-3">
    <Label htmlFor="password">Contraseña Nueva</Label>
    <Input
      id="Newpassword"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Ingresa tu nueva contraseña"
    />
     {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
  </div>

   {/* Contraseña antigua */}
   <div className="space-y-2 mt-3">
    <Label htmlFor="password">Foto de Perfil</Label>
    <Input
      id="photo"
      type="file"
      onChange={(e) => setPhoto(e.target.files[0])}
    />
    {/* {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>} */}
  </div>

  <div className="space-y-2 flex justify-center items-center mt-4">
    {picture == "" ? (
        <User className="h-[100px] w-[100px] rounded-full bg-[#111] p-5 text-white" />
    ) : (
        <img src={picture}  alt="" className="w-[100px] h-[100px] rounded-full" />
    )
    }

  </div>
    </div>
    <div>
        <Button>Actualizar perfil</Button>
    </div>
  </form>
  )
}
