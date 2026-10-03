import {
  ImportGeneralManifest,
  ExportGeneralManifest,
  DeliveryOrder,
  ShippingInstruction,
  ExportStuffingPlan,
  PortCall,
  LedgerEntry,
  DisbursementAccount,
  DebitCreditNote,
  RoleItem
} from '../types';

// ============================================
// 1. IGM (IMPORT GENERAL MANIFEST) RECORDS
// ============================================
export const initialIgms: ImportGeneralManifest[] = [
  {
    id: 'igm_01',
    igmNumber: 'IGM-2026-KPT-0418',
    vesselName: 'MSC Oscar',
    imoNumber: '9703291',
    voyageNumber: 'MS-2640W',
    callSign: '3FDA9',
    shippingLine: 'Mediterranean Shipping Company (MSC)',
    portOfArrival: 'Karachi Port (KPT - East Wharf)',
    portCode: 'PKKHI',
    terminalName: 'Karachi International Container Terminal (KICT)',
    etaDate: '2026-10-08',
    filingDate: '2026-10-02',
    totalBls: 14,
    totalContainers: 38,
    totalGrossWeightKg: 812400,
    customsStation: 'Collectorate of Customs Appraisement (East), KPT',
    webocFilingStatus: 'Approved',
    blItems: [
      {
        blNumber: 'HBL-2026-8821',
        lineNo: 1,
        subLineNo: 1,
        shipper: 'Pacific Precision Electronics Inc.',
        consignee: 'Indus Micro Distribution Ltd, Karachi',
        notifyParty: 'National Logistics Cell (NLC) Clearing',
        packagesCount: 1200,
        packageType: 'Cartons / Pallets',
        cargoDesc: 'Integrated circuit components and telecommunication controllers in seaworthy packaging',
        grossWeightKg: 21450,
        cbmVolume: 48.5,
        containers: ['MSKU7829103', 'MSKU9182301'],
        marksAndNumbers: 'PPE/KHI/01-48'
      },
      {
        blNumber: 'HBL-2026-8835',
        lineNo: 1,
        subLineNo: 2,
        shipper: 'Rhine Valley Precision Engineering GmbH',
        consignee: 'Pak-German Industrial Spares (Pvt) Ltd',
        notifyParty: 'Same as Consignee',
        packagesCount: 45,
        packageType: 'Wooden Crates',
        cargoDesc: 'Textile spinning turbine assemblies and planetary gear spares',
        grossWeightKg: 18400,
        cbmVolume: 32.0,
        containers: ['HLXU6629104'],
        marksAndNumbers: 'RVP/KHI/SP-109'
      },
      {
        blNumber: 'HBL-2026-8840',
        lineNo: 2,
        subLineNo: 1,
        shipper: 'Shanghai Trans-Pacific Chemicals Co.',
        consignee: 'Mehran Polymer & Synthetic Resins, Lahore',
        notifyParty: 'Allied Bank Trade Desk, Lahore',
        packagesCount: 880,
        packageType: 'Bags on Pallets',
        cargoDesc: 'Polypropylene plastic raw material copolymer grade PP-802',
        grossWeightKg: 22000,
        cbmVolume: 42.0,
        containers: ['TCLU8837192'],
        marksAndNumbers: 'STPC/LHR/880'
      }
    ]
  },
  {
    id: 'igm_02',
    igmNumber: 'IGM-2026-PQA-0912',
    vesselName: 'Maersk Mc-Kinney Moller',
    imoNumber: '9619907',
    voyageNumber: 'MK-1892E',
    callSign: 'OWJQ2',
    shippingLine: 'Maersk Line A/S',
    portOfArrival: 'Port Muhammad Bin Qasim (QICT)',
    portCode: 'PKBQM',
    terminalName: 'Qasim International Container Terminal (QICT Berth 5)',
    etaDate: '2026-10-12',
    filingDate: '2026-10-03',
    totalBls: 22,
    totalContainers: 54,
    totalGrossWeightKg: 1240500,
    customsStation: 'Collectorate of Customs Appraisement (Port Qasim)',
    webocFilingStatus: 'Submitted',
    blItems: [
      {
        blNumber: 'HBL-2026-9014',
        lineNo: 1,
        subLineNo: 1,
        shipper: 'Jiangsu Solar Materials Corp.',
        consignee: 'Fauji Green Power Generating Co. Ltd.',
        packagesCount: 650,
        packageType: 'Crates',
        cargoDesc: 'Photovoltaic bifacial solar panels and mounting racking structures',
        grossWeightKg: 24800,
        cbmVolume: 56.0,
        containers: ['MSKU9018274', 'MSKU9920183'],
        marksAndNumbers: 'JSM/QICT/PV-01'
      }
    ]
  },
  {
    id: 'igm_03',
    igmNumber: 'IGM-2026-USLAX-0311',
    vesselName: 'ONE Apus',
    imoNumber: '9806079',
    voyageNumber: 'OA-9901S',
    callSign: '7KLL',
    shippingLine: 'Ocean Network Express (ONE)',
    portOfArrival: 'Port of Los Angeles (Pier 400)',
    portCode: 'USLAX',
    terminalName: 'APM Terminals Pier 400',
    etaDate: '2026-10-15',
    filingDate: '2026-10-01',
    totalBls: 18,
    totalContainers: 46,
    totalGrossWeightKg: 940000,
    customsStation: 'U.S. Customs and Border Protection Port #2704',
    webocFilingStatus: 'Acknowledged',
    blItems: [
      {
        blNumber: 'HBL-2026-9102',
        lineNo: 1,
        subLineNo: 1,
        shipper: 'Lahore Quality Cotton Textiles (Pvt) Ltd',
        consignee: 'Pacific Coast Apparel Brands Inc., Los Angeles',
        packagesCount: 1400,
        packageType: 'Corrugated Cartons',
        cargoDesc: '100% Ring Spun Combed Cotton Terry Towels & Bed Linen',
        grossWeightKg: 20800,
        cbmVolume: 54.0,
        containers: ['ONEU4829102'],
        marksAndNumbers: 'LQCT/LAX/01-1400'
      }
    ]
  }
];

