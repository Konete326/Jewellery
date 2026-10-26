import { jsPDF } from 'jspdf';
import { STORE_INFO } from '@/constants/storeInfo';

function formatCurrency(amount) {
  if (!amount && amount !== 0) return '—';
  return 'Rs. ' + Math.round(amount).toLocaleString('en-PK');
}

export function generateRateBulletinPdf(ratesData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  doc.setFillColor(28, 25, 23);
  doc.rect(margin, y, contentWidth, 1.2, 'F');
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(28, 25, 23);
  doc.text('KHALIL & SONS JEWELLERS', pageWidth / 2, y, { align: 'center' });
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(115, 115, 115);
  doc.text('MASTER GOLDSMITHS & BESPOKE BRIDAL ATELIER • SADDAR, KARACHI • EST. 1992', pageWidth / 2, y, { align: 'center' });
  y += 4;

  doc.setDrawColor(214, 211, 209);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFillColor(250, 250, 249);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
  doc.setDrawColor(231, 229, 228);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(28, 25, 23);
  doc.text('OFFICIAL DAILY SARAFA MARKET RATE BULLETIN', margin + 5, y + 6);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(87, 83, 78);
  doc.text(`Issued On: ${dateStr} • ${timeStr} (Asia/Karachi PKT)`, margin + 5, y + 11.5);

  const sourceName = ratesData?.marketSource || 'Karachi Sarafa Jewellers Association (gold.pk)';
  const statusMode = ratesData?.isManualOverride ? 'Atelier Verified Benchmark' : 'Live Sarafa Market Sync';
  doc.text(`Market Source: ${sourceName}  |  Status: ${statusMode}`, margin + 5, y + 17);
  y += 28;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(28, 25, 23);
  doc.text('GOLD MARKET BENCHMARK RATES (PKR)', margin, y);
  y += 4;

  const colWidths = [42, 26, 36, 36, 38];
  const colX = [
    margin,
    margin + colWidths[0],
    margin + colWidths[0] + colWidths[1],
    margin + colWidths[0] + colWidths[1] + colWidths[2],
    margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]
  ];

  doc.setFillColor(245, 245, 244);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setDrawColor(214, 211, 209);
  doc.rect(margin, y, contentWidth, 7, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(68, 64, 60);
  doc.text('Karat Specification', colX[0] + 3, y + 4.8);
  doc.text('Purity', colX[1] + 3, y + 4.8);
  doc.text('Per 1 Tola', colX[2] + 3, y + 4.8);
  doc.text('Per 10 Grams', colX[3] + 3, y + 4.8);
  doc.text('Per 1 Gram', colX[4] + 3, y + 4.8);
  y += 7;

  const gold = ratesData?.gold || {};
  const goldRows = [
    { label: '24 Karat (Pure Gold)', purity: '99.9% (.999)', tola: gold['24K']?.tola, tenG: gold['24K']?.tenGram, oneG: gold['24K']?.gram },
    { label: '22 Karat (Bridal Gold)', purity: '91.67% (.916)', tola: gold['22K']?.tola, tenG: gold['22K']?.tenGram, oneG: gold['22K']?.gram },
    { label: '21 Karat (Traditional)', purity: '87.5% (.875)', tola: gold['21K']?.tola, tenG: gold['21K']?.tenGram, oneG: gold['21K']?.gram },
    { label: '18 Karat (Diamond Sets)', purity: '75.0% (.750)', tola: gold['18K']?.tola, tenG: gold['18K']?.tenGram, oneG: gold['18K']?.gram }
  ];

  goldRows.forEach((row, idx) => {
    const rowH = 7.5;
    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 249);
      doc.rect(margin, y, contentWidth, rowH, 'F');
    }
    doc.setDrawColor(231, 229, 228);
    doc.rect(margin, y, contentWidth, rowH, 'S');

    doc.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
    doc.setFontSize(8);
    doc.setTextColor(28, 25, 23);
    doc.text(row.label, colX[0] + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text(row.purity, colX[1] + 3, y + 5);

    doc.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
    doc.setFontSize(8);
    doc.setTextColor(28, 25, 23);
    doc.text(formatCurrency(row.tola), colX[2] + 3, y + 5);
    doc.text(formatCurrency(row.tenG), colX[3] + 3, y + 5);
    doc.text(formatCurrency(row.oneG), colX[4] + 3, y + 5);

    y += rowH;
  });

  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(28, 25, 23);
  doc.text('SILVER (CHANDI) MARKET BENCHMARK RATES (PKR)', margin, y);
  y += 4;

  doc.setFillColor(245, 245, 244);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setDrawColor(214, 211, 209);
  doc.rect(margin, y, contentWidth, 7, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(68, 64, 60);
  doc.text('Silver Specification', colX[0] + 3, y + 4.8);
  doc.text('Purity', colX[1] + 3, y + 4.8);
  doc.text('Per 1 Tola', colX[2] + 3, y + 4.8);
  doc.text('Per 10 Grams', colX[3] + 3, y + 4.8);
  doc.text('Per 1 Gram', colX[4] + 3, y + 4.8);
  y += 7;

  const silver = ratesData?.silver || {};
  const silverRows = [
    { label: '24 Karat (Fine Silver)', purity: '99.9% (.999)', tola: silver['24K']?.tola, tenG: silver['24K']?.tenGram, oneG: silver['24K']?.gram },
    { label: '22 Karat (Sterling 925)', purity: '92.5% (.925)', tola: silver['22K']?.tola, tenG: silver['22K']?.tenGram, oneG: silver['22K']?.gram }
  ];

  silverRows.forEach((row, idx) => {
    const rowH = 7.5;
    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 249);
      doc.rect(margin, y, contentWidth, rowH, 'F');
    }
    doc.setDrawColor(231, 229, 228);
    doc.rect(margin, y, contentWidth, rowH, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(28, 25, 23);
    doc.text(row.label, colX[0] + 3, y + 5);

    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text(row.purity, colX[1] + 3, y + 5);

    doc.setFontSize(8);
    doc.setTextColor(28, 25, 23);
    doc.text(formatCurrency(row.tola), colX[2] + 3, y + 5);
    doc.text(formatCurrency(row.tenG), colX[3] + 3, y + 5);
    doc.text(formatCurrency(row.oneG), colX[4] + 3, y + 5);

    y += rowH;
  });

  y += 12;

  doc.setFillColor(250, 250, 249);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(231, 229, 228);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(68, 64, 60);
  doc.text('CRAFTSMANSHIP & ATELIER NOTICE', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(115, 115, 115);
  doc.text('• Daily bullion rates represent benchmark un-worked raw precious metal values fixed by Karachi Sarafa Association.', margin + 4, y + 10.5);
  doc.text('• Making charges (jurai), 3D CAD casting, gemstone settings, and polki uncut work are calculated individually on custom pieces.', margin + 4, y + 15);
  doc.text('• Every gold piece created at Khalil & Sons is certified with lifetime purity and transparent buy-back hallmark guarantees.', margin + 4, y + 19.5);

  y += 30;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(28, 25, 23);
  doc.text('KHALIL & SONS JEWELLERS • SHOWROOM & ATELIER', margin, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(87, 83, 78);
  doc.text(`Address: ${STORE_INFO.address.line1}, ${STORE_INFO.address.area}, ${STORE_INFO.address.city}, Pakistan`, margin, y);
  y += 4;
  doc.text(`Landline: ${STORE_INFO.phone.landlineFormatted}  |  WhatsApp Consultations: ${STORE_INFO.phone.mobile}  |  Web: khalilandsons.pk`, margin, y);

  y = 282;
  doc.setDrawColor(214, 211, 209);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.text('Certified Bullion Rate Bulletin • Generated from Khalil & Sons Official Atelier System', margin, y);
  doc.text('System crafted by elitedevagency', pageWidth - margin, y, { align: 'right' });

  const dateSlug = now.toISOString().slice(0, 10);
  doc.save(`Khalil_Sons_Sarafa_Rates_${dateSlug}.pdf`);
}
