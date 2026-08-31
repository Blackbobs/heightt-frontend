import { jsPDF } from "jspdf";

export interface ReceiptPdfData {
  ref: string;
  title: string;
  org: string;
  amount: number;
  amountFormatted: string;
  date: string;
  payerName?: string;
  payerEmail?: string;
  paymentMethod?: string;
  status?: string;
}

export async function generateReceiptPdf(receipt: ReceiptPdfData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // 1. Top Decorative Brand Bar
  doc.setFillColor(37, 99, 235); // #2563EB Heightt Blue
  doc.rect(0, 0, pageWidth, 8, "F");

  // 2. Header Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(11, 16, 32); // #0B1020 Midnight
  doc.text("Heightt", margin, 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Financial Infrastructure for Campus Organisations", margin, 29);

  // Receipt Header Label on right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(37, 99, 235);
  doc.text("PAYMENT RECEIPT", pageWidth - margin, 23, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Receipt #: ${receipt.ref}`, pageWidth - margin, 29, { align: "right" });

  // Divider Line
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.setLineWidth(0.5);
  doc.line(margin, 35, pageWidth - margin, 35);

  // 3. Status Badge & Metadata Cards
  // Status Box
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.roundedRect(margin, 42, 60, 18, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(21, 128, 61); // emerald-700
  doc.text("PAYMENT STATUS", margin + 6, 48);
  doc.setFontSize(11);
  doc.text("VERIFIED & PAID", margin + 6, 55);

  // Date Box
  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.roundedRect(margin + 65, 42, 50, 18, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("PAYMENT DATE", margin + 71, 48);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 16, 32);
  doc.text(receipt.date || "N/A", margin + 71, 55);

  // Method Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + 120, 42, 50, 18, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("PAYMENT METHOD", margin + 126, 48);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 16, 32);
  doc.text((receipt.paymentMethod || "Card / Online").toUpperCase(), margin + 126, 55);

  // 4. Payer and Organisation Information
  const infoStartY = 70;

  // Box for Payer & Org info
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, infoStartY, contentWidth, 32, 2, 2, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, infoStartY, contentWidth, 32, 2, 2, "S");

  // Left Column: Payer Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("ISSUED TO (STUDENT / MEMBER):", margin + 6, infoStartY + 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(11, 16, 32);
  doc.text(receipt.payerName || "Student Member", margin + 6, infoStartY + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(receipt.payerEmail || "Verified Student Account", margin + 6, infoStartY + 23);

  // Right Column: Organisation Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("COLLECTING ORGANISATION:", margin + 90, infoStartY + 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(11, 16, 32);
  doc.text(receipt.org || "Student Organisation", margin + 90, infoStartY + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Heightt Registered Organisation", margin + 90, infoStartY + 23);

  // 5. Payment Items Table Header
  const tableStartY = 112;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, tableStartY, contentWidth, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("DESCRIPTION / ITEM", margin + 6, tableStartY + 6.5);
  doc.text("CATEGORY", margin + 105, tableStartY + 6.5);
  doc.text("AMOUNT", pageWidth - margin - 6, tableStartY + 6.5, { align: "right" });

  // Table Row
  const rowY = tableStartY + 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 16, 32);
  doc.text(receipt.title, margin + 6, rowY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Annual Student Dues / Official Levy", margin + 6, rowY + 6);

  doc.text("Campus Dues", margin + 105, rowY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(11, 16, 32);
  doc.text(receipt.amountFormatted, pageWidth - margin - 6, rowY, { align: "right" });

  // Table Bottom Line
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, rowY + 14, pageWidth - margin, rowY + 14);

  // 6. Total Amount Highlight Block
  const totalY = rowY + 22;
  doc.setFillColor(239, 246, 255); // blue-50
  doc.roundedRect(margin + 80, totalY, contentWidth - 80, 26, 2, 2, "F");
  doc.setDrawColor(191, 219, 254); // blue-200
  doc.roundedRect(margin + 80, totalY, contentWidth - 80, 26, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text("TOTAL AMOUNT PAID:", margin + 88, totalY + 11);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(11, 16, 32);
  doc.text(receipt.amountFormatted, pageWidth - margin - 8, totalY + 18, { align: "right" });

  // 7. Security & Official Verification Seal
  const sealY = totalY + 42;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, sealY - 8, pageWidth - margin, sealY - 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(11, 16, 32);
  doc.text("HEIGHTT OFFICIAL CLEARANCE VERIFICATION", margin, sealY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This document serves as valid proof of payment for clearance, department records, and faculty accreditation.",
    margin,
    sealY + 6
  );
  doc.text(
    `Digital Verification Reference: ${receipt.ref} · Issued automatically via Heightt Financial System`,
    margin,
    sealY + 11
  );

  // Footer Bottom Note
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Heightt Technologies Inc. · https://www.heightt.app", margin, 285);
  doc.text(`Generated on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, pageWidth - margin, 285, { align: "right" });

  // Save the PDF
  doc.save(`Heightt-Receipt-${receipt.ref}.pdf`);
}
