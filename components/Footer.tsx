// app/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto py-4" style={{
      background: 'linear-gradient(to right, #121212, #363839)', // Dark Blue to Sky Blue
      color: 'white'
    }}>
      <div className="container text-center">
        <div className="mb-2">
          {/* Copyright Section */}
          <p className="mb-3">&copy; {new Date().getFullYear()} Group C . All rights reserved.</p>
          <h6 className="font-bold text-gray-200 hover:text-blue-500 focus:text-blue-500 transition-colors duration-200 cursor-pointer"> 
            Jee Kai Zhun
          </h6>
        </div>
        
        {/* Instagram Link Section */}
        <div>
            {/* <a href="https://www.instagram.com/jeekz17_/" target="_blank" className="link-light link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover">
                <i className="bi bi-instagram me-2">Follow me on Instagram</i>
            </a> */}
        </div>
        <div>
            <a href="/products" target="_blank" className="link-light link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover">
                <i>Products</i>
            </a>
        </div>
      </div>
    </footer>
  );
}