import React, { useEffect, useState, useLayoutEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { IoPlayCircleOutline } from "react-icons/io5";

// Import both video versions
import newsVideoDesktop from '../../SplashScreenAssets/newsVideo.mp4';
import newsVideoMobile from '../../SplashScreenAssets/phone-news-video.mp4';
import newsAudio from '../../SplashScreenAssets/news_audio.mp3';

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
  const [error, setError] = useState(null);
  const [videoSrc, setVideoSrc] = useState(newsVideoDesktop); // default

  useLayoutEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    console.log('Detected mobile:', isMobile, 'UserAgent:', navigator.userAgent);
    setVideoSrc(isMobile ? newsVideoMobile : newsVideoDesktop);
  }, []);

  useEffect(() => {
    const video = document.getElementById('splashVideo');

    const handleVideoEnd = () => {
      setIsVisible(false);
      if (onComplete) onComplete();
    };

    const handleVideoError = (e) => {
      console.error('Video error:', e);
      setError('Video error: ' + (e.message || 'Unknown error'));
    };

    if (video) {
      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('error', handleVideoError);
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handleVideoEnd);
        video.removeEventListener('error', handleVideoError);
      }
    };
  }, [onComplete]);

  const handleStart = async () => {
    if (!isWaitingForPlay) return;

    try {
      const video = document.getElementById('splashVideo');
      const audio = new Audio(newsAudio);

      if (video) {
        video.load(); // force load source
        const playPromise = video.play();

        if (playPromise !== undefined) {
          await playPromise;
        }
      }

      // Try playing audio (may fail silently on mobile)
      audio.play().catch(err => {
        console.warn('Audio play blocked or failed:', err.message);
      });

      setIsWaitingForPlay(false);
      setIsPlaying(true);

      setTimeout(() => {
        setIsVisible(false);
        video.pause();
        audio.pause();
        if (onComplete) onComplete();
      }, 5000);
    } catch (error) {
      console.error('Playback error:', error);
      setError('Could not play media: ' + error.message);
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
        id="splashVideo"
        playsInline
        muted // Crucial for mobile playback
        isPlaying={isPlaying}
        loop
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </Video>
    </SplashContainer>
  );
}

export default SplashScreen;
