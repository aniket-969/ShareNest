import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur border-b border-gray-800">
      <div className="container mx-auto px-6 md-8 lg-12 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          ShareNest
        </Link>
        <Button className="bg-gradient-to-r from-pink-500 to-red-500 hover-pink-600 hover-red-600 text-white px-6 py-2 font-semibold rounded-lg transition-all duration-300">
          Login
        </Button>
      </div>
    </header>
  )
}
