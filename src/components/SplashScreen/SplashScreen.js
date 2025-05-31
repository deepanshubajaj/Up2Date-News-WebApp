import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Import both video versions
import newsVideoDesktop from '../../SplashScreenAssets/newsVideo.mp4';
import newsVideoMobile from '../../SplashScreenAssets/phone-news-video.mp4';

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translate(-50%, -50%) translateY(10px); }
  50% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
  100% { opacity: 0; transform: translate(-50%, -50%) translateY(-10px); }
`;

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  background: #000;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  cursor: ${({ isWaitingForPlay }) => (isWaitingForPlay ? 'pointer' : 'default')};
`;

const StartMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  animation: ${fadeInOut} 2s ease-in-out infinite;
  display: ${({ show }) => (show ? 'block' : 'none')};
  white-space: nowrap;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ isPlaying }) => (isPlaying ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isWaitingForPlay, setIsWaitingForPlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState(newsVideoDesktop);
  const videoRef = useRef(null);

  useLayoutEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setVideoSrc(isMobile ? newsVideoMobile : newsVideoDesktop);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setIsVisible(false);
      onComplete?.();
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [onComplete]);

  const handleStart = async () => {
    if (!isWaitingForPlay) return;

    try {
      const video = videoRef.current;
      if (!video) return;

      await video.play(); // should succeed if muted and user-triggered
      setIsWaitingForPlay(false);
      setIsPlaying(true);

      setTimeout(() => {
        video.pause();
        setIsVisible(false);
        onComplete?.();
      }, 5000);
    } catch (error) {
      console.error('Playback failed:', error.message);
    }
  };

  return (
    <SplashContainer
      isVisible={isVisible}
      isWaitingForPlay={isWaitingForPlay}
      onClick={handleStart}
    >
      <StartMessage show={isWaitingForPlay}>
        Tap anywhere to start
      </StartMessage>
      <Video
        key={videoSrc}
        ref={videoRef}
        playsInline
        muted
        loop
        isPlaying={isPlaying}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </Video>
    </SplashContainer>
  );
}

export default SplashScreen;
