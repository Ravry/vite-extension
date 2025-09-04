
type Props = {
    step: number;
    set_step: React.Dispatch<React.SetStateAction<number>>;
    visible: boolean;
    set_visible: React.Dispatch<React.SetStateAction<boolean>>;
    position: any;
}

function Settings({step, set_step, visible, set_visible, position} : Props) {
    if (!visible) return null;

    return (
        <div style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            padding: "10px",
            borderRadius: "10px",
            zIndex: "99999999",
            position: "absolute",
            top: position.top,
            left: position.left,
            display: "flex",
            flexDirection: "column",
            width: "140px",
            userSelect: "none"
        }}> 
            <h1 style={{color: "white"}}>Settings</h1>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <input type="range" min={0.1} max={1.0} step={0.1} value={step} onChange={(e) => {set_step(Number(e.target.value))}}/>
                <span style={{color: "white"}}>{step.toFixed(1)}</span>
            </div>
            <button onClick={() => set_visible(false)} style={{
                color: "white",
                backgroundColor: "rgba(48, 48, 48, 0.4)",
                border: "0",
                padding: "10px",
                borderRadius: "10px"
            }}>close</button>
        </div>
    );
}

export default Settings