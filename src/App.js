import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import NavBar from "./components/NavBar/NavBar";
import News from "./components/News/News";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { router } from "./config/config";
import Search from "./components/Search/Search";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import SplashScreenMobile from "./components/SplashScreen/SplashScreenMobile";
import Footer from "./components/Footer";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash ? (
        isMobile ? (
          <SplashScreenMobile onComplete={handleSplashComplete} />
        ) : (
          <SplashScreen onComplete={handleSplashComplete} />
        )
      ) : (
        <Router>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <NavBar />
            <div style={{ flex: 1 }}>
              <Routes>
                {router.map((path) => (
                  <Route
                    exact
                    key={uuidv4()}
                    path={path.path}
                    element={
                      <News
                        key={path.key}
                        newscategory={path.category}
                        country={path.country}
                      />
                    }
                  />
                ))}
                <Route path="/search/:query" element={<Search />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      )}
    </>
  );
}

export default App;
