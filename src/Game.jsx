import TierMaker from "./TierMaker"
import GameAside from "./components/game/Aside"
import { Toaster } from "sonner"


export default function Game() {
  return (
    <div>
    <Toaster />
    <TierMaker />
    <GameAside />
    </div>
  )
}
