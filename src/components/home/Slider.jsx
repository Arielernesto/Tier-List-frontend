/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Slider({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = useCallback(() => {
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => prevIndex + 1)
  }, [])

  const prevSlide = useCallback(() => {
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => prevIndex - 1)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000) // Auto-advance every 5 seconds
    return () => clearInterval(interval)
  }, [nextSlide])

  useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false)
        if (currentIndex >= slides.length - 3) {
          setCurrentIndex(0)
        } else if (currentIndex < 0) {
          setCurrentIndex(slides.length - 4)
        }
      }, 300) // Duration of the transition
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, isTransitioning])

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden bg-[#111] text-white p-4">
      <div 
        className={`flex transition-transform duration-300 ease-in-out ${isTransitioning ? '' : 'transition-none'}`}
        style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
          >
            <div className="bg-[#222] rounded-lg shadow-lg overflow-hidden h-full">
              <img 
                src={slide.image} 
                alt={slide.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
                <h3 className="text-xl font-bold mb-2">{slide.name}</h3>
                <p className="text-sm mb-4 flex-grow">{slide.description}</p>
                <Link to={`/game/${slide.id}`} className="bg-white text-[#111] px-4 py-2 rounded hover:bg-gray-200 transition-colors self-start">
                  Ver más
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-[#111] rounded-full p-2 focus:outline-none hover:bg-gray-200 transition-colors"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-[#111] rounded-full p-2 focus:outline-none hover:bg-gray-200 transition-colors"
        aria-label="Siguiente slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  )
}
