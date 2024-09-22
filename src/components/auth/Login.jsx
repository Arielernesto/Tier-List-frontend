import { Toaster } from "sonner"
import { useState } from "react"
import { Label } from "../ui/label" 
import { Input } from "../ui/input"  
import { Button } from "../ui/button" 
import { SignIn } from "../../utils/Auth"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"


export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault()
      const results = await SignIn({email, password})
      if (results.error) {
      results.error.issues.map(err => {
        if (err.path == "password") {
            setPasswordError(err.message)    
        }
        if (err.path == "email") {
            setEmailError(err.message)
        }
      })
    } else {
        setPasswordError("")
        setEmailError("")
    }


      if (!results.error  && results.auth == "ok") {
       navigate(-1)
      }
    }
    return (
      <>
      <Toaster />
      <div className="mx-auto max-w-md space-y-6  bg-[#222] p-10 mt-10 rounded-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{"Iniciar sesi\u00F3n"}</h1>
          <p className="text-muted-foreground">
            {"Ingresa tus credenciales para acceder"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {"Iniciar sesi\u00F3n"}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
            <>
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="underline underline-offset-2 font-bold text-gray-400"
                
              >
                Regístrate
              </Link>
            </>
        </div>
      </div>
      </>
    )
}
