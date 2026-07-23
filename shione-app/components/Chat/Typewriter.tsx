import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import Markdown from "react-native-markdown-display";

interface TypewriterTextProps {
  text: string;
  animate?: boolean;
  speed?: number;
  markdownStyle?: any;
}

export default function TypewriterText({
  text,
  animate = true,
  speed = 14,
  markdownStyle,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState(animate ? "" : text);
  const [isDone, setIsDone] = useState(!animate);

  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      setIsDone(true);
      return;
    }

    setDisplayedText("");
    setIsDone(false);

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, animate]);

  if (isDone) {
    return <Markdown style={markdownStyle}>{text}</Markdown>;
  }

  return (
    <Text className="text-neutral-700 text-[15px] leading-5">
      {displayedText}
    </Text>
  );
}