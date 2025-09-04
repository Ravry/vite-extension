import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import Settings from './Settings';
import config from '../../../public/config.json'

function Overlay() {
    const [hoveredVideo, setHoveredVideo] = useState<HTMLVideoElement | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [position, setPosition] = useState<{top: number, left: number}>({top: 0, left: 0});

    const [speed, setSpeed] = useState(config.speed);
    const [step, setStep] = useState(config.step);
    const [settings_visible, setSettingsVisible] = useState(false);
    const [settings_position, setSettingsPosition] = useState({top: 0, left: 0});

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

    const adjust_speed = (step : number) => {
        let value : number = Math.round((speed + step) * 100) / 100;
        value = Math.min(Math.max(value, .1), 16.0);
        setSpeed(value);
    };

    if (!isHovering) return null;

    return (
        <div onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <div 
                onContextMenu={(e) => {
                    e.preventDefault();
                    setSettingsVisible(true);
                    setSettingsPosition({left: e.clientX, top: e.clientY});
                }}
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "fit-content",
                    borderRadius: "10px",
                    position: "absolute",
                    zIndex: "99999998",
                    top: position.top + 5,
                    left: position.left + 5,
                    userSelect: "none"
                }}
            >
                <button style={{ 
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    border: "0",
                    padding: "10px",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px"
                }} onClick={() => adjust_speed(-step)}>
                    <FontAwesomeIcon style={{color: "white", width: "10px"}} icon={faCaretLeft} />
                </button>
                <span onClick={() => {setSpeed(1.0)}} style={{
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
                }} onClick={() => adjust_speed(step)}>
                    <FontAwesomeIcon style={{color: "white", width: "10px"}} icon={faCaretRight} />
                </button>
            </div>
        
            <Settings step={step} set_step={setStep} visible={settings_visible} set_visible={setSettingsVisible} position={settings_position}/>
        </div>
    )
}

export default Overlay