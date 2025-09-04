
type Props = {
    step: number;
    set_step: React.Dispatch<React.SetStateAction<number>>;
}

function Settings({step, set_step} : Props) {
    return (
        <>
        <input type="range" min={0.1} max={1.0} step={0.1} value={step} onChange={(e) => {set_step(Number(e.target.value))}}/>
        <span>step: {step}</span>
        </>
    );
}

export default Settings