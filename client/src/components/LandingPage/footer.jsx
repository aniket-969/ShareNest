import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md-cols-4 gap-8">
          <div className="col-span-1 md-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">ShareNest</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              The complete platform for managing shared living spaces. Split bills, assign chores, and stay connected with your roommates.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover-white transition-colors">Features</Link></li>
              <li><Link href="#" className="text-gray-400 hover-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-gray-400 hover-white transition-colors">Demo</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover-white transition-colors">About</Link></li>
              <li><Link href="#" className="text-gray-400 hover-white transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-gray-400 hover-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} ShareNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
