import Header from "../components/Header";
import NavTabs from "../components/NavTabs";
import PregnancyWeek from "../pages/PregnancyWeek";
import Nutrition from "../pages/Nutrition";
import ImageModal from "../components/ImageModal";

import sieuamImgW6 from "../src/assets/img/sieuam-img-W6.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./App.css";
import "./responsive.css";

function App() {
  return (
    <>
      <div className="bg-pink-50 text-gray-800 flex flex-col">
        {/* Thanh tiêu đề */}
        <Header />
        {/* Thanh navigation */}
        <NavTabs />
        {/* <div className="bg-base-100 border-base-300 collapse border">
          <input type="checkbox" className="peer" />
          <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
            How do I create an account?
          </div>
          <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
            Click the "Sign Up" button in the top right corner and follow the
            registration process.
          </div>
        </div> */}
        {/* Nội dung chính */}
        <main className="flex-1 p-4"></main>
      </div>
      <div className="copyright">Design by HuyVo</div>

      {/* <div class="btn btn-neutral">Neutral</div>
      <div class="btn btn-primary">Primary</div>
      <div class="btn btn-secondary">Secondary</div>
      <div class="btn btn-accent">Accent</div>
      <div class="btn btn-info">Info</div>
      <div class="btn btn-success">Success</div>
      <div class="btn btn-warning">Warning</div>
      <div class="btn btn-error">Error</div> */}
    </>
  );
}

export default App;
