"use client";

import { useState } from "react";
import axios from "axios";

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
      <div className="bg-white w-full max-w-md rounded-4xl p-6 space-y-2 mx-5">
        <h2 className="text-xl font-semibold">
          Automate this post
        </h2>

        {/* Post preview */}
        <img
          src={mediaUrl}
          className=" w-full rounded-lg"
        />

        <div className="space-y-3">
          <input
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Reply message to comment"
            className="w-full border rounded px-3 py-2"
          />

          <input
            value={dmMessage}
            onChange={(e) => setDmMessage(e.target.value)}
            placeholder="DM message to commenter"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
          >
            {loading ? "Setting..." : "Set Automation"}
          </button>
        </div>
      </div>
    </div>
  );
}