// ============================================
// 2. EGM (EXPORT GENERAL MANIFEST) RECORDS
// ============================================
export const initialEgms: ExportGeneralManifest[] = [
  {
    id: 'egm_01',
    egmNumber: 'EGM-2026-KPT-0199',
    vesselName: 'CMA CGM Antoine de Saint Exupery',
    imoNumber: '9776418',
    voyageNumber: 'CG-8820E',
    shippingLine: 'CMA CGM Line',
    portOfLoading: 'Karachi Port (KPT)',
    portCode: 'PKKHI',
    terminalName: 'South Asia Pakistan Terminals (SAPT Berth 3)',
    sailingDate: '2026-10-05',
    filingDate: '2026-10-03',
    totalBls: 16,
    totalContainers: 42,
    totalGrossWeightKg: 890400,
    customsStation: 'Customs Export Collectorate, Karachi',
    status: 'Sailing Clearance Issued',
    blItems: [
      {
        blNumber: 'EXP-BL-2026-0041',
        lineNo: 1,
        subLineNo: 1,
        shipper: 'Indus Valley Basmati Rice Mills Ltd, Karachi',
        consignee: 'Al-Jazeera General Trading LLC, Dubai, UAE',
        packagesCount: 2000,
        packageType: 'Jute Bags',
        cargoDesc: 'Super Kernel Basmati Rice Export Quality Double Polished',
        grossWeightKg: 50000,
        cbmVolume: 65.0,
        containers: ['CMAU1092831', 'MSKU8829104'],
        marksAndNumbers: 'IVR/DXB/2026'
      },
      {
        blNumber: 'EXP-BL-2026-0042',
        lineNo: 2,
        subLineNo: 1,
        shipper: 'Sialkot Master Surgical Instruments Co.',
        consignee: 'Bavarian Medical Implements GmbH, Hamburg',
        packagesCount: 320,
        packageType: 'Foam Lined Boxes',
        cargoDesc: 'Stainless steel medical surgical and dental instruments grade AISI 420',
        grossWeightKg: 8400,
        cbmVolume: 18.0,
        containers: ['HLXU9928172'],
        marksAndNumbers: 'SMS/HAM/MED-99'
      }
    ]
  },
  {
    id: 'egm_02',
    egmNumber: 'EGM-2026-PQA-0084',
    vesselName: 'MSC Oscar',
    imoNumber: '9703291',
    voyageNumber: 'MS-2641E',
    shippingLine: 'Mediterranean Shipping Company (MSC)',
    portOfLoading: 'Port Muhammad Bin Qasim (QICT)',
    portCode: 'PKBQM',
    terminalName: 'QICT Terminal 2',
    sailingDate: '2026-10-18',
    filingDate: '2026-10-02',
    totalBls: 12,
    totalContainers: 34,
    totalGrossWeightKg: 710200,
    customsStation: 'Customs Collectorate (Port Qasim Exports)',
    status: 'Filed',
    blItems: [
      {
        blNumber: 'EXP-BL-2026-0050',
        lineNo: 1,
        subLineNo: 1,
        shipper: 'Artistic Denim Mills Ltd, Karachi',
        consignee: 'Zara Inditex Supply Chain S.A., Valencia, Spain',
        packagesCount: 1600,
        packageType: 'Cartons on Pallets',
        cargoDesc: 'Woven Indigo Blue Denim Trousers and Casual Apparel',
        grossWeightKg: 24200,
        cbmVolume: 58.0,
        containers: ['MSKU2019284'],
        marksAndNumbers: 'ADM/VAL/441'
      }
    ]
  }
];

