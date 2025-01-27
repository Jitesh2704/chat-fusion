import React from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";
import ProfileHeader from "./ProfileHeader";
import RecentChats from "./RecentChats";
import RecentGroupChats from "./RecentGroupChats";
import IncomingRequests from "./IncomingRequests";
import AccountInfo from "./AccountInfo";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col relative bg-slate-100">
      <div className="absolute top-0 right-0 left-0">
        <NavBar />
      </div>

      <div className="w-full pt-14">
        <ProfileHeader />
      </div>

      <div className="pt-10 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-8 px-8">
        <div className="col-span-3">
          <RecentGroupChats />
        </div>
        <div className="col-span-3">
          <RecentChats />
        </div>
        <div className="col-span-3">
          <IncomingRequests />
        </div>
        <div className="col-span-3">
          <AccountInfo />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        {" "}
        <Footer />
      </div>
    </div>
  );
}
