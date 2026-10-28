import React from 'react';
import docCard from '../../assets/landing/doc-card.png';
import aiBot from '../../assets/shared/ai-bot.png';
import knowledgeGraph from '../../assets/landing/knowledge-graph.png';
import flashcards from '../../assets/landing/flashcards.png';
import smartSearch from '../../assets/landing/smart-search.png';
import cloudSync from '../../assets/landing/cloud-sync.png';

export const FeatureBadges = () => {
  const badges = [
    {
      img: docCard,
      title: 'Rich Editor',
      desc: 'Beautiful, powerful, distraction-free writing',
      color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/40 text-orange-600 dark:text-orange-400'
    },
    {
      img: aiBot,
      title: 'AI Assistant',
      desc: 'Summarize, explain, ask and generate',
      color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/40 text-purple-600 dark:text-purple-400'
    },
    {
      img: knowledgeGraph,
      title: 'Knowledge Graph',
      desc: 'See connections between your ideas',
      color: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400'
    },
    {
      img: flashcards,
      title: 'Flashcards & Quizzes',
      desc: 'Turn notes into active recall',
      color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40 text-blue-600 dark:text-blue-400'
    },
    {
      img: smartSearch,
      title: 'Smart Search',
      desc: 'Find anything with natural language',
      color: 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900/40 text-pink-600 dark:text-pink-400'
    },
    {
      img: cloudSync,
      title: 'Cross-Device Sync',
      desc: 'Access your notes anywhere',
      color: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-600 dark:text-amber-400'
    }
  ];

  return (
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1E1E1E] dark:text-[#FAF8F5]">
          More than just a note-taking app
        </h2>
        <p className="text-xs sm:text-sm text-[#6E6C66] dark:text-[#9A9893]">
          Everything you need to capture ideas, organize your thoughts, and turn your notes into real knowledge.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${item.color} flex flex-col items-center text-center space-y-2.5 transition-all duration-200 hover:scale-105 shadow-xs`}
          >
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#181A20] flex items-center justify-center p-2 shadow-xs border border-white/60 dark:border-white/10">
              <img src={item.img} alt={item.title} className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#222] dark:text-[#FAF8F5]">
                {item.title}
              </h4>
              <p className="text-[10px] text-[#777] dark:text-[#9A9893] mt-0.5 leading-snug">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
