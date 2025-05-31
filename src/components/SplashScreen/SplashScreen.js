import React, { useEffect, useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { IoPlayCircleOutline } from "react-icons/io5";
import newsVideo from '../../SplashScreenAssets/newsVideo.mp4';
import newsAudio from '../../SplashScreenAssets/news_audio.mp3';
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
  display: block;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  background-color: black;
  opacity: ${({ isPlaying }) => (isPlaying ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isWaitingForPlay, setIsWaitingForPlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  const videoSource = useMemo(() => {
    return window.innerWidth < 768 ? newsVideoMobile : newsVideo;
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

    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('error', handleVideoError);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('error', handleVideoError);
    };
  }, [onComplete]);

  const handleStart = async () => {
    if (!isWaitingForPlay) return;

    try {
      const video = document.getElementById('splashVideo');
      const audio = new Audio(newsAudio);

      // Reset and preload video for iOS compatibility
      video.currentTime = 0;
      video.load();

      // Play video (must be muted for autoplay on iOS)
      await video.play();

      // Play audio after video begins (iOS requires gesture)
      audio.play().catch(err => {
        console.warn('Audio play blocked:', err);
      });

      setIsWaitingForPlay(false);
      setIsPlaying(true);

      // Automatically finish splash screen after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
        video.pause();
        audio.pause();
        if (onComplete) onComplete();
      }, 5000);

    } catch (err) {
      console.error('Playback error:', err);
      setError('Playback error: ' + (err.message || 'Unknown'));
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
        id="splashVideo"
        playsInline
        muted
        preload="auto"
        isPlaying={isPlaying}
        loop
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </Video>
    </SplashContainer>
  );
};

export default SplashScreen;
