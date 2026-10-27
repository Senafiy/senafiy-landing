/**
 * =========================================================================
 * Senafiy Landing Page - Google Workspace / Google Drive Integration
 * =========================================================================
 * 
 * الميزة والهدف:
 * - يتم إرسال البريد الإلكتروني الذي يدخله الزائر مباشرة وسرياً إلى Google Drive الخاص بك.
 * - لا يتم تخزين أي بريد داخل المتصفح أو على الصفحة، ولا يظهر أي زر أو رابط للمشتركين للعامة.
 * - أنت الوحيد الذي يفتح ويطّلع على الملف من حسابك في Google Drive كملف Google Sheets أو تحميله Excel.
 * 
 * -------------------------------------------------------------------------
 * خطوات الإعداد السريعة في حساب Google Workspace:
 * -------------------------------------------------------------------------
 * 1. افتح Google Drive بحسابك، واضغط (+ جديد) -> جدول بيانات Google جديد (Google Sheets).
 * 2. سمِّ الملف: Senafiy - قائمة الانتظار
 * 3. في أول صف من الجدول، ضع العناوين التالية:
 *    [A1: #]  [B1: البريد الإلكتروني]  [C1: تاريخ التسجيل]  [D1: المصدر]  [E1: اللغة]
 * 
 * 4. من القائمة العلوية داخل الجدول، اضغط:
 *    التطبيقات الملحقة (Extensions) -> Apps Script
 * 
 * 5. احذف أي كود موجود في المحرر، والصق هذا الكود بالكامل:
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};

    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var email = (data.email || '').trim().toLowerCase();
    if (!email || email.indexOf('@') === -1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid email'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // منع التكرار
    var lastRow = sheet.getLastRow();
    var isDuplicate = false;
    if (lastRow > 1) {
      var existingEmails = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (var i = 0; i < existingEmails.length; i++) {
        if (existingEmails[i][0].toString().toLowerCase() === email) {
          isDuplicate = true;
          break;
        }
      }
    }

    // إضافة المشترك الجديد إذا لم يكن مكرراً
    if (!isDuplicate) {
      var nextIndex = Math.max(1, lastRow);
      var dateStr = Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyyy-MM-dd HH:mm:ss');
      var source = data.source || 'Landing Page Direct';
      var lang = data.lang || 'ar';

      sheet.appendRow([nextIndex, email, dateStr, source, lang]);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * -------------------------------------------------------------------------
 * الخطوة الأخيرة للربط:
 * -------------------------------------------------------------------------
 * 6. اضغط زر (نشر / Deploy) أعلى اليمين -> (نشر جديد / New deployment).
 * 7. اختر نوع النشر: تطبيق ويب (Web app).
 * 8. الإعدادات:
 *    - الوصف: Senafiy Drive Hook
 *    - تنفيذ باسم (Execute as): أنا (حساب Google Workspace الخاص بك)
 *    - من يمكنه الوصول (Who has access): أي شخص (Anyone)
 * 9. اضغط (نشر / Deploy) وانسخ الرابط الذي سيظهر لك (Web App URL).
 * 10. افتح ملف index.html وضع الرابط في السطر:
 *     const GOOGLE_SHEET_WEBHOOK_URL = 'ضع_الرابط_هنا';
 * 
 * مبروك! الآن أي زائر يدخل بريده سيصل سراً وفوراً إلى ملفك في Google Drive.
 */
