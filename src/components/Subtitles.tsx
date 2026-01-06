import { useEffect, useState } from "react";

interface SubtitleProps {
  story?: string[];
  dataState: "ok" | "loadingNASA" | "loadingAI" | "error";
}

export function Subtitles({ story, dataState }: SubtitleProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentSentenceIndex(0);

    const timer = setInterval(() => {
      setCurrentSentenceIndex((prev) => {
        if (story && prev >= story?.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [story]);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      <div className="bg-card/90 border-t border-primary/30 backdrop-blur-md md:backdrop-blur-sm">
        <div>
          <div className="h-32 md:h-24 flex items-center justify-center px-8 subtitle-text">
            {dataState === "loadingNASA" && (
              <p className="">
                Loading NEO data
                <TerminalSpinner />
              </p>
            )}
            {dataState === "loadingAI" && (
              <p className="">
                Establishing connection to NEO
                <TerminalSpinner />
              </p>
            )}
            {dataState === "ok" && story?.length && (
              <p className="">{story[currentSentenceIndex]}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalSpinner() {
  const [spinner, setSpinner] = useState<string>("/");

  useEffect(() => {
    const frames = ["/", "-", "\\", "|"];
    let i = 0;

    const id = window.setInterval(() => {
      i = (i + 1) % frames.length;
      setSpinner(frames[i]);
    }, 160);

    return () => {
      if (id) window.clearInterval(id);
    };
  }, []);

  return <span className="font-mono inline-block w-4">{spinner}</span>;
}
