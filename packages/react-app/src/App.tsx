import { useEffect, useRef, useState } from "react";
import init, { greet, get_arr_length } from "hello-wasm";

function App() {
	const [webassemblyReady, setWebAssemblyReady] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		init().then(() => {
			setWebAssemblyReady(true);
		});
	}, []);

	return (
		<>
			<div>
				<h1>hello</h1>
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
				<canvas ref={canvasRef} width={600} height={600} />
			</div>
		</>
	);
}

export default App;
