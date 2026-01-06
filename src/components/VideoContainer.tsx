import React, { useRef, useEffect } from 'react';

interface VideoContainerProps {
    src: string;
    poster?: string;
    autoPlay?: boolean;
    controls?: boolean;
    muted?: boolean;
    loop?: boolean;
    width?: string | number;
    height?: string | number;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
    src,
    poster,
    autoPlay = true,
    controls = false,
    muted = false,
    loop = false,
    width = '100%',
    height = 'auto'
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video && autoPlay) {
            video.play().catch(console.error);
        }
    }, [autoPlay]);

    return (
        <div style={{width, height}} className="video-container ">
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                controls={controls}
                muted={muted}
                loop={loop}
                width={width}
                height={height}
                style={{ maxWidth: '100%' }}
            >
                Your browser does not support the video tag.
            </video>
            
        </div>
    );
};

export default VideoContainer;