import { FREEHOST_API_KEY } from "./src/constants";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Read the raw request body into a Buffer
        const buffer = await new Promise((resolve, reject) => {
            const chunks = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', () => resolve(Buffer.concat(chunks)));
            req.on('error', reject);
        });

        const file = new File([buffer], 'upload.png', { type: 'image/png' });

        const formData = new FormData();
        formData.append('key', FREEHOST_API_KEY);
        formData.append('action', 'upload');
        formData.append('source', file); // Sending the actual file object
        formData.append('format', 'json');

        // 4. Forward to FreeImage.host
        const response = await fetch('https://freeimage.host/api/1/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        // 5. Respond to frontend
        if (response.ok) {
            res.status(200).json(data);
        } else {
            res.status(response.status).json(data);
        }

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}