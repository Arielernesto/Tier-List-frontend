import { useRef, useEffect, createRef } from 'react'
import './App.css'
import useDragandDrop from './hooks/useDragAndDrop'
import { useTierStore } from './store/TierStore'
import { useParams } from 'react-router-dom'
import { useAuthStore } from './store/AuthStore'

export default function TierMaker() {
  const { id } = useParams()

  const trash = useRef()
  const tier = useRef()
  const setTier = useTierStore(state => state.SetTier)
  const setImageQuant = useTierStore(state => state.setImageQuant)
  const setRowsRankLowtest = useTierStore(state => state.setRowsRankLowtest)
  const setRowsRankHightest = useTierStore(state => state.setRowsRankHightest)
  const loading = useAuthStore(state => state.loading)

  const {Reset,  loading : isLoading, rows ,handleTrashDrop, handleTrashLeave, handleTrashDragOver, handleDrop, handleDragOver, handleDragLeave, images, handleDragStart, handleDragEnd, handleInputAddImage,} = useDragandDrop(trash, id)
  const refs = useRef(rows.map(() => createRef()))


  function handleInput(index, e){
    rows[index].rank = e.target.innerText
    if(index == 0) setRowsRankHightest(e.target.innerText)
    if (index == 5) setRowsRankLowtest(e.target.innerText)
  }
  useEffect(() => {
      setImageQuant(document.querySelectorAll('.item-image') ?? [])
      setTier(tier)
  });
    if (isLoading) {
      return  <div className="w-[80%] h-[100vh] flex justify-center items-center">
      <div className="loader"></div>
    </div>
    }

    if (id && !loading) {
      return (
        <div className=' w-[70%] h-[100vh] flex items-center justify-center'>
          <h1 className='text-white font-bold text-lg'>Inicia sesión para ver el Ranking</h1>
        </div>
      )
    }
    return (
        <section className='flex me-40 justify-end flex-col place-items-start overflow-hidden xl:place-items-center'>
      <header id="top-header" className=' mb-5 mt-3 w-[600px] lg:w-[700px] xl:w-[800px]'>
        <h1 className='  text-3xl text-center'>Tier Maker</h1>
     </header>

     <main className=" w-[600px] lg:w-[700px] xl:w-[800px] main">
        <div className="w-full ">
        <section className=" tier " ref={tier}>
        {
          rows.map(({rank, color, id, items}, index) => (
        <div style={{display: "flex"}} key={id}>
            <aside className="label" style={{backgroundColor: color}}>
                <span contentEditable 
                ref={refs.current[index]} 
                onInput={(e) => handleInput(index, e)}
                className=' flex w-full justify-center text-center'>{rank}</span>
            </aside>
            <div className=" row " style={{minHeight: "50px", width: "100%"}} onDragOver={(event) => handleDragOver(event)} onDrop={(event) => handleDrop(event, id)} onDragLeave={(event) => handleDragLeave(event)}  id={id} >

                   {
                  
                   items.map((data, index) => (
                     <img key={index} src={data.image} className={` item-image ${data.preview ? 'drag-preview' : ''}`} draggable={true} onDragStart={handleDragStart}
                     onDragEnd={handleDragEnd}  alt="" id={data.id} />
                   ))

                   }

            </div>
        </div>
          ))

        }
    
    </section>
     <footer id="selector">
        <section id="selector-buttons">
            <label className=" input-add" style={{width: "42px", height: "42px"}}>    
                <svg style={{cursor: "pointer"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle align-middle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            <input multiple accept="image/*" type="file" name="" id="image-input" hidden onChange={handleInputAddImage} />
          </label>

          
          <button id="trash" ref={trash} onDragOver={handleTrashDragOver} onDragLeave={handleTrashLeave}
          onDrop={handleTrashDrop} className=" disabled" style={{width: "42px", height: "42px"}}>
            <svg style={{cursor: "pointer"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 align-middle me-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
         </button>
         
         
         <label style={{width: "42px", height: "42px"}}>
            <button id="reset" onClick={Reset}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-rotate-cw align-middle me-2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
            </button>
           </label>
        </section>


        <section id="selector-items" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}> 
    
      { 
            
              images.map((data, index) => (
                <img key={index} src={data.image} id={data.id} className=" item-image " draggable={true} onDragStart={(e) => handleDragStart(e)}
                onDragEnd={handleDragEnd}  alt="" />
              ))
             
      } 
       
        </section>
     </footer>
    </div>
    </main>
        </section>
    ) 
}
