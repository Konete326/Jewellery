import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SizingVideoPlayer({
  videoSrc,
  posterSvg,
  title,
  duration = '0:45',
  steps = [],
  className
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = React.useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setVideoError(true));
    }
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/80 bg-white shadow-xs group">
        {!videoError && videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            muted={isMuted}
            loop
            onEnded={() => setIsPlaying(false)}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover bg-white"
          />
        ) : null}

        {(!isPlaying || videoError || !videoSrc) && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-4">
            {posterSvg}
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
              <button
                type="button"
                onClick={togglePlay}
                className="size-12 sm:size-14 rounded-full bg-foreground text-background hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg cursor-pointer"
                title="Play Video Guide"
                aria-label={`Play ${title} guide`}
              >
                <Play className="size-5 sm:size-6 ml-0.5 fill-current" />
              </button>
            </div>
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-600 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-neutral-200">
              <span className="font-semibold text-foreground">{title}</span>
              <span>{duration} • Clean White Studio</span>
            </div>
          </div>
        )}

        {isPlaying && (
          <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
                title="Pause"
              >
                <Pause className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
                title="Restart"
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
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </div>
          </div>
        )}
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
