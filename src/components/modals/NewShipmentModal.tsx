import React, { useState } from 'react';
import { ShipmentItem, ShipmentType, DirectionType } from '../../types/shipping';
import { X, Box, Container, Ship, MapPin, Calendar, FileText, ArrowRight } from 'lucide-react';

interface NewShipmentModalProps {
  onClose: () => void;
  onSubmit: (shipment: ShipmentItem) => void;
}

export const NewShipmentModal: React.FC<NewShipmentModalProps> = ({ onClose, onSubmit }) => {
  const [type, setType] = useState<ShipmentType>('FCL');
  const [direction, setDirection] = useState<DirectionType>('Export');
  const [shipper, setShipper] = useState('');
  const [consignee, setConsignee] = useState('');
  const [pol, setPol] = useState('Port of Los Angeles (USLAX)');
  const [pod, setPod] = useState('Port of Shanghai (CNSHA)');
  const [carrier, setCarrier] = useState('Mediterranean Shipping Company (MSC)');
  const [vesselName, setVesselName] = useState('MSC Oscar');
  const [voyageNo, setVoyageNo] = useState('MS-2645W');
  const [containersCount, setContainersCount] = useState(1);
  const [cbmVolume, setCbmVolume] = useState(12.5);
  const [weightKg, setWeightKg] = useState(21400);
  const [etd, setEtd] = useState('2026-10-10');
  const [eta, setEta] = useState('2026-10-28');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipper || !consignee) return;

    const polMatch = pol.match(/\(([^)]+)\)/);
    const podMatch = pod.match(/\(([^)]+)\)/);
    const polCode = polMatch ? polMatch[1] : 'USLAX';
    const podCode = podMatch ? podMatch[1] : 'CNSHA';

    const newShipment: ShipmentItem = {
      id: `shp_${Date.now()}`,
      shipmentNo: `SHP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingNo: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      direction,
      shipper,
      consignee,
      pol: pol.split('(')[0].trim(),
      polCode,
      pod: pod.split('(')[0].trim(),
      podCode,
      carrier,
      vesselName,
      voyageNo,
      etd,
      eta,
      status: 'Booking Confirmed',
      containersCount: type === 'FCL' ? Number(containersCount) : 1,
      cbmVolume: type === 'LCL' ? Number(cbmVolume) : undefined,
      weightKg: Number(weightKg),
    };

    onSubmit(newShipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans">
              Create New Shipping Consignment
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              Direct Booking
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Freight Mode Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1.5 uppercase">
                Shipment Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('FCL')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded border font-mono font-bold transition-all ${
                    type === 'FCL'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Container className="w-3.5 h-3.5" />
                  <span>FCL (Full Box)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('LCL')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded border font-mono font-bold transition-all ${
                    type === 'LCL'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>LCL (Groupage)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1.5 uppercase">
                Trade Direction
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('Export')}
                  className={`py-2 px-3 rounded border font-mono font-bold transition-all ${
                    direction === 'Export'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  Outbound Export
                </button>

                <button
                  type="button"
                  onClick={() => setDirection('Import')}
                  className={`py-2 px-3 rounded border font-mono font-bold transition-all ${
                    direction === 'Import'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  Inbound Import
                </button>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1">
                Shipper / Consignor (Company Name)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Electronics Manufacturing Co."
                value={shipper}
                onChange={(e) => setShipper(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1">
                Consignee / Importer (Company Name)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Global Tech Distributors Inc."
                value={consignee}
                onChange={(e) => setConsignee(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          {/* Ports & Routing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1">
                Port of Loading (POL)
              </label>
              <select
                value={pol}
                onChange={(e) => setPol(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none font-mono"
              >
                <option value="Port of Los Angeles (USLAX)">Port of Los Angeles (USLAX)</option>
                <option value="Port of Long Beach (USLGB)">Port of Long Beach (USLGB)</option>
                <option value="Port of Shanghai (CNSHA)">Port of Shanghai (CNSHA)</option>
                <option value="Port of Singapore (SGSIN)">Port of Singapore (SGSIN)</option>
                <option value="Port of Rotterdam (NLRTM)">Port of Rotterdam (NLRTM)</option>
                <option value="Port of Hamburg (DEHAM)">Port of Hamburg (DEHAM)</option>
                <option value="Port of Tokyo (JPTYO)">Port of Tokyo (JPTYO)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1">
                Port of Discharge (POD)
              </label>
              <select
                value={pod}
                onChange={(e) => setPod(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none font-mono"
              >
                <option value="Port of Shanghai (CNSHA)">Port of Shanghai (CNSHA)</option>
                <option value="Port of Los Angeles (USLAX)">Port of Los Angeles (USLAX)</option>
                <option value="Port of Rotterdam (NLRTM)">Port of Rotterdam (NLRTM)</option>
                <option value="Port of Singapore (SGSIN)">Port of Singapore (SGSIN)</option>
                <option value="Port of Hamburg (DEHAM)">Port of Hamburg (DEHAM)</option>
                <option value="Port of Ningbo (CNNGB)">Port of Ningbo (CNNGB)</option>
              </select>
            </div>
          </div>

          {/* Carrier & Vessel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1">
                Ocean Carrier Line
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none"
              >
                <option value="Mediterranean Shipping Company (MSC)">MSC</option>
                <option value="Maersk Line">Maersk Line</option>
                <option value="CMA CGM Group">CMA CGM</option>
                <option value="Ocean Network Express (ONE)">ONE Line</option>
                <option value="Hapag-Lloyd">Hapag-Lloyd</option>
                <option value="Evergreen Marine">Evergreen</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1">
                Target Vessel
              </label>
              <input
                type="text"
                value={vesselName}
                onChange={(e) => setVesselName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1">
                Voyage Number
              </label>
              <input
                type="text"
                value={voyageNo}
                onChange={(e) => setVoyageNo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Volume and Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {type === 'FCL' ? (
              <div>
                <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1">
                  Container Count (Boxes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={containersCount}
                  onChange={(e) => setContainersCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none font-mono"
                />
              </div>
            ) : (
              <div>
                <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1">
                  Cargo Volume (CBM m³)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={cbmVolume}
                  onChange={(e) => setCbmVolume(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none font-mono"
                />
              </div>
            )}

            <div>
              <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1">
                Certified Gross Weight (Kg)
              </label>
              <input
                type="number"
                min="100"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold text-neutral-500 mb-1">
                Estimated Departure (ETD)
              </label>
              <input
                type="date"
                value={etd}
                onChange={(e) => setEtd(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 mt-6 rounded">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
            >
              Confirm & Book Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
