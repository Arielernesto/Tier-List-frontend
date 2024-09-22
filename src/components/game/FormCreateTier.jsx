/* eslint-disable react/prop-types */
import { useState } from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useEffect } from "react"
import { Button } from "../ui/button"
import { Box } from "lucide-react"
import { API_HOST } from "../../../config"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea.tsx"
import { useTierStore } from "../../store/TierStore.js"
import html2canvas from "html2canvas-pro"
import z from 'zod'
import { useParams } from "react-router-dom"

export default function FormCreateTier({ setOpenModalCreate, rows, isUpload}) {
  const [description, setDescription] = useState("")
  const [name, setName] = useState("")
  const [photo, setPhoto] = useState("")
  const [picture, setPicture] = useState("")
  const [descriptionError, setDescriptionError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const tierContainer = useTierStore(state => state.tier)
  const nameTier = useTierStore(state => state.nameTier)
  const descriptionTier = useTierStore(state => state.descriptionTier)
  const setTierInfo = useTierStore(state => state.setTierInfo)

  const [rowError, setRowError] = useState("")
  const { id } = useParams()
  useEffect(() => {
    function drawTier() {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext("2d")
  
      html2canvas(tierContainer.current).then(canvas => {
        ctx.drawImage(canvas, 0, 0)
        const imgURL = canvas.toDataURL('image/png')
        setPicture(imgURL)
        setPhoto({imageDefault: imgURL, photo: null})
      })
    }
    drawTier()
    if (id) {
      setName(nameTier)
      setDescription(descriptionTier)
    }
  }, []);

  useEffect(() => {
    if (photo.photo) {    
    const reader = new FileReader()
            reader.onload = (eventReader) => {
      
              const url = eventReader.target.result
              setPicture(url)
           }
            reader.readAsDataURL(photo.photo)
    }

  }, [photo]);


  async function onSubmit(e){
    e.preventDefault()
    const TierSchema = z.object({
      name: z.string({
        invalid_type_error: "El nombre debe ser un string",
        required_error: "El nombre es requerido"
       }).min(5 , {message: "El nombre debe tener como mínimo 5 caracteres"}),
      description: z.string({
        invalid_type_error: "La descripción debe ser un string",
        required_error: "La descripción es requerida"
       }).min(10, {message: "La descripción debe tener como mínimo 10 caracteres"}),
      status: z.boolean()
  })
    const results = await TierSchema.safeParse({description, name, status: isUpload})
    console.log("!")
    if (results.error) {
        results.error.issues.map(err => {
          if (err.path == "description") {
              setDescriptionError(err.message)    
          }
          if (err.path == "name") {
              setNameError(err.message)
          }
          if (err.path == "rows") {
            setRowError(err.message)
            toast.error(rowError)
          }
        })
        console.log(results.error.issues)
        return
      } else {
          setDescriptionError("")
          setNameError("")
          setRowError("")
      }
 

    const idParam = id ? id : undefined 
    const imageToUpload = photo.imageDefault ? photo.imageDefault : photo.photo
    const pet = id ? await fetch(`${API_HOST}/tier/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({...results.data, image: imageToUpload, id: idParam, rows})
    }) :  await fetch(`${API_HOST}/tier`, {
      method: "POST",
      credentials: "include",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({...results.data, image: imageToUpload, id: idParam, rows})
  })
    const res = await pet.json()
    if (res.error) {
        console.log(res)
        return toast.error(res.error)
    }
    if (id) {
      setTierInfo(res.tierUpdated.name, res.tierUpdated.description)
    }
    setOpenModalCreate(false)
    console.log(res)
    return toast.success(res.message)
  }

  return (
    <form action="" onSubmit={onSubmit}>
    <div className=" grid grid-cols-1  md:grid-cols-2 gap-x-4">
    {/* Nombre de usuario */}

    <div className="space-y-2">
    <Label htmlFor="password">Nombre de tu Ranking</Label>
    <Input
      id="name"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Ingresa su nombre de usuario"
    />
     {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
    </div>

    <div className="space-y-2">
    <Label htmlFor="password">Foto del Ranking</Label>
    <Input
      id="photo"
      type="file"
      onChange={(e) => setPhoto({imageDefault: null ,photo: e.target.files[0]})}
    />
    {/* {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>} */}
    </div>

    <div className="space-y-2">
    <Label htmlFor="password">Descripción</Label>
    <Textarea
      id="description"
      placeholder="Escriba una descripción..."
      type="text"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />

    {descriptionError && <p className="text-red-500 text-sm">{descriptionError}</p>}
    </div>

  

  <div className="space-y-2 flex justify-center items-center mt-4">
    {picture == "" ? (
        <Box className="h-[150px] w-[250px] rounded-lg bg-[#111] p-5 text-white" />
    ) : (
        <img src={picture}  alt="" className="w-[250px] h-[150px] rounded-lg object-cover object-left" />
    )
    }

    </div>
  </div>
    <div>
        <Button className="w-[40%]">{isUpload ? "Publicar Tier" : "Guardar Tier"}</Button>
    </div>
  </form>
  )
}
