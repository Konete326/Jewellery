import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { galleryApi } from "@/api/galleryApi";
import { DEFAULT_SKIPER_IMAGES } from "@/user/components/Skiper54";

function pickWeightedPiece(pool, currentId) {
  if (!pool || pool.length === 0) return null;
  const candidates =
    pool.length > 1 && currentId
      ? pool.filter((item) => (item._id || item.id) !== currentId)
      : pool;

  const weights = candidates.map((item) => {
    const rawRating = Number(item.averageRating ?? item.rating ?? 4.8);
    return Math.pow(Math.max(1, rawRating), 3);
  });

  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  let randomNum = Math.random() * totalWeight;

  for (let i = 0; i < candidates.length; i++) {
    randomNum -= weights[i];
    if (randomNum <= 0) return candidates[i];
  }
  return candidates[0];
}

export function AuthGalleryShowcase() {
  const [pieces, setPieces] = useState(() => {
    return DEFAULT_SKIPER_IMAGES.map((item, idx) => ({
      id: item._id || item.id || `default-${idx}`,
      imageUrl: item.imageUrl || item.src,
      title: item.title,
      averageRating: 4.9
    }));
  });

  const [currentPiece, setCurrentPiece] = useState(() => {
    const initialPool = DEFAULT_SKIPER_IMAGES.map((item, idx) => ({
      id: item._id || item.id || `default-${idx}`,
      imageUrl: item.imageUrl || item.src,
      title: item.title,
      averageRating: 4.9
    }));
    return pickWeightedPiece(initialPool, null);
  });

  const [prevImage, setPrevImage] = useState(null);
  const piecesRef = useRef(pieces);

  useEffect(() => {
    piecesRef.current = pieces;
  }, [pieces]);

  useEffect(() => {
    let isMounted = true;

    const loadPieces = async () => {
      try {
        const res = await galleryApi.getAll();
        const apiData = Array.isArray(res?.data) ? res.data : [];
        const merged = [
          ...apiData.filter((item) => item.imageUrl || item.src),
          ...DEFAULT_SKIPER_IMAGES.map((item, idx) => ({
            id: item._id || item.id || `fallback-${idx}`,
            imageUrl: item.imageUrl || item.src,
            title: item.title,
            averageRating: 4.9
          }))
        ];

        const uniqueMap = new Map();
        for (const item of merged) {
          const key = item.imageUrl || item.src || item.title;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, {
              id: item._id || item.id || key,
              imageUrl: item.imageUrl || item.src,
              title: item.title,
              averageRating: Number(item.averageRating ?? item.rating ?? 4.8)
            });
          }
        }

        const uniqueList = Array.from(uniqueMap.values());
        if (isMounted && uniqueList.length > 0) {
          setPieces(uniqueList);
          const firstPick = pickWeightedPiece(uniqueList, null);
          if (firstPick) {
            setCurrentPiece(firstPick);
          }
        }
      } catch {}
    };

    loadPieces();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const pool = piecesRef.current;
      if (!pool || pool.length < 2) return;

      const next = pickWeightedPiece(pool, currentPiece?.id);
      if (next && next.imageUrl !== currentPiece?.imageUrl) {
        setPrevImage(currentPiece?.imageUrl);
        setCurrentPiece(next);

        const timer = setTimeout(() => {
          setPrevImage(null);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [currentPiece]);

  return (
    <div className="relative hidden h-full flex-col border-r border-border p-10 lg:flex overflow-hidden select-none bg-neutral-950">
      <div className="absolute inset-0 z-0">
        {prevImage && (
          <img
            src={prevImage}
            alt="Khalil & Sons Gallery"
            className="absolute inset-0 size-full object-cover transition-opacity duration-1000 opacity-0"
          />
        )}
        {currentPiece?.imageUrl && (
          <img
            key={currentPiece.imageUrl}
            src={currentPiece.imageUrl}
            alt={currentPiece.title || "Khalil & Sons Masterpiece"}
            className="absolute inset-0 size-full object-cover transition-opacity duration-1000 opacity-100 scale-105 animate-in fade-in zoom-in-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60 backdrop-blur-[1px]" />
      </div>

      <Link
        to="/"
        className="z-10 flex items-center gap-3 w-fit group transition-opacity hover:opacity-90"
      >
        <img
          src="/assets/logo.png"
          alt="Khalil & Sons"
          className="size-8 object-contain drop-shadow"
        />
        <span className="font-serif tracking-widest text-lg font-light text-white drop-shadow-sm">
          KHALIL & SONS
        </span>
      </Link>

      <div className="z-10 mt-auto">
        <blockquote className="space-y-3">
          <p className="font-serif italic text-2xl text-white/95 leading-snug drop-shadow-sm max-w-lg">
            &ldquo;True luxury is found in the artist's touch, preserving the timeless beauty of pure gold.&rdquo;
          </p>
          <footer className="text-xs uppercase tracking-widest text-amber-300/80 drop-shadow-xs">
            Murshid Bazaar, Saddar, Karachi • Est. 1992
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
