import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LogoIcon from '../assets/images/logo.webp';

export const generateInvoicePDF = async (order) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // VAT calculations
  const total = parseFloat(order.total);
  const vat = parseFloat(order.total_tax || (total * 0.05 / 1.05));
  const subtotal = total - vat;

  const invoiceElement = document.createElement('div');
  invoiceElement.style.width = '800px';
  invoiceElement.style.padding = '30px';
  invoiceElement.style.fontFamily = 'Montserrat, sans-serif';
  invoiceElement.style.background = '#fff';
  invoiceElement.style.color = '#333';
  invoiceElement.style.fontSize = '14px';
  invoiceElement.style.lineHeight = '1.4';

  invoiceElement.innerHTML = `
    <!-- Header -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:25px;">
      
      <!-- Left: Logo + Tax Invoice + Billing -->
      <div style="width:50%;">
        <img src="${LogoIcon}" style="max-width:80px; margin-bottom:10px;" />

        <h2 style="margin:0 0 10px 0; font-size:20px; color:#FF8C00;">
          INVOICE
        </h2>

        <div style="font-size:13px; line-height:1.5;">
          <strong>Billing Address</strong><br/>
          ${order.billing.first_name} ${order.billing.last_name}<br/>
          ${order.billing.address_1}<br/>
          ${order.billing.address_2 || ''}<br/>
          ${order.billing.city}, ${order.billing.state}<br/>
          ${order.billing.country}<br/>
          Phone: ${order.billing.phone}<br/>
          Email: ${order.billing.email}
        </div>
      </div>

      <!-- Right: Company Info + Order Info -->
      <div style="width:45%; text-align:right; font-size:13px; line-height:1.6;">
        <strong>ALTHAKEEL GENERAL TRADING L.L.C</strong><br/>
        TRN 104587430000003<br/>
        DUBAI<br/>
        United Arab Emirates
        <br/><br/>
        <strong>Order Number:</strong> ${order.id}<br/>
        <strong>Order Date:</strong> ${new Date(order.date_created).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}<br/>
        <strong>Payment Method:</strong> ${order.payment_method_title || order.payment_method}
      </div>
    </div>

    <!-- Product Table -->
    <table style="width:100%; border-collapse:collapse; font-size:14px;">
      <thead style="background:#FF8C00; color:#fff;">
        <tr>
          <th style="padding:10px; border:1px solid #ccc; text-align:left;">Product</th>
          <th style="padding:10px; border:1px solid #ccc; text-align:center;">Qty</th>
          <th style="padding:10px; border:1px solid #ccc; text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${order.line_items.map((item, index) => `
          <tr style="background:${index % 2 === 0 ? '#f9f9f9' : '#fff'}">
            <td style="border:1px solid #ccc; padding:8px;">${item.name}</td>
            <td style="border:1px solid #ccc; padding:8px; text-align:center;">${item.quantity}</td>
            <td style="border:1px solid #ccc; padding:8px; text-align:right;">
              ${order.currency} ${parseFloat(item.total).toFixed(2)}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Totals -->
    <div style="margin-top:25px; width:100%; display:flex; justify-content:flex-end;">
      <table style="width:300px; font-size:14px;">
        <tr>
          <td>Subtotal (ex. VAT)</td>
          <td style="text-align:right;">
            ${order.currency} ${subtotal.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td>VAT 5%</td>
          <td style="text-align:right;">
            ${order.currency} ${vat.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td style="font-weight:bold; padding-top:8px;">Total</td>
          <td style="font-weight:bold; text-align:right; padding-top:8px;">
            ${order.currency} ${total.toFixed(2)}
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="margin-top:40px; text-align:center; font-size:13px; color:#555;">
      Thank you for shopping with us.
    </div>
  `;

  document.body.appendChild(invoiceElement);

  const canvas = await html2canvas(invoiceElement, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  const imgProps = doc.getImageProperties(imgData);
  const pdfWidth = pageWidth - 40;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  doc.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
  doc.save(`Invoice_PO-${order.id}.pdf`);

  document.body.removeChild(invoiceElement);
};
