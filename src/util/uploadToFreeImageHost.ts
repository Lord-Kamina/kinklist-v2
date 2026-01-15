import { VERCEL_URL } from "@/constants";

export const uploadImageToFreeImageHost = async (canvas: HTMLCanvasElement): Promise<string> => {
    const blob = await new Promise<Blob | null>((resolve) => 
        canvas.toBlob(resolve, 'image/png')
    );
    if (!blob) throw new Error('Failed to convert canvas to blob');
    const response = await fetch(`${VERCEL_URL}/api/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream', 
        },
        body: blob, 
    });

    const json = await response.json();

    if (!response.ok || json.status_code !== 200) {
        throw new Error(json.error?.message || 'Upload failed');
    }

    return json.image.id_encoded;
};