'use client'; 

import { useState, useEffect } from "react";
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ProfileModal from "../app/profile/ProfileModal";
import CartModal, { CartItem } from "@/app/products/cartModal"; // 1. Import your CartModal
import { logoutUser } from "@/lib/actions";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // 2. Add active cart visibility state
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  
  // Track continuous list array elements instead of just a raw number count string
  const [cartItems, setCartItems] = useState<CartItem[]>([]); 

  const handleLogout = async () => {
    await logoutUser(); 
    setUser(null);
    setIsLoggedIn(false);
    setRole(null);
    window.location.href = '/login'; 
  };

  // Sync cart data from central localStorage database tracking engine
  const syncCartWithStorage = () => {
    const savedCart = localStorage.getItem("pharmacy_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed parsing cart store payload:", e);
      }
    } else {
      setCartItems([]);
    }
  };

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/users', { cache: 'no-store' }); 
      
      if (res.ok) {
        const data = await res.json();
        if (data && data.role) {
          setUser(data);
          setIsLoggedIn(true);
          setRole(data.role);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setRole(null);
      }
    } catch (error) {
      console.error("Session fetch failed", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchSession();
    syncCartWithStorage(); // Load baseline cache on page mount

    // 3. Register Custom Listener to intercept real-time shop additions instantly
    const handleCartUpdateEvent = () => {
      syncCartWithStorage();
    };

    window.addEventListener("syncPharmacyCart", handleCartUpdateEvent);
    return () => window.removeEventListener("syncPharmacyCart", handleCartUpdateEvent);
  }, []);

  // Cart helper manipulation actions managed directly from your primary header
  const handleUpdateQuantity = (id: number, delta: number) => {
    const updated = cartItems
      .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter(item => item.quantity > 0);

    setCartItems(updated);
    localStorage.setItem("pharmacy_cart", JSON.stringify(updated));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("pharmacy_cart");
  };

  // Calculate distinct aggregated volume items count
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- RENDER: ADMIN NAVBAR ---
  if (isLoggedIn && role === 'admin') {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm px-4 sticky-top">
        <Link className="navbar-brand fw-bold" href="/admin/dashboard"> Admin Control Panel</Link>
        <div className="container-fluid justify-content-center">
          <ul className="navbar-nav flex-row gap-4">
            <li className="nav-item"><Link className="nav-link text-white fw-bold" href="/admin/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link text-white fw-bold" href="/admin/patients">Patient List</Link></li>
            <li className="nav-item"><Link className="nav-link text-white fw-bold" href="/admin/manageDoc">Doctor List</Link></li>
            <li className="nav-item"><Link className="nav-link text-white fw-bold" href="/admin/leave">Leave Approval</Link></li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm fw-bold">Logout Admin</button>
        </div>
      </nav>
    );
  }

  // --- RENDER: DOCTOR NAVBAR ---
  if (isLoggedIn && role === 'doctor') {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-4 sticky-top">
        <Link className="navbar-brand fw-bold" href="/doctor/dashboard">🩺 Doctor Portal</Link>
        <div className="container-fluid justify-content-center">
          <ul className="navbar-nav flex-row gap-4">
            <li className="nav-item"><Link className="nav-link text-white fw-bold" href="/doctor/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link text-white fw-bold" href="/doctor/bookings">Manage Bookings</Link></li>
            <li className="nav-item"><Link className="nav-link text-white fw-bold" href="/doctor/leaveApply">Apply Leave</Link></li>
          </ul>
        </div>
        <div className="d-flex align-items-center text-white">
          <span className="me-3 small fw-bold">Dr. {user?.username}</span>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm">Logout</button>
        </div>
      </nav>
    );
  }

  // --- RENDER: PATIENT NAVBAR ---
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4 sticky-top">
        <Link className="navbar-brand fw-bold" href={isLoggedIn ? "/dashboard" : "/"}>🏥 MedAppoint</Link>
        <div className="container-fluid justify-content-center">
          <ul className="navbar-nav flex-row gap-4">
            <li className="nav-item"><Link className="nav-link text-white" href={isLoggedIn ? "/dashboard" : "/"}>Home</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" href="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" href="/appointment">Appointments</Link></li>

            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link text-white" href="/products">Product</Link>
              </li>
            )}
            
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link text-white" href="/feedback">Feedback</Link>
              </li>
            )}
          </ul>
        </div>

        {/* RIGHT SIDE CONTAINER: Cart & Profile Identity actions */}
        <div className="d-flex align-items-center gap-3">
          
          {/* --- DYNAMIC CART ICON LINKED TO OVERLAY MODAL --- */}
          {isLoggedIn && (
            <div className="position-relative">
              <button 
                onClick={() => setIsCartOpen(true)} // 4. Click opens the blurred overlay modal
                className="btn btn-link position-relative p-0 text-decoration-none text-white opacity-75 hover-opacity-100 transition-all shadow-none d-block"
                title="View Cart"
              >
                <i className="bi bi-cart3" style={{ fontSize: '1.4rem' }}></i>
                {totalCartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: '0.6rem', padding: '0.25em 0.45em' }}>
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Profile Action Elements */}
          {isLoggedIn ? (
            <button onClick={() => setIsProfileOpen(true)} className="btn btn-link text-white d-flex align-items-center gap-2 text-decoration-none shadow-none p-0">
              <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
              <span className="fw-medium">{user?.username}</span>
            </button>
          ) : (
            <Link href="/login" className="nav-link text-white d-flex align-items-center gap-2">
              <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
              <span>Login</span>
            </Link>
          )}
        </div>
        
        {isProfileOpen && (
          <ProfileModal 
            user={user} 
            onClose={() => setIsProfileOpen(false)} 
            onLogout={handleLogout} 
          />
        )}
      </nav>

      {/* --- RENDERED OVERLAY CART MODAL VIEW WITH CENTRAL LAYOUT --- */}
      {isCartOpen && (
        <CartModal 
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
        />
      )}
    </>
  );
}