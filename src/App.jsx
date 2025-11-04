import Header from "../components/Header";
import NavTabs from "../components/NavTabs";
import PregnancyWeek from "../pages/PregnancyWeek";
import "./App.css";

function App() {
  return (
    <>
      <div className="min-h-screen bg-pink-50 text-gray-800 flex flex-col">
        {/* Thanh tiêu đề */}
        <Header />

        {/* Thanh navigation */}
        <NavTabs />

        {/* Nội dung chính */}
        <main className="flex-1 p-4">
          <PregnancyWeek />
        </main>
      </div>

      <div class="btn btn-neutral">Neutral</div>
      <div class="btn btn-primary">Primary</div>
      <div class="btn btn-secondary">Secondary</div>
      <div class="btn btn-accent">Accent</div>
      <div class="btn btn-info">Info</div>
      <div class="btn btn-success">Success</div>
      <div class="btn btn-warning">Warning</div>
      <div class="btn btn-error">Error</div>
    </>
  );
}

export default App;
