import puppeteer from 'puppeteer';

export async function generateInvoicePDF(data) {
  const { clientName, projectName, amount, date, items } = data;
  
  // Format items array or use fallback
  const lineItems = items || [{ description: 'Web Development Services', cost: amount || 0 }];
  
  // Basic beautiful HTML for the invoice
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
        body { font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
        .invoice-container { max-width: 800px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #5b21b6; padding-bottom: 20px; margin-bottom: 30px; }
        .header-left h1 { margin: 0; color: #5b21b6; font-size: 32px; font-weight: bold; }
        .header-right { text-align: right; color: #666; }
        .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .details h3 { margin: 0 0 5px 0; color: #333; }
        .details p { margin: 0; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background-color: #f8fafc; color: #5b21b6; font-weight: bold; }
        .total-row td { font-weight: bold; font-size: 18px; border-top: 2px solid #333; }
        .footer { text-align: center; color: #888; font-size: 14px; margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="header-left">
            <h1>INVOICE</h1>
            <p>SyncSpace AI</p>
          </div>
          <div class="header-right">
            <p><strong>Date:</strong> ${date || new Date().toISOString().split('T')[0]}</p>
            <p><strong>Invoice #:</strong> ${Math.floor(Math.random() * 10000)}</p>
          </div>
        </div>
        
        <div class="details">
          <div>
            <h3>Bill To:</h3>
            <p>${clientName || 'Valued Client'}</p>
            <p>Project: ${projectName || 'Standard Project'}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${lineItems.map(item => `
              <tr>
                <td>${item.description}</td>
                <td style="text-align: right;">$${item.cost}</td>
              </tr>
            `).join('')}
            
            <tr class="total-row">
              <td style="text-align: right;">Total</td>
              <td style="text-align: right;">$${amount || lineItems.reduce((acc, curr) => acc + Number(curr.cost), 0)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>This is a system generated invoice via SyncSpace AI Flow.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  let browser;
  try {
    // Launch puppeteer
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set HTML
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF buffer
    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    
    // Convert buffer/Uint8Array to base64 for easy JSON transfer
    return Buffer.from(pdfBuffer).toString('base64');
  } catch (error) {
    console.error("Puppeteer PDF generation error:", error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}
