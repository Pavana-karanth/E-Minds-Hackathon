// Optional: Add interactivity if needed
console.log('TalkSync website loaded!');

        let mediaRecorder;
        let audioChunks = [];

        // Start recording on button click
        document.getElementById("start-recording").addEventListener("click", async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById("audio-preview").src = audioUrl;
                uploadAudio(audioBlob);
                audioChunks = []; // Clear chunks after stopping
            };

            mediaRecorder.start();
            document.getElementById("start-recording").disabled = true;
            document.getElementById("stop-recording").disabled = false;
        });

        // Stop recording and send the audio to the server
        document.getElementById("stop-recording").addEventListener("click", () => {
            mediaRecorder.stop();
            document.getElementById("start-recording").disabled = false;
            document.getElementById("stop-recording").disabled = true;
        });

        // Upload the audio file to the server
        async function uploadAudio(blob) {
            const formData = new FormData();
            formData.append("file", blob, "audio.wav");

            try {
                const response = await fetch("https://0884-34-83-108-75.ngrok-free.app/process-speech/", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    // Get the response as a Blob for playback
                    const audioResponse = await response.blob();
                    const audioUrl = URL.createObjectURL(audioResponse);
                    const generatedAudio = document.getElementById("generated-audio");

                    // Set the generated audio as the source for playback
                    generatedAudio.src = audioUrl;
                    generatedAudio.play();
                } else {
                    console.error("Error:", response.statusText);
                    alert("Failed to upload audio!");
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                alert("An error occurred while uploading the audio.");
            }
        }

