import { useEffect, useRef, useState } from "react";
import init, { greet, get_arr_length, convert_to_grayscale } from "hello-wasm";

function drawGradient(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const canvas = canvasRef.current;
	const ctx = canvas?.getContext("2d");
	if (canvas && ctx) {
		// Create a linear gradient (left to right)
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

		// Define gradient stops (you can add more as needed)
		gradient.addColorStop(0, "red");
		gradient.addColorStop(0.17, "yellow");
		gradient.addColorStop(0.33, "green");
		gradient.addColorStop(0.5, "cyan");
		gradient.addColorStop(0.67, "blue");
		gradient.addColorStop(0.83, "magenta");
		gradient.addColorStop(1, "red");

		// Apply the gradient to fill the canvas
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
}

function getImageData(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const canvas = canvasRef.current;
	const ctx = canvas?.getContext("2d");
	if (canvas && ctx) {
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		return imageData;
	}
	return null;
}

function convertImageDataToGrayscale(imageData: ImageData) {
	const data = new Uint8ClampedArray(imageData.data.length);
	for (let i = 0; i < imageData.data.length; i += 4) {
		const r = imageData.data[i];
		const g = imageData.data[i + 1];
		const b = imageData.data[i + 2];
		// Calculate the grayscale value using the luminosity method
		const gray = 0.3 * r + 0.59 * g + 0.11 * b;
		data[i] = gray; // Red
		data[i + 1] = gray; // Green
		data[i + 2] = gray; // Blue
		// Alpha remains unchanged
		data[i + 3] = imageData.data[i + 3];
	}
	return new ImageData(data, imageData.width, imageData.height);
}

function App() {
	const [webassemblyReady, setWebAssemblyReady] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const grayscaleCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const jsGrayscaleCanvasRef = useRef<HTMLCanvasElement | null>(null);

	const canvasSize = {
		// width: 20000,
		// height: 20000,
		width: 3000,
		height: 3000,
		// width: 600,
		// height: 600,
	};

	const [imageData, setImageData] = useState<ImageData | null>(null);

	useEffect(() => {
		init().then(() => {
			drawGradient(canvasRef);
			setWebAssemblyReady(true);
			setImageData(getImageData(canvasRef));
		});
	}, []);

	useEffect(() => {
		if (webassemblyReady && imageData) {
			// do it
			// convert the image to grayscale

			Promise.all(
				[
					async () => {
						console.log("start js conversion");
						console.time("js conversion");
						const jsImageData = convertImageDataToGrayscale(imageData);
						const jsGrayscaleCanvas = jsGrayscaleCanvasRef.current;
						const jsCtx = jsGrayscaleCanvas?.getContext("2d");
						jsCtx?.putImageData(jsImageData, 0, 0);
						console.log("end js conversion");
						console.timeEnd("js conversion");
					},
					async () => {
						const imageDataArray = new Uint8Array(imageData.data);
						console.log("start wasm conversion");
						console.time("wasm conversion");
						const grayscaleData = convert_to_grayscale(imageDataArray);
						console.timeEnd("wasm conversion");
						const grayscaleImageData = new ImageData(
							new Uint8ClampedArray(grayscaleData),
							imageData.width,
							imageData.height,
						);
						grayscaleCanvasRef.current
							?.getContext("2d")
							?.putImageData(grayscaleImageData, 0, 0);

						console.log("end wasm conversion");
						// console.timeEnd("wasm conversion");
					},
				].map((fn) => fn()),
			).then(() => console.log("hi"));
		}
	}, [webassemblyReady, imageData]);

	return (
		<>
			<div className="page">
				<h1>hello</h1>
				<div className="button-container">
					<button
						disabled={!webassemblyReady}
						onClick={() => {
							if (webassemblyReady) {
								greet("hello from wasm");
							}
						}}
					>
						Greet me
					</button>
					<button
						disabled={!webassemblyReady}
						onClick={() => {
							if (webassemblyReady) {
								const arr = new Float32Array([1, 2, 3]);
								const length = get_arr_length(arr);
								alert(`Array length: ${length}`);
							}
						}}
					>
						Get array length
					</button>
				</div>
				<div className="canvas-container">
					<canvas
						id="img"
						ref={canvasRef}
						width={canvasSize.width}
						height={canvasSize.height}
					/>
					<canvas
						id="img-grayscale"
						ref={grayscaleCanvasRef}
						width={canvasSize.width}
						height={canvasSize.height}
					/>
					<canvas
						id="js-grayscale"
						ref={jsGrayscaleCanvasRef}
						width={canvasSize.width}
						height={canvasSize.height}
					/>
				</div>
			</div>
		</>
	);
}

export default App;
