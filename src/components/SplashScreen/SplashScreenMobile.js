import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import phoneNewsGif from '../../SplashScreenAssets/phone-news-video.gif';
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
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  cursor: ${({ isWaitingForPlay }) => (isWaitingForPlay ? "pointer" : "default")};
  flex-direction: column;
  overflow: hidden;
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
  white-space: nowrap;
  z-index: 2;
`;

const GifImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

function SplashScreenMobile({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isWaitingForPlay, setIsWaitingForPlay] = useState(true);
  const [showGif, setShowGif] = useState(false);

  const handleStart = async () => {
    if (!isWaitingForPlay) return;

    try {
      const audio = new Audio(newsAudio);
      await audio.play();

      setIsWaitingForPlay(false);
      setShowGif(true);

      setTimeout(() => {
        setIsVisible(false);
        audio.pause();
        if (onComplete) onComplete();
      }, 5000);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <SplashContainer
      isVisible={isVisible}
      isWaitingForPlay={isWaitingForPlay}
      onClick={handleStart}
    >
      {showGif && <GifImage src={phoneNewsGif} alt="Loading animation" />}
      {isWaitingForPlay && <StartMessage>Tap anywhere to start</StartMessage>}
    </SplashContainer>
  );
}

export default SplashScreenMobile;
