"use client";

import { useRouter } from "next/navigation";
import TextType from '@/lib/ui/typingtext/typetext';
import { useState } from "react";
import Loader from "@/lib/ui/components/loader";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    router.push("/login");
  };

  return (
    <div className="flex flex-col">
      {/* HERO SECTION (unchanged) */}
      <main className="h-screen flex items-center justify-center bg-black lg:rounded-b-full">
        <div className="max-w-3xl text-center px-6 z-10">
          {/* Badge */}
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-white/20 text-white text-sm">
            Automate your Instagram presence with <span className="font-bold">autoScale</span>
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white  leading-tight tracking-[-0.08em]">
            <TextType
              text={[
                "Auto-reply to comments",
                "DM links personally",
                "Engage Faster",
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-white/90">
            Auto-reply to comments, DM personally, and track your posts.
            All from one simple dashboard.
          </p>

          {/* CTA */}
          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={handleClick}
              className="px-8 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 transition"
            >
              {loading ? <Loader/>: "Get started"}
            </button>

            <a
              href="#features"
              className="px-8 py-3 rounded-lg border border-white/40 text-white hover:bg-white/10 transition"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="absolute  inset-0 h-full w-full 
bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] 
bg-[size:25px_25px] 
[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]" ></div>
      </main>

      {/* FEATURES SECTION */}
      <section 
        id="features"
        className=" py-20 px-6 relative"
      >
        
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need to engage smarter
            </h2>
            <p className="mt-4 text-gray-600">
              Built for creators who want growth without burnout.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Smart Comment Automation"
              description="Automatically reply to comments with personalized messages and links, the moment they arrive."
              icon="💬"
            />

            <FeatureCard
              title="Personalized DM Flows"
              description="Send resources, links, or onboarding messages via DM — without sounding like a bot."
              icon="📩"
            />

            <FeatureCard
              title="Post & Engagement Tracking"
              description="View all your posts, engagement stats, and automation status in one clean dashboard."
              icon="📊"
            />
          </div>
        </div>
       
      </section>


    </div>
  );
}

/* Feature card component */
function FeatureCard({ title, description, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 hover:shadow-lg transition bg-white">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}