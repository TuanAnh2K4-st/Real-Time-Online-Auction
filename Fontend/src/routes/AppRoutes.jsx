import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import OAuth2Success from "../pages/OAuth2Success";
import Business from "../pages/Business";

// PROFILE (nested)
import ProfileLayout from "../pages/profile/ProfileLayout";
import ProfileInfo from "../pages/profile/ProfileInfo";
import ChangePassword from "../pages/profile/ChangePassword";
import Orders from "../pages/profile/Orders";
import Auctions from "../pages/profile/Auctions";

// BUSINESS (nested)
import BusinessLayout from "../pages/business/BusinessLayout";
import BusinessInfo from "../pages/business/BusinessInfo";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
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
          <Route path="orders" element={<Orders />} />
          <Route path="auctions" element={<Auctions />} />
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