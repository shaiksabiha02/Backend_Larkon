import PDFDocument from "pdfkit";
import {
  getInvoices,
  getInvoiceById,
  sendInvoiceEmail,
  generateInvoicePDF,
} from "../services/invoiceService.js";

export async function listInvoices(req, res) {
  try {
    const result = await getInvoices();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
    });
  }
}

export async function fetchInvoiceById(req, res) {
  try {
    const { id } = req.params;

    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);

    return res.status(500).json({
      message: "Failed to fetch invoice",
    });
  }
}

export async function sendInvoice(req, res) {
  try {
    const { id } = req.params;
    const result = await sendInvoiceEmail(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Invoice email sent successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send invoice email",
    });
  }
}


// Download invoice as PDF
export async function downloadInvoice(req, res) {
  try {
    const { id } = req.params;

    const data = await generateInvoicePDF(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const { invoice, billing, items, summary } = data;

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice.invoice_number}.pdf`,
    );

    doc.pipe(res);

    doc.fontSize(20).text("Larkon Invoice", { align: "center" });

    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Invoice Number: ${invoice.invoice_number}`)
      .text(`Customer: ${billing.name}`)
      .text(`Email: ${billing.email}`)
      .text(`Phone: ${billing.phone || "N/A"}`)
      .text(`Order Date: ${invoice.order_date}`)
      .text(`Payment Status: ${invoice.payment_status}`)
      .text(`Order Status: ${invoice.order_status}`)
      .text(`Shipping Address: ${invoice.shipping_address || "N/A"}`);

    doc.moveDown();

    doc.fontSize(14).text("Items");

    doc.moveDown();

    items.forEach((item, index) => {
      doc
        .fontSize(11)
        .text(
          `${index + 1}. ${item.product_name} | ` +
            `Size: ${item.size || "N/A"} | ` +
            `Quantity: ${item.quantity} | ` +
            `Price: ${item.price} | ` +
            `Tax: ${item.tax} | ` +
            `Total: ${item.total}`,
        );

      doc.moveDown(0.5);
    });

    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Subtotal: ${summary.subtotal}`)
      .text(`Discount: ${summary.discount}`)
      .text(`Tax: ${summary.tax}`)
      .text(`Grand Total: ${summary.grand_total}`);

    doc.end();
  } catch (error) {
    console.error("Error downloading invoice:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download invoice PDF",
    });
  }
}
