export const fileToBase64 = (file: File): Promise<string> => {
    // debugger;
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export const base64ToFile = (base64: string, fileName: string): File => {
    const bufferData = Buffer.from(base64, 'base64');
    return new File([bufferData], fileName, { type: 'application/pdf' });
}