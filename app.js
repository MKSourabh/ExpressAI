// Access the user's camera and display the video feed
function startCamera() {
    const cameraContainer = document.getElementById('camera-container');
    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true; // Ensures compatibility with mobile browsers
    video.id = 'camera-feed';
    cameraContainer.appendChild(video);

    // Request access to the camera
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } }) // Use 'environment' for the rear camera
        .then((stream) => {
            video.srcObject = stream;

            video.onloadedmetadata = () => {
                video.width = video.videoWidth;
                video.height = video.videoHeight;
                video.play().catch((error) => {
                    console.error('Error playing the video:', error);
                });
            };
        })
        .catch((error) => {
            console.error('Error accessing the camera:', error);
            cameraContainer.textContent = 'Unable to access the camera.';
        });
}

// Load Face API models
async function loadModels() {
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
        await faceapi.nets.faceExpressionNet.loadFromUri('./models');
        await faceapi.nets.ageGenderNet.loadFromUri('./models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
        console.log('Models loaded successfully');
    } catch (error) {
        console.error('Error loading Face API models:', error);
    }
}

// Start emotion detection
async function startEmotionDetection() {
    const video = document.getElementById('camera-feed');

    video.addEventListener('loadeddata', async () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.getElementById('camera-container').appendChild(canvas);
        console.log('Canvas created and appended.');

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const detectFaces = async () => {
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                console.warn('Video dimensions are not ready yet. Retrying...');
                setTimeout(detectFaces, 100); // Retry after 100ms
                return;
            }

            try {
                const detections = await faceapi
                    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 }))
                    .withFaceLandmarks()
                    .withFaceExpressions()
                    .withAgeAndGender();

                // Clear and resize canvas
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);

                // Mirror the canvas horizontally
                context.save(); // Save the current state
                context.scale(-1, 1); // Flip horizontally
                context.translate(-canvas.width, 0); // Adjust the origin

                const resizedDetections = faceapi.resizeResults(detections, displaySize);

                // Draw face outlines and landmarks
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

                // Restore the original state to draw readable text
                context.restore();

                // Draw confidence scores (numbers) in a readable way
                resizedDetections.forEach((detection) => {
                    const box = detection.detection.box;
                    const score = (detection.detection.score * 100).toFixed(2); // Convert to percentage

                    // Draw only the percentage number
                    context.font = '16px Arial';
                    context.fillStyle = 'blue';
                    context.fillText(`${score}%`, box.x + box.width - 50, box.y - 10); // Adjust position as needed
                });

                if (detections.length > 0) {
                    console.log('Face detected with landmarks.');

                    // Update age and gender
                    const age = detections[0].age;
                    const gender = detections[0].gender;
                    document.getElementById('age-display').textContent = `Age: ${Math.round(age)}`;
                    document.getElementById('gender-display').textContent = `Gender: ${gender}`;

                    // Update emotion bars
                    const expressions = detections[0].expressions;
                    const amplifiedExpressions = amplifyExpressions(expressions);
                    console.log('Amplified Expressions:', amplifiedExpressions);
                    updateEmotionBars(amplifiedExpressions);
                } else {
                    console.warn('No face detected.');
                }
            } catch (error) {
                console.error('Error during face detection:', error);
            }

            requestAnimationFrame(detectFaces); // Keep detecting in a loop
        };

        detectFaces();
    });
}

// Normalize and amplify emotion values
function amplifyExpressions(expressions) {
    const total = Object.values(expressions).reduce((sum, value) => sum + value, 0);
    const amplified = {};
    const scaleFactor = 100; // Amplify the values for better visibility

    for (const emotion in expressions) {
        amplified[emotion] = ((expressions[emotion] / total) || 0) * scaleFactor; // Avoid division by zero
    }
    return amplified;
}

// Update emotion bars dynamically
function updateEmotionBars(expressions) {
    const emotionMap = {
        neutral: 'neutral',
        happy: 'happiness',
        sad: 'sadness',
        fearful: 'fear',
        angry: 'anger',
        surprised: 'surprise',
        disgusted: 'disgust',
    };

    Object.entries(emotionMap).forEach(([apiEmotion, uiEmotion]) => {
        const barFill = document.getElementById(`${uiEmotion}-bar`).querySelector('.bar-fill');
        const percentage = document.getElementById(`${uiEmotion}-percentage`);

        let value = expressions && expressions[apiEmotion] ? Math.round(expressions[apiEmotion]) : 0;
        value = Math.min(value, 100);

        barFill.style.width = `${value}%`;
        percentage.textContent = `${value}%`;
    });
}

// Initialize the application
loadModels().then(() => {
    console.log('Models loaded successfully, starting the camera...');
    startCamera();
    startEmotionDetection();
});