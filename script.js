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
    formData.append('audio', audioBlob);

    console.log('Sending audio to transcription API...');
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY'  // Replace YOUR_API_KEY with your actual key in quotes
        },
        body: formData
    });

    if (!response.ok) {
        console.error('Error with transcription API:', response.statusText);
        return 'Error with transcription API';
    }

    const result = await response.json();
    console.log('Transcription result:', result);
    return result.text;
}
