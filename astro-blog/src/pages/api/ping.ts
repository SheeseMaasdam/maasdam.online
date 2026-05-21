import type { APIRoute } from 'astro';
import { createConnection } from 'net';

export const GET: APIRoute = async ({ url }) => {
	const ip = url.searchParams.get('ip');
	const port = url.searchParams.get('port');

	if (!ip || !port) {
		return new Response(
			JSON.stringify({ error: 'Missing ip or port parameter' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	const portNum = parseInt(port, 10);
	if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
		return new Response(
			JSON.stringify({ error: 'Invalid port number' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	return new Promise((resolve) => {
		const socket = createConnection(
			{
				host: ip,
				port: portNum,
				timeout: 30000
			},
			() => {
				socket.destroy();
				resolve(
					new Response(
						JSON.stringify({ status: 'online', ip, port: portNum }),
						{ status: 200, headers: { 'Content-Type': 'application/json' } }
					)
				);
			}
		);

		socket.on('error', () => {
			socket.destroy();
			resolve(
				new Response(
					JSON.stringify({ status: 'offline', ip, port: portNum }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			);
		});

		socket.on('timeout', () => {
			socket.destroy();
			resolve(
				new Response(
					JSON.stringify({ status: 'offline', ip, port: portNum }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			);
		});
	});
};
