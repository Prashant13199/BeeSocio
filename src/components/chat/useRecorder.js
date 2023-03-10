import {
    useEffect, useState
}
    from "react";

const useRecorder = () => {
    const [audioURL, setAudioURL] = useState("");
    const [audio, setAudio] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);

    useEffect(() => { if (recorder === null) { if (isRecording) { requestRecorder().then(setRecorder, console.error); } return; } if (isRecording) { recorder.start(); } else { recorder.stop(); } const handleData = (e) => { setAudioURL(URL.createObjectURL(e.data)); setAudio(e.data); }; recorder.addEventListener("dataavailable", handleData); return () => recorder.removeEventListener("dataavailable", handleData); }, [recorder, isRecording]);

    const startRecording = () => {
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    return [audioURL, isRecording, startRecording, stopRecording, setAudioURL, audio,];
};

async function requestRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream);
}
export default useRecorder;
