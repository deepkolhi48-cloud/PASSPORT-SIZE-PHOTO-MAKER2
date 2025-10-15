
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ProcessingSteps } from './components/ProcessingSteps';
import { ResultDisplay } from './components/ResultDisplay';
import { generatePassportPhoto, validatePassportPhoto } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { AppStep, ProcessingStage } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('upload');
  const [processingStage, setProcessingStage] = useState<ProcessingStage | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setError(null);
    setStep('processing');

    try {
      // 1. Convert file to base64 and show it
      const { base64, dataUrl } = await fileToBase64(file);
      setOriginalImage(dataUrl);

      // 2. Simulate Face Detection
      setProcessingStage('detecting');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Generate Passport Photo
      setProcessingStage('generating');
      const { base64: generatedBase64, mimeType: generatedMimeType } = await generatePassportPhoto(base64, file.type);
      const generatedUrl = `data:${generatedMimeType};base64,${generatedBase64}`;
      setGeneratedImage(generatedUrl);

      // 4. Validate Generated Photo
      setProcessingStage('validating');
      const validationText = await validatePassportPhoto(generatedBase64, generatedMimeType);
      setValidationResult(validationText);

      // 5. Show results
      setProcessingStage('done');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('result');

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Generation failed: ${errorMessage}`);
      setStep('upload'); // Go back to upload step on error
    } finally {
      setProcessingStage(null);
    }
  }, []);

  const handleReset = useCallback(() => {
    setStep('upload');
    setProcessingStage(null);
    setOriginalImage(null);
    setGeneratedImage(null);
    setValidationResult(null);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (step) {
      case 'upload':
        return <ImageUploader onImageUpload={handleImageUpload} error={error} />;
      case 'processing':
        return <ProcessingSteps stage={processingStage} originalImage={originalImage} />;
      case 'result':
        return (
          <ResultDisplay
            originalImage={originalImage!}
            generatedImage={generatedImage!}
            validationResult={validationResult!}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
            AI Passport Photo Generator
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Upload a clear photo of your face, and let our AI create a professional, compliant passport photo for you in seconds.
          </p>
        </header>
        <main className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 transition-all duration-300 min-h-[400px] flex items-center justify-center">
          {renderContent()}
        </main>
        <footer className="text-center mt-8 text-slate-500">
          <p>Powered by React, Tailwind CSS, and Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
