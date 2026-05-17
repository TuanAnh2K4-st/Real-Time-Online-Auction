import { BrowserRouter, Routes, Route } from "react-router-dom";

/* PUBLIC */
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import OAuth2Success from "../pages/OAuth2Success";
import UserGuide from "../pages/UserGuide";
import Legal from "../pages/Legal";
import ListNormalAuction from "../pages/ListNormalAuction";
import ListLiveAuction from "../pages/ListLiveAuction";

/* Protected */
import NormalAuctionDetail from "../pages/NormalAuctionDetail";
import LiveAuctionDetail from "../pages/LiveAuctionDetail";
import Profile from "../pages/Profile";
import MyNotification from "../pages/MyNotification"
import Cart from "../pages/Cart"
import  Wallet from "../pages/Wallet";
import MyProduct from "../pages/MyProduct";
import CreateNormalAuction from "../pages/CreateNormalAuction";
import CreateLiveAuction from "../pages/CreateLiveAuction"
import Favourite from "../pages/Favourite"
import ChangePassword from "../pages/ChangePassword";

/* SELLER */
import Subscription from "../pages/Subscription";

/* ADMIN */
import Dashboard from "../pages/admin/dashboard/Dashboard"
import UserManage from "../pages/admin/user/UserManage"
import StoreManage from "../pages/admin/store/StoreManage"
import ProductManage from "../pages/admin/product/ProductManage"
import SubscriptionManage from "../pages/admin/subcription/SubcriptionManage";

/* ROUTE GUARD */
import ProtectedRoute from "./ProtectedRoute";
import SellerRoute from "./SellerRoute";
import AdminRoute from "./AdminRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/success" element={<OAuth2Success />} />
        <Route path="/user-guide" element={<UserGuide />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/list-normal-auctions" element={<ListNormalAuction />} />
        <Route path="/list-live-auctions" element={<ListLiveAuction />} />
        {/* PROTECTED */}
        <Route path="/auction/:auctionId" element={<NormalAuctionDetail />} />
        <Route path="/live-auction" element={<LiveAuctionDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-notification" element={<MyNotification/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/my-products" element={<MyProduct />} />
        <Route path="/create-normal-auction" element={<CreateNormalAuction />} />
        <Route path="/create-live-auction" element={<CreateLiveAuction />} />
        <Route path="/favourite" element={<Favourite />} />
        <Route path="/change-password" element={<ChangePassword />} />
        {/* SELLER */}
        <Route path="/subscription" element={<Subscription />} />       
        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/user-manage" element={<UserManage />} />
        <Route path="/admin/store-manage" element={<StoreManage />} />
        <Route path="/admin/product-manage" element={<ProductManage />} />
        <Route path="/admin/subcription-manage" element={<SubscriptionManage />} />

      </Routes>
    </BrowserRouter>
  );
}