import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import OAuth2Success from "../pages/OAuth2Success";
import Profile from "../pages/Profile";
import MyProduct from "../pages/MyProduct";
import CreateNormalAuction from "../pages/CreateNormalAuction";
import NormalAuctionDetail from "../pages/NormalAuctionDetail";
import ListNormalAuction from "../pages/ListNormalAuction";
import ListLiveAuction from "../pages/ListLiveAuction";
import UserGuide from "../pages/UserGuide";
import LiveAuctionDetail from "../pages/LiveAuctionDetail";
import Cart from "../pages/Cart"
import  Wallet from "../pages/Wallet";
import Legal from "../pages/Legal";
import MyNotification from "../pages/MyNotification"
import CreateLiveAuction from "../pages/CreateLiveAuction"
import Favourite from "../pages/Favourite"




export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth2/success" element={<OAuth2Success />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-products" element={<MyProduct />} />
        <Route path="/create-normal-auction" element={<CreateNormalAuction />} />
        <Route path="/auction/:auctionId" element={<NormalAuctionDetail />} />
        <Route path="/list-normal-auctions" element={<ListNormalAuction />} />
        <Route path="/list-live-auctions" element={<ListLiveAuction />} />
        <Route path="/user-guide" element={<UserGuide />} />
        <Route path="/live-auction" element={<LiveAuctionDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/my-notification" element={<MyNotification/>} />
        <Route path="/create-live-auction" element={<CreateLiveAuction />} />
        <Route path="/favourite" element={<Favourite />} />

      </Routes>
    </BrowserRouter>
  );
}