
import React from 'react';
import type { ProcessingStage } from '../types';
import { Spinner } from './Spinner';
import { CheckIcon } from './icons/CheckIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface ProcessingStepsProps {
  stage: ProcessingStage | null;
  originalImage: string | null;
}

const steps: { id: ProcessingStage; name: string }[] = [
  { id: 'detecting', name: 'Detecting Face' },
  { id: 'generating', name: 'Generating Photo' },
  { id: 'validating', name: 'Validating Compliance' },
  { id: 'done', name: 'Done' },
];

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ stage, originalImage }) => {
  const currentStepIndex = stage ? steps.findIndex(s => s.id === stage) : -1;

  return (
    <div className="w-full flex flex-col items-center">
      {originalImage && (
        <img
          src={originalImage}
          alt="Original upload"
          className="w-48 h-48 object-cover rounded-lg shadow-md mb-8 border-4 border-white"
        />
      )}
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative pr-8 sm:pr-20 last:pr-0">
              {stepIdx < steps.length - 1 ? (
                <div className="absolute inset-0 top-4 left-4 -ml-px mt-0.5 h-0.5 w-full bg-gray-300" aria-hidden="true" />
              ) : null}

              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-gray-300">
                {stepIdx < currentStepIndex && <CheckIcon className="h-5 w-5 text-indigo-600" />}
                {stepIdx === currentStepIndex && <Spinner />}
              </div>
              <span className="block mt-2 text-sm font-medium text-gray-700 text-center">{step.name}</span>
            </li>
          ))}
        </ol>
      </nav>
      <p className="mt-8 text-slate-600 animate-pulse">
        AI is working its magic... Please wait a moment.
      </p>
    </div>
  );
};
