import PDFDocument from "pdfkit";
import { getInvoices,
         getInvoiceById,
         sendInvoiceEmail,
         generateInvoicePDF
 } from "../services/invoiceService.js";
 

export async function listInvoices(req,res){

    try {
        const result = await getInvoices();

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Error fetching invoices:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch invoices"
        });
    }
}

export async function fetchInvoiceById(req, res) {
    try {
        const {id} = req.params;

        const invoice = await getInvoiceById(id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        return res.status(200).json({
            success:true,
            data: invoice
        });

    } catch (error) {
        console.error("Error fetching invoice:", error);

        return res.status(500).json({
            message: "Failed to fetch invoice"
        });
    }
}

export async function sendInvoice(req,res){
    try{
        const{id}=req.params;
        const result=await sendInvoiceEmail(id)

        if(!result){
            return res.status(404).json({
                success:false,
                message:"Invoice not found"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Invoice email sent successfully",
            data:result
        });
        
    }catch(error){
        console.error("Error sending invoice email:",error);
        return res.status(500).json({
            success:false,
            message:"Failed to send invoice email"
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
                message: "Invoice not found"
            });
        }

        const { invoice, items } = data;
        
        

        // Create PDF
        const doc = new PDFDocument();

        // Tell Postman/browser that response is a PDF
        res.setHeader("Content-Type", "application/pdf");

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=invoice-${invoice.invoice_number}.pdf`
        );

        // Send PDF to response
        doc.pipe(res);

        // Invoice heading
        doc
            .fontSize(20)
            .text("Larkon Invoice", { align: "center" });

        doc.moveDown();

        // Invoice details
        doc
            .fontSize(12)
            .text(`Invoice Number: ${invoice.invoice_number}`)
            .text(`Customer: ${invoice.first_name} ${invoice.last_name}`)
            .text(`Email: ${invoice.email}`)
            .text(`Phone: ${invoice.phone || "N/A"}`)
            .text(`Order Date: ${invoice.order_date}`)
            .text(`Payment Status: ${invoice.payment_status}`)
            .text(`Order Status: ${invoice.order_status}`)
            .text(`Shipping Address: ${invoice.shipping_address || "N/A"}`);

        doc.moveDown();

        // Items
        doc
            .fontSize(14)
            .text("Items");

        doc.moveDown();

        items.forEach((item, index) => {

            doc
                .fontSize(11)
                .text(
                    `${index + 1}. ${item.product_name} | ` +
                    `Size: ${item.size || "N/A"} | ` +
                    `Quantity: ${item.quantity} | ` +
                    `Price: ${item.price} | ` +
                    `Discount: ${item.discount} | ` +
                    `Tax: ${item.tax} | ` +
                    `Total: ${item.total}`
                );

            doc.moveDown(0.5);
        });

        doc.moveDown();

        // Calculate totals
        const subtotal = items.reduce(
            (sum, item) =>
                sum + Number(item.price) * Number(item.quantity),
            0
        );

        const discount = items.reduce(
            (sum, item) =>
                sum + Number(item.discount) * Number(item.quantity),
            0
        );

        const tax = items.reduce(
            (sum, item) =>
                sum + Number(item.tax) * Number(item.quantity),
            0
        );

        const total = items.reduce(
            (sum, item) =>
                sum + Number(item.total),
            0
        );

        // Invoice summary
        doc
            .fontSize(12)
            .text(`Subtotal: ${subtotal}`)
            .text(`Discount: ${discount}`)
            .text(`Tax: ${tax}`)
            .text(`Grand Total: ${total}`);

        // Finish PDF
        doc.end();

    } catch (error) {

        console.error("Error downloading invoice:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to download invoice PDF"
        });
    }
}
