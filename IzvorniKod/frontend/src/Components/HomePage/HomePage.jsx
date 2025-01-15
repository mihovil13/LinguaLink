import Navbar from "./NavBar";
import Hero from "./Hero";
import Features from "./Features";

const HomePage = () => {
  return (
    <div className="home-container"> {/* Dodajemo parent container */}
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
};

export default HomePage;
