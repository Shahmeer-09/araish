"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DbProductCard from "@/components/DbProductCard";
import Pagination from "@/components/Pagination";
import Image from "next/image";

interface DbProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  material: string;
  inStock: boolean;
  featured: boolean;
  images: { id: string; mimeType: string }[];
}

interface Settings {
  bannerTitle: string;
  bannerSubtitle: string;
  hasBannerImage: boolean;
  shopNameUrdu: string;
  updatedAt?: number;
}

interface PaginationData {
  page: number;
  totalPages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function Home() {
  const [settings, setSettings] = useState<Settings>({
    bannerTitle: "Aaraish",
    bannerSubtitle: "Exquisite Handcrafted Jewelry",
    hasBannerImage: false,
    shopNameUrdu: "",
  });
  const [featuredProducts, setFeaturedProducts] = useState<DbProduct[]>([]);
  const [allProducts, setAllProducts] = useState<DbProduct[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [bannerCacheBust, setBannerCacheBust] = useState(0);

  const fetchSettings = useCallback(async () => {
    try {
      // Check localStorage cache first
      const cachedSettings = localStorage.getItem('siteSettings');
      const cachedTime = localStorage.getItem('siteSettingsTime');
      const now = Date.now();
      
      // Use cache if it's less than 5 minutes old
      if (cachedSettings && cachedTime && (now - parseInt(cachedTime)) < 5 * 60 * 1000) {
        const cached = JSON.parse(cachedSettings);
        setSettings(cached);
        setBannerCacheBust(cached.updatedAt || now);
        return;
      }

      // Fetch fresh data
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        const settingsData = {
          bannerTitle: data.bannerTitle || "Araish",
          bannerSubtitle:
            data.bannerSubtitle || "Exquisite Handcrafted Jewelry",
          hasBannerImage: data.hasBannerImage,
          shopNameUrdu: data.shopNameUrdu || "",
          updatedAt: data.updatedAt || now,
        };
        setSettings(settingsData);
        setBannerCacheBust(data.updatedAt || now);
        
        // Cache the settings
        localStorage.setItem('siteSettings', JSON.stringify(settingsData));
        localStorage.setItem('siteSettingsTime', now.toString());
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }, []);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/public/products?featured=true&limit=4",
      );
      if (response.ok) {
        const data = await response.json();
        setFeaturedProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  }, []);

  const fetchAllProducts = useCallback(async (page: number) => {
    try {
      setProductsLoading(true);
      const response = await fetch(`/api/public/products?page=${page}&limit=8`);
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSettings(),
        fetchFeaturedProducts(),
        fetchAllProducts(1),
      ]);
      setLoading(false);
    };
    loadData();
  }, [fetchSettings, fetchFeaturedProducts, fetchAllProducts]);

  const handlePageChange = (page: number) => {
    fetchAllProducts(page);
    // Scroll to all products section
    document
      .getElementById("all-products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const urduTitle = settings.shopNameUrdu?.trim();
  const hasUrduTitle = Boolean(urduTitle);
  const scrollToCollections = useCallback(() => {
    document
      .getElementById("collections")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div
      className="min-h-screen bg-[var(--background)]"
      suppressHydrationWarning
    >
      <Header />
      <WhatsAppButton />

      {/* Hero Section with Royal Styling */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {settings.hasBannerImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/settings/banner?t=${bannerCacheBust}`}
              alt="Luxury jewelry background"
              className="w-full h-full object-cover scale-105 animate-[scaleIn_1.5s_ease-out]"
              key={bannerCacheBust}
            />
          )}
          {/* Royal gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        {/* Decorative corner elements */}
        <div
          className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-[var(--gold)]/40 animate-fade-in opacity-0 delay-700"
          style={{ animationFillMode: "forwards" }}
        />
        <div
          className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-[var(--gold)]/40 animate-fade-in opacity-0 delay-700"
          style={{ animationFillMode: "forwards" }}
        />
        <div
          className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-[var(--gold)]/40 animate-fade-in opacity-0 delay-700"
          style={{ animationFillMode: "forwards" }}
        />
        <div
          className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-[var(--gold)]/40 animate-fade-in opacity-0 delay-700"
          style={{ animationFillMode: "forwards" }}
        />

        <div className="relative z-10 text-center text-white px-4 space-y-8">
          {/* Royal decorative element */}
          <div
            className="flex items-center justify-center gap-4 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--gold)]" />
            <span className="text-[var(--gold)] text-sm tracking-[0.3em]">
              ✦ LUXURY JEWELLERY ✦
            </span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--gold)]" />
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-8xl font-serif tracking-[0.2em] animate-fade-in-up opacity-0"
            dir={hasUrduTitle ? "rtl" : "ltr"}
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            {hasUrduTitle ? urduTitle : settings.bannerTitle}
          </h1>

          {hasUrduTitle && (
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-[0.25em] text-[var(--gold-light)] animate-fade-in-up opacity-0"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              {settings.bannerTitle}
            </h2>
          )}

          {/* Elegant divider */}
          <div
            className="flex items-center justify-center gap-4 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <span className="w-16 h-px bg-[var(--gold)]" />
            <span className="text-[var(--gold)]">◆</span>
            <span className="w-16 h-px bg-[var(--gold)]" />
          </div>

          <p
            className="text-lg sm:text-xl md:text-2xl font-light tracking-[0.15em] max-w-2xl mx-auto leading-relaxed text-gray-200 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
          >
            {settings.bannerSubtitle}
          </p>

          <div
            className="pt-6 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}
          >
            <a
              href="#collections"
              className="group relative inline-flex items-center gap-3 px-10 py-4 border-2 border-[var(--gold)] text-white overflow-hidden transition-all duration-500 hover:text-black"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--gold-light)] to-[var(--gold)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative text-sm tracking-[0.2em] uppercase font-medium">
                Explore Collection
              </span>
              <svg
                className="relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToCollections}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-float"
          aria-label="Scroll to Collections"
        >
          <div className="flex flex-col items-center gap-2 text-white/80 hover:text-[var(--gold)] transition-colors duration-300">
            <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </button>
      </section>

      {/* Featured Collection Section */}
      <section
        id="collections"
        className="py-28 px-4 sm:px-6 lg:px-8 bg-[var(--background)]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[var(--gold)] text-sm tracking-[0.3em] uppercase">
              Our Finest
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-[0.15em] mt-4 mb-6">
              FEATURED COLLECTION
            </h2>
            <div className="flex items-center justify-center gap-4">
              <span className="w-20 h-px bg-gradient-to-r from-transparent to-[var(--gold)]" />
              <span className="text-[var(--gold)]">✦</span>
              <span className="w-20 h-px bg-gradient-to-l from-transparent to-[var(--gold)]" />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-[var(--gold)]/30 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-[var(--gold)] rounded-full animate-spin" />
              </div>
              <p className="mt-4 text-gray-500 tracking-wider text-sm">
                Loading treasures...
              </p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <DbProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 tracking-wide">
              No featured products available yet.
            </p>
          )}

          <div className="text-center mt-20">
            <a
              href="#all-products"
              className="group relative inline-flex items-center gap-3 px-10 py-4 border-2 border-[var(--charcoal)] text-[var(--charcoal)] overflow-hidden transition-all duration-500 hover:text-white"
            >
              <span className="absolute inset-0 bg-[var(--charcoal)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative text-sm tracking-[0.2em] uppercase font-medium">
                View All Collections
              </span>
              <svg
                className="relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section
        id="all-products"
        className="py-28 px-4 sm:px-6 lg:px-8 bg-[var(--cream)]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[var(--gold)] text-sm tracking-[0.3em] uppercase">
              Discover More
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-[0.15em] mt-4 mb-6">
              ALL COLLECTIONS
            </h2>
            <div className="flex items-center justify-center gap-4">
              <span className="w-20 h-px bg-gradient-to-r from-transparent to-[var(--gold)]" />
              <span className="text-[var(--gold)]">✦</span>
              <span className="w-20 h-px bg-gradient-to-l from-transparent to-[var(--gold)]" />
            </div>
            {pagination.total > 0 && (
              <p className="text-sm text-gray-500 mt-6 tracking-wider">
                Showing{" "}
                <span className="text-[var(--gold)]">{allProducts.length}</span>{" "}
                of{" "}
                <span className="text-[var(--gold)]">{pagination.total}</span>{" "}
                exquisite pieces
              </p>
            )}
          </div>

          {loading || productsLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-[var(--gold)]/30 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-[var(--gold)] rounded-full animate-spin" />
              </div>
              <p className="mt-4 text-gray-500 tracking-wider text-sm">
                Loading treasures...
              </p>
            </div>
          ) : allProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {allProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up opacity-0"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <DbProductCard product={product} />
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p className="text-center text-gray-500 tracking-wide">
              No products available yet.
            </p>
          )}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-28 px-4 sm:px-6 lg:px-8 bg-[var(--background)] relative overflow-hidden"
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a227' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-[var(--gold)] text-sm tracking-[0.3em] uppercase">
            Our Story
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-[0.15em] mt-4 mb-6">
            ABOUT AARAISH
          </h2>
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="w-20 h-px bg-gradient-to-r from-transparent to-[var(--gold)]" />
            <span className="text-[var(--gold)]">✦</span>
            <span className="w-20 h-px bg-gradient-to-l from-transparent to-[var(--gold)]" />
          </div>

          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-gray-700">
              At <span className="text-[var(--gold)] font-medium">Aaraish</span>
              , we believe that jewellery is more than just an
              accessory—it&apos;s a reflection of your unique story, a
              celebration of life&apos;s precious moments, and an heirloom to be
              treasured for generations.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Each piece in our collection is meticulously handcrafted by master
              artisans using only the finest materials. From ethically sourced
              gems to lustrous precious metals, we ensure that every detail
              meets our exacting standards of quality and beauty.
            </p>
          </div>

          {/* Decorative element */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--gold)]" />
            <span className="w-3 h-3 rounded-full border border-[var(--gold)]" />
            <span className="w-2 h-2 rounded-full bg-[var(--gold)]" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-28 px-4 sm:px-6 lg:px-8 bg-[var(--cream)]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[var(--gold)] text-sm tracking-[0.3em] uppercase">
            Connect
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-[0.15em] mt-4 mb-6">
            GET IN TOUCH
          </h2>
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="w-20 h-px bg-gradient-to-r from-transparent to-[var(--gold)]" />
            <span className="text-[var(--gold)]">✦</span>
            <span className="w-20 h-px bg-gradient-to-l from-transparent to-[var(--gold)]" />
          </div>

          <p className="text-lg leading-relaxed text-gray-700 mb-10 max-w-2xl mx-auto">
            Have questions about our collection or looking for something
            special? Our team is here to help you find the perfect piece that
            speaks to your heart.
          </p>

          <button
            onClick={() => {
              const phoneNumber = "03359178835";
              const message = encodeURIComponent(
                "Hello! I am interested in your jewellery collection.",
              );
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
              window.open(whatsappUrl, "_blank");
            }}
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-[#25D366] text-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#25D366]/30"
          >
            <span className="absolute inset-0 bg-[#20BA5A] translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <svg
              className="relative w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="relative text-sm tracking-[0.2em] uppercase font-medium">
              Contact Us on WhatsApp
            </span>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
