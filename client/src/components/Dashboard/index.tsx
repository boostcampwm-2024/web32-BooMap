import { useState } from "react";
import GuestDashBoard from "./GuestDashBoard";
import UserDashBoard from "./UserDashBoard";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashBoard() {
  const loggedin = useAuthStore((state) => state.isAuthenticated);
  return (
    <>
      <section className="relative w-full">{loggedin ? <UserDashBoard /> : <GuestDashBoard />}</section>
    </>
  );
}
