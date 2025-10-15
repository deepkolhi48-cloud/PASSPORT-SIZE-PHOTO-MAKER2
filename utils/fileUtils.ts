
export const fileToBase64 = (file: File): Promise<{ base64: string; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // The result is 'data:image/jpeg;base64,LzlqLzRBQ...'. We only want the part after the comma.
      const base64 = dataUrl.split(',')[1];
      resolve({ base64, dataUrl });
    };
    reader.onerror = (error) => reject(error);
  });
};
