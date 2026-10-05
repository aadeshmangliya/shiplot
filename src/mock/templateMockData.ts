import { CompanyUser, DocumentTemplate } from '../types';

export const initialCompanyUsers: CompanyUser[] = [
  {
    id: 'usr_01',
    name: 'Capt. Rehan Siddiqui',
    email: 'rehan.siddiqui@indusmagna.com',
    password: 'Password@2026',
    role: 'nvocc_admin',
    roleTitle: 'Managing Director & Line Representative',
    department: 'Executive Management',
    phone: '+92-300-8219401',
    status: 'Active',
    createdAt: '2026-01-10',
    lastLogin: '2026-10-05 09:15',
    companyId: 'COMP-001'
  },
  {
    id: 'usr_02',
    name: 'Kamran Qureshi',
    email: 'kamran.finance@indusmagna.com',
    password: 'Finance#Indus26',
    role: 'finance',
    roleTitle: 'Chief Accounts & Disbursement Officer',
    department: 'Finance & Freight Accounts',
    phone: '+92-321-4455890',
    status: 'Active',
    createdAt: '2026-02-14',
    lastLogin: '2026-10-05 11:30',
    companyId: 'COMP-001'
  },
  {
    id: 'usr_03',
    name: 'Asad Farooq',
    email: 'asad.ops@indusmagna.com',
    password: 'OpsFarooq!2026',
    role: 'operations',
    roleTitle: 'Port & Terminal Operations Lead',
    department: 'Container Control & Drayage',
    phone: '+92-333-9182371',
    status: 'Active',
    createdAt: '2026-03-01',
    lastLogin: '2026-10-05 08:45',
    companyId: 'COMP-001'
  },
  {
    id: 'usr_04',
    name: 'Zainab Bibi',
    email: 'zainab.docs@indusmagna.com',
    password: 'DocsZainab@99',
    role: 'documentation',
    roleTitle: 'Senior B/L & Manifest Documentation Officer',
    department: 'Export/Import Documentation',
    phone: '+92-301-7788112',
    status: 'Active',
    createdAt: '2026-03-12',
    lastLogin: '2026-10-04 17:10',
    companyId: 'COMP-001'
  },
  {
    id: 'usr_05',
    name: 'Tariq Mehmood',
    email: 'tariq@gulf-forwarders.pk',
    password: 'ForwarderPass#1',
    role: 'freight_forwarder',
    roleTitle: 'Freight Forwarding Partner Desk',
    department: 'Channel Partners & Forwarders',
    phone: '+92-345-2233445',
    status: 'Active',
    createdAt: '2026-04-18',
    lastLogin: '2026-10-03 14:22',
    companyId: 'COMP-001'
  },
  {
    id: 'usr_06',
    name: 'Bilal Ahmed',
    email: 'imports@indusmicro.com',
    password: 'ClientImporter!9',
    role: 'importer',
    roleTitle: 'Consignee / Importer Portal Lead',
    department: 'Indus Micro Distribution Ltd',
    phone: '+92-300-1122334',
    status: 'Active',
    createdAt: '2026-05-20',
    lastLogin: '2026-10-05 13:05',
    companyId: 'COMP-001'
  },
  {
    id: 'usr_07',
    name: 'Sarah Khan',
    email: 'exports@paktextiles.org',
    password: 'ExportShipper#7',
    role: 'exporter',
    roleTitle: 'Shipper / Exporter Logistics Manager',
    department: 'Pak-Crescent Textile Mills',
    phone: '+92-322-9988776',
    status: 'Active',
    createdAt: '2026-06-11',
    lastLogin: '2026-10-02 16:40',
    companyId: 'COMP-001'
  }
];

