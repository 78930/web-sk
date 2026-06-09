import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
          window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }, [pathname]);
    return null;
}

export default function Layout({ children }) {
    return (
          <div className="flex min-h-screen flex-col">
                <ScrollToTop />
                <Navbar />
                <main id="main-content" className="flex-1">{children}</main>main>
                <Footer />
          </div>div>
        );
}</div>
