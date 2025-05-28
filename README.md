# ExpressAI

ExpressAI is a real-time facial expression recognition application that utilizes camera access to detect and display emotions such as happiness and sadness. The application visualizes these emotions through horizontal bars that fill and empty based on the intensity of the detected emotions.

## Live 

[ExpressAI - Emotion Detection](mksourabh.github.io/ExpressAI/)

## Features

- Real-time facial expression scanning
- Emotion visualization with synchronized percentage display
- User-friendly interface

## Project Structure

```
ExpressAI
├── src
│   ├── app.ts
│   ├── components
│   │   ├── Camera.ts
│   │   ├── EmotionBars.ts
│   │   └── index.ts
│   ├── services
│   │   ├── EmotionDetectionService.ts
│   │   └── index.ts
│   ├── utils
│   │   └── index.ts
│   └── types
│       └── index.ts
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ExpressAI.git
   ```
2. Navigate to the project directory:
   ```
   cd ExpressAI
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```
2. Open your web browser and navigate to `http://localhost:3000` (or the specified port).

3. Grant camera permissions when prompted to allow the application to access your camera.

4. Observe the real-time emotion detection and visualization.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## 👨‍💻 Creator

Made by [@MKSourabh](https://github.com/MKSourabh)  
📫 Email: [kireetisourabhmangalampally@gmail.com](mailto:kireetisourabhmangalampally@gmail.com)  
📸 Instagram: [@mk__sourabh](https://instagram.com/mk__sourabh)

## License

This project is licensed under the MIT License. See the LICENSE file for details.