// ============================================
// 3. DELIVERY ORDERS (D.O.) - WPCARGO PARITY
// ============================================
export const initialDeliveryOrders: DeliveryOrder[] = [
  {
    id: 'do_01',
    doNumber: 'DO-2026-0891',
    issueDate: '2026-10-01',
    validityDate: '2026-10-08',
    vesselName: 'MSC Oscar',
    voyage: 'MS-2640W',
    virNumber: 'VIR-KPT-2026-441',
    mblNumber: 'MEDU77192841',
    hblNumber: 'HBL-2026-8821',
    destinationPort: 'Karachi Port (KPT)',
    igmNumber: 'IGM-2026-KPT-0418',
    igmLineNo: 1,
    igmSubLineNo: 1,
    issuedTo: 'Al-Hadi Customs Clearing & Forwarding Agency (Lic #2140)',
    consigneeName: 'Indus Micro Distribution Ltd',
    consigneeAddress: 'Suite 401, Business Avenue, P.E.C.H.S Block 6, Shahrah-e-Faisal, Karachi, Pakistan',
    notifyPartyName: 'National Logistics Cell (NLC) Clearing Desk',
    notifyPartyAddress: 'NLC Terminal, Mai Kolachi Road, Karachi, Pakistan',
    containers: [
      {
        containerNo: 'MSKU7829103',
        sizeType: '40HC',
        sealNo: 'SL-991204',
        emptyReturnLocation: 'Premier Container Yard (PCY), Hawke\'s Bay Road, Karachi',
        emptyReturnValidity: '2026-10-15',
        marksAndNumbers: 'PPE/KHI/01-24',
        packageCount: 600,
        packageType: 'Cartons',
        cargoDesc: 'Integrated circuit components and microcontrollers',
        grossWeightKg: 10725
      },
      {
        containerNo: 'MSKU9182301',
        sizeType: '40HC',
        sealNo: 'SL-109283',
        emptyReturnLocation: 'Premier Container Yard (PCY), Hawke\'s Bay Road, Karachi',
        emptyReturnValidity: '2026-10-15',
        marksAndNumbers: 'PPE/KHI/25-48',
        packageCount: 600,
        packageType: 'Cartons',
        cargoDesc: 'Telecommunication network server boards',
        grossWeightKg: 10725
      }
    ],
    lineRemarks: 'All ocean freight, THC, and delivery order documentation fees settled in full. Cargo released against surrendered Original Bill of Lading.',
    status: 'Issued',
    clearingAgent: 'Muhammad Usman (Lic #2140)'
  },
  {
    id: 'do_02',
    doNumber: 'DO-2026-0892',
    issueDate: '2026-10-02',
    validityDate: '2026-10-09',
    vesselName: 'Maersk Mc-Kinney Moller',
    voyage: 'MK-1892E',
    virNumber: 'VIR-PQA-2026-189',
    mblNumber: 'MAEU99201940',
    hblNumber: 'HBL-2026-9014',
    destinationPort: 'Port Muhammad Bin Qasim (QICT)',
    igmNumber: 'IGM-2026-PQA-0912',
    igmLineNo: 1,
    igmSubLineNo: 1,
    issuedTo: 'Trans-World Freight Forwarders (Pvt) Ltd',
    consigneeName: 'Fauji Green Power Generating Co. Ltd.',
    consigneeAddress: 'Fauji Tower, 68 Tipu Road, Rawalpindi / Port Qasim Site',
    notifyPartyName: 'Bank Alfalah Trade Finance Operations',
    notifyPartyAddress: 'I.I. Chundrigar Road, Karachi',
    containers: [
      {
        containerNo: 'MSKU9018274',
        sizeType: '20GP',
        sealNo: 'SL-771923',
        emptyReturnLocation: 'Maersk Depot Qasim, Eastern Industrial Zone, Port Qasim',
        emptyReturnValidity: '2026-10-16',
        marksAndNumbers: 'JSM/QICT/PV-01',
        packageCount: 325,
        packageType: 'Crates',
        cargoDesc: 'Photovoltaic bifacial solar panels',
        grossWeightKg: 12400
      },
      {
        containerNo: 'MSKU9920183',
        sizeType: '40GP',
        sealNo: 'SL-120938',
        emptyReturnLocation: 'Maersk Depot Qasim, Eastern Industrial Zone, Port Qasim',
        emptyReturnValidity: '2026-10-16',
        marksAndNumbers: 'JSM/QICT/PV-02',
        packageCount: 325,
        packageType: 'Crates',
        cargoDesc: 'Aluminum ground mounting racking assemblies',
        grossWeightKg: 12400
      }
    ],
    lineRemarks: 'Delivery Order valid for 7 calendar days. Demurrage free time expires on 2026-10-16. Detention thereafter billable at standard tariff USD 45/20ft and USD 80/40ft per day.',
    status: 'Issued',
    clearingAgent: 'Tariq Mehmood (CHAL Lic #1809)'
  }
];

