import { FaPlay } from "react-icons/fa6";
import content from "@/content";

import React from "react";
import Link from "next/link";

const VideoSection = () => {
  return (
    <section className="h-[600px] relative bg-[url('/images/bg/video-thumbnail.png')] bg-cover bg-center">
      <Link
        className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
        href={content.video.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative h-16 w-16 lg:h-28 lg:w-28 bg-white rounded-full z-10 flex items-center justify-center">
          <FaPlay className="w-8 h-8 text-primary" />
        </div>
      </Link>
    </section>
  );
};

export default VideoSection;
