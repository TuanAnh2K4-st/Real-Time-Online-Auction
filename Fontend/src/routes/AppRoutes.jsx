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

// PROFILE (nested)
// import ProfileLayout from "../pages/profile/ProfileLayout";
// import ProfileInfo from "../pages/profile/ProfileInfo";
// import ChangePassword from "../pages/profile/ChangePassword";
// import Orders from "../pages/profile/Orders";
// import Auctions from "../pages/profile/Auctions";
// import MyProduct from "../pages/profile/MyProduct";
// import CreateAuctionNormal from "../pages/profile/CreateAuctionNormal";

// BUSINESS (nested)
import BusinessLayout from "../pages/business/BusinessLayout";
import BusinessInfo from "../pages/business/BusinessInfo";

//Test
import HomeTest from "../pages/Test/HomeTest2";
import LoginTest from "../pages/Test/LoginTest";
import RegisterTest from "../pages/Test/RegisterTest";
import Legal from "../pages/Test/Legal";
import Profile2 from "../pages/Test/Profile";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TEST */}
        <Route path="/homeTest2" element={<HomeTest />} />
        <Route path="/loginTest" element={<LoginTest />} />
        <Route path="/registerTest" element={<RegisterTest />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/profileTest" element={<Profile2 />} />

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
        
      </Routes>
    </BrowserRouter>
  );
}