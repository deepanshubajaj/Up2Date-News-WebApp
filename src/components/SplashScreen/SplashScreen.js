import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IoPlayCircleOutline } from "react-icons/io5";

import newsVideo from '../../SplashScreenAssets/newsVideo.mp4';
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

  useEffect(() => {
    const video = document.getElementById('splashVideo');

    const handleVideoEnd = () => {
      setIsVisible(false);
      onComplete?.();
    };

    const handleVideoError = (e) => {
      console.error('Video error:', e);
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

    const video = document.getElementById('splashVideo');
    const audio = new Audio(newsAudio);

    try {
      // iOS requires video to be muted on first play
      video.muted = true;

      await video.play();

      // Unmute after successful playback begins
      video.muted = false;

      // Play audio in parallel
      await audio.play().catch(err =>
        console.warn('Audio play may be blocked on iOS:', err)
      );

      setIsPlaying(true);
      setIsWaitingForPlay(false);

      setTimeout(() => {
        setIsVisible(false);
        video.pause();
        audio.pause();
        onComplete?.();
      }, 5000);
    } catch (err) {
      console.error('Error starting video/audio:', err);
    }
  };

  return (
    <SplashContainer
      isVisible={isVisible}
      isWaitingForPlay={isWaitingForPlay}
      onClick={handleStart}
      onTouchStart={handleStart} // ensure iOS triggers this too
    >
      <StartMessage show={isWaitingForPlay}>
        Tap anywhere to start
      </StartMessage>
      <Video
        id="splashVideo"
        playsInline
        muted // Required for initial autoplay on iOS
        loop
        isPlaying={isPlaying}
      >
        <source src={newsVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </Video>
    </SplashContainer>
  );
}

export default SplashScreen;
