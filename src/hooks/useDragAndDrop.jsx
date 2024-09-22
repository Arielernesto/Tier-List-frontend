import { useEffect } from "react"
import { useState } from "react"
import { useTierStore } from "../store/TierStore";
import { API_HOST } from "../../config";
import { toast } from "sonner";
import { useAuthStore } from "../store/AuthStore";

export function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export const rows = [
    {
      id: "1",
      rank: "S",
      color: "#ff7f80",
      items: []
    },
    {
      id: "2",
      rank: "A",
      color: "#ffc07f",
      items: []
    },
    {
      id: "3",
      rank: "B",
      color: "#ffdf80",
      items: []
    },
    {
      id: "4",
      rank: "C",
      color: "#fdff7f",
      items: []
    },
    {
      id: "5",
      rank: "D",
      color: "#bfff7f",
      items: []
    },
    {
      id: "6",
      rank: "E",
      color: "#7fff7f",
      items: []
    },
  ]


export default function useDragandDrop( trash, id ){

const [draggedElement, setDraggedElement] = useState("")
const [sourceContainer, setSourceContainer] = useState("")
const [images, setImages] = useState([])
const [refresh, setRefresh] = useState(false)
const [loading, setLoading] = useState(false)
const setChanges = useTierStore(state => state.setChanges)
const setAverage = useTierStore(state => state.setAverage)
const setTierInfo = useTierStore(state => state.setTierInfo)
const session = useAuthStore(state => state.session)

useEffect(() => {
  setLoading(true)
  if (!id) { 
    rows.map(row => row.items = [])
  }
  setLoading(false)
}, []);

useEffect(() => {
  const calculateAverageRow = () => {
    const totalItems = rows.reduce((acc, row) => acc + row.items.length, 0);
    const average = totalItems / rows.length;

    let closestRow = rows[0];
    let closestDifference = Math.abs(rows[0].items.length - average);

    rows.forEach(row => {
      const difference = Math.abs(row.items.length - average);
      if (difference < closestDifference) {
        closestDifference = difference;
        closestRow = row;
      }
    });
    setAverage(closestRow.rank)
  }
  calculateAverageRow()
});

useEffect(() => {
  async function getTier(){
    setLoading(true)
    const pet = await fetch(`${API_HOST}/tier/${id}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({id})
    })
    const res = await pet.json()
    if (!res.tier) {
      return toast.error("Ranking no encontrado")
    }
    if (res.error) {
      setLoading(false)
      return toast.error(res.error)
    }
    const newRows = JSON.parse(res.tier.rows)
    console.log(res.tier)
    rows.forEach((obj, index) => {
      Object.assign(obj,newRows[index])
    })
    setTierInfo(res.tier.name, res.tier.description)
    setRefresh(!refresh)
    setLoading(false)
  }

 
  if (id && session) {
    getTier()
  } 

}, [session]);



const handleInputAddImage =  async (event) => {
    const files = event.target.files
    createItemsWithFiles(files)
}


const createItemsWithFiles = (files)  =>{
    for (let i = 0; i < files.length; i++) {
        const element = files[i];
        if (element && element.type.includes("image")) {
            const reader = new FileReader()
            reader.onload = (eventReader) => {
      
              const url = eventReader.target.result
              setImages(prevImagenes => [...prevImagenes, {id: generateUUID() ,image: url}])
           }
            reader.readAsDataURL(element)
           }
    }
  }



function handleDragOver(e){
    e.preventDefault()
    const { currentTarget, dataTransfer } = e
  
    if (dataTransfer.types.includes('Files') && !dataTransfer.types.includes('text/html')) {
      currentTarget.classList.add('drag-files')
      return
    }
  
    if (sourceContainer == currentTarget) return
    currentTarget.classList.add('drag-over')
  
    const dragPreview = document.querySelector('.drag-preview')
  
  
    if (draggedElement && !dragPreview) {
      const previewElement = draggedElement.cloneNode(true)
      previewElement.classList.add('drag-preview')
      currentTarget.appendChild(previewElement)    
    }
  }


 
  function handleDrop(event, id){
    event.preventDefault()
    // Actualizar los cambios
    setChanges()

    const { currentTarget, dataTransfer } = event
    trash.current.classList.remove('active')
   
    if (dataTransfer.types.includes('Files') && !dataTransfer.types.includes('text/html')) {
      currentTarget.classList.remove('drag-files')
      const { files } = dataTransfer
      createItemsWithFiles(files)
      return
    }
    if (sourceContainer && draggedElement) {
        
        const src = dataTransfer.getData('text/plain')
     
        if (sourceContainer.id != "selector-items") {
          
        const parentRow = rows.find(item => item.id == sourceContainer.id)
        const oldImages = parentRow.items.filter(item => item.id != draggedElement.id)
        parentRow.items = oldImages 
      } else {
       const oldImages = images.filter(item => item.id != draggedElement.id)
       setImages(oldImages)
      }
      if (id) {
      const row = rows.find(item => item.id == id)
      row.items.push({id: generateUUID() ,image: src, preview: false}) 
      }   
      else{
        setImages(prevImagenes => [...prevImagenes, {id: generateUUID() ,image: src, preview: false}])
      }
        currentTarget.classList.remove('drag-over')
        currentTarget.querySelector('.drag-preview')?.remove()
        setRefresh(!refresh)
        
    }
  }


  

function handleDragStart(event){
    trash.current.classList.add("active")
    setDraggedElement(event.target) 
    setSourceContainer(event.target.parentNode)
    event.dataTransfer.setData('text/plain', event.target.src)
  }

function handleDragEnd() {
    trash.current.classList.remove('active')
    setDraggedElement(null)  
    setSourceContainer(null)
}

function handleDragLeave(event){
    event.preventDefault()
    const { currentTarget } = event
    currentTarget.classList.remove('drag-over')
    currentTarget.querySelector('.drag-preview')?.remove()
    currentTarget.classList.remove('drag-files')
  }



     
  function handleTrashDragOver(event){
    event.preventDefault()
    const { dataTransfer } = event
    if (dataTransfer.types.includes('text/html')) {
        trash.current.classList.add('hover')
    }
  }
  
  function handleTrashLeave(event){
    event.preventDefault()
    const { dataTransfer } = event
    if (dataTransfer.types.includes('text/html')) {
        trash.current.classList.remove('hover')
    }
  }
  function  handleTrashDrop(event) {
    event.preventDefault()
    // Actualizar cambios
    setChanges()

    const { dataTransfer } = event
    trash.current.classList.remove('active')
    if (dataTransfer.types.includes('text/html')) {
        trash.current.classList.remove('hover')
        if (sourceContainer.id == "selector-items") {
          const filteredImages = images.filter(img => img.id != draggedElement.id)
          setImages(filteredImages)
        } else {
          const row = rows.find(item => item.id == sourceContainer.id)
          const filteredImages = row.items.filter(i => i.id != draggedElement.id)
          row.items = filteredImages
        }
        setRefresh(!refresh)
    }

}

async function Reset(){

    // Actualizar cambios
    setChanges()
    rows.map(row => {
      row.items.map(item => {
        setImages(prevImagenes => [...prevImagenes, item])
      })
      row.items = []
    })
    setRefresh(!refresh)
}

return {loading, Reset, handleDragOver, handleInputAddImage, handleDrop, handleDragStart, handleDragEnd, handleDragLeave, handleTrashDragOver, handleTrashDrop , handleTrashLeave, images, rows, refresh, setRefresh }
}