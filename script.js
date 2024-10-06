let mediaRecorder;
let audioChunks = [];

async function testTranscription() {
    const response = await fetch('https://cors-bypasser.glitch.me/bypass/assembly.ai/wildfires.mp3');
    const audioBlob = await response.blob();
    const transcript = await transcribeAudio(audioBlob);
    console.log('Test transcription:', transcript);
}

testTranscription();

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
            'Authorization': 'Bearer a10344be1c7e4b55b7c5bdb73b27318e'  // Replace YOUR_API_KEY
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
