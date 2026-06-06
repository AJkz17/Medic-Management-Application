'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  dosage: string;
  image: string;
  description: string;
  inStock: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); 
  const [isCategoriesVisible, setIsCategoriesVisible] = useState<boolean>(true); 
  const [loading, setLoading] = useState<boolean>(true);

  // --- SEARCH AUTOCOMPLETE STATES ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch items live from database via backend API route
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetch("/api/products", { cache: 'no-store' });
        if (!response.ok) throw new Error("Failed to sync store inventory");
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Shop interface loading failed:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // --- CLOSE DROPDOWN ON CLICK OUTSIDE ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live Auto-complete Search Dropdown Filter Logic
  const autocompleteResults = searchQuery.trim() === ""
    ? [] : products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    
  // Unified Filtering Logic for Main Grid Display (Combines Category Checkboxes AND Search Keywords)
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchesSearch = searchQuery.trim() === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Checkbox change handler toggle
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // --- FIXED GLOBAL NAVBAR CART CONNECTIVITY SCRIPT ---
  const handleAddToCart = (product: Product) => {
    // 1. Fetch current cart cache snapshot array from localStorage safely
    const rawCart = localStorage.getItem("pharmacy_cart");
    let currentCart: any[] = rawCart ? JSON.parse(rawCart) : [];

    // 2. Check if this product item is already allocated inside the shopping basket
    const existingItem = currentCart.find((item) => item.id === product.id);
    
    if (existingItem) {
      // Increment structural count parameter natively
      currentCart = currentCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // Append item layout details to storage object arrays
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    // 3. Write back configured data elements string to cache layers
    localStorage.setItem("pharmacy_cart", JSON.stringify(currentCart));

    // 4. EMIT RE-VALIDATION EVENT TO INSTANTLY ALERT THE NAVBAR ICON Badges
    window.dispatchEvent(new Event("syncPharmacyCart"));
    
    alert(`Added ${product.name} to your medical cart!`);
  };

  // Safe Dropdown Selection (Filters text gracefully without mutating the master source array)
  const handleSelectDropdownItem = (productName: string) => {
    setSearchQuery(productName);
    setShowDropdown(false);
  };

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="text-center mb-4">
        <h1 className="text-primary fw-bold">In-House Pharmacy Shop</h1>
        <p className="text-muted">Browse prescription-free over-the-counter medicine and wellness necessities.</p>
      </div>

      {/* --- Dynamic seatch bar  --- */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-6 position-relative" ref={searchContainerRef}>
          <div className="input-group shadow-sm rounded">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input type="text" className="form-control border-start-0 py-2 shadow-none" placeholder="Search for items" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)} />
            {searchQuery && (
              <button className="btn btn-outline-secondary border-start-0 bg-white text-muted" type="button" onClick={() => {setSearchQuery(""); setShowDropdown(false);}}>
                 ✕
              </button>
            )}
          </div>

          {/* floating dropdown search suggestions */}
          {showDropdown && autocompleteResults.length > 0 && (
            <div className="position-absolute w-100 bg-white border rounded shadow-lg mt-1 overflow-hidden" style={{ zIndex: 1060, left: 0 }}>
              <div className="text-muted small px-3 py-2 bg-light border-bottom fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                Matching Inventory Items
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {autocompleteResults.map((p) => (
                  <div key={p.id} onClick={() => handleSelectDropdownItem(p.name)}  className="d-flex align-items-center justify-content-between p-3 border-bottom dropdown-search-item cursor-pointer bg-white transition-all">
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative rounded bg-light" style={{ width: '40px', height: '40px', overflow: 'hidden' }}>
                        <img src={p.image} alt={p.name} className="w-100 h-100 object-fit-cover" />
                      </div>
                      <div>
                        <div className="fw-bold text-dark small">{p.name}</div>
                        <span className="badge bg-secondary-subtle text-secondary rounded-pill px-2" style={{ fontSize: '0.6rem' }}>
                          {p.category}
                        </span>
                      </div>
                    </div>
                    {/* div to show price in right side  */}
                    <div className="text-end ps-2">
                      <span className="fw-bold text-success small">RM {p.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search if nothing found*/}
          {showDropdown && searchQuery.trim() !== "" && autocompleteResults.length === 0 && (
            <div className="position-absolute w-100 bg-white border rounded shadow-lg mt-1 p-3 text-center text-muted small" style={{ zIndex: 1060, left: 0 }}>
              <i className="bi bi-exclamation-circle me-1"></i> No matching medicines in stock.
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN: VISUAL VERTICAL CATEGORY FILTER SIDEBAR */}
        <div className="col-lg-3 col-md-4">
          <div className="card shadow-sm border-0 p-3 bg-light sticky-top" style={{ top: '6rem', zIndex: 10 }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h5 className="fw-bold text-dark m-0">
                <i className="bi bi-filter-square-fill text-primary me-2"></i>Filter
              </h5>
              <button 
                type="button"
                className="btn btn-link btn-sm text-decoration-none fw-semibold p-0 shadow-none text-primary"
                onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}
              >
                {isCategoriesVisible ? "Hide ✕" : "Show ＋"}
              </button>
            </div>

            {isCategoriesVisible && (
              <div className="pt-3 border-top border-secondary border-opacity-10">
                <p className="text-muted small fw-bold mb-2">BY CATEGORY</p>
                <div className="d-flex flex-column gap-2">
                  {["Pain Relief", "Antihistamine", "Stomach Care"].map((cat) => {
                    const isChecked = selectedCategories.includes(cat);
                    return (
                      <div key={cat} className="form-check p-2 rounded transition-all hover-bg-white d-flex align-items-center" style={{ cursor: 'pointer' }}>
                        <input
                          className="form-check-input cursor-pointer m-0 me-2"
                          type="checkbox"
                          id={`check-${cat}`}
                          checked={isChecked}
                          onChange={() => handleCategoryChange(cat)}
                          style={{ width: '1.1rem', height: '1.1rem' }}
                        />
                        <label 
                          className={`form-check-label cursor-pointer small fw-medium text-dark select-none w-100 ${isChecked ? 'fw-bold text-primary' : ''}`} 
                          htmlFor={`check-${cat}`}
                        >
                          {cat}
                        </label>
                      </div>
                    );
                  })}
                </div>

                {selectedCategories.length > 0 && (
                  <button 
                    onClick={() => setSelectedCategories([])}
                    className="btn btn-link btn-sm text-danger text-decoration-none mt-3 p-0 w-100 text-start small fw-semibold"
                  >
                    <i className="bi bi-trash3-fill me-1"></i> Clear all active filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MEDICINE GRID ELEMENT DISPLAY */}
        <div className="col-lg-9 col-md-8">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted small mt-2">Connecting to pharmacy warehouse database...</p>
            </div>
          ) : (
            <div>
              {/* --- REACTIVE DYNAMIC RESET NAVIGATION BANNER --- */}
              {searchQuery && (
                <div className="alert bg-light border border-secondary border-opacity-10 d-flex align-items-center justify-content-between p-3 mb-4 rounded shadow-sm animate-fade-in">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary text-white px-2 py-1">Filter Active</span>
                    <span className="text-dark fw-medium small">
                      Showing matches for: <strong className="text-primary">"{searchQuery}"</strong>
                    </span>
                  </div>
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-1 px-3 shadow-none border-0"
                  >
                    <i className="bi bi-arrow-left-short fs-5 lh-1"></i> View All Products
                  </button>
                </div>
              )}

              {/* Grid Layout Container */}
              <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <div key={p.id} className="col">
                      <div className="card h-100 shadow-sm border-0 overflow-hidden transition-all hover-shadow">
                        <div className="position-relative bg-light" style={{ height: '200px', width: '100%' }}>
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-fit-cover"
                            unoptimized
                          />
                          {!p.inStock && (
                            <div className="position-absolute top-0 inset-e-0 bg-danger text-white small px-2 py-1 fw-bold rounded-bottom-start shadow-sm">
                              Out of Stock
                            </div>
                          )}
                        </div>

                        <div className="card-body d-flex flex-column justify-content-between p-3">
                          <div>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2" style={{ fontSize: '0.7rem' }}>
                                {p.category}
                              </span>
                              <span className="fw-bold text-success fs-5">RM {p.price.toFixed(2)}</span>
                            </div>
                            <h5 className="card-title fw-bold text-dark mb-1">{p.name}</h5>
                            <p className="card-text text-muted small mb-3">{p.description}</p>
                          </div>

                          <div className="bg-light p-2 rounded mb-3 border-start border-3 border-info">
                            <small className="d-block text-secondary fw-bold" style={{ fontSize: '0.65rem' }}>DOSAGE GUIDELINES:</small>
                            <small className="text-dark font-monospace" style={{ fontSize: '0.75rem' }}>{p.dosage}</small>
                          </div>

                          <button 
                            onClick={() => handleAddToCart(p)}
                            disabled={!p.inStock}
                            className={`btn w-100 fw-bold d-flex align-items-center justify-content-center gap-2 ${
                              p.inStock ? 'btn-primary shadow-sm' : 'btn-secondary opacity-50'
                            }`}
                          >
                            <i className="bi bi-bag-plus-fill"></i>
                            {p.inStock ? "Add to Cart" : "Restocking..."}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5 text-muted">
                    <i className="bi bi-capsule-extralarge fs-1 opacity-25"></i>
                    <p className="mt-2">No medicines found matching selected filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}