let mediaRecorder;
let audioChunks = [];
# `pip3 install assemblyai` (macOS)
# `pip install assemblyai` (Windows)

import assemblyai as aai

aai.settings.api_key = "a10344be1c7e4b55b7c5bdb73b27318e"
transcriber = aai.Transcriber()

transcript = transcriber.transcribe("https://assembly.ai/news.mp4")
# transcript = transcriber.transcribe("./my-local-audio-file.wav")

print(transcript.text)

document.getElementById('recordButton').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPlayback').src = audioUrl;

        // Send audioBlob to transcription API
        const transcript = await transcribeAudio(audioBlob);
        document.getElementById('transcript').textContent = transcript;
    };

    document.getElementById('recordButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
});

document.getElementById('stopButton').addEventListener('click', () => {
    mediaRecorder.stop();
    document.getElementById('recordButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
});

async function transcribeAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer a10344be1c7e4b55b7c5bdb73b27318e'
        },
        body: formData
    });

    const result = await response.json();
    return result.text;
}
