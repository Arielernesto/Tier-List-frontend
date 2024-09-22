import { z } from 'zod'
import { API_HOST } from '../../config'
import { toast } from 'sonner'

export const UserSchemaRegister = z.object({
  name:  z.string({
    invalid_type_error: "El nombre de usuario debe ser un string",
    required_error: "El nombre de usuario es requerida"
}).min(3 , {message: "El nombre de usuario debe tener como mínimo 3 caracteres"}),
  email: z.string({
   invalid_type_error: "El email debe ser un string",
   required_error: "El email es requerido"
  }).email({ message: "El email debe ser correcto"}),
  password: z.string({
      invalid_type_error: "La contraseña debe ser un string",
      required_error: "La contraseña es requerida"
  }).min(6 , {message: "La contraseña debe tener como mínimo 6 caracteres"})
})

export async function SignIn({email, password}){
    const UserSchemaLogin = z.object({
        email: z.string({
         invalid_type_error: "El email debe ser un string",
         required_error: "El email es requerido"
        }).email({ message: "El email debe ser correcto"}),
        password: z.string({
            invalid_type_error: "La contraseña debe ser un string",
            required_error: "La contraseña es requerida"
        }).min(6 , {message: "La contraseña debe tener como mínimo 6 caracteres"})
      })
      const results = UserSchemaLogin.safeParse({email, password})

      if (results.error){
        return results
      }

      try {
        const pet = await fetch(`${API_HOST}/auth/login` , {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        })
        const user = await pet.json()
        if (user.error) {
          return toast.error(user.error)
        }
        toast.success("Usuario logueado con éxito")
        return user
      } 
      catch (e) {
        return toast.error(e.error)
      }

}


export async function registerFetch({email, password, name}){
 
    
    const results = UserSchemaRegister.safeParse({email, password, name})
    
    if (results.error){
      return results.error
    }
   
    try {
      const pet = await fetch(`${API_HOST}/auth/register` , {
          method: "POST",
          credentials: "include",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({email, password, name})
      })
      const user = await pet.json()
      if (user.error) {
       return toast.error(user.error)
      }
      toast.success("Usuario registrado con éxito")
      return user
    } 
    catch (e) {
      toast.error(e.error) 
      return e
    }

}