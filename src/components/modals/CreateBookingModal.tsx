import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FclBookingForm } from '../forms/FclBookingForm';
import { LclBookingForm } from '../forms/LclBookingForm';
import { Box, Boxes, X } from 'lucide-react';

export const CreateBookingModal: React.FC = () => {
  const { isNewBookingOpen, setIsNewBookingOpen } = useApp();
  const [bookingMode, setBookingMode] = useState<'FCL' | 'LCL'>('FCL');

  if (!isNewBookingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="max-w-6xl w-full my-auto shadow-2xl rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Mode Selector Bar */}
        <div className="p-3 sm:p-4 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
              Booking Type:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-neutral-200/80 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => setBookingMode('FCL')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  bookingMode === 'FCL'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>FCL Master Booking</span>
              </button>

              <button
                type="button"
                onClick={() => setBookingMode('LCL')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  bookingMode === 'LCL'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>LCL Groupage / CFS</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNewBookingOpen(false)}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer self-end sm:self-auto"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container */}
        <div className="overflow-y-auto flex-1">
          {bookingMode === 'FCL' ? (
            <FclBookingForm
              onClose={() => setIsNewBookingOpen(false)}
              onBookingCreated={() => setIsNewBookingOpen(false)}
            />
          ) : (
            <LclBookingForm
              onClose={() => setIsNewBookingOpen(false)}
              onBookingCreated={() => setIsNewBookingOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
