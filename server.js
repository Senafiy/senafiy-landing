/**
 * Senafiy Landing Page - Backend Server
 * 
 * Features:
 * 1. Serves static files (HTML, CSS, SVG, etc.)
 * 2. Receives email subscriptions from the Landing Page
 * 3. Appends subscribers directly to:
 *    - subscribers.csv (UTF-8 BOM - opens directly in Excel with full Arabic support)
 *    - subscribers.xls (Excel XML Spreadsheet format)
 * 4. API endpoint to export/download Excel directly: GET /api/export-excel
 * 
 * Usage:
 *   node server.js
 *   (or specify port: PORT=8080 node server.js)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const CSV_FILE = path.join(__dirname, 'subscribers.csv');
const XLS_FILE = path.join(__dirname, 'subscribers.xls');
const JSON_FILE = path.join(__dirname, 'subscribers.json');

// Ensure files exist
if (!fs.existsSync(CSV_FILE)) {
  const header = '\uFEFF"الرقم","البريد الإلكتروني","تاريخ التسجيل","المصدر","اللغة"\n';
  fs.writeFileSync(CSV_FILE, header, 'utf8');
}

function loadSubscribers() {
  if (fs.existsSync(JSON_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveSubscribers(list) {
  fs.writeFileSync(JSON_FILE, JSON.stringify(list, null, 2), 'utf8');

  // Update CSV with UTF-8 BOM
  let csvContent = '\uFEFF"الرقم","البريد الإلكتروني","تاريخ التسجيل","المصدر","اللغة"\n';
  list.forEach((entry, idx) => {
    const row = [
      idx + 1,
      `"${(entry.email || '').replace(/"/g, '""')}"`,
      `"${entry.date || ''}"`,
      `"${(entry.source || 'direct').replace(/"/g, '""')}"`,
      `"${entry.lang || 'ar'}"`
    ].join(',');
    csvContent += row + '\n';
  });
  fs.writeFileSync(CSV_FILE, csvContent, 'utf8');

  // Generate Excel XML Spreadsheet (.xls)
  const xlsContent = generateExcelXml(list);
  fs.writeFileSync(XLS_FILE, xlsContent, 'utf8');
}

function generateExcelXml(list) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<?mso-application progid="Excel.Sheet"?>\n';
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
  xml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
  xml += '<Styles>\n';
  xml += '  <Style ss:ID="header">\n';
  xml += '    <Font ss:Bold="1" ss:Size="12" ss:Color="#FFFFFF"/>\n';
  xml += '    <Interior ss:Color="#144976" ss:Pattern="Solid"/>\n';
  xml += '    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>\n';
  xml += '  </Style>\n';
  xml += '  <Style ss:ID="row">\n';
  xml += '    <Alignment ss:Vertical="Center"/>\n';
  xml += '  </Style>\n';
  xml += '</Styles>\n';
  xml += '<Worksheet ss:Name="قائمة المشتركين">\n';
  xml += '<Table>\n';
  xml += '<Column ss:Width="50"/>\n';
  xml += '<Column ss:Width="250"/>\n';
  xml += '<Column ss:Width="180"/>\n';
  xml += '<Column ss:Width="150"/>\n';
  xml += '<Column ss:Width="80"/>\n';

  // Header row
  xml += '<Row ss:StyleID="header" ss:Height="25">\n';
  xml += '  <Cell><Data ss:Type="String">#</Data></Cell>\n';
  xml += '  <Cell><Data ss:Type="String">البريد الإلكتروني</Data></Cell>\n';
  xml += '  <Cell><Data ss:Type="String">تاريخ التسجيل</Data></Cell>\n';
  xml += '  <Cell><Data ss:Type="String">المصدر</Data></Cell>\n';
  xml += '  <Cell><Data ss:Type="String">اللغة</Data></Cell>\n';
  xml += '</Row>\n';

  // Data rows
  list.forEach((item, i) => {
    xml += '<Row ss:StyleID="row" ss:Height="20">\n';
    xml += `  <Cell><Data ss:Type="Number">${i + 1}</Data></Cell>\n`;
    xml += `  <Cell><Data ss:Type="String">${escapeXml(item.email)}</Data></Cell>\n`;
    xml += `  <Cell><Data ss:Type="String">${escapeXml(item.date)}</Data></Cell>\n`;
    xml += `  <Cell><Data ss:Type="String">${escapeXml(item.source || 'مباشر')}</Data></Cell>\n`;
    xml += `  <Cell><Data ss:Type="String">${escapeXml(item.lang || 'ar')}</Data></Cell>\n`;
    xml += '</Row>\n';
  });

  xml += '</Table>\n</Worksheet>\n</Workbook>';
  return xml;
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.xls': 'application/vnd.ms-excel',
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // API: Subscribe
  if (req.method === 'POST' && pathname === '/api/subscribe') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const email = (data.email || '').trim().toLowerCase();

        if (!email || !email.includes('@')) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'بريد إلكتروني غير صالح' }));
          return;
        }

        const subscribers = loadSubscribers();
        const exists = subscribers.some(s => s.email.toLowerCase() === email);

        if (!exists) {
          subscribers.push({
            email,
            date: new Date().toISOString().replace('T', ' ').slice(0, 19),
            source: data.source || 'Landing Page',
            lang: data.lang || 'ar'
          });
          saveSubscribers(subscribers);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'تم الحفظ في ملف الإكسل بنجاح',
          total: subscribers.length
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'خطأ في معالجة الطلب' }));
      }
    });
    return;
  }

  // API: Export Excel
  if (req.method === 'GET' && pathname === '/api/export-excel') {
    const subscribers = loadSubscribers();
    saveSubscribers(subscribers); // Regenerates files

    if (!fs.existsSync(XLS_FILE)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('لا توجد بيانات بعد');
      return;
    }

    const stat = fs.statSync(XLS_FILE);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.ms-excel',
      'Content-Length': stat.size,
      'Content-Disposition': 'attachment; filename="senafiy-subscribers.xls"'
    });
    fs.createReadStream(XLS_FILE).pipe(res);
    return;
  }

  // API: Export CSV
  if (req.method === 'GET' && pathname === '/api/export-csv') {
    const subscribers = loadSubscribers();
    saveSubscribers(subscribers);

    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="senafiy-subscribers.csv"'
    });
    fs.createReadStream(CSV_FILE).pipe(res);
    return;
  }

  // API: List count
  if (req.method === 'GET' && pathname === '/api/subscribers') {
    const list = loadSubscribers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: list.length, subscribers: list }));
    return;
  }

  // Serve static files
  let safePath = pathname === '/' ? '/index.html' : pathname;
  safePath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 خادم صفحة Senafiy Landing Page يعمل الآن على:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`📊 مسار ملف المشتركين المحدث تلقائياً:`);
  console.log(`📁 ${CSV_FILE}`);
  console.log(`📁 ${XLS_FILE}`);
  console.log(`====================================================`);
});
