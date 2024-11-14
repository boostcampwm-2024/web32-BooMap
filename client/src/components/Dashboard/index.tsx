import { useState } from "react";
import GuestDashBoard from "./GuestDashBoard";
import UserDashBoard from "./UserDashBoard";

export default function DashBoard() {
  const [login, setLogin] = useState(false);
  return (
    <>
      <section className="relative w-full">
        {login ? <UserDashBoard /> : <GuestDashBoard />}
        <button className="absolute bottom-[-30px] left-0" onClick={() => setLogin((prev) => !prev)}>
          login
        </button>
      </section>
    </>
  );
}
