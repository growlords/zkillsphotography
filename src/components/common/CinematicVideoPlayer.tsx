import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  RotateCw,
  Loader2,
} from 'lucide-react';

export interface CinematicVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  initialMuted?: boolean;
  loop?: boolean;
  title?: string;
  category?: string;
  location?: string;
  year?: string;
  onEnded?: () => void;
  className?: string;
}

export const CinematicVideoPlayer: React.FC<CinematicVideoPlayerProps> = ({
  src,
  poster,
  autoPlay = true,
  initialMuted = false,
  loop = false,
  title,
  category,
  location,
  year,
  onEnded,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  // Interaction state
  const [isSeeking, setIsSeeking] = useState(false);
  const [wasPlayingBeforeSeek, setWasPlayingBeforeSeek] = useState(false);
  const [seekHoverTime, setSeekHoverTime] = useState<number | null>(null);
  const [seekHoverPos, setSeekHoverPos] = useState<number | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Video rotation state (0°, 90°, 180°, 270°)
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [scaleFactor, setScaleFactor] = useState(1);

  // Volume slider hover state on desktop
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Format seconds -> MM:SS or HH:MM:SS
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
    const totalSecs = Math.floor(seconds);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate rotation scale to prevent ANY cropping or distortion
  const updateRotationScale = useCallback(() => {
    if (!containerRef.current || !videoRef.current) return;

    if (rotation === 0 || rotation === 180) {
      setScaleFactor(1);
      return;
    }

    // When rotation is 90° or 270°, the video's width and height swap relative to the container
    const containerRect = containerRef.current.getBoundingClientRect();
    const cWidth = containerRect.width;
    const cHeight = containerRect.height;

    // Determine intrinsic or rendered aspect ratio of video
    const video = videoRef.current;
    const vWidth = video.videoWidth || cWidth;
    const vHeight = video.videoHeight || cHeight;
    const videoAspect = vWidth / vHeight;
    const containerAspect = cWidth / cHeight;

    // Normal unrotated fitted dimensions inside container
    let unrotatedWidth: number;
    let unrotatedHeight: number;

    if (containerAspect > videoAspect) {
      // Height-limited
      unrotatedHeight = cHeight;
      unrotatedWidth = cHeight * videoAspect;
    } else {
      // Width-limited
      unrotatedWidth = cWidth;
      unrotatedHeight = cWidth / videoAspect;
    }

    // When rotated 90/270 degrees:
    // the rotated box has width = unrotatedHeight and height = unrotatedWidth
    // We scale so: unrotatedHeight * scale <= cWidth AND unrotatedWidth * scale <= cHeight
    const scaleX = cWidth / unrotatedHeight;
    const scaleY = cHeight / unrotatedWidth;
    const computedScale = Math.min(scaleX, scaleY, 1);

    setScaleFactor(computedScale);
  }, [rotation]);

  // Re-calculate scale on rotation, window resize, or fullscreen change
  useEffect(() => {
    updateRotationScale();

    const handleResize = () => {
      updateRotationScale();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateRotationScale]);

  // Handle Rotation cycle
  const handleRotate = () => {
    setRotation((prev) => {
      if (prev === 0) return 90;
      if (prev === 90) return 180;
      if (prev === 180) return 270;
      return 0;
    });
    showControlsTemporarily();
  };

  // Play / Pause toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    showControlsTemporarily();
  };

  // Mute / Unmute toggle
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      video.volume = volume > 0 ? volume : 0.8;
    } else {
      video.muted = true;
      setIsMuted(true);
    }
    showControlsTemporarily();
  };

  // Volume slider change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    setVolume(val);
    video.volume = val;
    if (val === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
    showControlsTemporarily();
  };

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('[CinematicVideoPlayer] Fullscreen toggle failed:', err);
    }
    showControlsTemporarily();
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = Boolean(
        document.fullscreenElement || (document as any).webkitFullscreenElement
      );
      setIsFullscreen(isNowFullscreen);
      setTimeout(updateRotationScale, 100);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [updateRotationScale]);

  // Auto-hide controls logic
  const showControlsTemporarily = () => {
    setControlsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    // If video is playing and not seeking, hide after 2.6 seconds
    if (isPlaying && !isSeeking) {
      hideTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 2600);
    }
  };

  const handlePointerActivity = () => {
    showControlsTemporarily();
  };

  // Video event listeners
  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isSeeking) return;

    setCurrentTime(video.currentTime);

    // Calculate buffer progress
    if (video.buffered && video.buffered.length > 0) {
      const end = video.buffered.end(video.buffered.length - 1);
      setBufferedEnd(end);
    }
  };

  const onLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 0);
    updateRotationScale();
  };

  // Timeline scrub calculations
  const calculateSeekTime = (clientX: number): number => {
    if (!timelineRef.current || duration === 0) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const clampedX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = clampedX / rect.width;
    return percentage * duration;
  };

  // Pointer Down on Timeline (Start Scrubbing)
  const handleTimelinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRef.current;
    if (!video || duration === 0) return;

    // Capture pointer so dragging outside the bar keeps seeking
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    setWasPlayingBeforeSeek(!video.paused);
    setIsSeeking(true);
    setControlsVisible(true);

    const targetTime = calculateSeekTime(e.clientX);
    setCurrentTime(targetTime);
    video.currentTime = targetTime;
  };

  // Pointer Move on Timeline (Drag or Hover)
  const handleTimelinePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!timelineRef.current || duration === 0) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clampedX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clampedX / rect.width;
    const hoverTime = percentage * duration;

    setSeekHoverTime(hoverTime);
    setSeekHoverPos(percentage * 100);

    if (isSeeking) {
      const video = videoRef.current;
      if (video) {
        setCurrentTime(hoverTime);
        video.currentTime = hoverTime;
      }
    }
  };

  // Pointer Up on Timeline (End Scrubbing)
  const handleTimelinePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch (_) {}

    setIsSeeking(false);

    const video = videoRef.current;
    if (video && wasPlayingBeforeSeek) {
      video.play().catch(() => {});
      setIsPlaying(true);
    }

    showControlsTemporarily();
  };

  const handleTimelinePointerLeave = () => {
    if (!isSeeking) {
      setSeekHoverTime(null);
      setSeekHoverPos(null);
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      if (e.code === 'Space' || e.code === 'KeyK') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleRotate();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const nextTime = Math.max(0, video.currentTime - 5);
        video.currentTime = nextTime;
        setCurrentTime(nextTime);
        showControlsTemporarily();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const nextTime = Math.min(duration, video.currentTime + 5);
        video.currentTime = nextTime;
        setCurrentTime(nextTime);
        showControlsTemporarily();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration, isMuted, isPlaying]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercentage = duration > 0 ? (bufferedEnd / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerActivity}
      onTouchStart={handlePointerActivity}
      onClick={handlePointerActivity}
      className={`relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none group ${
        isFullscreen ? 'fixed inset-0 z-[999999]' : 'rounded-xl border border-white/10 shadow-2xl'
      } ${className}`}
    >
      {/* Rotatable & Scaled Video Surface Wrapper */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out pointer-events-auto cursor-pointer"
        onClick={togglePlay}
        style={{
          transform: `rotate(${rotation}deg) scale(${scaleFactor})`,
          transformOrigin: 'center center',
        }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={isMuted}
          loop={loop}
          playsInline
          className="max-w-full max-h-full w-auto h-auto object-contain bg-black pointer-events-none"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onPlay={() => {
            setIsPlaying(true);
            showControlsTemporarily();
          }}
          onPause={() => {
            setIsPlaying(false);
            setControlsVisible(true);
          }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onEnded={() => {
            setIsPlaying(false);
            setControlsVisible(true);
            onEnded?.();
          }}
        />
      </div>

      {/* Buffering Spinner Overlay */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-champagne/30 text-champagne">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>
      )}

      {/* Top Gradient Shadow & Context Header */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none transition-opacity duration-300 z-30 ${
          controlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            {category && (
              <span className="text-[10px] font-mono tracking-widest-2xl text-champagne uppercase block">
                {category}
              </span>
            )}
            {title && (
              <h3 className="text-sm sm:text-base font-serif text-white font-normal truncate max-w-md">
                {title}
              </h3>
            )}
          </div>

          {rotation !== 0 && (
            <span className="px-2.5 py-1 rounded-full bg-champagne/20 border border-champagne/40 text-champagne font-mono text-[10px] tracking-wider">
              ROTATED {rotation}°
            </span>
          )}
        </div>
      </div>

      {/* Center Quick Play / Pause Flash Overlay */}
      {!isPlaying && !isBuffering && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 hover:bg-champagne hover:text-black text-champagne border border-champagne/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl z-20"
          aria-label="Play video"
        >
          <Play className="w-8 h-8 fill-current ml-1" />
        </button>
      )}

      {/* Bottom Cinematic Gradient & YouTube-Style Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 pt-16 pb-3 sm:pb-4 px-3 sm:px-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 z-30 ${
          controlsVisible || isSeeking ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* 1. YOUTUBE-STYLE INTERACTIVE SEEK / TIMELINE BAR                           */}
        {/* ========================================================================= */}
        <div className="relative mb-2 sm:mb-3 group/timeline select-none">
          {/* Touch-Friendly Expansion Hitbox */}
          <div
            ref={timelineRef}
            onPointerDown={handleTimelinePointerDown}
            onPointerMove={handleTimelinePointerMove}
            onPointerUp={handleTimelinePointerUp}
            onPointerCancel={handleTimelinePointerUp}
            onPointerLeave={handleTimelinePointerLeave}
            className="w-full h-8 sm:h-7 -my-2 flex items-center cursor-pointer touch-none"
            role="slider"
            aria-label="Seek video playback time"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            tabIndex={0}
          >
            {/* Background Track Base */}
            <div className="w-full h-1 sm:h-1.5 bg-white/20 group-hover/timeline:h-2 sm:group-hover/timeline:h-2.5 rounded-full relative transition-all duration-200 overflow-visible">
              {/* Buffer Bar (Downloaded segment) */}
              <div
                className="absolute top-0 left-0 h-full bg-white/35 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, bufferPercentage)}%` }}
              />

              {/* Played Progress Bar (Champagne Gold Fill) */}
              <div
                className="absolute top-0 left-0 h-full bg-champagne rounded-full"
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              />

              {/* Scrubber / Thumb */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-champagne border-2 border-white shadow-lg transition-transform duration-150 ${
                  isSeeking || seekHoverPos !== null ? 'scale-125' : 'scale-0 group-hover/timeline:scale-100'
                }`}
                style={{ left: `${Math.min(100, progressPercentage)}%` }}
              />
            </div>
          </div>

          {/* Hover Time Tooltip Pill (Desktop) */}
          {seekHoverTime !== null && seekHoverPos !== null && (
            <div
              className="hidden sm:block absolute -top-8 px-2 py-1 rounded-md bg-[#121217] border border-white/20 text-[11px] font-mono text-champagne shadow-xl pointer-events-none transform -translate-x-1/2"
              style={{ left: `${seekHoverPos}%` }}
            >
              {formatTime(seekHoverTime)}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. PLAYER CONTROLS (Play, Volume, Time, Rotation, Fullscreen)              */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 text-white">
          {/* Left Controls: Play/Pause, Volume, Time */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg text-white/90 hover:text-champagne hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-champagne"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              title={isPlaying ? 'Pause (Space / K)' : 'Play (Space / K)'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Volume Control Container */}
            <div
              className="flex items-center gap-1.5 group/vol"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg text-white/90 hover:text-champagne hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-champagne"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              {/* Volume Slider (Desktop hover / focus) */}
              <div
                className={`overflow-hidden transition-all duration-200 hidden sm:flex items-center ${
                  showVolumeSlider ? 'w-20 opacity-100 mr-1' : 'w-0 opacity-0 pointer-events-none'
                }`}
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-18 h-1 bg-white/25 accent-champagne rounded-lg cursor-pointer"
                  aria-label="Volume level"
                />
              </div>
            </div>

            {/* Time Display: 00:37 / 04:52 */}
            <div className="text-[11px] sm:text-xs font-mono text-white/80 tracking-wider flex items-center gap-1">
              <span className="text-white font-medium">{formatTime(currentTime)}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/60">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Location/Year badge, Rotation, Fullscreen */}
          <div className="flex items-center gap-1 sm:gap-2">
            {(location || year) && (
              <span className="hidden md:inline-block text-[11px] font-mono text-white/40 px-2 py-0.5 rounded border border-white/10 bg-white/5 mr-1">
                {[location, year].filter(Boolean).join(' • ')}
              </span>
            )}

            {/* ========================================================================= */}
            {/* 3. SCREEN / VIDEO ROTATION BUTTON (0° -> 90° -> 180° -> 270° -> 0°)         */}
            {/* ========================================================================= */}
            <button
              onClick={handleRotate}
              className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-champagne ${
                rotation !== 0
                  ? 'bg-champagne/20 text-champagne border border-champagne/40'
                  : 'text-white/90 hover:text-champagne hover:bg-white/10'
              }`}
              aria-label="Rotate video"
              title={`Rotate video orientation (Currently ${rotation}°)`}
            >
              <RotateCw className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="text-[10px] font-mono font-medium">{rotation}°</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-white/90 hover:text-champagne hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-champagne"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize className="w-4.5 h-4.5" /> : <Maximize className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
