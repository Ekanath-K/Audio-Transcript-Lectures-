let mediaRecorder;
let audioChunks = [];

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
    formData.append('file', audioBlob);

    const response = await fetch('YOUR_TRANSCRIPTION_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: formData
    });

    const result = await response.json();
    return result.transcript;
}
