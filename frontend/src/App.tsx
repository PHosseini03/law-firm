import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ToastProvider } from "./components/Toast";
import Home from "./pages/Home";
import { PracticeAreaDetail, PracticeAreas } from "./pages/PracticeAreas";
import { AttorneyProfile, Attorneys } from "./pages/Attorneys";
import { Insights, Results } from "./pages/Results";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice-areas" element={<PracticeAreas />} />
          <Route path="/practice-areas/:slug" element={<PracticeAreaDetail />} />
          <Route path="/attorneys" element={<Attorneys />} />
          <Route path="/attorneys/:slug" element={<AttorneyProfile />} />
          <Route path="/results" element={<Results />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </ToastProvider>
  );
}
