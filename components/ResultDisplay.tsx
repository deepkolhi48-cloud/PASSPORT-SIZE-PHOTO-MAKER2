import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
  originalImage: string;
  generatedImage: string;
  validationResult: string;
  onReset: () => void;
}

// A simple markdown-to-html converter for the validation result
const formatValidationResult = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    if (line.startsWith('* ') || line.startsWith('- ')) {
      return (
        <li key={index} className="flex items-start">
          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>{line.substring(2)}</span>
        </li>
      );
    }
    if (index === 0) {
      return <p key={index} className="font-semibold text-slate-700 mb-2">{line}</p>;
    }
    return <p key={index}>{line}</p>;
  }).reduce((acc, elem) => {
    if (elem.type === 'li' && (acc.length === 0 || acc[acc.length - 1].type !== 'ul')) {
      return [...acc, <ul key={`ul-${acc.length}`} className="space-y-2 list-inside">{elem}</ul>];
    }
    if (elem.type === 'li') {
      // FIX: Cast lastElement to a type that includes `children`.
      // The logic of the reducer ensures that `lastElement` is a `<ul>` element, so this cast is safe.
      // This resolves the TypeScript errors on the following lines.
      const lastElement = acc[acc.length - 1] as React.ReactElement<React.PropsWithChildren<{}>>;
      // FIX: Use React.Children.toArray to safely handle single or multiple children.
      const newChildren = [...React.Children.toArray(lastElement.props.children), elem];
      const newUl = React.cloneElement(lastElement, { children: newChildren });
      return [...acc.slice(0, -1), newUl];
    }
    return [...acc, elem];
    // FIX: Changed JSX.Element to React.ReactElement to resolve namespace issue.
  }, [] as React.ReactElement[]);
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  originalImage,
  generatedImage,
  validationResult,
  onReset,
}) => {
  const getFileExtension = (dataUrl: string) => {
    if (!dataUrl || !dataUrl.includes(';')) return 'png';
    const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
    return mimeType.split('/')[1] || 'png';
  }
  const downloadFilename = `passport_photo.${getFileExtension(generatedImage)}`;

  return (
    <div className="w-full animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Images */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-center font-semibold text-slate-600 mb-2">Original</h3>
            <img src={originalImage} alt="Original" className="rounded-lg shadow-md w-full" />
          </div>
          <div>
            <h3 className="text-center font-semibold text-slate-600 mb-2">Generated Passport Photo</h3>
            <img src={generatedImage} alt="Generated Passport" className="rounded-lg shadow-md w-full" />
          </div>
        </div>
        {/* Validation */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">AI Validation Check</h3>
          <div className="text-slate-600 space-y-2">
            {formatValidationResult(validationResult)}
          </div>
        </div>
      </div>
      <div className="mt-10 text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onReset}
              className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 w-full sm:w-auto"
            >
              Create Another Photo
            </button>
            <a
              href={generatedImage}
              download={downloadFilename}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-200 w-full sm:w-auto"
            >
              <DownloadIcon className="h-5 w-5" />
              <span>Download Photo</span>
            </a>
        </div>
      </div>
    </div>
  );
};