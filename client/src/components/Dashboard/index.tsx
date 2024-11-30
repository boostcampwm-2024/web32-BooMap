import { useConnectionStore } from "@/store/useConnectionStore";
import GuestDashBoard from "./GuestDashBoard";
import UserDashBoard from "./UserDashBoard";

export default function DashBoard() {
  const loggedIn = useConnectionStore((state) => state.isAuthenticated);
  return (
    <>
      <section className="relative w-full">{loggedIn ? <UserDashBoard /> : <GuestDashBoard />}</section>
    </>
  );
}
