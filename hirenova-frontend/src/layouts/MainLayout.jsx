import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-5">{children}</div>
      <Footer />
    </>
  );
};

export default MainLayout;
