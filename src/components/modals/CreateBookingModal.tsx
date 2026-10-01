import React from 'react';
import { useApp } from '../../context/AppContext';
import { OceanBookingInlineForm } from '../forms/OceanBookingInlineForm';

export const CreateBookingModal: React.FC = () => {
  const { isNewBookingOpen, setIsNewBookingOpen } = useApp();

  if (!isNewBookingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="max-w-5xl w-full my-auto shadow-2xl">
        <OceanBookingInlineForm
          mode="FCL"
          onClose={() => setIsNewBookingOpen(false)}
        />
      </div>
    </div>
  );
};