// ============================================
// 4. SHIPPING INSTRUCTIONS (S/I) & EXPORT STUFFING
// ============================================
export const initialShippingInstructions: ShippingInstruction[] = [
  {
    id: 'si_01',
    siNumber: 'SI-2026-0491',
    bookingNo: 'BKG-5521',
    shipperName: 'Indus Valley Basmati Rice Mills Ltd, Karachi',
    consigneeName: 'Al-Jazeera General Trading LLC, Dubai, UAE',
    notifyPartyName: 'Mashreq Bank PJSC Trade Operations, Dubai',
    vesselName: 'CMA CGM Antoine de Saint Exupery',
    voyage: 'CG-8820E',
    pol: 'Karachi Port (KPT)',
    pod: 'Jebel Ali Port (AEJEA)',
    finalDestination: 'Dubai Logistics City, UAE',
    cargoDesc: 'Super Kernel Basmati Rice Export Quality, 100% Sortex Cleaned, Packed in 50KG New Jute Bags',
    packagesCount: 1000,
    packageType: 'Jute Bags',
    grossWeightKg: 50200,
    cbmVolume: 64.0,
    submissionDate: '2026-09-30',
    status: 'Verified',
    containers: ['CMAU1092831', 'MSKU8829104']
  },
  {
    id: 'si_02',
    siNumber: 'SI-2026-0492',
    bookingNo: 'BKG-5534',
    shipperName: 'Sialkot Master Surgical Instruments Co.',
    consigneeName: 'Bavarian Medical Implements GmbH, Hamburg',
    notifyPartyName: 'Deutsche Bank AG, Munich Branch',
    vesselName: 'Hapag-Lloyd Berlin Express',
    voyage: 'BX-4410A',
    pol: 'Karachi Port (KPT)',
    pod: 'Port of Hamburg (DEHAM)',
    finalDestination: 'Hamburg Central Medical Depot',
    cargoDesc: 'Electrosurgical Forceps, Scalpel Handles & Micro Scissors in Seaworthy Wooden Crates',
    packagesCount: 320,
    packageType: 'Boxes',
    grossWeightKg: 8400,
    cbmVolume: 18.0,
    submissionDate: '2026-10-01',
    status: 'Submitted',
    containers: ['HLXU9928172']
  }
];

export const initialExportStuffingPlans: ExportStuffingPlan[] = [
  {
    id: 'stp_01',
    planNumber: 'STF-PLAN-2026-08',
    vesselName: 'CMA CGM Antoine de Saint Exupery',
    voyage: 'CG-8820E',
    loadingTerminal: 'SAPT Berth 3, Karachi',
    cutoffDate: '2026-10-04 18:00 PKT',
    containerNo: 'CMAU1092831',
    sizeType: '40HC',
    allocatedWeightKg: 26920,
    vgmVerified: true,
    assignedSlot: 'Bay 12, Row 04, Tier 84 (Underdeck)',
    status: 'Gated In'
  },
  {
    id: 'stp_02',
    planNumber: 'STF-PLAN-2026-09',
    vesselName: 'CMA CGM Antoine de Saint Exupery',
    voyage: 'CG-8820E',
    loadingTerminal: 'SAPT Berth 3, Karachi',
    cutoffDate: '2026-10-04 18:00 PKT',
    containerNo: 'MSKU8829104',
    sizeType: '20GP',
    allocatedWeightKg: 16450,
    vgmVerified: true,
    assignedSlot: 'Bay 08, Row 02, Tier 82 (On Deck)',
    status: 'Stuffed'
  }
];