export const commonTemplateTags: string[] = [
  '{{company_name}}',
  '{{company_logo}}',
  '{{fmc_license}}',
  '{{tax_id}}',
  '{{company_address}}',
  '{{company_phone}}',
  '{{company_email}}',
  '{{website}}',
  '{{bl_number}}',
  '{{do_number}}',
  '{{airbill_number}}',
  '{{gatepass_number}}',
  '{{invoice_number}}',
  '{{shipper_name}}',
  '{{shipper_address}}',
  '{{consignee_name}}',
  '{{consignee_address}}',
  '{{notify_party}}',
  '{{vessel_name}}',
  '{{voyage}}',
  '{{pol}}',
  '{{pod}}',
  '{{final_destination}}',
  '{{container_no}}',
  '{{seal_no}}',
  '{{containers_table}}',
  '{{cargo_description}}',
  '{{gross_weight}}',
  '{{cbm_volume}}',
  '{{packages_count}}',
  '{{freight_term}}',
  '{{issue_date}}',
  '{{validity_date}}',
  '{{signatory_name}}',
  '{{signatory_title}}',
  '{{bank_name}}',
  '{{bank_iban}}'
];

export const initialDocumentTemplates: DocumentTemplate[] = [
  // 1. HBL Standard
  {
    id: 'tmpl_hbl_01',
    name: 'FIATA Standard Multimodal House B/L (HBL)',
    docType: 'HBL',
    docTypeLabel: 'House Bill of Lading',
    description: 'Official FIATA negotiable Multimodal Transport B/L format with full carrier header, cargo boxes, and standard liability terms.',
    version: '2.4',
    isShiplotMaster: true,
    isDefault: true,
    lastUpdated: '2026-10-01',
    author: 'Shiplot SuperAdmin',
    availableTags: commonTemplateTags,
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 24px; color: #111; font-size: 11px; }
    .header-table { width: 100%; border-collapse: collapse; border-bottom: 2px solid #000; margin-bottom: 12px; }
    .header-table td { vertical-align: top; }
    .company-title { font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
    .company-sub { font-size: 10px; color: #444; }
    .doc-type-badge { text-align: right; }
    .doc-type-title { font-size: 16px; font-weight: 900; }
    .bl-num { font-size: 14px; font-weight: bold; font-family: monospace; color: #000; margin-top: 4px; }
    .grid-table { width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 10px; }
    .grid-table td { border: 1px solid #000; padding: 6px; vertical-align: top; }
    .label { font-size: 8px; font-weight: bold; text-transform: uppercase; color: #555; margin-bottom: 2px; }
    .val { font-size: 10px; font-weight: 600; }
    .cargo-table { width: 100%; border-collapse: collapse; border: 1px solid #000; margin-top: 10px; }
    .cargo-table th { background: #eee; border: 1px solid #000; padding: 6px; font-size: 9px; text-transform: uppercase; }
    .cargo-table td { border: 1px solid #000; padding: 6px; vertical-align: top; }
    .footer-table { width: 100%; border-collapse: collapse; margin-top: 15px; border-top: 1px solid #000; padding-top: 8px; }
    .terms-text { font-size: 7.5px; color: #555; text-align: justify; line-height: 1.2; }
    .sign-box { border: 1px dashed #777; padding: 12px; text-align: center; width: 220px; float: right; margin-top: 10px; }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td style="width: 65%;">
        <div class="company-title">{{company_name}}</div>
        <div class="company-sub">{{company_address}} | Tel: {{company_phone}} | Email: {{company_email}}</div>
        <div class="company-sub">FMC Reg: {{fmc_license}} | Tax ID: {{tax_id}}</div>
      </td>
      <td class="doc-type-badge">
        <div class="doc-type-title">NEGOTIABLE FIATA MULTIMODAL B/L</div>
        <div class="bl-num">B/L NO: {{bl_number}}</div>
        <div style="font-size: 9px; color: #555;">ORIGINAL (1 of 3)</div>
      </td>
    </tr>
  </table>

  <table class="grid-table">
    <tr>
      <td style="width: 50%;">
        <div class="label">Shipper / Exporter</div>
        <div class="val">{{shipper_name}}<br>{{shipper_address}}</div>
      </td>
      <td style="width: 50%;">
        <div class="label">Consignee (or Order)</div>
        <div class="val">{{consignee_name}}<br>{{consignee_address}}</div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="label">Notify Party / Clearing Agent</div>
        <div class="val">{{notify_party}}</div>
      </td>
      <td>
        <div class="label">Ocean Vessel & Voyage</div>
        <div class="val">{{vessel_name}} / Voy: {{voyage}}</div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="label">Port of Loading (POL)</div>
        <div class="val">{{pol}}</div>
      </td>
      <td>
        <div class="label">Port of Discharge (POD) & Final Destination</div>
        <div class="val">{{pod}} &rarr; {{final_destination}}</div>
      </td>
    </tr>
  </table>

  <table class="cargo-table">
    <thead>
      <tr>
        <th style="width: 25%;">Container & Seal No</th>
        <th style="width: 15%;">Packages</th>
        <th style="width: 38%;">Description of Goods</th>
        <th style="width: 11%;">Gross Wt (KG)</th>
        <th style="width: 11%;">Volume (CBM)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div style="font-family: monospace; font-weight: bold;">{{container_no}}</div>
          <div style="font-size: 9px; color: #555;">Seal: {{seal_no}}</div>
        </td>
        <td>{{packages_count}} PKGS</td>
        <td>
          <div style="font-weight: 600;">{{cargo_description}}</div>
          <div style="font-size: 8.5px; color: #666; margin-top: 3px;">CLEAN ON BOARD — STOWED UNDER DECK</div>
        </td>
        <td style="text-align: right; font-weight: bold;">{{gross_weight}} KG</td>
        <td style="text-align: right;">{{cbm_volume}} CBM</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 15px; display: flex; justify-content: space-between;">
    <div style="width: 60%;">
      <div class="label">Freight & Charges</div>
      <div class="val">{{freight_term}} &bull; Freight Payable At: {{pod}}</div>
      <div class="terms-text" style="margin-top: 6px;">
        Shipped on board the vessel indicated in apparent good order and condition unless otherwise stated. One of the Bills of Lading must be surrendered duly endorsed in exchange for the goods or delivery order.
      </div>
      <div style="font-size: 9px; margin-top: 6px;">Issued Date: <strong>{{issue_date}}</strong></div>
    </div>
    <div class="sign-box">
      <div class="label">For and on behalf of the Carrier</div>
      <div style="font-weight: bold; font-size: 11px; margin-top: 24px;">{{company_name}}</div>
      <div style="font-size: 9px; color: #555;">Authorized Signatory: {{signatory_name}}</div>
      <div style="font-size: 8px; color: #777;">{{signatory_title}}</div>
    </div>
  </div>
</body>
</html>`
  },

  // 2. DO (Delivery Order)
  {
    id: 'tmpl_do_01',
    name: 'Pakistan Customs & Terminal Delivery Order (D.O.)',
    docType: 'DO',
    docTypeLabel: 'Delivery Order',
    description: 'Compliant with Karachi Port (KPT), QICT Port Qasim, and SAPT container terminal delivery orders with VIR / IGM endorsement.',
    version: '1.8',
    isShiplotMaster: true,
    isDefault: true,
    lastUpdated: '2026-10-02',
    author: 'Shiplot SuperAdmin',
    availableTags: commonTemplateTags,
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 24px; color: #000; font-size: 11px; }
    .header-box { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 12px; }
    .company-name { font-size: 18px; font-weight: bold; }
    .do-badge { float: right; text-align: right; }
    .do-badge h1 { margin: 0; font-size: 20px; font-weight: 900; }
    .do-no { font-size: 13px; font-weight: bold; font-family: monospace; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10px; }
    .meta-table td { padding: 4px 6px; border: 1px solid #ccc; vertical-align: top; }
    .meta-label { font-size: 8px; font-weight: bold; text-transform: uppercase; color: #555; }
    .items-table { width: 100%; border-collapse: collapse; border: 1px solid #000; margin: 12px 0; }
    .items-table th { background: #f0f0f0; border: 1px solid #000; padding: 6px; font-size: 9px; text-transform: uppercase; }
    .items-table td { border: 1px solid #000; padding: 6px; font-size: 10px; }
    .instructions { background: #fdfdfd; border: 1px solid #aaa; padding: 8px; font-size: 9px; margin-top: 10px; }
    .sig-area { margin-top: 24px; width: 100%; }
    .sig-block { float: right; width: 220px; text-align: center; border-top: 1px solid #000; padding-top: 4px; }
  </style>
</head>
<body>
  <div class="header-box">
    <div class="do-badge">
      <h1>DELIVERY ORDER</h1>
      <div class="do-no">D.O. NO: {{do_number}}</div>
      <div style="font-size: 9px; color: #444;">Issue Date: {{issue_date}}</div>
      <div style="font-size: 10px; color: #b91c1c; font-weight: bold;">Valid Upto: {{validity_date}}</div>
    </div>
    <div class="company-name">{{company_name}}</div>
    <div style="font-size: 10px; color: #333;">SHIPPING AGENCY & NVOCC CARRIER OPERATIONS</div>
    <div style="font-size: 9px; color: #555;">{{company_address}} | Tel: {{company_phone}}</div>
    <div style="font-size: 9px; color: #555;">FMC License: {{fmc_license}} | NTN: {{tax_id}}</div>
    <div style="clear: both;"></div>
  </div>

  <table class="meta-table">
    <tr>
      <td style="width: 50%;">
        <div class="meta-label">Delivered To / Clearing Agent</div>
        <div style="font-weight: bold; font-size: 11px;">{{consignee_name}}</div>
        <div>{{consignee_address}}</div>
        <div style="margin-top: 4px; font-size: 9px; color: #444;">Notify: {{notify_party}}</div>
      </td>
      <td style="width: 50%;">
        <div class="meta-label">Vessel & Voyage Details</div>
        <div>Vessel: <strong>{{vessel_name}}</strong> &bull; Voy: <strong>{{voyage}}</strong></div>
        <div>Port of Discharge: <strong>{{pod}}</strong></div>
        <div style="margin-top: 4px;">Master B/L: <strong>{{bl_number}}</strong></div>
      </td>
    </tr>
  </table>

  <div style="font-weight: bold; font-size: 10px; margin-bottom: 4px;">
    TO: THE HARBOUR MASTER / TERMINAL OPERATOR (KICT / QICT / SAPT / KPT)
  </div>
  <div style="font-size: 9.5px; color: #333; margin-bottom: 8px;">
    Please deliver the undermentioned import cargo/containers landed ex-vessel to the above nominated consignee or their authorized customs clearing agent, all freight and detention charges having been secured:
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Container No.</th>
        <th>Size/Type</th>
        <th>Seal No.</th>
        <th>Package Qty & Description</th>
        <th>Gross Weight</th>
        <th>Empty Return Yard</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-family: monospace; font-weight: bold;">{{container_no}}</td>
        <td>40' High Cube</td>
        <td>{{seal_no}}</td>
        <td><strong>{{packages_count}} PKGS</strong><br>{{cargo_description}}</td>
        <td style="text-align: right; font-weight: bold;">{{gross_weight}} KG</td>
        <td style="font-size: 9px;">Premier Container Depot (Hawke's Bay)</td>
      </tr>
    </tbody>
  </table>

  <div class="instructions">
    <strong>LINE REMARKS & RETURN INSTRUCTIONS:</strong><br>
    1. Empty containers must be returned to the nominated empty depot on or before <strong>{{validity_date}}</strong>.<br>
    2. Detaining containers beyond free days will incur detention charges as per standard NVOCC tariff.<br>
    3. Terminal Gate Pass must be obtained before gate-out from the wharf.
  </div>

  <div class="sig-area">
    <div class="sig-block">
      <div>For <strong>{{company_name}}</strong></div>
      <div style="margin-top: 36px; font-weight: bold;">{{signatory_name}}</div>
      <div style="font-size: 9px; color: #555;">{{signatory_title}}</div>
      <div style="font-size: 8px; color: #777;">(Delivery Desk Sign & Stamp)</div>
    </div>
    <div style="clear: both;"></div>
  </div>
</body>
</html>`
  },

  // 3. Air Waybill (AWB)
  {
    id: 'tmpl_awb_01',
    name: 'IATA Standard International Air Waybill (AWB)',
    docType: 'AIR_BILL',
    docTypeLabel: 'Air Waybill (AWB)',
    description: 'Standard 12-digit IATA air cargo waybill format with flight numbers, airport codes, and freight rate breakdown.',
    version: '1.5',
    isShiplotMaster: true,
    isDefault: true,
    lastUpdated: '2026-10-03',
    author: 'Shiplot SuperAdmin',
    availableTags: commonTemplateTags,
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Courier New', Courier, monospace; margin: 0; padding: 20px; color: #111; font-size: 10px; }
    .awb-border { border: 2px solid #000; padding: 10px; }
    .awb-header { border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
    .awb-num { font-size: 16px; font-weight: bold; float: right; }
    .airline-name { font-size: 16px; font-weight: bold; font-family: sans-serif; }
    .awb-box { border: 1px solid #000; padding: 6px; margin-bottom: 6px; }
    .awb-label { font-size: 8px; font-weight: bold; text-transform: uppercase; color: #444; }
    .awb-val { font-size: 11px; font-weight: bold; }
    .flight-table { width: 100%; border-collapse: collapse; border: 1px solid #000; margin: 8px 0; }
    .flight-table td, .flight-table th { border: 1px solid #000; padding: 4px; font-size: 9px; text-align: left; }
    .flight-table th { background: #eee; }
  </style>
</head>
<body>
  <div class="awb-border">
    <div class="awb-header">
      <div class="awb-num">AWB: {{airbill_number}}</div>
      <div class="airline-name">{{company_name}} AIR LOGISTICS</div>
      <div style="font-size: 9px;">NOT NEGOTIABLE AIR WAYBILL &bull; ISSUED UNDER IATA CONDITIONS</div>
    </div>

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="width: 50%; vertical-align: top; padding-right: 5px;">
          <div class="awb-box">
            <div class="awb-label">Shipper's Name and Address</div>
            <div class="awb-val">{{shipper_name}}</div>
            <div>{{shipper_address}}</div>
          </div>
          <div class="awb-box">
            <div class="awb-label">Consignee's Name and Address</div>
            <div class="awb-val">{{consignee_name}}</div>
            <div>{{consignee_address}}</div>
          </div>
        </td>
        <td style="width: 50%; vertical-align: top; padding-left: 5px;">
          <div class="awb-box">
            <div class="awb-label">Issuing Carrier's Agent Name and City</div>
            <div class="awb-val">{{company_name}}</div>
            <div>{{company_address}}</div>
            <div>IATA Cargo Code: 072-4410 &bull; Tel: {{company_phone}}</div>
          </div>
          <div class="awb-box">
            <div class="awb-label">Airport of Departure</div>
            <div class="awb-val">{{pol}} (KHI / LAX)</div>
            <div class="awb-label" style="margin-top: 4px;">Airport of Destination</div>
            <div class="awb-val">{{pod}}</div>
          </div>
        </td>
      </tr>
    </table>

    <table class="flight-table">
      <thead>
        <tr>
          <th>No of Pieces</th>
          <th>Gross Weight</th>
          <th>Commodity Item No.</th>
          <th>Chargeable Weight</th>
          <th>Rate / Charge</th>
          <th>Nature and Quantity of Goods</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>{{packages_count}}</strong></td>
          <td><strong>{{gross_weight}} KG</strong></td>
          <td>GEN-CARGO</td>
          <td><strong>{{gross_weight}} KG</strong></td>
          <td>AS AGREED</td>
          <td>{{cargo_description}}<br><small>DIMENSIONS: {{cbm_volume}} CBM</small></td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 15px; border-top: 1px solid #000; padding-top: 6px; font-size: 8.5px;">
      Shipper certifies that the particulars on the face hereof are correct and that insofar as any part of the consignment contains dangerous goods, such part is properly described by name.
    </div>

    <div style="margin-top: 20px; display: flex; justify-content: space-between;">
      <div>Executed Date: <strong>{{issue_date}}</strong> at {{pol}}</div>
      <div style="text-align: right; border-top: 1px solid #000; width: 200px; padding-top: 4px;">
        Signature of Issuing Carrier / Agent
      </div>
    </div>
  </div>
</body>
</html>`
  },

  // 4. Gate Pass (EIR)
  {
    id: 'tmpl_gp_01',
    name: 'Depot & Terminal Gate Pass (EIR)',
    docType: 'GATE_PASS',
    docTypeLabel: 'Gate Pass (EIR)',
    description: 'Equipment Interchange Receipt & Gate Pass for container entry/exit from terminals and off-dock yards.',
    version: '2.1',
    isShiplotMaster: true,
    isDefault: true,
    lastUpdated: '2026-10-02',
    author: 'Shiplot SuperAdmin',
    availableTags: commonTemplateTags,
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; font-size: 11px; }
    .gp-container { border: 2px solid #000; padding: 15px; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
    .title { font-size: 18px; font-weight: 900; letter-spacing: 1px; }
    .pass-no { font-size: 13px; font-weight: bold; font-family: monospace; color: #b91c1c; }
    .grid { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .grid td { border: 1px solid #ccc; padding: 6px; }
    .label { font-size: 8px; font-weight: bold; text-transform: uppercase; color: #555; }
    .val { font-size: 11px; font-weight: bold; }
    .weighbridge { background: #f9f9f9; border: 1px solid #000; padding: 8px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="gp-container">
    <div class="header">
      <div class="title">{{company_name}}</div>
      <div>TERMINAL & DEPOT EQUIPMENT INTERCHANGE RECEIPT (EIR)</div>
      <div class="pass-no">GATE PASS NO: {{gatepass_number}}</div>
      <div style="font-size: 10px;">Date & Time: {{issue_date}}</div>
    </div>

    <table class="grid">
      <tr>
        <td style="width: 50%;">
          <div class="label">Container Number</div>
          <div class="val" style="font-size: 14px; font-family: monospace;">{{container_no}}</div>
        </td>
        <td style="width: 50%;">
          <div class="label">Seal Number</div>
          <div class="val" style="font-family: monospace;">{{seal_no}}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="label">Delivery Order Ref / B/L</div>
          <div class="val">{{do_number}} (B/L: {{bl_number}})</div>
        </td>
        <td>
          <div class="label">Carrier / Shipping Line</div>
          <div class="val">{{company_name}} / FMC {{fmc_license}}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="label">Truck / Trailer Registration No</div>
          <div class="val">TX-1092M / Bedford Multi-Axle</div>
        </td>
        <td>
          <div class="label">Driver Name & CNIC / License</div>
          <div class="val">Muhammad Rafiq (Lic #KHI-882109)</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="label">Transporter / Haulage Contractor</div>
          <div class="val">National Goods & Drayage Transport Co.</div>
        </td>
        <td>
          <div class="label">Gate Status & Movement</div>
          <div class="val">GATE OUT (LADEN) &bull; AUTHORIZED</div>
        </td>
      </tr>
    </table>

    <div class="weighbridge">
      <strong>WEIGHBRIDGE CERTIFICATE:</strong> Gross: <strong>{{gross_weight}} KG</strong> | Tare: <strong>3,820 KG</strong> | Net Cargo: <strong>Verified</strong>
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 9px; text-align: center;">
      <div style="border-top: 1px solid #000; width: 150px; padding-top: 4px;">Driver Signature</div>
      <div style="border-top: 1px solid #000; width: 150px; padding-top: 4px;">Security Gate Officer</div>
      <div style="border-top: 1px solid #000; width: 180px; padding-top: 4px;">Authorized Terminal Surveyor</div>
    </div>
  </div>
</body>
</html>`
  },

  // 5. Commercial Freight Invoice
  {
    id: 'tmpl_inv_01',
    name: 'Commercial Ocean Freight & Detention Invoice',
    docType: 'INVOICE',
    docTypeLabel: 'Freight Invoice',
    description: 'Bilingual / standard ocean freight invoice format with itemized ocean slot fees, terminal THC, and demurrage recovery.',
    version: '1.9',
    isShiplotMaster: true,
    isDefault: true,
    lastUpdated: '2026-10-02',
    author: 'Shiplot SuperAdmin',
    availableTags: commonTemplateTags,
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 24px; color: #111; font-size: 11px; }
    .inv-header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 15px; }
    .company-title { font-size: 20px; font-weight: bold; }
    .inv-title { float: right; text-align: right; }
    .inv-title h1 { margin: 0; font-size: 22px; font-weight: 900; }
    .inv-num { font-size: 13px; font-family: monospace; font-weight: bold; }
    .party-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    .party-table td { padding: 8px; border: 1px solid #ddd; vertical-align: top; }
    .charges-table { width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 15px; }
    .charges-table th { background: #f0f0f0; border: 1px solid #000; padding: 6px; font-size: 9px; text-transform: uppercase; }
    .charges-table td { border: 1px solid #000; padding: 6px; font-size: 10px; }
    .bank-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 4px; font-size: 10px; width: 60%; }
  </style>
</head>
<body>
  <div class="inv-header">
    <div class="inv-title">
      <h1>COMMERCIAL INVOICE</h1>
      <div class="inv-num">INVOICE: {{invoice_number}}</div>
      <div style="font-size: 10px; color: #555;">Date: {{issue_date}}</div>
      <div style="font-size: 10px; color: #b91c1c; font-weight: bold;">Due Date: {{validity_date}}</div>
    </div>
    <div class="company-title">{{company_name}}</div>
    <div style="font-size: 10px; color: #444;">{{company_address}}</div>
    <div style="font-size: 10px; color: #444;">Tel: {{company_phone}} | Email: {{company_email}}</div>
    <div style="font-size: 9px; color: #666;">FMC Reg: {{fmc_license}} | NTN / Tax ID: {{tax_id}}</div>
    <div style="clear: both;"></div>
  </div>

  <table class="party-table">
    <tr>
      <td style="width: 50%;">
        <div style="font-size: 8.5px; font-weight: bold; color: #666; text-transform: uppercase;">BILLED TO (CUSTOMER):</div>
        <div style="font-size: 12px; font-weight: bold; margin-top: 2px;">{{consignee_name}}</div>
        <div>{{consignee_address}}</div>
      </td>
      <td style="width: 50%;">
        <div style="font-size: 8.5px; font-weight: bold; color: #666; text-transform: uppercase;">SHIPMENT PARTICULARS:</div>
        <div>B/L Reference: <strong>{{bl_number}}</strong></div>
        <div>Vessel & Voyage: <strong>{{vessel_name}} / {{voyage}}</strong></div>
        <div>POL / POD: <strong>{{pol}} &rarr; {{pod}}</strong></div>
        <div>Container: <strong>{{container_no}}</strong></div>
      </td>
    </tr>
  </table>

  <table class="charges-table">
    <thead>
      <tr>
        <th style="width: 10%;">Item</th>
        <th style="width: 55%;">Description of Charges</th>
        <th style="width: 15%; text-align: right;">Currency</th>
        <th style="width: 20%; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Ocean Freight (Basic Freight Rate - 1x40' HC)</td>
        <td style="text-align: right;">USD</td>
        <td style="text-align: right; font-weight: bold;">2,850.00</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Terminal Handling Charges (THC at Port of Discharge)</td>
        <td style="text-align: right;">USD</td>
        <td style="text-align: right; font-weight: bold;">350.00</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Bunker Adjustment Factor (BAF / Low Sulfur Fuel)</td>
        <td style="text-align: right;">USD</td>
        <td style="text-align: right; font-weight: bold;">220.00</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Documentation & Electronic Delivery Order Issuance Fee</td>
        <td style="text-align: right;">USD</td>
        <td style="text-align: right; font-weight: bold;">85.00</td>
      </tr>
    </tbody>
    <tfoot>
      <tr style="background: #f0f0f0; font-weight: bold; font-size: 11px;">
        <td colspan="3" style="text-align: right;">TOTAL PAYABLE AMOUNT:</td>
        <td style="text-align: right; color: #000; font-size: 13px;">$3,505.00 USD</td>
      </tr>
    </tfoot>
  </table>

  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 15px;">
    <div class="bank-box">
      <strong>WIRE REMITTANCE DETAILS:</strong><br>
      Bank Name: {{bank_name}}<br>
      Account Title: {{company_name}}<br>
      IBAN: {{bank_iban}}<br>
      Please quote Invoice <strong>{{invoice_number}}</strong> in payment reference.
    </div>
    <div style="text-align: center; width: 180px; border-top: 1px solid #000; padding-top: 4px; margin-top: 30px;">
      <div>Authorized Accounts Signatory</div>
      <div style="font-weight: bold; font-size: 10px;">{{signatory_name}}</div>
    </div>
  </div>
</body>
</html>`
  },

  // 6. Arrival Notice
  {
    id: 'tmpl_an_01',
    name: 'Cargo Arrival Notice & Customs Clearance Advice',
    docType: 'ARRIVAL_NOTICE',
    docTypeLabel: 'Arrival Notice',
    description: 'Standard advice note sent to Notify Party and Consignee upon vessel arrival at port.',
    version: '1.2',
    isShiplotMaster: true,
    isDefault: true,
    lastUpdated: '2026-10-01',
    author: 'Shiplot SuperAdmin',
    availableTags: commonTemplateTags,
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 24px; color: #111; font-size: 11px; }
    .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 12px; }
    .title { font-size: 18px; font-weight: bold; }
    .badge { float: right; text-align: right; font-weight: bold; font-size: 16px; color: #0369a1; }
    .box { border: 1px solid #000; padding: 8px; margin-bottom: 10px; font-size: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">CARGO ARRIVAL NOTICE</div>
    <div class="title">{{company_name}}</div>
    <div style="font-size: 10px; color: #555;">{{company_address}} | Tel: {{company_phone}}</div>
    <div style="clear: both;"></div>
  </div>

  <p>Dear Customer / Clearing Agent,</p>
  <p>Please be advised that the cargo described below has arrived / is scheduled to arrive at <strong>{{pod}}</strong> on board <strong>{{vessel_name}} (Voy: {{voyage}})</strong> on <strong>{{issue_date}}</strong>:</p>

  <div class="box">
    <strong>B/L Number:</strong> {{bl_number}}<br>
    <strong>Consignee:</strong> {{consignee_name}}<br>
    <strong>Notify Party:</strong> {{notify_party}}<br>
    <strong>Container(s):</strong> {{container_no}} (Seal: {{seal_no}})<br>
    <strong>Cargo Description:</strong> {{cargo_description}}<br>
    <strong>Total Weight:</strong> {{gross_weight}} KG &bull; <strong>Volume:</strong> {{cbm_volume}} CBM
  </div>

  <p>Please surrender the Original Bill of Lading and settle all outstanding freight and port dues to obtain your Delivery Order (D.O.). Free time starts 24 hours after container discharge.</p>

  <div style="margin-top: 30px;">
    Sincerely,<br>
    <strong>Import Customer Service Desk</strong><br>
    {{company_name}}
  </div>
</body>
</html>`
  }
];
