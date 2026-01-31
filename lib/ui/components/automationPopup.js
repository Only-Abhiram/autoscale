"use client";

import { useState } from "react";
import axios from "axios";
import Loader from "./loader"
export default function AutomationPopup({
  post,
  onClose,
  notify,
}) {
  const [dmMessage, setDmMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let mediaUrl = post.media_url;
  if (post.media_type === "VIDEO") {   //if media is video, use thumbnail
    mediaUrl = post.thumbnail_url;
  }
  const handleSubmit = async () => {
    if (!dmMessage && !replyMessage) {
      setError("Set at least one automation message.");
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const res = await axios.post("/api/automation", {
        postId: post.id,
        dmMessage: dmMessage,
        replyMessage: replyMessage,
        mediaUrl: mediaUrl,
        permalink: post.permalink,
      });
      if (res.data.success) {
        notify("Automation set successfully!");
      } else {
        //some error
        notify("Failed to set automation!")
      }
      onClose();
    } catch (err) {
      setError(err.response?.data || "Failed to save automation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="  bg-white w-full max-w-md  rounded-4xl p-6 space-y-2 mx-5">
        <h2 className="text-center text-xl font-bold">
          Automate this post
        </h2>

        {/* Post preview */}
        <div className="flex justify-center">
        <img
          src={mediaUrl}
          className=" w-40 rounded-lg"
        />
        </div>
        

        <div className="space-y-3">
          <input
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Reply message to comment"
            className="w-full border rounded px-3 py-2 focus:outline-none border-gray-300"
          />

          <input
            value={dmMessage}
            onChange={(e) => setDmMessage(e.target.value)}
            placeholder="DM message to commenter"
            className="w-full border rounded px-3 py-2 focus:outline-none border-gray-300"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2  font-bold">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-white text-black border border-gray-300  disabled:opacity-60"
          >
            {loading ? <Loader/> : "Set Automation"}
          </button>
        </div>
      </div>
    </div>
  );
}
