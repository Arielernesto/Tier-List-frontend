import { Suspense } from "react"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import { lazy } from "react"
const Game = lazy(() => import('./Game'))
const Home = lazy(() => import('./components/home/Home'))
const Panel = lazy(() => import('./components/dashboard/Panel'))

import { BrowserRouter as Router, Route , Routes} from "react-router-dom"



function App() {

  return (
    <>
      <Suspense fallback={ 
        <div className="w-[100%] h-[100vh] flex justify-center items-center">
          <div className="loader"></div>
        </div>} >
      <Router> 
         <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/game" element={<Game />} />
            <Route exact path="/game/:id" element={<Game />} />
            <Route exact path="/dashboard" element={<Panel />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />}></Route>
         </Routes>
    </Router>
    </Suspense>
    </>
  )
}

export default App
