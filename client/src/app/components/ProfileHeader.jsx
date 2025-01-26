import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import banner_img from "../../assets/banner_img.png";

export default function ProfileHeader() {
  const { user } = useSelector((state) => state.auth);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <div className="w-full py-2 bg-cyan-100">
      <div className="h-full grid grid-cols-12">
        <div className="col-span-4 flex flex-row">
          <iframe
            src="https://lottie.host/embed/ec2d6d91-032a-435c-9cb9-e5d09ddc5576/CoWKDn3rL0.lottie"
            className="w-full h-60"
          ></iframe>
          <iframe
            src="https://lottie.host/embed/555f4e7e-47b6-4bea-b9a6-1640b467e467/ZxqbDKuiQU.lottie"
            className="w-full h-60"
          ></iframe>
        </div>

        <div className="flex flex-col justify-center p-4 col-span-3">
          <div className="font-bold text-2xl ml-24 text-center">
            {greeting}, <span className="text-yellow-500">{user?.fname}</span>
          </div>
          <div className="text-md text-center ml-16">
            Ready to chat and connect with amazing people on Chat Fusion?
          </div>
        </div>

        <div className="flex flex-row col-span-4">
          <iframe
            src="https://lottie.host/embed/c0cc1518-dadd-4500-9618-df762bc41ae6/4HLQyvTCnc.lottie"
            className="w-full h-60"
          ></iframe>
          <iframe
            src="https://lottie.host/embed/bb9df42e-2b04-4f80-b224-0a33bba5b087/Oihn8YfiGu.lottie"
            className="h-60 w-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
