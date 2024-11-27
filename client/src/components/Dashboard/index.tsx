import GuestDashBoard from "./GuestDashBoard";
import UserDashBoard from "./UserDashBoard";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashBoard() {
  const loggedIn = useAuthStore((state) => state.isAuthenticated);
  return (
    <>
      <section className="relative w-full">{loggedIn ? <UserDashBoard /> : <GuestDashBoard />}</section>
    </>
  );
}
