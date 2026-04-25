import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import OAuth2Success from "../pages/OAuth2Success";

// PROFILE (nested)
import ProfileLayout from "../pages/profile/ProfileLayout";
import ProfileInfo from "../pages/profile/ProfileInfo";
import ChangePassword from "../pages/profile/ChangePassword";
import Orders from "../pages/profile/Orders";
import Auctions from "../pages/profile/Auctions";
import MyProduct from "../pages/profile/MyProduct";
import CreateAuctionNormal from "../pages/profile/CreateAuctionNormal";

// BUSINESS (nested)
import BusinessLayout from "../pages/business/BusinessLayout";
import BusinessInfo from "../pages/business/BusinessInfo";

//Test
import HomeTest from "../pages/Test/HomeTest2";
import LoginTest from "../pages/Test/LoginTest";
import RegisterTest from "../pages/Test/RegisterTest";
import Legal from "../pages/Test/Legal";
import Profile from "../pages/Test/Profile";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TEST */}
        <Route path="/homeTest2" element={<HomeTest />} />
        <Route path="/loginTest" element={<LoginTest />} />
        <Route path="/registerTest" element={<RegisterTest />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/profileTest" element={<Profile />} />

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth2/success" element={<OAuth2Success />} />
        <Route path="/register" element={<Register />} />

        {/* PROFILE (NESTED ROUTE) */}
        <Route path="/profile" element={<ProfileLayout />}>
          {/* default: /profile */}
          <Route index element={<ProfileInfo />} />

          {/* child routes */}
          <Route path="me" element={<ProfileInfo />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="my-products" element={<MyProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="auctions" element={<Auctions />} />
          <Route path="create-auction-normal" element={<CreateAuctionNormal />} />
        </Route>

        {/* BUSINESS (NESTED) */}
        <Route path="/business" element={<BusinessLayout />}>
          {/* default */}
          <Route index element={<BusinessInfo />} />

          {/* child routes */}
          <Route path="me" element={<BusinessInfo />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="orders" element={<Orders />} />
          <Route path="auctions" element={<Auctions />} />
          {/* sau này thêm */}
          {/* <Route path="wallet" element={<Wallet />} /> */}
          {/* <Route path="auctions" element={<Auctions />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}