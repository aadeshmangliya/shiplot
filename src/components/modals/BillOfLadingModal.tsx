import React, { useRef } from 'react';
import { Shipment } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';

interface Props {
  shipment: Shipment;
  onClose: () => void;
}

export const BillOfLadingModal: React.FC<Props> = ({ shipment, onClose }) => {
  const { currentCompany } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-4xl w-full my-auto shadow-2xl flex flex-col max-h-[95vh]">
        {/* Modal Top Control Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-100 dark:bg-neutral-800/80 rounded-t-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-mono">
              FMC Ocean Bill of Lading — {shipment.shipmentNo}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
              ORIGINAL VERIFIED
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 text-xs font-mono font-medium shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printRef} className="p-6 overflow-y-auto flex-1 bg-white text-neutral-900 text-xs font-mono">
          <div className="border-2 border-neutral-900 p-4 space-y-4">
            {/* Header NVOCC Info */}
            <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-3">
              <div>
                <h1 className="text-xl font-bold tracking-tight uppercase">
                  {currentCompany.name}
                </h1>
                <p className="text-[11px] text-neutral-600 font-sans mt-0.5">
                  LICENSED OCEAN TRANSPORTATION INTERMEDIARY · FMC NO: {currentCompany.registrationNo}
                </p>
                <p className="text-[11px] text-neutral-600 font-sans">
                  Corporate HQ: {currentCompany.hqCity}, {currentCompany.country} · EDI: INTTRA/CARGOWISE
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg text-blue-900">
                  NEGOTIABLE FIATA BILL OF LADING
                </span>
                <div className="mt-1 font-bold text-sm bg-neutral-100 p-1.5 border border-neutral-900">
                  B/L NO: HBL-{shipment.shipmentNo.replace('SHP-', '')}
                </div>
              </div>
            </div>

            {/* Shipper & Consignee boxes */}
            <div className="grid grid-cols-2 gap-4 border-b-2 border-neutral-900 pb-3">
              <div className="border border-neutral-800 p-2 min-h-[90px]">
                <div className="text-[10px] font-bold uppercase text-neutral-500">Shipper / Exporter:</div>
                <div className="font-semibold text-[11px] mt-1">{shipment.shipper}</div>
                <div className="text-[10px] text-neutral-600 mt-0.5">Booking Ref: {shipment.bookingNo}</div>
              </div>
              <div className="border border-neutral-800 p-2 min-h-[90px]">
                <div className="text-[10px] font-bold uppercase text-neutral-500">Consignee (or Order of):</div>
                <div className="font-semibold text-[11px] mt-1">{shipment.consignee}</div>
                <div className="text-[10px] text-neutral-600 mt-0.5">To Order of Shipper / Notify Party</div>
              </div>
            </div>

            {/* Ocean Vessel & Routing */}
            <div className="grid grid-cols-4 gap-2 border-b-2 border-neutral-900 pb-3 text-[11px]">
              <div className="border border-neutral-800 p-1.5">
                <div className="text-[9px] uppercase font-bold text-neutral-500">Ocean Vessel:</div>
                <div className="font-bold uppercase mt-0.5">{shipment.vesselName}</div>
              </div>
              <div className="border border-neutral-800 p-1.5">
                <div className="text-[9px] uppercase font-bold text-neutral-500">Voyage No:</div>
                <div className="font-bold uppercase mt-0.5">{shipment.voyageNo}</div>
              </div>
              <div className="border border-neutral-800 p-1.5">
                <div className="text-[9px] uppercase font-bold text-neutral-500">Port of Loading:</div>
                <div className="font-bold mt-0.5">{shipment.pol} ({shipment.polCode})</div>
              </div>
              <div className="border border-neutral-800 p-1.5">
                <div className="text-[9px] uppercase font-bold text-neutral-500">Port of Discharge:</div>
                <div className="font-bold mt-0.5">{shipment.pod} ({shipment.podCode})</div>
              </div>
            </div>

            {/* Cargo Particulars Table */}
            <div className="border border-neutral-900">
              <div className="grid grid-cols-12 bg-neutral-100 font-bold border-b border-neutral-900 p-1.5 text-[10px] uppercase">
                <div className="col-span-3">Container Nos / Seals</div>
                <div className="col-span-2">No. of Pkgs</div>
                <div className="col-span-4">Description of Goods</div>
                <div className="col-span-2 text-right">Gross Weight</div>
                <div className="col-span-1 text-right">Measurement</div>
              </div>

              <div className="grid grid-cols-12 p-3 text-[11px] min-h-[140px] items-start">
                <div className="col-span-3 space-y-1">
                  <div className="font-bold">MSKU8819024 / 40HC</div>
                  <div className="text-neutral-600">Seal: SL-992140</div>
                  <div className="text-[10px] text-neutral-500">FCL/FCL Shipper Load & Count</div>
                </div>
                <div className="col-span-2">
                  <div className="font-bold">48 PALLETS</div>
                  <div className="text-[10px] text-neutral-500">STC High Tech Units</div>
                </div>
                <div className="col-span-4 space-y-1">
                  <div className="font-semibold">SAID TO CONTAIN:</div>
                  <p className="text-[10px] text-neutral-700 leading-relaxed">
                    Commercial electronic components, integrated micro-controllers, assembled server modules. Clean on board. Temperature controlled dry box.
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <div className="font-bold">{shipment.weightKg.toLocaleString()} KGS</div>
                  <div className="text-[10px] text-neutral-500">VGM: {(shipment.weightKg + 3820).toLocaleString()} KGS</div>
                </div>
                <div className="col-span-1 text-right font-bold">
                  {shipment.cbmVolume ? `${shipment.cbmVolume} CBM` : '67.3 CBM'}
                </div>
              </div>
            </div>

            {/* Terms and Signatures */}
            <div className="grid grid-cols-3 gap-4 pt-2 text-[10px]">
              <div className="border border-neutral-800 p-2">
                <div className="font-bold uppercase text-neutral-500">Freight & Charges:</div>
                <div className="font-bold text-sm mt-1 text-neutral-900">
                  {shipment.direction === 'Export' ? 'FREIGHT PREPAID' : 'FREIGHT COLLECT'}
                </div>
                <div className="text-neutral-500 mt-0.5">Payable at origin by Shipper</div>
              </div>
              <div className="border border-neutral-800 p-2">
                <div className="font-bold uppercase text-neutral-500">Number of Original B/Ls:</div>
                <div className="font-bold text-sm mt-1">THREE (3 / THREE)</div>
                <div className="text-neutral-500 mt-0.5">One accomplished, others stand void</div>
              </div>
              <div className="border border-neutral-800 p-2 flex flex-col justify-between">
                <div>
                  <div className="font-bold uppercase text-neutral-500">Signed as Carrier:</div>
                  <div className="font-serif italic text-neutral-700 mt-1">Shiplot Ocean Services Ltd.</div>
                </div>
                <div className="border-t border-neutral-400 pt-1 text-[9px] text-neutral-500">
                  For and on behalf of the Master
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