// ============================================
// 5. PORT CALLS & DAILY OPERATIONS LOG (SOF)
// ============================================
export const initialPortCalls: PortCall[] = [
  {
    id: 'pc_01',
    callId: 'PC-2026-KPT-01',
    vesselName: 'MSC Oscar',
    imo: '9703291',
    voyage: 'MS-2640W',
    carrier: 'MSC',
    principalName: 'Indus Magna Oceanic Principals Ltd',
    portName: 'Karachi Port (KPT)',
    portCode: 'PKKHI',
    terminalName: 'KICT Berth 2-3',
    berthNo: 'Berth 03',
    eta: '2026-10-08 06:00',
    etb: '2026-10-08 09:30',
    etd: '2026-10-10 18:00',
    status: 'Scheduled',
    noticeOfReadinessTendered: '2026-10-08 07:00 (Scheduled)',
    portClearanceStatus: 'Pending',
    sailingClearanceStatus: 'Pending',
    sofEvents: [
      {
        id: 'sof_01',
        timestamp: '2026-10-02 09:00',
        event: 'Proforma Disbursement Account (PDA) approved by Principal',
        category: 'Customs/Clearance',
        remarks: 'Advance funds USD 34,500 received via Standard Chartered Karachi'
      },
      {
        id: 'sof_02',
        timestamp: '2026-10-02 14:30',
        event: 'Berthing window locked with KPT Harbour Master',
        category: 'Berthing',
        remarks: 'Tug assistance: 2x KPT Harbor Tugs (Qasim-1 & Manora-2) allocated'
      },
      {
        id: 'sof_03',
        timestamp: '2026-10-03 10:00',
        event: 'Customs inward entry manifest (IGM) lodged in WeBOC',
        category: 'Customs/Clearance',
        remarks: 'VIR-KPT-2026-441 assigned by Karachi Customs Collectorate'
      }
    ]
  },
  {
    id: 'pc_02',
    callId: 'PC-2026-PQA-02',
    vesselName: 'Maersk Mc-Kinney Moller',
    imo: '9619907',
    voyage: 'MK-1892E',
    carrier: 'Maersk Line',
    principalName: 'Nordic Sea-Air Cargo B.V.',
    portName: 'Port Muhammad Bin Qasim (QICT)',
    portCode: 'PKBQM',
    terminalName: 'QICT Berth 5',
    berthNo: 'Berth 05',
    eta: '2026-10-01 14:00',
    etb: '2026-10-01 17:30',
    etd: '2026-10-03 22:00',
    actualArrival: '2026-10-01 14:15',
    actualBerthing: '2026-10-01 18:00',
    status: 'Berthed',
    noticeOfReadinessTendered: '2026-10-01 14:45',
    portClearanceStatus: 'Granted',
    sailingClearanceStatus: 'Pending',
    sofEvents: [
      {
        id: 'sof_10',
        timestamp: '2026-10-01 14:15',
        event: 'Arrived at Outer Anchorage Port Qasim',
        category: 'Navigation',
        remarks: 'VHF Ch 16 communication established with Port Control'
      },
      {
        id: 'sof_11',
        timestamp: '2026-10-01 15:30',
        event: 'Port Pilot Capt. Salman onboard at Fairway Buoy',
        category: 'Navigation',
        remarks: 'Navigating through 45km Port Qasim navigational channel'
      },
      {
        id: 'sof_12',
        timestamp: '2026-10-01 18:00',
        event: 'All fast alongside QICT Berth 5 (First line 17:40, All fast 18:00)',
        category: 'Berthing',
        remarks: 'Draft Fwd 12.8m, Aft 13.2m. Gangway positioned.'
      },
      {
        id: 'sof_13',
        timestamp: '2026-10-01 19:15',
        event: 'Joint Boarding Inspection (Customs, Immigration, Port Health)',
        category: 'Customs/Clearance',
        remarks: 'Port Clearance inward issued. Crew shore passes endorsed.'
      },
      {
        id: 'sof_14',
        timestamp: '2026-10-01 20:00',
        event: 'Commenced container discharging operations (3x STS Gantry Cranes)',
        category: 'Cargo Ops',
        remarks: 'Hourly discharge rate: 78 moves/hr.'
      }
    ]
  }
];

// ============================================
// 6. ACCOUNTS & GENERAL LEDGER
// ============================================
export const initialLedgerEntries: LedgerEntry[] = [
  {
    id: 'led_01',
    date: '2026-10-01',
    accountCode: '1010',
    accountTitle: 'Habib Bank Limited (HBL) - Freight A/C',
    accountType: 'Asset',
    voucherNo: 'BRV-2026-081',
    voucherType: 'BRV',
    description: 'Freight collection received for HBL-2026-8821 from Indus Micro',
    debit: 14250,
    credit: 0,
    runningBalance: 489200,
    entityName: 'Indus Micro Distribution Ltd',
    vesselVoyage: 'MSC Oscar / MS-2640W'
  },
  {
    id: 'led_02',
    date: '2026-10-01',
    accountCode: '4010',
    accountTitle: 'Ocean Freight Revenue (NVOCC)',
    accountType: 'Revenue',
    voucherNo: 'BRV-2026-081',
    voucherType: 'BRV',
    description: 'Ocean Freight billing against HBL-2026-8821',
    debit: 0,
    credit: 14250,
    runningBalance: 1245000,
    entityName: 'Indus Micro Distribution Ltd',
    vesselVoyage: 'MSC Oscar / MS-2640W'
  },
  {
    id: 'led_03',
    date: '2026-10-02',
    accountCode: '5020',
    accountTitle: 'Port Dues & Terminal Handling Charges',
    accountType: 'Expense',
    voucherNo: 'BPV-2026-042',
    voucherType: 'BPV',
    description: 'KICT Port handling charges payment for container MSKU7829103',
    debit: 3850,
    credit: 0,
    runningBalance: 320400,
    entityName: 'KICT Terminal Operations',
    vesselVoyage: 'MSC Oscar / MS-2640W'
  },
  {
    id: 'led_04',
    date: '2026-10-02',
    accountCode: '1010',
    accountTitle: 'Habib Bank Limited (HBL) - Freight A/C',
    accountType: 'Asset',
    voucherNo: 'BPV-2026-042',
    voucherType: 'BPV',
    description: 'Cheque payment to KICT for terminal charges',
    debit: 0,
    credit: 3850,
    runningBalance: 485350,
    entityName: 'KICT Terminal Operations',
    vesselVoyage: 'MSC Oscar / MS-2640W'
  },
  {
    id: 'led_05',
    date: '2026-10-03',
    accountCode: '1020',
    accountTitle: 'Petty Cash Book (Karachi Port Office)',
    accountType: 'Asset',
    voucherNo: 'CPV-2026-019',
    voucherType: 'CPV',
    description: 'Customs gate pass stamping & surveyor boarding conveyance',
    debit: 0,
    credit: 250,
    runningBalance: 4250,
    entityName: 'Port Operations Desk',
    vesselVoyage: 'MSC Oscar / MS-2640W'
  },
  {
    id: 'led_06',
    date: '2026-10-03',
    accountCode: '5080',
    accountTitle: 'Port Husbandry & Agency Operations',
    accountType: 'Expense',
    voucherNo: 'CPV-2026-019',
    voucherType: 'CPV',
    description: 'Surveyor and port husbandry documentation expenses',
    debit: 250,
    credit: 0,
    runningBalance: 42100,
    entityName: 'Port Operations Desk',
    vesselVoyage: 'MSC Oscar / MS-2640W'
  }
];

