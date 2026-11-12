import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SizingVideoPlayer({
  videoSrc,
  posterSvg,
  title,
  duration = '0:45',
  steps = [],
  className
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasVideoSource, setHasVideoSource] = useState(Boolean(videoSrc));
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setVideoLoaded(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [videoSrc]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      setIsPlaying((prev) => !prev);
      return;
    }
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/80 bg-white shadow-xs group">
        {hasVideoSource && (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setHasVideoSource(false)}
            className="w-full h-full object-cover bg-white"
          />
        )}

        {(!hasVideoSource || !videoLoaded) && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-4 select-none">
            {posterSvg}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-600 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-neutral-200">
              <span className="font-semibold text-foreground">{title}</span>
              <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-500 font-semibold">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Continuous Studio Loop
              </span>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />}
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
              title="Restart"
              aria-label="Restart video"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {steps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl border border-border/80 bg-background/80 text-left space-y-0.5"
            >
              <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-semibold block uppercase tracking-wider">
                Step 0{idx + 1}
              </span>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {step}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
