import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { useEffect } from 'react'
import { API_HOST } from '../../../config'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export default function CardsTier() {
  const [makers, setMakers] = useState()
  const [error, setError] = useState()
  async function getAllTiers(){
    const pet = await fetch(`${API_HOST}/tier`, {
        credentials: "include"
    })
    const tiers = await pet.json()
    if (tiers) setMakers(tiers)
    else return setError("Ha ocurrido un error")

  }
  useEffect(() => {
    getAllTiers()
  }, []);

  const handleDelete = async (id) => {
    const pet = await fetch(`${API_HOST}/tier`, {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({id: id})
    })
    const res = await pet.json()
    if (res.error) {
     return toast.error(res.error)
    }
    toast.success(res.message)
    const newMakers = makers.filter(make => make.id != id)
    setMakers(newMakers)
  }

  if (error) {
    return (
        <main className="text-center mt-20 text-lg font-bold">
            {error}
        </main>
    )
  }
  if (makers) return (
    <main className="flex-1 p-6 bg-[#111]">
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {makers.map((maker) => (
        <Card key={maker.id} className="bg-[#222] border-gray-700 relative">
          <div className=' flex justify-end absolute top-0 right-0'> 
          <span className={` p-1  mt-1 me-1 text-white font-bold rounded-2xl ${maker.status ? 'bg-green-500' : 'bg-red-500'}`}>{maker.status ? "Publicado" : "Guardado"}</span> 
          </div>
          <CardHeader>
            <CardTitle className="text-white ">{maker.name.length < 20 ? maker.name :  maker.name.slice(0,20) + "..."}</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={maker.image}
              alt={maker.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <p className="text-gray-300">{maker.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-gray-700 text-gray-200 hover:bg-gray-600"
            >
              <Link to={`/game/${maker.id}`} className='w-full h-full flex items-center'>
              <Edit className="mr-2 h-4 w-4" />
              Editar
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDelete(maker.id)}
              className="bg-red-700 hover:bg-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </main>
  )
}