// ============================================
// 7. DISBURSEMENT ACCOUNTS (PDA / FDA)
// ============================================
export const initialDisbursementAccounts: DisbursementAccount[] = [
  {
    id: 'pda_01',
    accountNo: 'PDA-2026-KPT-01',
    type: 'PDA',
    vesselName: 'MSC Oscar',
    voyage: 'MS-2640W',
    portName: 'Karachi Port (KPT)',
    principalName: 'Indus Magna Oceanic Principals Ltd',
    eta: '2026-10-08',
    etd: '2026-10-10',
    currency: 'USD',
    pilotageDues: 4800,
    towageAndTugs: 8500,
    portBerthHire: 6200,
    customsLightDues: 1800,
    immigrationFormalities: 650,
    agencyFee: 3500,
    stevedoringOps: 6800,
    bunkeringFuel: 0,
    freshWaterProvision: 2250,
    totalDisbursement: 34500,
    advanceReceived: 34500,
    balanceDue: 0,
    status: 'Approved by Principal'
  },
  {
    id: 'fda_01',
    accountNo: 'FDA-2026-PQA-04',
    type: 'FDA',
    vesselName: 'Maersk Mc-Kinney Moller',
    voyage: 'MK-1892E',
    portName: 'Port Muhammad Bin Qasim (QICT)',
    principalName: 'Nordic Sea-Air Cargo B.V.',
    eta: '2026-10-01',
    etd: '2026-10-03',
    currency: 'USD',
    pilotageDues: 5200,
    towageAndTugs: 9100,
    portBerthHire: 7400,
    customsLightDues: 1950,
    immigrationFormalities: 700,
    agencyFee: 4000,
    stevedoringOps: 8200,
    bunkeringFuel: 12000,
    freshWaterProvision: 2800,
    totalDisbursement: 51350,
    advanceReceived: 45000,
    balanceDue: 6350,
    status: 'Settled'
  }
];

// ============================================
// 8. DEBIT NOTES & CREDIT NOTES
// ============================================
export const initialDebitCreditNotes: DebitCreditNote[] = [
  {
    id: 'dn_01',
    noteNumber: 'DN-2026-0042',
    type: 'Debit Note',
    issueDate: '2026-10-02',
    partyName: 'Indus Micro Distribution Ltd',
    partyRole: 'Consignee',
    referenceDoc: 'INV-2026-4401',
    vesselVoyage: 'MSC Oscar / MS-2640W',
    currency: 'USD',
    amount: 1450,
    reason: 'Container demurrage detention charges beyond 7 days free-time',
    status: 'Approved'
  },
  {
    id: 'cn_01',
    noteNumber: 'CN-2026-0018',
    type: 'Credit Note',
    issueDate: '2026-10-03',
    partyName: 'Pacific Precision Electronics Inc.',
    partyRole: 'Shipper',
    referenceDoc: 'INV-2026-4389',
    vesselVoyage: 'CMA CGM Antoine de Saint Exupery',
    currency: 'USD',
    amount: 600,
    reason: 'Volume rebate credit adjustment on monthly 40HC booking quota',
    status: 'Approved'
  }
];

