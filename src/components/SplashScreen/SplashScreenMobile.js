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
  cursor: pointer;
  flex-direction: column;
`;

const StartMessage = styled.div`
  color: white;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
  animation: ${fadeInOut} 2s ease-in-out infinite;
  white-space: nowrap;
`;

const GifImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
`;

function SplashScreenMobile({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleStart = () => {
    const audio = new Audio(newsAudio);
    audio.play().catch((e) => console.error("Error playing audio:", e));

    setIsVisible(false);
    if (onComplete) onComplete();
  };

  return (
    <SplashContainer isVisible={isVisible} onClick={handleStart}>
      <GifImage src={phoneNewsGif} alt="Loading animation" />
      <StartMessage>Tap anywhere to start</StartMessage>
    </SplashContainer>
  );
}

export default SplashScreenMobile;
