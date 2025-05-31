import React, { useEffect, useState } from 'react';
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ isPlaying }) => (isPlaying ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px 40px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translate(-50%, -50%) scale(1.05);
  }

  svg {
    width: 64px;
    height: 64px;
  }
`;

const PlayText = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isWaitingForPlay, setIsWaitingForPlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [videoSource, setVideoSource] = useState(newsVideo);

  useEffect(() => {
  const updateVideoSource = () => {
    console.log('window.innerWidth:', window.innerWidth);
    const isMobile = window.innerWidth <= 768;
    setVideoSource(isMobile ? newsVideoMobile : newsVideo);
  };

  updateVideoSource();
  window.addEventListener('resize', updateVideoSource);

  return () => {
    window.removeEventListener('resize', updateVideoSource);
  };
}, []);


 useEffect(() => {
  const video = document.getElementById('splashVideo');
  if (video) {
    video.load(); // Force the video to reload the new source
    if (isPlaying) {
      video.play().catch(e => console.error('Error playing video:', e));
    }
  }
}, [videoSource, isPlaying]);

  const handleStart = async () => {
    if (!isWaitingForPlay) return;

    try {
      const video = document.getElementById('splashVideo');
      const audio = new Audio(newsAudio);
      
      // Start playing both
      await Promise.all([video.play(), audio.play()]);
      
      setIsWaitingForPlay(false);
      setIsPlaying(true);

      // Set timer to end splash screen after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
        video.pause();
        audio.pause();
        if (onComplete) onComplete();
      }, 5000);

    } catch (error) {
      console.error('Error playing media:', error);
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
        muted={false}
        isPlaying={isPlaying}
        loop
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </Video>
    </SplashContainer>
  );
}

export default SplashScreen;
