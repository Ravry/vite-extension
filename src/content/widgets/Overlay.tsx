import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import Settings from './Settings';

function Overlay() {
    const [hoveredVideo, setHoveredVideo] = useState<HTMLVideoElement | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [position, setPosition] = useState<{top: number, left: number}>({top: 0, left: 0});

    const [speed, setSpeed] = useState(1.0);
    const [step, setStep] = useState(.1);

    useEffect(() => {
        const handleVideoHover = (video: HTMLVideoElement) => {
            const handleMouseOver = () => {
                setHoveredVideo(video);
                setIsHovering(true);
                const rect = video.getBoundingClientRect();
                setPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
            };
            const handleMouseOut = () => {
                setIsHovering(false);
                setHoveredVideo(null);
            }

            video.addEventListener('mouseover', handleMouseOver);
            video.addEventListener('mouseout', handleMouseOut);

            return () => {
                video.removeEventListener('mouseover', handleMouseOver);
                video.removeEventListener('mouseout', handleMouseOut);
            };
        };

        document.querySelectorAll<HTMLVideoElement>('video').forEach(video => handleVideoHover(video));

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLVideoElement) {
                        handleVideoHover(node);
                    }
                    if (node instanceof HTMLElement) {
                        node.querySelectorAll<HTMLVideoElement>('video').forEach(video => handleVideoHover(video));
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);


    useEffect(() => {
        if (hoveredVideo) {
            hoveredVideo.playbackRate = speed;
        }
    }, [speed, hoveredVideo]);

    useEffect(() => {
        const videos = document.querySelectorAll<HTMLVideoElement>("video");
        videos.forEach(video => {
            video.playbackRate = speed;
        });
    }, [speed])

    if (!isHovering) return null;

    return (
        <>
            <div    
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)} 
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "fit-content",
                borderRadius: "10px",
                position: "absolute",
                zIndex: "99999999",
                top: position.top,
                left: position.left,
                userSelect: "none"
            }}>
                <button style={{ 
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    border: "0",
                    padding: "10px",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px"
                }} onClick={() => setSpeed(Math.round((speed - step) * 100) / 100)}>
                    <FontAwesomeIcon style={{color: "white", width: "10px"}} icon={faCaretLeft} />
                </button>
                <span style={{
                    color: "white",
                    padding: "10px",
                    textAlign: "center",
                    fontWeight: "bolder" 
                }}>{speed}x</span>
                <button style={{ 
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    border: "0",
                    padding: "10px",
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px" 
                }} onClick={() => setSpeed(Math.round((speed + step) * 100) / 100)}>
                    <FontAwesomeIcon style={{color: "white", width: "10px"}} icon={faCaretRight} />
                </button>
                <Settings step={step} set_step={setStep}/>
            </div>

        </>
    )
}

export default Overlay