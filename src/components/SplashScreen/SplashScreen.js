import React, { useState } from 'react';
import styled from 'styled-components';
import { IoPlayCircleOutline } from 'react-icons/io5';

import newsVideoDesktop from '../../SplashScreenAssets/newsVideo.mp4';
import newsVideoMobile from '../../SplashScreenAssets/phone-news-video.mp4';
import newsAudio from '../../SplashScreenAssets/news_audio.mp3';

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  background: #000;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  cursor: pointer;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 12px;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${({ isPlaying }) => (isPlaying ? 'block' : 'none')};
`;

function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState(newsVideoDesktop);

  const handleStart = () => {
    const video = document.getElementById('splashVideo');
    const audio = new Audio(newsAudio);

    video.play().then(() => {
      audio.play().catch(err => console.warn('Audio play failed:', err));
      setIsPlaying(true);
      setTimeout(() => {
        setIsVisible(false);
        video.pause();
        audio.pause();
        if (onComplete) onComplete();
      }, 5000);
    }).catch(err => console.error('Video play failed:', err));
  };

  return (
    <SplashContainer isVisible={isVisible} onClick={handleStart}>
      {!isPlaying && (
        <PlayButton>
          <IoPlayCircleOutline size={48} />
          Tap to Start
        </PlayButton>
      )}
      <Video
        id="splashVideo"
        playsInline
        muted
        loop
        isPlaying={isPlaying}
        key={videoSrc}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </Video>
    </SplashContainer>
  );
}

export default SplashScreen;
