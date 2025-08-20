import { useEffect, useState } from "react";
import init, { greet } from "hello-wasm";
function App() {
	const [webassemblyReady, setWebAssemblyReady] = useState(false);

	useEffect(() => {
		init().then(() => {
			setWebAssemblyReady(true);
		});
	}, []);

	return (
		<>
			<div>
				<h1>hello world</h1>
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
			</div>
		</>
	);
}

export default App;
