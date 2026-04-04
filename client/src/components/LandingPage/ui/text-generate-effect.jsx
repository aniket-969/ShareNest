import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export const TextGenerateEffect = ({
  words,
  className,
}) => {
  const rotatingWords = ["simplified.", "made hassle-free.", "made affordable.", "streamlined.", "made effortless.", "organized.", "made convenient."]
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = rotatingWords[currentWordIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing effect
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.substring(0, displayText.length + 1))
        } else {
          // Wait before starting to delete
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        // Deleting effect
        if (displayText.length > 0) {
          setDisplayText(currentWord.substring(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
        }
      }
    }, isDeleting ? 50 : 100 )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentWordIndex, rotatingWords])

  return (
    <div className={cn("font-bold", className)}>
      <div className="text-white text-center">
        <div className="text-4xl sm:text-5xl bs:text-6xl">Shared living,</div>
        <div className=" mt-2 ">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 text-3xl sm:text-4xl bs:text-5xl">
            {displayText}
          </span>
          <span className="animate-pulse text-pink-500">|</span>
        </div>
      </div>
    </div>
  )
}
