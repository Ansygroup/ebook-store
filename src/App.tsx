import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HtmlLang from './components/HtmlLang';
import Home from './pages/Home';
import Shop from './pages/Shop';
import BookDetail from './pages/BookDetail';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Pricing from './pages/Pricing';
import Faq from './pages/Faq';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import VerifyPayment from './pages/VerifyPayment';
import Wishlist from './pages/Wishlist';

export default function App() {
  return (
    <>
      <HtmlLang />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/book/:slug" element={<BookDetail />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/verify" element={<VerifyPayment />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