// ============================================
// 9. SRS 7 ROLES & PERMISSIONS
// ============================================
export const initialSrsRoles: RoleItem[] = [
  {
    roleId: 'managing_director',
    roleName: 'Managing Director',
    roleCategory: 'Internal Staff',
    description: 'Executive management authority across agency operations, P&L ledgers, banking, and strategic agreements',
    permissions: {
      aisTracking: true,
      demurrageOverride: true,
      mblManagement: true,
      hblGeneration: true,
      profitMargins: true,
      cfsConsolidation: true,
      customsHolds: true,
      carrierContracts: true,
      ledgerInvoicing: true,
      extraTelemetry: true,
      ledgerAccess: true,
      igmEgmAccess: true,
      customsClearanceAccess: true,
      canGenerateDeliveryOrder: true,
      agencyOperations: true,
      exportWorkflow: true
    }
  },
  {
    roleId: 'coo_lahore',
    roleName: 'Chief Operating Officer (Lahore — remote)',
    roleCategory: 'Internal Staff',
    description: 'Regional operational head with full visibility over Upcountry booking desks, bonded dry ports, and client relations',
    permissions: {
      aisTracking: true,
      demurrageOverride: true,
      mblManagement: true,
      hblGeneration: true,
      profitMargins: true,
      cfsConsolidation: true,
      customsHolds: true,
      carrierContracts: true,
      ledgerInvoicing: true,
      extraTelemetry: true,
      ledgerAccess: true,
      igmEgmAccess: true,
      customsClearanceAccess: true,
      canGenerateDeliveryOrder: true,
      agencyOperations: true,
      exportWorkflow: true
    }
  },
  {
    roleId: 'operations_officer',
    roleName: 'Operations Officer',
    roleCategory: 'Internal Staff',
    description: 'Terminal operations, port calls, Statement of Facts (SOF), container gate pass (EIR), and vessel husbandry',
    permissions: {
      aisTracking: true,
      demurrageOverride: false,
      mblManagement: false,
      hblGeneration: false,
      profitMargins: false,
      cfsConsolidation: true,
      customsHolds: true,
      carrierContracts: false,
      ledgerInvoicing: false,
      extraTelemetry: true,
      ledgerAccess: false,
      igmEgmAccess: true,
      customsClearanceAccess: true,
      canGenerateDeliveryOrder: false,
      agencyOperations: true,
      exportWorkflow: true
    }
  },
  {
    roleId: 'documentation_officer',
    roleName: 'Documentation Officer',
    roleCategory: 'Internal Staff',
    description: 'Bill of Lading drafting, IGM / EGM filing, Shipping Instructions verification, and Delivery Order preparation',
    permissions: {
      aisTracking: false,
      demurrageOverride: false,
      mblManagement: true,
      hblGeneration: true,
      profitMargins: false,
      cfsConsolidation: true,
      customsHolds: true,
      carrierContracts: false,
      ledgerInvoicing: false,
      extraTelemetry: false,
      ledgerAccess: false,
      igmEgmAccess: true,
      customsClearanceAccess: true,
      canGenerateDeliveryOrder: false, // Only Admin / System Administrator can generate DO by default
      agencyOperations: false,
      exportWorkflow: true
    }
  },
  {
    roleId: 'accounts_officer',
    roleName: 'Accounts Officer',
    roleCategory: 'Internal Staff',
    description: 'General ledger, PDA/FDA disbursement accounts, receivables aging, cash book, and freight billing invoicing',
    permissions: {
      aisTracking: false,
      demurrageOverride: false,
      mblManagement: false,
      hblGeneration: false,
      profitMargins: true,
      cfsConsolidation: false,
      customsHolds: false,
      carrierContracts: false,
      ledgerInvoicing: true,
      extraTelemetry: false,
      ledgerAccess: true,
      igmEgmAccess: false,
      customsClearanceAccess: false,
      canGenerateDeliveryOrder: false,
      agencyOperations: false,
      exportWorkflow: false
    }
  },
  {
    roleId: 'marketing_officer',
    roleName: 'Marketing Officer',
    roleCategory: 'Internal Staff',
    description: 'Commercial sales, freight booking requests, slot rate quotations, and principal marketing pipelines',
    permissions: {
      aisTracking: true,
      demurrageOverride: false,
      mblManagement: false,
      hblGeneration: false,
      profitMargins: true,
      cfsConsolidation: false,
      customsHolds: false,
      carrierContracts: true,
      ledgerInvoicing: false,
      extraTelemetry: false,
      ledgerAccess: false,
      igmEgmAccess: false,
      customsClearanceAccess: false,
      canGenerateDeliveryOrder: false,
      agencyOperations: false,
      exportWorkflow: true
    }
  },
  {
    roleId: 'system_admin',
    roleName: 'System Administrator',
    roleCategory: 'Internal Staff',
    description: 'Full administrative governance, system configuration, company branding, D.O. authorization, and user access control',
    permissions: {
      aisTracking: true,
      demurrageOverride: true,
      mblManagement: true,
      hblGeneration: true,
      profitMargins: true,
      cfsConsolidation: true,
      customsHolds: true,
      carrierContracts: true,
      ledgerInvoicing: true,
      extraTelemetry: true,
      ledgerAccess: true,
      igmEgmAccess: true,
      customsClearanceAccess: true,
      canGenerateDeliveryOrder: true,
      agencyOperations: true,
      exportWorkflow: true
    }
  }
];

// ============================================
// 10. PAKISTAN CUSTOMS (WeBOC) SPECIFIC MOCK CASES
// ============================================
export interface PakistanCustomsCase {
  id: string;
  gdNumber: string; // Goods Declaration Number
  igmNumber: string;
  blNumber: string;
  containerNo: string;
  consignee: string;
  ntnNumber: string;
  portStation: string;
  channel: 'Green Channel' | 'Yellow Channel (Assessment)' | 'Red Channel (Physical Exam)';
  hsCode: string;
  declaredValuePkr: number;
  customsDutyPkr: number;
  salesTaxPkr: number;
  incomeTaxPkr: number;
  acdAndRdPkr: number;
  totalDutyPkr: number;
  psidPaymentStatus: 'Paid via 1Link' | 'Payment Pending (PSID Generated)' | 'Duty Exemption Approved';
  psidNumber: string;
  clearanceStatus: 'Out of Charge (Cleared)' | 'Under Assessment' | 'Examination Completed' | 'Exam Held';
  examLocation?: string;
  filingDate: string;
}

