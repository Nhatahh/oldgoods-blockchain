import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import AddProductPage from "./pages/AddProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import TransactionsPage from "./pages/TransactionsPage";
import MyProductsPage from "./pages/MyProductsPage";
import MyTransactionsPage from "./pages/MyTransactionsPage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-container with-sidebar">
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/my-products" element={<MyProductsPage />} />
          <Route path="/my-transactions" element={<MyTransactionsPage />} />
        </Routes>
      </main>
    </div>
  );
}
