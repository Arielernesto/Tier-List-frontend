import { Button } from "../ui/button" 
import { Input } from "../ui/input" 
import { Link } from "react-router-dom"
import { Toaster } from "sonner"
import { useEffect } from "react"
import { useAuthStore } from "../../store/AuthStore"
import Slider from "./Slider"
import { API_HOST } from "../../../config"
import { toast } from "sonner"
import { useState } from "react"

export default function HomePage() {

  const getSession = useAuthStore(state => state.getAuth)
  const session = useAuthStore(state => state.session)
  const [tiers , setTiers] = useState([])
  const [loading, setLoading] = useState(false)

  async function getAll(){
    setLoading(true)
    const pet = await fetch(`${API_HOST}/tier/all`)
    const res = await pet.json()
    if (res.error) return toast.error(res.error)
    setTiers(res.tiers)
    setLoading(false)
  }
  useEffect(() => {
    getSession()
    getAll()
 }, []);

  return (
    <>
    <Toaster />
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-primary py-12 md:py-20 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
                Crea y Comparte tus Rankings Favoritos
            </h1>
            <p className="text-lg text-primary-foreground/90 md:text-xl">
              Explora, crea y comparte tus listas de clasificación personalizadas para cualquier tema. Desde videojuegos hasta series de televisión, ¡las posibilidades son infinitas!
            </p>
            <div className="flex gap-4 justify-center">
              { session ? (
                <Button className="w-[300px]">
                  <Link className="w-full h-full" to="/game">Empezar</Link>
                </Button>
              ) : (   
              <>         
              <Button>
                <Link to="/login">Inicia Sesión para empezar</Link>
              </Button>
              <Button>
                <Link to="/game">Pruébalo</Link>
              </Button>
              </>
              )
              }

            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-20 lg:py-24">
          {loading ? (
             <div className="w-[100%] h-[100%] flex justify-center items-center">
             <div className="loader"></div>
           </div>
          ) : (
          <Slider slides={tiers} />
          )
          }
          
        </section>
      </main>
      
    </div>
    </>
  )
}