export const initialPakistanCustomsCases: PakistanCustomsCase[] = [
  {
    id: 'pk_cst_01',
    gdNumber: 'KAPE-HC-194029-01-10-2026',
    igmNumber: 'IGM-2026-KPT-0418',
    blNumber: 'HBL-2026-8821',
    containerNo: 'MSKU7829103',
    consignee: 'Indus Micro Distribution Ltd',
    ntnNumber: '42201-9812490-7',
    portStation: 'Karachi Port (KPT - East Wharf WeBOC)',
    channel: 'Green Channel',
    hsCode: '8542.31.00 (Processors & Controllers)',
    declaredValuePkr: 18450000,
    customsDutyPkr: 553500,
    salesTaxPkr: 3321000,
    incomeTaxPkr: 1107000,
    acdAndRdPkr: 369000,
    totalDutyPkr: 5350500,
    psidPaymentStatus: 'Paid via 1Link',
    psidNumber: '1004928192039',
    clearanceStatus: 'Out of Charge (Cleared)',
    filingDate: '2026-10-01'
  },
  {
    id: 'pk_cst_02',
    gdNumber: 'KPPI-HC-209144-02-10-2026',
    igmNumber: 'IGM-2026-PQA-0912',
    blNumber: 'HBL-2026-9014',
    containerNo: 'MSKU9018274',
    consignee: 'Fauji Green Power Generating Co. Ltd.',
    ntnNumber: '07102-4491028-1',
    portStation: 'Port Muhammad Bin Qasim (QICT)',
    channel: 'Yellow Channel (Assessment)',
    hsCode: '8541.40.00 (Solar Photovoltaic Modules)',
    declaredValuePkr: 32400000,
    customsDutyPkr: 0, // SRO Concessionary 0%
    salesTaxPkr: 0, // Renewable Energy Exemption
    incomeTaxPkr: 648000,
    acdAndRdPkr: 0,
    totalDutyPkr: 648000,
    psidPaymentStatus: 'Paid via 1Link',
    psidNumber: '1004928194412',
    clearanceStatus: 'Under Assessment',
    filingDate: '2026-10-02'
  },
  {
    id: 'pk_cst_03',
    gdNumber: 'KAPE-HC-194511-03-10-2026',
    igmNumber: 'IGM-2026-KPT-0418',
    blNumber: 'HBL-2026-8835',
    containerNo: 'HLXU6629104',
    consignee: 'Pak-German Industrial Spares (Pvt) Ltd',
    ntnNumber: '14902-8819203-3',
    portStation: 'Karachi Port (KPT - West Wharf)',
    channel: 'Red Channel (Physical Exam)',
    hsCode: '8448.39.00 (Parts for Textile Machinery)',
    declaredValuePkr: 14200000,
    customsDutyPkr: 426000,
    salesTaxPkr: 2556000,
    incomeTaxPkr: 852000,
    acdAndRdPkr: 284000,
    totalDutyPkr: 4118000,
    psidPaymentStatus: 'Payment Pending (PSID Generated)',
    psidNumber: '1004928198901',
    clearanceStatus: 'Examination Completed',
    examLocation: 'KICT Yard 4 Examination Shed',
    filingDate: '2026-10-02'
  }
];

// ============================================
// 11. EXTENDED PARTNERS (PRINCIPALS, OWNERS, CHARTERERS)
// ============================================
export const initialAgencyPartners = [
  {
    id: 'pt_p01',
    name: 'Indus Magna Shipping Lines (Overseas Principal)',
    category: 'Principal',
    hq: 'Dubai International Financial Centre (DIFC), UAE',
    contact: 'principals.desk@indusmagna.ae',
    monthlyTeu: 850,
    status: 'Core Principal Line',
    creditTerms: 'Monthly Agency Settlement'
  },
  {
    id: 'pt_o01',
    name: 'Navios Maritime Holdings Inc.',
    category: 'Ship Owner',
    hq: 'Piraeus, Greece',
    contact: 'chartering@navios.com',
    monthlyTeu: 340,
    status: 'Vessel Owner (Time Charter)',
    creditTerms: 'Charterhire Semi-Monthly in Advance'
  },
  {
    id: 'pt_c01',
    name: 'Cargill Ocean Transportation',
    category: 'Charterer',
    hq: 'Geneva, Switzerland',
    contact: 'ocean.operations@cargill.com',
    monthlyTeu: 520,
    status: 'Voyage Charterer',
    creditTerms: 'Demurrage / Despatch 15 Days After SOF'
  }
];
