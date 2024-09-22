import { Toaster } from "sonner"
import { useState } from "react"
import { Label } from "@radix-ui/react-label" 
import { Input } from "../ui/input"  
import { Button } from "../ui/button"
import { registerFetch } from "../../utils/Auth.js"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"


export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [nameError, setNameError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault()
      setPasswordError("")
      setEmailError("")
      setNameError("")
      const results = await registerFetch({ email, name, password })

      if (results.issues) {
      results.issues.map(err => {
        if (err.path == "password") {
            setPasswordError(err.message)    
        }
        if (err.path == "email") {
            setEmailError(err.message)
        }
        if (err.path == "name") {
            setNameError(err.message)
        }
      })
    } else {
        setPasswordError("")
        setEmailError("")
        setNameError("")
    }


      if (!results.issues && results.auth == "ok") {
        navigate("/")
      }
    }
    return (
      <>
      <Toaster />
      <div className="mx-auto max-w-md space-y-6  w-full bg-[#222] md:p-10 p-4 mt-10 rounded-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{"Registrarse"}</h1>
          <p className="text-muted-foreground">
            {"Crea tu cuenta"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="space-y-2">
            <Label htmlFor="email">Nombre de usuario</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) =>  setName(e.target.value)}
              placeholder="Ingresa tu nombre de usuario"
            />
            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>
          <Button type="submit" className="w-full">
            {"Registrarse"}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
            <>
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="underline underline-offset-2 font-bold text-gray-400"
                
              >
                inicia Sesión
              </Link>
            </>
        </div>
      </div>
      </>
    )
}
