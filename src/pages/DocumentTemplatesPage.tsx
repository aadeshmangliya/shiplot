import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentTemplate, TemplateDocType } from '../types';
import { commonTemplateTags } from '../mock/templateMockData';
import {
  FileText,
  Code,
  Eye,
  Check,
  Plus,
  Printer,
  Copy,
  Upload,
  Settings,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Trash2,
  Edit3
} from 'lucide-react';

export const DocumentTemplatesPage: React.FC = () => {
  const {
    currentCompany,
    documentTemplates,
    addDocumentTemplate,
    updateDocumentTemplate,
    deleteDocumentTemplate,
    selectCompanyTemplate,
    currentUser
  } = useApp();

  const isShiplotAdmin = currentUser.role === 'platform_admin';

  // Filter by doc type
  const [selectedDocType, setSelectedDocType] = useState<TemplateDocType | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [activeTemplateId, setActiveTemplateId] = useState<string>(documentTemplates[0]?.id || '');
  const [viewMode, setViewMode] = useState<'browse' | 'editor' | 'preview'>('browse');

  // Editor State
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [editorName, setEditorName] = useState('');
  const [editorDocType, setEditorDocType] = useState<TemplateDocType>('HBL');
  const [editorDesc, setEditorDesc] = useState('');
  const [editorHtml, setEditorHtml] = useState('');
  const [editorVersion, setEditorVersion] = useState('1.0');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const docTypeLabels: Record<TemplateDocType, string> = {
    HBL: 'House Bill of Lading (HBL)',
    MBL: 'Master Bill of Lading (MBL)',
    DO: 'Delivery Order (D.O.)',
    AIR_BILL: 'Air Waybill (AWB)',
    GATE_PASS: 'Gate Pass / EIR',
    INVOICE: 'Commercial Freight Invoice',
    ARRIVAL_NOTICE: 'Cargo Arrival Notice',
    SHIPPING_INSTRUCTION: 'Shipping Instructions'
  };

  const currentSelectedTemplate = documentTemplates.find(t => t.id === activeTemplateId) || documentTemplates[0];

  // Helper to substitute dynamic tags with real company data for live preview
  const renderTemplateHtml = (htmlContent: string) => {
    let output = htmlContent;
    const sampleData: Record<string, string> = {
      '{{company_name}}': currentCompany.name,
      '{{company_logo}}': currentCompany.logoUrl || '',
      '{{fmc_license}}': currentCompany.registrationNo,
      '{{tax_id}}': currentCompany.ntnNumber || currentCompany.nationalId || 'NTN-4129840-3',
      '{{company_address}}': currentCompany.address || 'Suite 802, Trade Tower, Karachi, Pakistan',
      '{{company_phone}}': currentCompany.phone || '+92-21-3568-9900',
      '{{company_email}}': currentCompany.adminEmail || 'agency@indusmagna.com',
      '{{website}}': currentCompany.website || 'www.indusmagna.com',
      '{{bl_number}}': 'HBL-2026-8821',
      '{{do_number}}': 'DO-2026-4410',
      '{{airbill_number}}': '072-4410-9921',
      '{{gatepass_number}}': 'GP-2026-9042',
      '{{invoice_number}}': 'INV-2026-7819',
      '{{shipper_name}}': 'Pacific Precision Electronics Inc.',
      '{{shipper_address}}': '108 Industrial Zone, High-Tech Park, Taipei, Taiwan',
      '{{consignee_name}}': 'Indus Micro Distribution Ltd',
      '{{consignee_address}}': 'Suite 401, Business Avenue, P.E.C.H.S Block 6, Shahrah-e-Faisal, Karachi',
      '{{notify_party}}': 'National Logistics Cell (NLC) Clearing Agency, Karachi',
      '{{vessel_name}}': 'MSC Oscar',
      '{{voyage}}': 'MS-2640W',
      '{{pol}}': 'Port of Los Angeles (USLAX)',
      '{{pod}}': 'Karachi Port (KPT - East Wharf)',
      '{{final_destination}}': 'Karachi CFS Depot (PKKHI)',
      '{{container_no}}': 'MSKU7829103',
      '{{seal_no}}': 'SL-881920',
      '{{cargo_description}}': 'Integrated circuit components and telecommunication controllers in seaworthy packaging',
      '{{gross_weight}}': '21,450',
      '{{cbm_volume}}': '48.5',
      '{{packages_count}}': '1,200',
      '{{freight_term}}': 'FREIGHT PREPAID',
      '{{issue_date}}': '2026-10-05',
      '{{validity_date}}': '2026-10-19',
      '{{signatory_name}}': currentCompany.signatoryName || 'Capt. Rehan Siddiqui',
      '{{signatory_title}}': currentCompany.signatoryTitle || 'Authorized Managing Representative',
      '{{bank_name}}': currentCompany.bankName || 'Habib Bank Limited (HBL) - Corporate Branch',
      '{{bank_iban}}': currentCompany.bankIban || 'PK36HABB000129840192801'
    };

    Object.entries(sampleData).forEach(([tag, val]) => {
      output = output.split(tag).join(val);
    });

    return output;
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleSelectTemplateForCompany = (tmpl: DocumentTemplate) => {
    selectCompanyTemplate(tmpl.docType, tmpl.id);
    setToastMessage(`Selected "${tmpl.name}" as your active printing template for ${tmpl.docTypeLabel}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenEditor = (tmpl?: DocumentTemplate) => {
    if (tmpl) {
      setEditingTemplate(tmpl);
      setEditorName(tmpl.name);
      setEditorDocType(tmpl.docType);
      setEditorDesc(tmpl.description);
      setEditorHtml(tmpl.htmlContent);
      setEditorVersion(tmpl.version);
    } else {
      setEditingTemplate(null);
      setEditorName('Custom Carrier Format');
      setEditorDocType('HBL');
      setEditorDesc('Custom company formatted printout template');
      setEditorHtml(documentTemplates[0]?.htmlContent || '<div>Sample Template</div>');
      setEditorVersion('1.0');
    }
    setViewMode('editor');
  };

  const handleSaveEditorTemplate = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTemplate) {
      updateDocumentTemplate(editingTemplate.id, {
        name: editorName,
        docType: editorDocType,
        docTypeLabel: docTypeLabels[editorDocType],
        description: editorDesc,
        htmlContent: editorHtml,
        version: editorVersion,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      setToastMessage(`Template "${editorName}" updated successfully!`);
    } else {
      const newTmpl: DocumentTemplate = {
        id: `tmpl_${Date.now()}`,
        name: editorName,
        docType: editorDocType,
        docTypeLabel: docTypeLabels[editorDocType],
        description: editorDesc,
        version: editorVersion,
        isShiplotMaster: isShiplotAdmin,
        isDefault: false,
        companyId: currentCompany.id,
        htmlContent: editorHtml,
        availableTags: commonTemplateTags,
        lastUpdated: new Date().toISOString().split('T')[0],
        author: isShiplotAdmin ? 'Shiplot SuperAdmin' : currentCompany.name
      };
      addDocumentTemplate(newTmpl);
      setActiveTemplateId(newTmpl.id);
      setToastMessage(`New template "${editorName}" added to the library!`);
    }

    setViewMode('browse');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setEditorHtml(content);
        setToastMessage(`HTML template loaded from ${file.name}`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const filteredTemplates = documentTemplates.filter(tmpl => {
    if (selectedDocType !== 'ALL' && tmpl.docType !== selectedDocType) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        tmpl.name.toLowerCase().includes(q) ||
        tmpl.docTypeLabel.toLowerCase().includes(q) ||
        tmpl.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              DOCUMENT TEMPLATES ENGINE
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Shiplot Admin & NVOCC Company Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Master Document Templates & Printout Formats
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Shiplot admin uploads HTML templates with dynamic tags. NVOCC carriers select their preferred format for HBL, DO, AWB, and Gate Passes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleOpenEditor()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-mono text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload / Create Template</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-mono flex items-center gap-2 shadow-xs transition-all">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation View Modes */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-3 text-xs font-mono">
        <button
          onClick={() => setViewMode('browse')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            viewMode === 'browse'
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Browse Available Templates ({filteredTemplates.length})</span>
        </button>

        <button
          onClick={() => setViewMode('preview')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            viewMode === 'preview'
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Interactive HTML Preview</span>
        </button>

        <button
          onClick={() => handleOpenEditor(currentSelectedTemplate)}
          className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            viewMode === 'editor'
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>HTML Template Code Editor & Tags</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: BROWSE TEMPLATES                                 */}
      {/* ======================================================== */}
      {viewMode === 'browse' && (
        <div className="space-y-6">
          {/* Doc Type Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
            <button
              onClick={() => setSelectedDocType('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer ${
                selectedDocType === 'ALL'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              All Types ({documentTemplates.length})
            </button>

            {(Object.keys(docTypeLabels) as TemplateDocType[]).map(typeKey => (
              <button
                key={typeKey}
                onClick={() => setSelectedDocType(typeKey)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer ${
                  selectedDocType === typeKey
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {typeKey} ({documentTemplates.filter(t => t.docType === typeKey).length})
              </button>
            ))}
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map(tmpl => {
              const isActiveForCompany =
                currentCompany.selectedTemplates?.[tmpl.docType] === tmpl.id ||
                (!currentCompany.selectedTemplates?.[tmpl.docType] && tmpl.isDefault);

              return (
                <div
                  key={tmpl.id}
                  className={`p-5 rounded-xl border bg-white dark:bg-neutral-900 shadow-xs flex flex-col justify-between transition-all ${
                    isActiveForCompany
                      ? 'border-neutral-900 dark:border-white ring-1 ring-neutral-900 dark:ring-white'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300">
                        {tmpl.docType}
                      </span>
                      {isActiveForCompany ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ACTIVE FOR {currentCompany.displayName || currentCompany.name}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-neutral-400">
                          v{tmpl.version}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                        {tmpl.name}
                      </h3>
                      <p className="text-xs text-neutral-500 font-mono mt-1 line-clamp-2">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-[10px] font-mono text-neutral-400">
                      <span>Author: {tmpl.author}</span>
                      <span>Updated: {tmpl.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setActiveTemplateId(tmpl.id);
                          setViewMode('preview');
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-mono font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer flex items-center gap-1"
                        title="Live Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditor(tmpl)}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                        title="Edit HTML Source"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isActiveForCompany ? (
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Default Active</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSelectTemplateForCompany(tmpl)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-mono font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 cursor-pointer transition-colors"
                      >
                        Select Format
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: LIVE INTERACTIVE PREVIEW                         */}
      {/* ======================================================== */}
      {viewMode === 'preview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-neutral-500">Previewing Template:</span>
              <select
                value={activeTemplateId}
                onChange={e => setActiveTemplateId(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono font-bold text-neutral-900 dark:text-white"
              >
                {documentTemplates.map(t => (
                  <option key={t.id} value={t.id}>
                    [{t.docType}] {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectTemplateForCompany(currentSelectedTemplate)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Use This Template for {currentSelectedTemplate.docType}</span>
              </button>

              <button
                onClick={() => {
                  const printWin = window.open('', '_blank');
                  if (printWin) {
                    printWin.document.write(renderTemplateHtml(currentSelectedTemplate.htmlContent));
                    printWin.document.close();
                    printWin.focus();
                    printWin.print();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Test Output</span>
              </button>
            </div>
          </div>

          {/* Rendered HTML Sheet Box */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-950 p-6 flex justify-center overflow-x-auto shadow-inner">
            <div className="bg-white text-black shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-4 transition-all">
              <div
                dangerouslySetInnerHTML={{
                  __html: renderTemplateHtml(currentSelectedTemplate.htmlContent)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: HTML CODE EDITOR & AVAILABLE DYNAMIC TAGS        */}
      {/* ======================================================== */}
      {viewMode === 'editor' && (
        <form onSubmit={handleSaveEditorTemplate} className="space-y-6 font-mono text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="font-bold text-sm text-neutral-900 dark:text-white">
                {editingTemplate ? `Editing: ${editingTemplate.name}` : 'New Custom HTML Template'}
              </span>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Insert dynamic tags anywhere in your HTML. When printed, tags are replaced with real data.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer font-bold">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload HTML File</span>
                <input
                  type="file"
                  accept=".html,.htm,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-bold rounded-lg cursor-pointer"
              >
                <span>Save Template</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form Metadata & HTML Code Textarea */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                      Document Type *
                    </label>
                    <select
                      value={editorDocType}
                      onChange={e => setEditorDocType(e.target.value as TemplateDocType)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    >
                      {(Object.keys(docTypeLabels) as TemplateDocType[]).map(t => (
                        <option key={t} value={t}>
                          {t} - {docTypeLabels[t]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editorName}
                      onChange={e => setEditorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                      Version
                    </label>
                    <input
                      type="text"
                      value={editorVersion}
                      onChange={e => setEditorVersion(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-1">
                      Description / Legal Scope
                    </label>
                    <input
                      type="text"
                      value={editorDesc}
                      onChange={e => setEditorDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                      HTML & CSS Template Source Code *
                    </label>
                    <span className="text-[10px] text-neutral-400">
                      {editorHtml.split('\n').length} lines &bull; Clean HTML5
                    </span>
                  </div>
                  <textarea
                    rows={22}
                    required
                    value={editorHtml}
                    onChange={e => setEditorHtml(e.target.value)}
                    className="w-full p-4 rounded-lg font-mono text-[11px] leading-relaxed border border-neutral-200 dark:border-neutral-800 bg-neutral-950 text-emerald-400 focus:outline-hidden"
                    placeholder="<!DOCTYPE html><html><head><style>...</style></head><body>...</body></html>"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Dynamic Tags Reference Panel (Requested by User) */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans">
                      Available Dynamic Tags
                    </h3>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Click any tag below to copy it to clipboard. Paste into your HTML code to automatically bind data:
                  </p>
                </div>

                {copiedTag && (
                  <div className="p-2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied {copiedTag} to clipboard!</span>
                  </div>
                )}

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                      Carrier & Company Branding:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '{{company_name}}',
                        '{{company_logo}}',
                        '{{fmc_license}}',
                        '{{tax_id}}',
                        '{{company_address}}',
                        '{{company_phone}}',
                        '{{company_email}}',
                        '{{website}}'
                      ].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleCopyTag(tag)}
                          className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-[10px] font-mono cursor-pointer transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                      Document Numbers & Dates:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '{{bl_number}}',
                        '{{do_number}}',
                        '{{airbill_number}}',
                        '{{gatepass_number}}',
                        '{{invoice_number}}',
                        '{{issue_date}}',
                        '{{validity_date}}'
                      ].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleCopyTag(tag)}
                          className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 hover:bg-blue-100 text-[10px] font-mono cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                      Trade Parties:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '{{shipper_name}}',
                        '{{shipper_address}}',
                        '{{consignee_name}}',
                        '{{consignee_address}}',
                        '{{notify_party}}'
                      ].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleCopyTag(tag)}
                          className="px-2 py-1 rounded bg-purple-50 dark:bg-purple-950 text-purple-800 dark:text-purple-300 hover:bg-purple-100 text-[10px] font-mono cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                      Voyage & Port Routing:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '{{vessel_name}}',
                        '{{voyage}}',
                        '{{pol}}',
                        '{{pod}}',
                        '{{final_destination}}'
                      ].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleCopyTag(tag)}
                          className="px-2 py-1 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 hover:bg-cyan-100 text-[10px] font-mono cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                      Containers & Cargo Particulars:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '{{container_no}}',
                        '{{seal_no}}',
                        '{{containers_table}}',
                        '{{cargo_description}}',
                        '{{gross_weight}}',
                        '{{cbm_volume}}',
                        '{{packages_count}}',
                        '{{freight_term}}'
                      ].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleCopyTag(tag)}
                          className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-[10px] font-mono cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                      Bank Wire & Signatories:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '{{bank_name}}',
                        '{{bank_iban}}',
                        '{{signatory_name}}',
                        '{{signatory_title}}'
                      ].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleCopyTag(tag)}
                          className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 text-[10px] font-mono cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
