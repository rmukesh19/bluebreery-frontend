import "./globals.css";
import "./beyoung.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { CartProvider } from "@/context/CartContext";
import DisableZoom from "@/components/DisableZoom";

export const metadata = {
  title: "Blueberries - Online Shopping for Everyday Fashion in India",
  description: "Blueberries: India's best online shopping site for trendy clothes. Shop cargos, joggers, oversized t-shirts, and more with Free Shipping & COD. Affordable style for every occasion!",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CartProvider>
          <DisableZoom />
          <Preloader />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
