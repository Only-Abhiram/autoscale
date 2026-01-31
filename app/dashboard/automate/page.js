"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import AutomationPopup from "@/lib/ui/components/automationPopup";
import Notification from "@/lib/ui/components/notification";
import Loader from "@/lib/ui/components/loader";
import { useRouter } from "next/navigation";
export default function Automate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [notification, setNotification] = useState("");
  useEffect(() => {
    fetchPosts();
  }, [])
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("/api/me/posts");
      console.log(res.data);
      setPosts(res.data.UserPosts);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async () => {
    setRefreshing(true);

    const res = await axios.get('/api/refresh-posts');
    if (res.data.success) {
      //notify successfully refreshed posts
      fetchPosts();
      setRefreshing(false);
    } else {
      //some problem
    }


  }
  const handleback = ()=>{
    router.push('/dashboard');
  }
  return (
    <div className="p-4">
      <div className="w-full flex justify-between">
        <button onClick={handleback}>
          <img className="w-5"  src="https://img.icons8.com/?size=100&id=1806&format=png&color=000000"/>
        </button>
        <button
          onClick={refreshPosts}
          disabled={loading}
          className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60 flex "
        >
          {refreshing ? <Loader/> : "Refresh"}
        </button>
      </div>


      {/* error Displaying */}
      {error && (
        <p className="text-red-500 mt-4">
          {JSON.stringify(error)}
        </p>
      )}


      {/* loader */}
      {loading && (
        <svg className="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24">
        </svg>
      )}


      {/* posts Displaying */}
      {posts.length === 0 ? (
        <div className="mt-6 text-gray-500">
          Posts not found, refresh the posts!
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {posts.map((post) => {
            let imgURL = post.media_url;
            if (post.media_type=="VIDEO") {
              imgURL = post.thumbnail_url;
            }
            return<div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group relative rounded-lg overflow-hidden border border-gray-300 bg-white hover:shadow-md transition"
            >
              {/* Image */}
              <img
                src={imgURL}
                alt=""
                className="w-full aspect-square object-cover"
              />
              {/* info */}
              <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    ❤️ {post.like_count}
                  </span>
                  <span className="flex items-center gap-1">
                    💬 {post.comments_count}
                  </span>
                </div>

                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                  title="View on Instagram"
                >
                  🔗
                </a>
              </div>
            </div>
})}
        </div>
      )}


      {/* popup on select */}
      {selectedPost && (
        <AutomationPopup
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          notify={(msg) => setNotification(msg)}
        />
      )}


      {/* notification popup */}
      <Notification
        message={notification}
        onClose={() => setNotification("")}
      />
    </div>

  );
}