"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";

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

  const handleCreateAutomate = () => {
    redirect('/dashboard/automate');
  }
  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-10">
      <div className="space-y-8">
        {/* PROFILE SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="col-span-1 p-6 border rounded-xl flex items-center gap-4">
            <img
              src={profilePictureUrl || "/avatar-placeholder.png"}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />

            <div>
              <p className="text-lg font-semibold">{name}</p>
              <p className="text-sm text-gray-500">@{username}</p>
              <p className="text-xs text-gray-400 mt-1">{accountType}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4">
            <StatCard label="Followers" value={followersCount} />
            <StatCard label="Following" value={followsCount} />
            <StatCard label="Media" value={mediaCount} />
          </div>
        </div>

        {/* AUTOMATIONS SECTION */}
        <div>
          <div className="text-lg font-semibold my-4 flex justify-between">
            <h1>Automations</h1>
            <button
              onClick={handleCreateAutomate}
              className="px-4 py-2 rounded-md bg-black text-white"
            >
              Create Automation
            </button>
          </div>
          {automations.length === 0 ? (
            <p className="text-gray-500">No automated media yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {automations.map((item, idx) => {
                const isActive = item.status === "true";

                return (
                  <div
                    key={item.media_id}
                    className="p-4 border rounded-xl space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        #{idx + 1}
                      </span>

                      <button
                        onClick={() => handleToggle(item.media_id, !isActive)}
                        className={`px-3 py-1 text-xs rounded-full ${isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    {/* Media */}
                    <img
                      src={item.media_url}
                      alt="media"
                      className="w-full h-48 object-cover rounded-lg"
                    />

                    {/* Actions */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-100"
                      >
                        Edit
                      </button>
                    </div>
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
    <div className="p-4 border rounded-xl text-center">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
