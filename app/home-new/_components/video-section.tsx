'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Play, Star, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { FEATURED_VIDEO } from '@/lib/config/featured-video';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';

const STARS = [
  { size: 28, top: '10%', right: '4%', rotate: 15, opacity: 0.18 },
  { size: 16, top: '60%', right: '14%', rotate: -20, opacity: 0.12 },
  { size: 22, bottom: '10%', right: '2%', rotate: 30, opacity: 0.15 },
  { size: 12, top: '20%', left: '52%', rotate: 0, opacity: 0.10 },
  { size: 18, bottom: '15%', left: '55%', rotate: -10, opacity: 0.13 },
];

const STORY_TRUNCATE = 120;

export function VideoSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [started, setStarted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!FEATURED_VIDEO.url) return null;

  const thumbnail = getYouTubeThumbnail(FEATURED_VIDEO.url);
  const body = FEATURED_VIDEO.storyBody ?? '';
  const isTruncated = body.length > STORY_TRUNCATE;
  const displayBody = isTruncated && !expanded ? body.slice(0, STORY_TRUNCATE) + '…' : body;

  return (
    <section className="relative z-10 -mt-36 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <MotionFadeIn trigger="view">
          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #1a2070 0%, #0e1550 100%)' }}
          >
            {STARS.map((s, i) => (
              <Star
                key={i}
                fill="white"
                className="absolute pointer-events-none"
                style={{
                  width: s.size,
                  height: s.size,
                  top: s.top,
                  bottom: s.bottom,
                  right: s.right,
                  left: s.left,
                  transform: `rotate(${s.rotate}deg)`,
                  opacity: s.opacity,
                }}
              />
            ))}

            <div className="grid md:grid-cols-2 items-center gap-0" dir="rtl">
              {/* Text */}
              <div className="p-8 text-white flex flex-col justify-center">
                <span className="inline-flex items-center gap-1.5 self-start mb-4 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 text-xs font-hebrew font-medium">
                  <Star className="w-3.5 h-3.5" fill="currentColor" />
                  סיפור השבוע
                </span>
                <h3 className="text-2xl md:text-3xl font-bold font-hebrew mb-3 leading-snug">
                  {FEATURED_VIDEO.title}
                </h3>
                {body && (
                  <div className="mb-3">
                    <p className="text-sm text-white/80 font-hebrew leading-relaxed">{displayBody}</p>
                    {isTruncated && (
                      <button
                        onClick={() => setExpanded((e) => !e)}
                        className="inline-flex items-center gap-1 mt-1 text-xs text-amber-300 hover:text-amber-200 font-hebrew transition-colors"
                      >
                        {expanded
                          ? <><ChevronUp className="w-3 h-3" />הצג פחות</>
                          : <><ChevronDown className="w-3 h-3" />הצג עוד</>}
                      </button>
                    )}
                  </div>
                )}
                {FEATURED_VIDEO.question && (
                  <p className="text-sm font-semibold text-white/90 font-hebrew leading-relaxed mb-6">
                    {FEATURED_VIDEO.question}
                  </p>
                )}
                {FEATURED_VIDEO.storyId && (
                  <Link
                    href={`/story/featured/${FEATURED_VIDEO.storyId}`}
                    className="inline-flex items-center gap-2 self-start px-6 py-3 bg-brand-orange text-white rounded-full font-hebrew font-medium text-sm hover:opacity-90 transition-all"
                  >
                    מעבר לתשובה
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* Video */}
              <div className="p-4 md:p-6">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-black">
                  {!started ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {thumbnail && (
                        <img
                          src={thumbnail}
                          alt={FEATURED_VIDEO.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <button
                        onClick={() => setStarted(true)}
                        className="absolute inset-0 flex items-center justify-center"
                        aria-label="הפעל סרטון"
                      >
                        <div className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95">
                          <Play className="w-7 h-7 text-slate-900 mr-[-3px]" />
                        </div>
                      </button>
                    </>
                  ) : (
                    <iframe
                      ref={iframeRef}
                      src={getYouTubeEmbedUrl(FEATURED_VIDEO.url, true)}
                      title={FEATURED_VIDEO.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </MotionFadeIn>
      </div>
    </section>
  );
}
