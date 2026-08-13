import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { api } from '../services/api';

// Defined interface for our success data
interface SuccessItem {
  id: number | string;
  title: string;
  desc: string;
  sender: string;
  message: string;
  time: string;
  photo?: string;
  visible?: boolean;
}

export const Carousel: React.FC = () => {
  const staticStories: SuccessItem[] = [
    {
      id: 1,
      title: "Placed in LG Soft",
      desc: "Harshith",
      sender: "Harshith",
      message: "Hey bhaiya, got selected at LG Soft! 🚀 The DSA placement sheet and your lectures literally saved my coding rounds. Thanks a ton!",
      time: "11:42 AM"
    },
    {
      id: 2,
      title: "Placed in TCS NQT Prime",
      desc: "Narasimha",
      sender: "Narasimha",
      message: "Hey Pavan bhaiya, finally placed in TCS Prime category! Aptitude Lab questions match 90% of the pattern. Blessed to have your mentorship.",
      time: "2:15 PM"
    },
    {
      id: 3,
      title: "Placed in Genpact",
      desc: "Swetha",
      sender: "Swetha",
      message: "Bhaiya got the offer letter from Genpact today! 😭 I did not know anything about tree traversals, your graph tutorials made it so easy.",
      time: "6:03 PM"
    },
    {
      id: 4,
      title: "Placed in LG",
      desc: "Sumanth",
      sender: "Sumanth",
      message: "Placed in LG! ⚡ Solving the 500+ question sheet did it. Standard structures were asked in technical round.",
      time: "10:11 AM"
    },
    {
      id: 5,
      title: "Placed in Sasken",
      desc: "Tejaswini",
      sender: "Tejaswini",
      message: "Selected in Sasken as Developer! Thank you for the interview prep guidance. Mock interviews helped build my confidence.",
      time: "4:30 PM"
    },
    {
      id: 6,
      title: "Placed in Surya AI",
      desc: "Kushwanth",
      sender: "Kushwanth",
      message: "Bhaiya! Placed in Surya AI! The compensation is awesome. The dynamic programming section in the doc is pure gold.",
      time: "1:05 PM"
    },
    {
      id: 7,
      title: "Placed in Deloitte",
      desc: "Lalasa",
      sender: "Lalasa",
      message: "Placed in Deloitte! TCS Ninja was my first round but cracked this. Aptitude logic questions were exact. Thank you pavanxdcl team!",
      time: "5:20 PM"
    },
    {
      id: 8,
      title: "Placed in PayU",
      desc: "Afsaan",
      sender: "Afsaan",
      message: "Placed in PayU! The package is great! 🚀 Thank you for forcing me to solve daily LeetCode medium questions.",
      time: "3:40 PM"
    },
  ];

  const [allStories, setAllStories] = useState<SuccessItem[]>(staticStories);

  useEffect(() => {
    api.stories.getStories()
      .then(res => {
        if (res.success && res.stories && res.stories.length > 0) {
          setAllStories(res.stories);
        } else {
          setAllStories(staticStories);
        }
      })
      .catch(e => {
        console.error("API error, using static fallback stories", e);
        setAllStories(staticStories);
      });
  }, []);

  const duplicatedStories = [...allStories, ...allStories];

  const controls = useAnimation();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    controls.start({
      x: [0, -1880],
      transition: {
        ease: "linear",
        duration: 32,
        repeat: Infinity,
      }
    });
  }, [controls, allStories]); // Re-trigger scroll if stories update

  return (
    <div className="w-full overflow-hidden relative py-6 select-none carousel-mask">
      
      <motion.div
        ref={carouselRef}
        animate={controls}
        onHoverStart={() => controls.stop()}
        onHoverEnd={() => {
          const currentX = carouselRef.current ? carouselRef.current.getBoundingClientRect().x : 0;
          const trackWidth = 1888;
          const startX = currentX % trackWidth;
          
          controls.start({
            x: [startX, -trackWidth],
            transition: {
              ease: "linear",
              duration: 32 * (1 - Math.abs(startX / trackWidth)),
              repeat: Infinity,
              repeatType: "loop"
            }
          });
        }}
        className="flex gap-6 w-max cursor-pointer"
      >
        {duplicatedStories.map((story, index) => (
          <div
            key={`${story.id}-${index}`}
            className="flex-shrink-0 w-[240px] md:w-[280px] glass-card glass-card-glow-orange border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
          >
            <div className="bg-[#030012]/80 px-4 py-3 flex items-center justify-between border-b border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                {story.photo ? (
                  <img src={story.photo} className="w-8 h-8 rounded-full object-cover border border-home-accent/30" alt={story.sender} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-home-accent/20 border border-home-accent/30 flex items-center justify-center text-[10px] font-bold text-home-accent">
                    {story.sender.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="leading-tight">
                  <h4 className="text-xs font-semibold text-white truncate max-w-[120px]">{story.sender}</h4>
                  <span className="text-[9px] text-[#10b981] font-mono">online</span>
                </div>
              </div>
              <span className="text-[9px] font-semibold text-home-accentLight bg-home-accent/10 border border-home-accent/20 px-2 py-0.5 rounded-full">
                💬 WA Verified
              </span>
            </div>

            {/* Chat Body */}
            <div className="p-4 flex-1 flex flex-col justify-between bg-transparent min-h-[120px]">
              {/* WhatsApp Speech Bubble */}
              <div className="bg-zinc-900/60 border border-white/[0.05] p-3 rounded-tr-xl rounded-b-xl relative text-[11px] md:text-xs text-zinc-300 leading-relaxed">
                <p className="italic">"{story.message}"</p>
                <span className="text-[8px] text-gray-500 float-right mt-1.5 font-mono">{story.time}</span>
              </div>

              {/* Achievement Badge */}
              <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                <div>
                  <h5 className="text-[11px] font-bold text-home-accent">{story.title}</h5>
                  <p className="text-[9px] text-gray-400 font-mono">Mentor Session Review</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981] text-xs font-bold">
                  ✓
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Carousel;
