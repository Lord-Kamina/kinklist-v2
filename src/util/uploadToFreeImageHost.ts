export const uploadImageToFreeImageHost = async (canvas: HTMLCanvasElement, clientId: string): Promise<string> => {
    const formdata = new FormData();
    formdata.append('source', canvas.toDataURL().split(',')[1]);
    formdata.append('action', 'upload');
    formdata.append('format', 'txt');
    formdata.append('key', clientId);
    const response = await fetch(`https://freeimage.host/api/1/upload`, {
        method: 'POST',
        body: formdata
    });
    const json = await response.json();
    if (!response.ok) {
        if (json.data.error) throw json.data.error;
        console.error({ response, json });
        throw new Error('FreeImageHost response: Not OK');
    }
    return json.data.id;
}