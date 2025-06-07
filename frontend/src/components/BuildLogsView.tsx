import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

interface LogMessage {
	id: number;
	text: string;
}

const SOCKET_URL = "http://localhost:9001";

const shimmerStyle: React.CSSProperties = {
	height: 20,
	width: "100%",
	background: "linear-gradient(90deg, #222 25%, #444 50%, #222 75%)",
	backgroundSize: "200% 100%",
	animation: "shimmer 1.5s infinite",
	marginTop: 8,
};

const BuildLogsView: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();

	const [logs, setLogs] = useState<LogMessage[]>([]);
	const [isBuilding, setIsBuilding] = useState(true);

	const logsEndRef = useRef<HTMLDivElement>(null);
	const messageId = useRef<number>(0);
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		const socket = io(SOCKET_URL, { transports: ["websocket"] });
		socketRef.current = socket;

		socket.on("connect", () => {
			console.log("[✅] Connected to server via socket:", socket.id);
			socket.emit("subscribe", `logs:${slug}`);
		});

		socket.on("message", (data: string) => {
      let logMessage = data;
			try {
				const parsed = JSON.parse(data);
				if (parsed.log) {
					logMessage = parsed.log;
				}
			} catch(err) {
				console.log("Parse Error : ", err);
			}


			if (logMessage.trim().toLowerCase() === "done...") {
				setIsBuilding(false);
				setTimeout(() => {
					navigate("/project");
				}, 1500);
			} else {
				setLogs((prev) => [...prev, { id: messageId.current++, text: data }]);
			}
		});

		socket.on("disconnect", () => {
			console.log("[❌] Disconnected from server");
			navigate("/");
		});

		return () => {
			socket.disconnect();
		};
	}, [slug, navigate]);

	useEffect(() => {
		logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [logs]);

	return (
		<>
			<style>
				{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
			</style>

			<div className="flex flex-col h-screen p-4 bg-gray-900">
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-white text-2xl font-semibold">
						🛠️ Build Logs for <span className="text-yellow-400">{slug}</span>
					</h2>
					<button disabled className={`px-4 py-2 rounded ${isBuilding ? "bg-blue-600" : "bg-green-600"} text-white cursor-default select-none`}>
						{isBuilding ? "Building..." : "Finished"}
					</button>
				</div>

				<div className="flex-1 overflow-y-auto bg-black border border-gray-700 rounded-md p-4 font-mono text-green-400 whitespace-pre-wrap" style={{ minHeight: 300 }}>
					{logs.map((log) => (
						<div key={log.id}>{log.text}</div>
					))}

					{isBuilding && <div style={shimmerStyle} />}
					<div ref={logsEndRef} />
				</div>
			</div>
		</>
	);
};

export default BuildLogsView;
