import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import newsVideo from '../../SplashScreenAssets/newsVideoWithAudio.mp4'; // combined video+audio recommended
import newsVideoMobile from '../../SplashScreenAssets/phone-news-video-with-audio.mp4'; // combined mobile version

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translate(-50%, -50%) translateY(10px); }
  50% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
  100% { opacity: 0; transform: translate(-50%, -50%) translateY(-10px); }
`;

const SplashContainer = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 10000; background: #000;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  cursor: ${({ isWaitingForPlay }) => (isWaitingForPlay ? 'pointer' : 'default')};
`;

const StartMessage = styled.div`
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  color: white; font-size: 24px; font-weight: 500;
  text-align: center;
  animation: ${fadeInOut} 2s ease-in-out infinite;
  display: ${({ show }) => (show ? 'block' : 'none')};
  white-space: nowrap;
`;

const Video = styled.video`
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: ${({ isPlaying }) => (isPlaying ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isWaitingForPlay, setIsWaitingForPlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSource, setVideoSource] = useState(newsVideo);
  const videoRef = useRef(null);

  useEffect(() => {
    const updateVideoSource = () => {
      const isMobile = window.innerWidth <= 768;
      setVideoSource(isMobile ? newsVideoMobile : newsVideo);
    };

    updateVideoSource();
    window.addEventListener('resize', updateVideoSource);
    return () => window.removeEventListener('resize', updateVideoSource);
  }, []);

  const handleStart = async () => {
    if (!isWaitingForPlay) return;

    const video = videoRef.current;
    if (!video) return;

    try {
      // Unmute video now on user interaction
      video.muted = false;

      await video.play();

      setIsWaitingForPlay(false);
      setIsPlaying(true);

      setTimeout(() => {
        setIsVisible(false);
        video.pause();
        if (onComplete) onComplete();
      }, 5000);
    } catch (err) {
      console.error('Error playing video:', err);
    }
  };

  return (
    <SplashContainer isVisible={isVisible} isWaitingForPlay={isWaitingForPlay} onClick={handleStart}>
      <StartMessage show={isWaitingForPlay}>Tap anywhere to start</StartMessage>
      <Video
        ref={videoRef}
        playsInline
        muted
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
