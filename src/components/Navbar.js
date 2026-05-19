"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Sheet } from "react-modal-sheet";
import logo from "@/images/blueberry-logo-Photoroom.png";

import { X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { API_URLS } from "@/utils/api";


export default function Navbar() {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");
  const { cartCount } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  /* SEARCH POPUP */
  const [showSearchPopup, setShowSearchPopup] = useState(false);

  const searchPopupRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const catRes = await fetch(API_URLS.CATEGORIES);
        const cats = await catRes.json();
        
        const subRes = await fetch(API_URLS.SUBCATEGORIES);
        const subs = await subRes.json();

        // Filter only Active categories and subcategories
        const activeCats = cats.filter(c => c.status === "Active");
        const activeSubs = subs.filter(s => s.status === "Active");

        setCategories(activeCats);
        setSubcategories(activeSubs);
      } catch (err) {
        console.error("Error fetching navigation categories:", err);
      }
    };

    fetchNavData();
  }, []);

  /* =========================
     SEARCH PLACEHOLDER SLIDER
  ========================= */

  const placeholders = [
    'Search "PINK SHIRTS"',
    'Search "POLO SHIRTS"',
    'Search "LINEN SHIRTS"',
    'Search "WHITE SHIRTS"',
  ];

  const [activePlaceholder, setActivePlaceholder] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [showPincodePopup, setShowPincodePopup] = useState(false);
  const [pincode, setPincode] = useState("");
  const [savedPincode, setSavedPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");

  useEffect(() => {
    if (searchValue.length > 0) return;

    const interval = setInterval(() => {
      setActivePlaceholder((prev) =>
        prev === placeholders.length - 1 ? 0 : prev + 1
      );
    }, 2200);

    return () => clearInterval(interval);
  }, [searchValue]);

  /* CLOSE SEARCH POPUP OUTSIDE CLICK */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchPopupRef.current &&
        !searchPopupRef.current.contains(event.target)
      ) {
        setShowSearchPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
     SCROLL
  ========================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =========================
     BODY LOCK
  ========================= */

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const storedPincode = localStorage.getItem("delivery_pincode");

    if (storedPincode) {
      setSavedPincode(storedPincode);
      setDeliveryMessage(`Delivery available for ${storedPincode}`);
    }
  }, []);
  /* =========================
     MENU TOGGLE
  ========================= */

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handlePincodeCheck = () => {
    if (!/^[0-9]{6}$/.test(pincode)) {
      setDeliveryMessage("Please enter valid 6 digit pincode");
      return;
    }

    localStorage.setItem("delivery_pincode", pincode);

    setSavedPincode(pincode);
    setDeliveryMessage(`Delivery available for ${pincode}`);

    setTimeout(() => {
      setShowPincodePopup(false);
    }, 700);
  };

  if (isAdminPath) return null;

  return (
    <>
      {/* =========================================
          DESKTOP TOP HEADER
      ========================================= */}

      <div className="desktop-header">
        <div className="header-sticky">
          <div className="header-inner">
            {/* LEFT */}

            <span className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 25" fill="none">
                <line y1="5" x2="24" y2="5" stroke="#0a2342"></line>
                <line y1="13" x2="24" y2="13" stroke="#0a2342"></line>
                <line y1="21" x2="24" y2="21" stroke="#0a2342"></line>
              </svg>
            </span>

            {/* Spacer */}
            <div className="header-space"></div>

            {/* LOGO */}
            <div className="logo-wrapper">
              <Link href="/">
                <Image
                  src={logo}
                  alt="Blueberries Logo"
                  className="logo-image"
                  priority
                />
              </Link>
            </div>

            {/* RIGHT */}

            <div className="header-right">
              {/* SEARCH */}

              <div
                className="search-wrapper"
                ref={searchPopupRef}
              >
                <div
                  className="search-box"
                  onClick={() => setShowSearchPopup(true)}
                >
                  <div className="search-icon">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8.866 16.59a7.723 7.723 0 1 0 0-15.447 7.723 7.723 0 0 0 0 15.446ZM22.878 22.768l-8.605-8.495"></path>
                      </g>
                    </svg>
                  </div>
                  <input
                    type="search"
                    className="search-input"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />

                  {searchValue === "" && (
                    <div className="search-placeholder">
                      <div
                        className="placeholder-slider"
                        style={{
                          transform: `translateY(-${activePlaceholder * 24
                            }px)`,
                        }}
                      >
                        {placeholders.map((item, index) => (
                          <div className="placeholder-item" key={index}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* SEARCH POPUP */}

                <div
                  className={`search-popup ${showSearchPopup ? "active" : ""
                    }`}
                >
                  {/* <button
                    className="drawer-close"
                    onClick={() => setShowSearchPopup(false)}
                  >
                    <X size={22} color="black" />
                  </button> */}
                  <div className="mobile_search_input">

                    <div
                      className="search-box"
                    >
                      <div className="search-icon">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <g
                            stroke="black"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M8.866 16.59a7.723 7.723 0 1 0 0-15.447 7.723 7.723 0 0 0 0 15.446ZM22.878 22.768l-8.605-8.495"></path>
                          </g>
                        </svg>
                      </div>
                      <input
                        type="search"
                        className="search-input"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />

                      {searchValue === "" && (
                        <div className="search-placeholder">
                          <div
                            className="placeholder-slider"
                            style={{
                              transform: `translateY(-${activePlaceholder * 24
                                }px)`,
                            }}
                          >
                            {placeholders.map((item, index) => (
                              <div className="placeholder-item" key={index}>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* TOP SEARCHES */}

                  <div className="search-section">
                    <h3 className="section-title">
                      Top Searches
                    </h3>

                    <div className="chip-wrapper">
                      {[
                        "POLO SHIRTS",
                        "LINEN SHIRTS",
                        "WHITE SHIRTS",
                        "BLACK SHIRTS",
                        "FORMAL SHIRTS",
                        "BAGGY JEANS",
                      ].map((item, index) => (
                        <div className="search-chip" key={index}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TRENDING */}

                  <div className="search-section">
                    <h3 className="section-title">
                      Trending
                    </h3>

                    <div className="chip-wrapper">
                      {[
                        "All",
                        "Shirts",
                        "T-Shirts",
                        "Jeans",
                        "Cargo Pants",
                        "Shoes",
                      ].map((item, index) => (
                        <div
                          className={`search-chip ${index === 0 ? "active-chip" : ""
                            }`}
                          key={index}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PRODUCTS */}

                  <div className="search-products">

                    {[1, 2, 3, 4].map((item) => (
                      <div className="product-card" key={item}>
                        <div className="product-image-wrapper">
                          <img
                            src="https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_7e454c60-a9aa-40e9-817d-d553b1424652.jpg?v=1775232197&quality=80"
                            alt=""
                            className="product-image"
                          />
                        </div>

                        <div className="product-content">
                          <h4>
                            Navy Cotton Linen Shirt
                          </h4>

                          <p>
                            ₹1599
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
                <div
                  className={`mobile-menu-overlay search_overlay ${showSearchPopup ? "active" : ""}`}
                  onClick={() => setShowSearchPopup(false)}
                ></div>
              </div>

              <div className="mbl_search_icon"
                onClick={() => setShowSearchPopup(true)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="jsx-dc2ab4ef147f532a"><g stroke="black" strokeLinecap="round" strokeLinejoin="round" className="jsx-dc2ab4ef147f532a"><path d="M8.866 16.59a7.723 7.723 0 1 0 0-15.447 7.723 7.723 0 0 0 0 15.446ZM22.878 22.768l-8.605-8.495" className="jsx-dc2ab4ef147f532a"></path></g></svg>
              </div>
            </div>

            {/* ICONS */}

            <div className="header-icons">
              <button className="header-icon-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.7802 11.9614C9.1921 11.9614 7.09399 9.86326 7.09399 7.27512C7.09399 4.68697 9.1921 2.58887 11.7802 2.58887C14.3684 2.58887 16.4665 4.68697 16.4665 7.27512C16.4665 9.86326 14.3684 11.9614 11.7802 11.9614Z"
                    fill="#FFF"
                    stroke="black"
                  />

                  <path
                    d="M19.8314 21.3342C19.8314 17.707 16.223 14.7734 11.7805 14.7734C7.3379 14.7734 3.72949 17.707 3.72949 21.3342"
                    fill="#FFF"
                    stroke="black"
                  />
                </svg>
              </button>

              <Link
                href="/checkout/cart"
                className="cart-btn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 9V7.86177C17 5.17669 14.7614 3 12 3C9.23858 3 7 5.17669 7 7.86177V9" stroke="#000" strokeLinecap="square" strokeLinejoin="round"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M19.9657 22L21 7L3 7L4.03434 22L19.9657 22Z" stroke="#000" strokeLinecap="round"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.9133 11.8345C15.5285 11.3311 14.9458 11 14.1887 11C13.4316 11 12.8807 11.3131 12.5144 11.6184C12.4043 11.7102 12.3108 11.8018 12.2337 11.8854C12.1563 11.8017 12.0624 11.71 11.9521 11.6182C11.5855 11.3133 11.0257 11 10.2801 11C9.53449 11 8.943 11.3314 8.55774 11.8343C8.17944 12.3283 8 12.9739 8 13.613C8 14.3218 8.27734 14.9871 8.66481 15.5728C9.05292 16.1594 9.56445 16.6858 10.0658 17.1239C10.5683 17.5631 11.0694 17.9208 11.4441 18.1685C11.6318 18.2926 11.7884 18.3895 11.8989 18.4558C11.9541 18.4889 11.9977 18.5144 12.028 18.5318C12.0431 18.5405 12.0549 18.5472 12.063 18.5519C12.0672 18.5542 12.0703 18.556 12.0725 18.5573L12.0752 18.5587L12.0762 18.5594L12.2345 18.6471L12.3927 18.5594L12.3938 18.5587L12.3964 18.5573C12.3986 18.556 12.4018 18.5542 12.4059 18.5519C12.414 18.5472 12.4258 18.5406 12.4409 18.5318C12.4712 18.5144 12.5149 18.4889 12.57 18.4558C12.6805 18.3895 12.8371 18.2926 13.0248 18.1685C13.3995 17.9208 13.9005 17.5631 14.4032 17.1239C14.9046 16.6859 15.416 16.1594 15.8041 15.5728C16.1916 14.9871 16.4689 14.3217 16.4689 13.613C16.4689 12.9744 16.2911 12.3288 15.9133 11.8345Z" fill="#0a2342"></path>
                </svg>

                {cartCount > 0 && (
                  <span className="cart-badge">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* =========================================
          MAIN HEADER
      ========================================= */}

      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container-fluid">
          {/* MOBILE MENU BUTTON */}

          {/* <span className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 25" fill="none">
              <line y1="5" x2="24" y2="5" stroke="#0a2342"></line>
              <line y1="13" x2="24" y2="13" stroke="#0a2342"></line>
              <line y1="21" x2="24" y2="21" stroke="#0a2342"></line>
            </svg>
          </span> */}

          {/* DESKTOP NAVIGATION */}
          {/* <div style={{ fontSize: '13px', width: '100%', display: 'flex', alignItems: 'center', marginTop: '10px', gap: '5px' }}>
            <span style={{ fontWeight: 'bold' }}>Enter Pincode -</span>
            <span className="text-black underline cursor-pointer"
              style={{ textDecoration: 'underline' }}>to check delivery</span>
          </div> */}
          <div
            style={{
              fontSize: "13px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            className="pincodeParent"

            onClick={() => setShowPincodePopup(true)}
          >
            <span style={{ fontWeight: "bold" }}>
              {savedPincode ? `Pincode ${savedPincode} -` : "Enter Pincode -"}
            </span>

            <span
              style={{ textDecoration: "underline" }}
            >
              {savedPincode ? "Change Pincode" : "to check delivery"}
            </span>
          </div>
          <Sheet
            isOpen={showPincodePopup}
            onClose={() => setShowPincodePopup(false)}
            detent="content-height"
          >
            <Sheet.Container
              style={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                background: "#fff",
                boxShadow: "none",
              }}
            >
              <Sheet.Content>
                <div className="pincode-modal-wrapper">

                  {/* CLOSE */}
                  <button
                    className="pincode-close"
                    onClick={() => setShowPincodePopup(false)}
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>

                  {/* LOCATION BOX */}
                  <div className="location-box">
                    <div className="location-left">
                      <div className="location-icon">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#000" d="M12 2a1 1 0 0 1 .993.883L13 3v1.314a7.754 7.754 0 0 1 6.686 6.687L21 11a1 1 0 0 1 .117 1.993L21 13h-1.314A7.754 7.754 0 0 1 13 19.686V21a1 1 0 0 1-1.993.117L11 21v-1.314A7.754 7.754 0 0 1 4.315 13H3a1 1 0 0 1-.117-1.993L3 11h1.314A7.754 7.754 0 0 1 11 4.315V3a1 1 0 0 1 1-1Zm0 4.25a5.75 5.75 0 1 0 0 11.5 5.75 5.75 0 0 0 0-11.5ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" opacity="0.65"></path></svg>
                      </div>

                      <div>
                        <p className="location-title">
                          LOCATION IS NOT ENABLED
                        </p>

                        <p className="location-subtitle">
                          Enable location for delivery estimate
                        </p>
                      </div>
                    </div>

                    <button className="enable-btn">
                      ENABLE
                    </button>
                  </div>

                  {/* OR */}
                  <div className="or-divider">
                    <span></span>
                    <p>OR</p>
                    <span></span>
                  </div>

                  {/* PINCODE */}
                  <p className="pincode-label">
                    ENTER PINCODE
                  </p>

                  <div className="pincode-input-box">
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) =>
                        setPincode(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter Pincode"
                    />

                    <button onClick={handlePincodeCheck}>
                      APPLY
                    </button>
                  </div>

                  {deliveryMessage && (
                    <p className="delivery-message">
                      {deliveryMessage}
                    </p>
                  )}
                </div>
              </Sheet.Content>
            </Sheet.Container>

            <Sheet.Backdrop
              onClick={() => setShowPincodePopup(false)} />
          </Sheet>
          <nav className="desktop-navigation">
            <ul className="desktop-nav-list">
              <li>
                <Link href="/" className="desktop-nav-link">
                  Home
                </Link>
              </li>

              {categories.map((category) => {
                const categorySubs = subcategories.filter(
                  (sub) => sub.category === category.name
                );
                const hasSubs = categorySubs.length > 0;

                return (
                  <li
                    key={category._id}
                    className={hasSubs ? "has-mega-menu" : ""}
                  >
                    <Link
                      href={`/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="desktop-nav-link"
                    >
                      {category.name}
                      {hasSubs && <ChevronDown size={14} className="nav-arrow" />}
                    </Link>
                    {hasSubs && (
                      <div className="mega-menu">
                        <div className="mega-column">
                          <ul>
                            {categorySubs.map((sub) => (
                              <li key={sub._id}>
                                <Link
                                  href={`/${category.name.toLowerCase().replace(/\s+/g, "-")}/${sub.name.toLowerCase().replace(/\s+/g, "-")}`}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}

      <div
        className={`mobile-menu-overlay ${isMenuOpen ? "active" : ""}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* =========================================
          MOBILE SIDEBAR
      ========================================= */}

      <div className={`mobile-drawer ${isMenuOpen ? "active" : ""}`}>
        {/* TOP */}

        <div className="drawer-top">
          <button
            className="drawer-close"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={22} color="black" />
          </button>

          <h2 className="drawer-title">
            Categories
          </h2>
        </div>

        {/* SEARCH */}

        <div className="drawer-search-wrapper">
          <div className="drawer-search-box">
            <div className="drawer-search-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <g
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8.866 16.59a7.723 7.723 0 1 0 0-15.447 7.723 7.723 0 0 0 0 15.446ZM22.878 22.768l-8.605-8.495"></path>
                </g>
              </svg>
            </div>

            <input type="search" className="drawer-search-input" />

            <div className="drawer-placeholder">
              <div
                className="drawer-placeholder-slider"
                style={{
                  transform: `translateY(-${activePlaceholder * 24}px)`,
                }}
              >
                {placeholders.map((item, index) => (
                  <div className="drawer-placeholder-item" key={index}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MENU */}

        <div className="drawer-menu">
          <Link
            href="/new-arrivals"
            className="drawer-link"
            onClick={() => setIsMenuOpen(false)}
          >
            NEW ARRIVALS
          </Link>

          <Link
            href="/bestsellers"
            className="drawer-link"
            onClick={() => setIsMenuOpen(false)}
          >
            BESTSELLERS
          </Link>

          <Link
            href="/sale"
            className="drawer-link sale"
            onClick={() => setIsMenuOpen(false)}
          >
            SALE
          </Link>

          {categories.map((category) => {
            const categorySubs = subcategories.filter(
              (sub) => sub.category === category.name
            );
            const hasSubs = categorySubs.length > 0;
            const isExpanded = expandedMenus[category._id];

            return (
              <div key={category._id} className="drawer-menu-item" style={{ borderBottom: "1px solid #f9f9f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Link
                    href={`/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="drawer-link"
                    style={{ flex: 1, borderBottom: "none", margin: 0 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name.toUpperCase()}
                  </Link>
                  {hasSubs && (
                    <button
                      onClick={() => toggleMenu(category._id)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: "12px 20px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <ChevronDown
                        size={18}
                        style={{
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease"
                        }}
                      />
                    </button>
                  )}
                </div>
                {hasSubs && isExpanded && (
                  <div style={{ paddingLeft: "20px", background: "#fafafa" }}>
                    {categorySubs.map((sub) => (
                      <Link
                        key={sub._id}
                        href={`/${category.name.toLowerCase().replace(/\s+/g, "-")}/${sub.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="drawer-link"
                        style={{ fontSize: "14px", padding: "10px 15px", textTransform: "capitalize", borderBottom: "none" }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================
          STYLES
      ========================================= */}

      <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
          }

          /* =========================
                    DESKTOP TOP HEADER
                  ========================= */

          .desktop-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #fff;
            z-index: 2000;
            border-bottom: 1px solid #eee;
          }

          .mobile_search_input{
            display: none;
          }

          @media (max-width: 991px) {
            .search-box {
              display: none !important;
            }

            .mbl_search_icon {
              display: flex !important;
            }
            .desktop-nav-list.pincodeParent{
              margin-top: 50px !important;
            }
            .mobile_search_input,
            .mobile_search_input .search-box{
              display: flex !important;
              width: 100%;
              margin-bottom: 10px;
            }
          }

          .header-sticky {
            position: relative;
            width: 100%;
          }

          .header-inner {
            background: #fff;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 24px 8px 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            width: 100%;
          }

          .menu-toggle {
            padding: 12px;
            cursor: pointer;
            background: #fff;
            transition: background 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .menu-toggle:hover {
            background: #f5f5f5;
          }

          .header-space {
            display: none;
          }
          @media (max-width: 768px) {
            .desktop-nav-list {
              overflow-x: auto;
              overflow-y: hidden;
              white-space: nowrap;
              flex-wrap: nowrap;

              width: 100%;

              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
            }

            .desktop-nav-list::-webkit-scrollbar {
              display: none;
            }


            .desktop-navigation {
              width: 100%;
              overflow: hidden;
            }
          }
          @media (min-width: 1024px) {
            .header-space {
              display: block;
              min-width: 250px;
            }
            // .search_overlay {
            //   display: none;
            // }
          }

          .logo-wrapper {
            flex: 1;
            display: flex;
            justify-content: center;
          }

          .logo-image {
            width: auto;
            height: 58px;
            object-fit: contain;
          }

          .header-right {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          /* =========================
                    SEARCH
                  ========================= */

          // .search-wrapper {
          //   width: 360px;
          // }

          .search-box {
            position: relative;
            height: 44px;
            border: 1px solid #000;
            display: flex;
            align-items: center;
            overflow: hidden;
          }

          .search-icon {
            padding-left: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mbl_search_icon {
            display: none;
          }

          .search-input {
            flex: 1;
            height: 100%;
            border: none;
            outline: none;
            padding: 0 14px;
            font-size: 14px;
            background: transparent;
            position: relative;
            z-index: 2;
          }

          .search-input:focus,
          .drawer-search-input:focus{
            background-color: #ffffff;
          }

          .search-placeholder {
            position: absolute;
            left: 48px;
            top: 50%;
            transform: translateY(-50%);
            height: 24px;
            overflow: hidden;
            pointer-events: none;
          }

          .placeholder-slider {
            transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
          }

          .placeholder-item {
            height: 24px;
            display: flex;
            align-items: center;
            color: #777;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.2px;
          }

          /* =========================
                    ICONS
                  ========================= */

          .header-icons {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          /* SEARCH POPUP */

          .search-popup {
            position: absolute;
            top: 80px;
            right: 105px;
            width: 700px;
            max-height: 80vh;
            overflow-y: auto;
            background: #fff;
            border: 1px solid #eee;
            border-radius: 12px;
            padding: 20px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: 0.3s ease;
            box-shadow: 0 10px 40px #0000001a;
            z-index: 999;
          }

          .search-popup.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }

          .search-section {
            margin-bottom: 24px;
          }

          .section-title {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 14px;
            text-transform: uppercase;
          }

          .chip-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .search-chip {
            border: 1px solid var(--primary-color);
            padding: 8px 14px;
            font-size: 12px;
            cursor: pointer;
            transition: 0.3s;
          }

          .search-chip:hover {
            background: var(--primary-color);
            color: #fff;
          }

          .active-chip {
            background: var(--primary-color);
            color: #fff;
          }

          /* PRODUCTS */

          .search-products {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .product-card {
            border-radius: 10px;
            overflow: hidden;
            background: #fff;
            cursor: pointer;
          }

          .product-image-wrapper {
            width: 100%;
            height: 320px;
            overflow: hidden;
          }

          .product-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: 0.4s;
          }

          .product-card:hover .product-image {
            transform: scale(1.05);
          }

          .product-content {
            padding: 10px;
          }

          .product-content h4 {
            font-size: 14px;
            margin: 0 0 6px;
            font-weight: 500;
          }

          .product-content p {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
          }

          .header-icon-btn,
          .cart-btn {
            border: none;
            background: transparent;
            cursor: pointer;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
          }

          .cart-badge {
            position: absolute;
            top: -7px;
            right: -10px;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #000;
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* =========================
                    MAIN HEADER
                  ========================= */

          .header {
            margin-top: 80px;
            height: 70px;
            background: #fff;
            position: sticky;
            top: 0;
            z-index: 1000;
            transition: all 0.3s ease;
            border-bottom: 1px solid #f1f1f1;
          }

          .header.scrolled {
            height: 60px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          }

          .container-fluid {
            height: 100%;
            max-width: 1700px;
            margin: auto;
            padding: 0 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .pincodeParent{
            margin-top: 10px
          }
          /* =========================
                    NAVIGATION
                  ========================= */

          .desktop-navigation {
            display: flex;
            align-items: center;
          }

          @media (max-width: 1024px) {
            // .desktop-navigation {
            //   display: none;
            // }
            .search-popup {
              width: 100%;
              right: 0;
            }
            .search-popup {
              border-radius: 0 0 12px 12px;
            }
              .header-icon-btn{
              padding: 10px 0 10px 14px;
              }
          }

          .desktop-nav-list {
            display: flex;
            align-items: center;
            gap: 32px;
            list-style: none;
            padding: 0 0 10px 0;
            margin: 0;
          }

          .desktop-nav-link {
            display: flex;
            align-items: center;
            color: #000;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1px;
            transition: opacity 0.3s ease;
          }

          .desktop-nav-link:hover {
            opacity: 0.6;
          }

          .nav-arrow {
            margin-left: 4px;
          }

          /* =========================
                    MEGA MENU
                  ========================= */

          .has-mega-menu {
            position: relative;
          }

          .mega-menu {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #fff;
            min-width: 220px;
            padding: 20px;
            border: 1px solid #eee;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          }

          .has-mega-menu:hover .mega-menu {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
          }

          .mega-column ul {
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .mega-column li {
            margin-bottom: 10px;
          }

          .mega-column a {
            color: #444;
            text-decoration: none;
            font-size: 14px;
          }

          /* =========================
                    MOBILE
                  ========================= */

          .mobile-menu-toggle {
            display: none;
            border: none;
            background: transparent;
            cursor: pointer;
          }

          @media (max-width: 1024px) {
            .mobile-menu-toggle {
              display: flex;
            }

            .header {
              margin-top: 60px;
              height: 100px;
            }
            .container-fluid{
              gap: 10px;
            }
              .pincodeParent {
    margin-top: 22px;
}
          }

          /* =========================
                    MOBILE OVERLAY
                  ========================= */
          .search_overlay {
            z-index: -1 !important;
          }

          .mobile-menu-overlay {
            position: fixed;
            inset: 0;
            background: #00000080;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: 0.4s ease;
          }

          .mobile-menu-overlay.active {
            opacity: 1;
            visibility: visible;
          }

          /* =========================
                    MOBILE SIDEBAR
                  ========================= */

          .mobile-nav-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 85%;
            max-width: 340px;
            height: 100vh;
            background: #fff;
            z-index: 2000;
            transition: left 0.45s cubic-bezier(0.85, 0, 0.15, 1);
            display: flex;
            flex-direction: column;
          }

          .mobile-nav-sidebar.active {
            left: 0;
          }

          .mobile-sidebar-top {
            height: 90px;
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .mobile-sidebar-logo {
            width: auto;
            height: 50px;
            object-fit: contain;
          }

          .close-sidebar-btn {
            border: none;
            background: #f5f5f5;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .mobile-nav-scroll-area {
            flex: 1;
            overflow-y: auto;
          }

          .mobile-nav-list,
          .sub-list {
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .mobile-menu-link {
            display: flex;
            align-items: center;
            padding: 18px 24px;
            border-bottom: 1px solid #f1f1f1;
            text-decoration: none;
            color: #111;
            cursor: pointer;
          }

          .icon-box {
            width: 24px;
            margin-right: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
          }

          .link-text {
            flex: 1;
            font-size: 15px;
            font-weight: 700;
          }

          .chevron {
            transition: transform 0.3s ease;
          }

          .chevron.rotate {
            transform: rotate(180deg);
          }

          .sub-list {
            background: #fafafa;
          }

          .sub-list a {
            display: block;
            padding: 14px 24px 14px 64px;
            border-bottom: 1px solid #eee;
            text-decoration: none;
            color: #444;
            font-size: 14px;
            font-weight: 600;
          }

          /* =========================================
            MOBILE DRAWER
          ========================================= */

          .mobile-drawer {
            position: fixed;
            top: 0;
            left: 0;
            width: 480px;
            max-width: 92%;
            height: 100vh;
            background: #fff;
            z-index: 3000;
            transform: translateX(-100%);
            transition: transform 0.35s ease;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .mobile-drawer.active {
            transform: translateX(0);
          }

          .drawer-top {
            height: 60px;
            min-height: 60px;
            display: flex;
            align-items: center;
            padding: 0 16px;
            border-bottom: 1px solid #eee;
            position: relative;
          }

          .drawer-close {
            width: 60px;
            height: 60px;
            border: none;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .drawer-title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .drawer-search-wrapper {
            padding: 20px 16px;
          }

          .drawer-search-box {
            position: relative;
            height: 44px;
            border: 1px solid #000;
            display: flex;
            align-items: center;
            overflow: hidden;
          }

          .drawer-search-icon {
            width: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .drawer-search-input {
            flex: 1;
            height: 100%;
            border: none;
            outline: none;
            font-size: 14px;
            background: transparent;
          }

          .drawer-placeholder {
            position: absolute;
            z-index: -1;
            left: 46px;
            top: 50%;
            transform: translateY(-50%);
            overflow: hidden;
            height: 24px;
            pointer-events: none;
          }

          .drawer-placeholder-slider {
            transition: transform 0.5s ease;
          }

          .drawer-placeholder-item {
            height: 24px;
            display: flex;
            align-items: center;
            color: #777;
            font-size: 13px;
          }

          .drawer-menu {
            flex: 1;
            overflow-y: auto;
            padding-bottom: 40px;
          }

          .drawer-link {
            display: flex;
            align-items: center;
            height: 52px;
            padding: 0 18px;
            border-bottom: 1px solid #f1f1f1;
            text-decoration: none;
            color: #000;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            transition: background 0.2s ease;
          }

          .drawer-link:hover {
            background: #f7f7f7;
          }

          .drawer-link.sale {
            color: #d45e3f;
            font-weight: 700;
          }

          @media (max-width: 768px) {
            .mobile-drawer {
              width: 100%;
              max-width: 100%;
            }
          }

          /* PINCODE MODAL */

          .pincode-modal-wrapper {
            position: relative;
            padding: 20px;
            background: #fff;
          }

          .pincode-close {
            color: #000000;
            position: absolute;
            top: 0;
            right: 0px;
            border: none;
            background: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .location-box {
            width: 100%;
            min-height: 80px;
            background: #f7eee8;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            margin-top: 12px;
          }

          .location-left {
            display: flex;
            gap: 12px;
            align-items: flex-start;
          }

          .location-icon {
            font-size: 18px;
            line-height: 1;
          }

          .location-title {
            margin: 0;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .location-subtitle {
            margin: 4px 0 0;
            font-size: 12px;
            color: #555;
          }

          .enable-btn {
            height: 34px;
            padding: 0 18px;
            background: #000;
            color: #fff;
            border: none;
            font-size: 10px;
            font-weight: 700;
            cursor: pointer;
            letter-spacing: 0.5px;
          }

          .or-divider {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 18px 0;
          }

          .or-divider span {
            flex: 1;
            height: 1px;
            background: #b2b2b2;
          }

          .or-divider p {
            margin: 0;
            font-size: 12px;
            font-weight: 700;
          }

          .pincode-label {
            margin: 0 0 10px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .pincode-input-box {
            width: 100%;
            height: 42px;
            border: 1px solid #d4d4d4;
            display: flex;
            align-items: center;
            justify-content: space-between;
            overflow: hidden;
          }

          .pincode-input-box input {
            flex: 1;
            height: 100%;
            border: none;
            outline: none;
            padding: 0 14px;
            font-size: 14px;
            background: transparent;
          }

          .pincode-input-box button {
            height: 100%;
            padding: 0 18px;
            border: none;
            background: #fff;
            cursor: pointer;
            color: #000000;
            font-size: 13px;
            font-weight: 700;
          }

          .pincode-input-box button:hover {
            background: #f5f5f5;
          }

          .delivery-message {
            margin-top: 14px;
            font-size: 13px;
            font-weight: 600;
          }

          @media (min-width: 768px) {

            .react-modal-sheet-container {
              right: 0;
              top: 0;
              margin: auto !important;
              height: fit-content !important;
            }
          }

          @media (min-width: 1200px) {
            .react-modal-sheet-container {
              width: 600px !important;
            }
          }
      `}</style>
    </>
  );
}
