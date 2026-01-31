"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import Loader from "@/lib/ui/components/loader";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const [automations, setAutomations] = useState([]);
  const [accountType, setAccountType] = useState("");
  const [followersCount, setFollowersCount] = useState(0);
  const [followsCount, setFollowsCount] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);

  // profile info
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  //automation elemensts
  const [statusloading, setStatusLoading] = useState(false);
  const [deleteloading, setDeleteLoading] = useState(false);
  const [loadingMap, setLoadingMap] = useState({});
  
  const setItemLoading = (id, value) => {
    setLoadingMap(prev => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get("/api/me", {
          withCredentials: true,
        });
        setAutomations(res.data.automations);
        setAccountType(res.data.account_type || "");
        setFollowersCount(res.data.followers_count || 0);
        setFollowsCount(res.data.follows_count || 0);
        setMediaCount(res.data.media_count || 0);
        setName(res.data.name || "");
        setUsername(res.data.username || "");
        setProfilePictureUrl(res.data.profile_picture_url || null);
        console.log(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load media");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []); // runs once on mount


  const handleDelete = async (mediaId) => {
    setItemLoading(mediaId, true);;
    const url = `/api/automation/delete?mediaId=${mediaId}`;
    const res = await axios.get(url);

    if (res.data.success) {
      updateStatus(mediaId, false, true);
    }

    setItemLoading(mediaId, false);;
  }
  const handleToggle = async (mediaId, status) => {// this  "status" is desired status
    setItemLoading(mediaId, true);
    const url = `/api/automation/toggle?mediaId=${mediaId}&status=${status}`;
    const res = await axios.get(url);

    if (res.data.success) {

      updateStatus(mediaId, status);
      console.log("finished")
    }

    setItemLoading(mediaId, false);
  }
  const updateStatus = (mediaId, status, Delete = false) => {
    console.log("called");
    if (Delete) {
      //delete an automated media from automations array
      setAutomations(prev =>
        prev.filter(item => item.media_id !== mediaId)
      );
    } else {
      console.log("got into updating");

      //update the status of an automated media in automations array
      setAutomations(prev =>
        prev.map(item =>
          item.media_id === mediaId
            ? { ...item, status: status }
            : item
        )
      );
      console.log(automations);
    }
  }

  const handleCreateAutomate = () => {

    redirect('/dashboard/automate');
  }

  if (loading) return <div className="flex justify-center w-full pt-50">
                        <Loader className="" />
                      </div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-10">
      <div className="space-y-8">
        {/* PROFILE SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-semibold">
          
          {/* Profile Card */}
          <div className="col-span-1 p-6 border border-gray-300 rounded-xl flex items-center gap-4 ">
          <img
              src={profilePictureUrl || "/avatar-placeholder.png"}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />

            <div>
              <p className="text-lg font-semibold">{name}</p>
              <p className="text-sm  bg-linear-to-l from-indigo-500 via-pink-500 to-blue-500 text-transparent bg-clip-text">@{username}</p>
              <p className="text-xs text-gray-400 mt-1">{accountType}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4 ">
         
            
            <StatCard label="Followers" value={followersCount} />
            <StatCard label="Following" value={followsCount} />
            <StatCard label="Media" value={mediaCount} />
          </div>
        </div>

        {/* AUTOMATIONS SECTION */}
        <div>
          <div className="text-lg  my-6 flex justify-between items-center">
            <h1 className="font-extrabold text-xl">Automations</h1>
            <button
              onClick={handleCreateAutomate}
              className="px-3 py-1 rounded-md text-lg font-semibold bg-black text-white ring-3 ring-gray-300"
            >
              create/update
            </button>
          </div>
          {automations.length === 0 ? (
            <p className="text-gray-500">No automated media yet</p>
          ) : (
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {automations.map((item, idx) => {
                const isActive = item.status;
                const isLoading = loadingMap[item.media_id];
                return (
                  <div
                    key={item.media_id}
                    className={`p-4 border-2 ring-4 rounded-xl space-y-4   ${isActive ? " border-green-300 ring-green-100 bg-green-50" : " border-gray-300 ring-gray-100 bg-gray-50"}`}
                  >
                       

                    {/* Header */}
                    {/* <div className="">
                      <span className="text-sm text-gray-400">
                        #{idx + 1}
                      </span>
                    
                    </div> */}

                    
                    <div className="flex justify-around items-center ">
                      {/* Media */}
                      <img
                        src={item.media_url}
                        alt="media"
                        className="w-20 h-20  object-cover rounded-lg"
                      />

                      {/* Actions */}

                      <button disabled={isLoading}
                        onClick={() => handleDelete(item.media_id)}
                        className="  text-xs font-bold px-4 py-3 border border-red-300 hover:bg-red-100 rounded-full  bg-white  text-red-500"
                      >
                         Delete
                      </button>


                      <button disabled={isLoading}
                        onClick={() => handleToggle(item.media_id, !isActive)}
                        className={` text-xs font-bold px-4 py-3 border border-gray-300 rounded-full bg-white ${isActive
                          ? "hover:bg-gray-100 text-gray-600" : "hover:bg-green-100 text-green-600"
                          }`}
                      >


                         {isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>

                    <div className="text-sm">

                      <p><span className=" font-bold italic">Reply:</span> {item.reply_message} </p>
                      <p><span className="font-bold italic">DM:</span> {item.dm_message}</p>
                    </div>
                    {isLoading ?<div className="w-full flex justify-center"> <Loader /></div> : <></>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>


    </div>

  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4  rounded-xl text-center">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}


