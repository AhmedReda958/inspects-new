# Script to rename Arabic image files to English names
# Run from project root

$basePath = "public\images\sections\problems-gallery"

# Architectural images mapping (order matters - matches content.ts)
$archFiles = @(
    "اثار رطوبة في الجدران الداخلية.jpg",
    "تسنين في البلاط.jpg",
    "تشققات عامودية في جدران الاسوار.jpg",
    "تشققات في الاسقف المستعارة.jpg",
    "تشققات قطرية في جدران السور.jpg",
    "تضرر وانتفاخ في قشرة الباب الخشبي.jpg",
    "تعبئة الفواصل بين البلاط (روبة)..jpg",
    "تموج في الجدران والسقف.jpg",
    "صدأ في الباب المعدني.jpg",
    "عدم استقامة زوايا الجدران.jpg",
    "عدم استكمال اعمال فواصل التمدد .jpg",
    "فصل بين السور والمبنى نتيجة هبوط.jpg",
    "فصل في رخام الدرج نتيجة هبوط.jpg",
    "وجود تشققات متفرقة.jpg",
    "يوجد فصل بين اعمال رخام المغاسل.jpg"
)

# Electrical images mapping
$elecFiles = @(
    "اسلاك بدون أنابيب كهربائية ونقاط تجميع.jpg",
    "التبديل بين الفاز والنيوترال .jpg",
    "تركيب قاطع فرعي مخالف لمتطلبات السلامة.jpg",
    "تمديد مخالف لمتطلبات السلامة .jpg",
    "تمديدات كهربائية بالقرب من مصادر المياه .jpg",
    "توزيع احمال سيء .jpg",
    "توصيل الكابلات سيء.jpg",
    "توصيل خاطىء مباشر من القاطع الرئيسي.jpg",
    "سعة القواطع غير مناسبة لمساحة مقطع الأسلاك المستخدمة.jpg",
    "سلك بدون استخدام راس الكيبل لتثبيت محكم.jpg",
    "صندوق الفيش خارج الجدار مخالف للمواصفات الفنية.jpg",
    "عازلية الكوابل الكهربائية سيئة .jpg",
    "عدم تركيب علب مطرية .jpg",
    "لم يتم سحب اسلاك التأريض للفيش.jpg",
    "لم يتم سحب اسلاك التأريض.jpg",
    "مقاومة تأريض اعلى من الحد المسموح به بالكود السعودي.jpg",
    "هبوط الجهد الكهربائي .jpg",
    "وجود الأفياش في مناطق الاستحمام يشكل خطر على السلامة .jpg"
)

# Mechanical images mapping
$mechFiles = @(
    "أثر التسريبات تجاه جدران بئر المصعد.jpg",
    "تجمع مخلفات البناء في خطوط صرف التكييف.jpg",
    "تلف في عزل انابيب التبريد يسبب ارتفاع في استهلاك الطاقة واحتمالية تسربات داخلية.jpg",
    "ثقب في انابيب الصرف.jpg",
    "ركود المياه وتشبعها في حلول البلاط نتيجة الترويب السيء.jpg",
    "ركود مخلفات صلبة في انابيب الصرف وعدم تركيب صحيح للوصلات.jpg",
    "صورة حراراية تبين وجود تجمع لرطوبة وتسريب من السقف الخرساني.jpg",
    "كسر في خطوط الصرف الرئيسية للوحدات الصحية.jpg",
    "مستوى الرطبوة في الجدران _متوسط _تحتوي على محتوى مائي.jpg",
    "مستوى رطوبة اسفل البلاط _اعلى من المتوسط.jpg"
)

# Rename Arch files
Write-Host "Renaming Arch files..."
$archPath = Join-Path $basePath "Arch"
$i = 1
foreach ($file in $archFiles) {
    $oldPath = Join-Path $archPath $file
    $newName = "arch-$('{0:D2}' -f $i).jpg"
    $newPath = Join-Path $archPath $newName
    if (Test-Path $oldPath) {
        if (Test-Path $newPath) {
            Write-Host "Skipping $newName - already exists"
        } else {
            Rename-Item -Path $oldPath -NewName $newName -ErrorAction Stop
            Write-Host "Renamed: $file -> $newName"
        }
    } else {
        Write-Host "File not found: $file"
    }
    $i++
}

# Rename Elec files
Write-Host "`nRenaming Elec files..."
$elecPath = Join-Path $basePath "Elec"
$i = 1
foreach ($file in $elecFiles) {
    $oldPath = Join-Path $elecPath $file
    $newName = "elec-$('{0:D2}' -f $i).jpg"
    $newPath = Join-Path $elecPath $newName
    if (Test-Path $oldPath) {
        if (Test-Path $newPath) {
            Write-Host "Skipping $newName - already exists"
        } else {
            Rename-Item -Path $oldPath -NewName $newName -ErrorAction Stop
            Write-Host "Renamed: $file -> $newName"
        }
    } else {
        Write-Host "File not found: $file"
    }
    $i++
}

# Rename Mechanic files
Write-Host "`nRenaming Mechanic files..."
$mechPath = Join-Path $basePath "mechanic"
$i = 1
foreach ($file in $mechFiles) {
    $oldPath = Join-Path $mechPath $file
    $newName = "mech-$('{0:D2}' -f $i).jpg"
    $newPath = Join-Path $mechPath $newName
    if (Test-Path $oldPath) {
        if (Test-Path $newPath) {
            Write-Host "Skipping $newName - already exists"
        } else {
            Rename-Item -Path $oldPath -NewName $newName -ErrorAction Stop
            Write-Host "Renamed: $file -> $newName"
        }
    } else {
        Write-Host "File not found: $file"
    }
    $i++
}

Write-Host "`nDone!"

