// ============================================================================
// КОНСТАНТЫ (из Delphi-кода)
// ============================================================================
const CA_PER_GH = 7.1446;
const MG_PER_GH = 4.3062;
const C_CASO4_2H2O = 0.030702;
const C_CACL2 = 0.019786;
const C_CACL2_2H2O = 0.026205;
const C_CACL2_6H2O = 0.039058;
const C_MGSO4_7H2O = 0.043669;
const C_MGSO4 = 0.021325;
const C_MGCL2_6H2O = 0.035999;
const C_K2SO4 = 0.002228;
const C_KCL = 0.001907;
const C_K2CO3 = 0.001767;
const TARGET_K_PPM = 3.0;
const C_NAHCO3_PER_DKH = 0.029994;
const M_CA = 40.078;
const M_MG = 24.305;
const M_NA = 22.990;
const M_HCO3 = 61.017;
const M_SO4 = 96.0626;
const M_CL = 35.453;
const M_CL2 = 70.906;
const M_CASO4_2H2O = 172.172;
const M_CACL2 = 110.984;
const M_CACL2_2H2O = 147.014;
const M_CACL2_6H2O = 219.084;
const M_MGSO4_7H2O = 246.475;
const M_MGSO4 = 120.368;
const M_MGCL2_6H2O = 203.303;
const M_NAHCO3 = 84.007;
const M_K2SO4 = 174.259;
const M_KCL = 74.5513;
const M_K2CO3 = 138.205;
const GH_TO_CACO3 = 17.848;
const KH_TO_CACO3 = 17.848;

// ============================================================================
// 🔥 ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА (i18n) 🔥
// ============================================================================
const translations = {
    ru: {
        subtitle: "Калькулятор реминерализации воды для аквариума",
        desired_params: "Желаемые параметры",
        gh_label: "Общая жёсткость (GH)",
        kh_label: "Карбонатная жёсткость (KH)",
        volume_label: "Объём воды",
        liters: "л",
        ca_mg_ratio: "Соотношение Ca:Mg",
        salt_selection: "Выбор препаратов",
        calcium_source: "Источник кальция",
        magnesium_source: "Источник магния",
        potassium_source: "Источник калия",
        add_dosage: "Необходимо внести",
        ion_composition: "Ионный состав воды",
        summary: "Сводка",
        export_report: "📥 Скачать отчёт (HTML)",
        reset: "🔄 Сбросить",
        help: "ℹ️ Справка",
        support: "💖 Поддержать проект",
        footer_slogan: "Профессионализм в каждой капле.",
        caso4: "CaSO₄·2H₂O (гипс)",
        cacl2_anh: "CaCl₂ (безводный)",
        cacl2_2h2o: "CaCl₂·2H₂O (дигидрат)",
        mgso4_7h2o: "MgSO₄·7H₂O (эпсом)",
        mgso4_anh: "MgSO₄ (безводный)"
    },
    en: {
        subtitle: "Aquarium Water Remineralization Calculator",
        desired_params: "Target Parameters",
        gh_label: "General Hardness (GH)",
        kh_label: "Carbonate Hardness (KH)",
        volume_label: "Water Volume",
        liters: "L",
        ca_mg_ratio: "Ca:Mg Ratio",
        salt_selection: "Salt Selection",
        calcium_source: "Calcium Source",
        magnesium_source: "Magnesium Source",
        potassium_source: "Potassium Source",
        add_dosage: "Required Dosage",
        ion_composition: "Water Ion Composition",
        summary: "Summary",
        export_report: "📥 Download Report (HTML)",
        reset: "🔄 Reset",
        help: "ℹ️ Help",
        support: "💖 Support Project",
        footer_slogan: "Professionalism in every drop.",
        caso4: "CaSO₄·2H₂O (gypsum)",
        cacl2_anh: "CaCl₂ (anhydrous)",
        cacl2_2h2o: "CaCl₂·2H₂O (dihydrate)",
        mgso4_7h2o: "MgSO₄·7H₂O (epsom)",
        mgso4_anh: "MgSO₄ (anhydrous)"
    }
};

let currentLang = 'ru';

function loadLanguage() {
    const saved = localStorage.getItem('aquacalc_language');
    if (saved && (saved === 'ru' || saved === 'en')) {
        currentLang = saved;
    } else {
        const browserLang = navigator.language.slice(0, 2);
        currentLang = (browserLang === 'ru') ? 'ru' : 'en';
    }
    updateLanguageUI();
}

function updateLanguageUI() {
    // Перевод всех элементов с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    
    // Обновление опций в select
    updateSaltOptions();
    
    // Обновление активной кнопки
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        }
    });
    
    // Сохранение языка
    document.documentElement.lang = currentLang;
    localStorage.setItem('aquacalc_language', currentLang);
    
    // Пересчёт с новыми единицами
    calculate();
}

function updateSaltOptions() {
    const caBox = document.getElementById('CaBox');
    const mgBox = document.getElementById('MgBox');
    
    if (caBox) {
        caBox.options[0].textContent = translations[currentLang].caso4;
        caBox.options[1].textContent = translations[currentLang].cacl2_anh;
        caBox.options[2].textContent = translations[currentLang].cacl2_2h2o;
    }
    
    if (mgBox) {
        mgBox.options[0].textContent = translations[currentLang].mgso4_7h2o;
        mgBox.options[1].textContent = translations[currentLang].mgso4_anh;
    }
}

function switchLanguage(lang) {
    if (lang === 'ru' || lang === 'en') {
        currentLang = lang;
        updateLanguageUI();
    }
}

function initLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
}

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ РАСЧЁТА
// ============================================================================
function calculate() {
    const gh = parseFloat(document.getElementById('editHardness').value.replace(',', '.')) || 0;
    const kh = parseFloat(document.getElementById('editKH').value.replace(',', '.')) || 0;
    const volume = parseFloat(document.getElementById('editVolume').value.replace(',', '.')) || 0;
    let targetRatio = parseFloat(document.getElementById('Ca_Mg').value.replace(',', '.')) || 0;
    if (targetRatio <= 0) targetRatio = 4;
    
    const caSaltIndex = parseInt(document.getElementById('CaBox').value);
    const mgSaltIndex = parseInt(document.getElementById('MgBox').value);
    const kSaltIndex = parseInt(document.getElementById('KBox').value);

    // Обновление названий препаратов
    const caSaltNames = ['CaSO₄·2H₂O', 'CaCl₂', 'CaCl₂·2H₂O', 'CaCl₂·6H₂O'];
    const mgSaltNames = ['MgSO₄·7H₂O', 'MgSO₄', 'MgCl₂·6H₂O'];
    const kSaltNames = ['K₂SO₄', 'KCl', 'K₂CO₃'];

    if (document.getElementById('saltCaName')) {
        document.getElementById('saltCaName').textContent = caSaltNames[caSaltIndex] || 'CaSO₄·2H₂O';
    }
    if (document.getElementById('saltMgName')) {
        document.getElementById('saltMgName').textContent = mgSaltNames[mgSaltIndex] || 'MgSO₄·7H₂O';
    }
    if (document.getElementById('saltKName')) {
        document.getElementById('saltKName').textContent = kSaltNames[kSaltIndex] || 'KCl';
    }

    // Распределение GH по ионам
    const mgPartGh = gh / (targetRatio * MG_PER_GH / CA_PER_GH + 1);
    const caPartGh = gh - mgPartGh;

    // Расчёт масс солей
    let caGrams = 0, mgGrams = 0;

    switch (caSaltIndex) {
        case 0: caGrams = C_CASO4_2H2O * caPartGh * volume; break;
        case 1: caGrams = C_CACL2 * caPartGh * volume; break;
        case 2: caGrams = C_CACL2_2H2O * caPartGh * volume; break;
        case 3: caGrams = C_CACL2_6H2O * caPartGh * volume; break;
    }

    switch (mgSaltIndex) {
        case 0: mgGrams = C_MGSO4_7H2O * mgPartGh * volume; break;
        case 1: mgGrams = C_MGSO4 * mgPartGh * volume; break;
        case 2: mgGrams = C_MGCL2_6H2O * mgPartGh * volume; break;
    }

    // Расчёт ppm ионов
    let caPpm = 0, mgPpm = 0, so4Ppm = 0, clPpm = 0;

    switch (caSaltIndex) {
        case 0:
            caPpm = caGrams * M_CA / M_CASO4_2H2O * 1000 / volume;
            so4Ppm = caGrams * M_SO4 / M_CASO4_2H2O * 1000 / volume;
            break;
        case 1:
            caPpm = caGrams * M_CA / M_CACL2 * 1000 / volume;
            clPpm = caGrams * M_CL2 / M_CACL2 * 1000 / volume;
            break;
        case 2:
            caPpm = caGrams * M_CA / M_CACL2_2H2O * 1000 / volume;
            clPpm = caGrams * M_CL2 / M_CACL2_2H2O * 1000 / volume;
            break;
        case 3:
            caPpm = caGrams * M_CA / M_CACL2_6H2O * 1000 / volume;
            clPpm = caGrams * M_CL2 / M_CACL2_6H2O * 1000 / volume;
            break;
    }

    switch (mgSaltIndex) {
        case 0:
            mgPpm = mgGrams * M_MG / M_MGSO4_7H2O * 1000 / volume;
            so4Ppm += mgGrams * M_SO4 / M_MGSO4_7H2O * 1000 / volume;
            break;
        case 1:
            mgPpm = mgGrams * M_MG / M_MGSO4 * 1000 / volume;
            so4Ppm += mgGrams * M_SO4 / M_MGSO4 * 1000 / volume;
            break;
        case 2:
            mgPpm = mgGrams * M_MG / M_MGCL2_6H2O * 1000 / volume;
            clPpm += mgGrams * M_CL2 / M_MGCL2_6H2O * 1000 / volume;
            break;
    }

    // Калий
    let kSaltMass = 0, kKhContrib = 0;
    switch (kSaltIndex) {
        case 0:
            kSaltMass = C_K2SO4 * TARGET_K_PPM * volume;
            so4Ppm += kSaltMass * M_SO4 / M_K2SO4 * 1000 / volume;
            break;
        case 1:
            kSaltMass = C_KCL * TARGET_K_PPM * volume;
            clPpm += kSaltMass * M_CL / M_KCL * 1000 / volume;
            break;
        case 2:
            kSaltMass = C_K2CO3 * TARGET_K_PPM * volume;
            kKhContrib = kSaltMass * 0.722 * 1000 / volume / KH_TO_CACO3;
            break;
        default:
            kSaltMass = C_K2SO4 * TARGET_K_PPM * volume;
            so4Ppm += kSaltMass * M_SO4 / M_K2SO4 * 1000 / volume;
    }

    // Бикарбонат (KH)
    const nahco3Grams = C_NAHCO3_PER_DKH * kh * volume;
    const naPpm = nahco3Grams * M_NA / M_NAHCO3 * 1000 / volume;
    const hco3Ppm = nahco3Grams * M_HCO3 / M_NAHCO3 * 1000 / volume;

    // TDS
    const totalTds = caPpm + mgPpm + naPpm + TARGET_K_PPM + hco3Ppm + so4Ppm + clPpm;
    const thCaco3 = gh * GH_TO_CACO3;

    // Форматирование чисел
    const fmt = (num, decimals = 2) => num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });

    // Единицы измерения в зависимости от языка
    const unitGram = currentLang === 'ru' ? ' г' : ' g';
    const unitMgL = currentLang === 'ru' ? ' мг/л' : ' mg/L';
    const unitVol = currentLang === 'ru' ? ' л' : ' L';

    // Дозировки солей
    document.getElementById('lblCaValue').textContent = `${fmt(caGrams)}${unitGram}`;
    document.getElementById('lblMgValue').textContent = `${fmt(mgGrams)}${unitGram}`;
    document.getElementById('lblNaHCO3Value').textContent = `${fmt(nahco3Grams)}${unitGram}`;
    document.getElementById('Label_K').textContent = `${fmt(kSaltMass)}${unitGram}`;
    document.getElementById('Label_Ka').textContent = `${fmt(TARGET_K_PPM, 1)}${unitMgL}`;

    // Ионный состав
    document.getElementById('Label3').textContent = `${fmt(caPpm, 1)}${unitMgL}`;
    document.getElementById('Label10').textContent = `${fmt(mgPpm, 1)}${unitMgL}`;
    document.getElementById('Label_Na').textContent = `${fmt(naPpm, 1)}${unitMgL}`;
    document.getElementById('Label15').textContent = `${fmt(so4Ppm, 1)}${unitMgL}`;
    document.getElementById('Label5').textContent = `${fmt(clPpm, 1)}${unitMgL}`;
    document.getElementById('Label_HCO3').textContent = `${fmt(hco3Ppm, 1)}${unitMgL}`;

    // Сводка
    document.getElementById('Label_TDC').textContent = `${fmt(totalTds, 1)} ppm`;
    document.getElementById('Label_TH_CaCO3').textContent = `${fmt(thCaco3, 0)}${unitMgL}`;

    const totalKh = kh + kKhContrib;
    document.getElementById('Label_KH').textContent = `${fmt(totalKh, 2)} °dKH`;

    // Info bar
    let infoText = '';
    if (gh === 0) {
        infoText = `GH ≈ 0.0 | KH ≈ 0.0 | Ca:Mg ≈ 0.00:1`;
    } else if (mgPpm === 0) {
        infoText = `GH ≈ ${fmt(gh, 1)} | KH ≈ ${fmt(totalKh, 2)} | Ca:Mg ≈ ∞:1`;
    } else {
        const caMgRatio = caPpm / mgPpm;
        infoText = `GH ≈ ${fmt(gh, 1)} | KH ≈ ${fmt(totalKh, 2)} | Ca:Mg ≈ ${fmt(caMgRatio, 2)}:1 | V ≈ ${fmt(volume, 0)}${unitVol}`;
    }
    document.getElementById('Label_info').textContent = infoText;

    saveSettings();
}

// ============================================================================
// СОХРАНЕНИЕ/ЗАГРУЗКА НАСТРОЕК
// ============================================================================
function saveSettings() {
    const settings = {
        gh: document.getElementById('editHardness').value,
        kh: document.getElementById('editKH').value,
        volume: document.getElementById('editVolume').value,
        caMgRatio: document.getElementById('Ca_Mg').value,
        caSalt: document.getElementById('CaBox').value,
        mgSalt: document.getElementById('MgBox').value,
        kSalt: document.getElementById('KBox').value
    };
    localStorage.setItem('aquacalc_settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('aquacalc_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        document.getElementById('editHardness').value = settings.gh || '6';
        document.getElementById('editKH').value = settings.kh || '2';
        document.getElementById('editVolume').value = settings.volume || '10';
        document.getElementById('Ca_Mg').value = settings.caMgRatio || '4';
        document.getElementById('CaBox').value = settings.caSalt || '0';
        document.getElementById('MgBox').value = settings.mgSalt || '0';
        document.getElementById('KBox').value = settings.kSalt || '0';
    }
}

function resetSettings() {
    localStorage.removeItem('aquacalc_settings');
    document.getElementById('editHardness').value = '6';
    document.getElementById('editKH').value = '2';
    document.getElementById('editVolume').value = '10';
    document.getElementById('Ca_Mg').value = '4';
    document.getElementById('CaBox').value = '0';
    document.getElementById('MgBox').value = '0';
    document.getElementById('KBox').value = '0';
    calculate();
}

// ============================================================================
// ЭКСПОРТ В HTML
// ============================================================================
function exportToHtml() {
    const now = new Date().toLocaleString(currentLang === 'ru' ? 'ru-RU' : 'en-US');
    const getVal = (id) => document.getElementById(id).textContent;
    const t = translations[currentLang];
    
    const html = `<!DOCTYPE html>
<html lang="${currentLang}">
<head>
    <meta charset="UTF-8">
    <title>AquaCalc Log</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: "Consolas", "Courier New", monospace;
            max-width: 820px;
            margin: 0 auto;
            padding: 16px;
            background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
            color: #F0F9FF !important;
            line-height: 1.45;
            font-size: 15px;
            min-height: 100vh;
        }
        .header { text-align: center; padding: 18px 0; margin-bottom: 18px; border-bottom: 1px solid rgba(34, 211, 238, 0.3); }
        .header h1 { color: #22D3EE !important; font-size: 1.5em; margin-bottom: 6px; }
        .section {
            background: linear-gradient(180deg, rgba(15, 52, 96, 0.98) 0%, rgba(8, 47, 73, 0.98) 100%);
            padding: 15px 18px; margin: 14px 0; border-radius: 9px;
            border: 1px solid rgba(34, 211, 238, 0.35);
        }
        .section h2 { color: #22D3EE !important; margin: 0 0 12px 0; padding-bottom: 9px; border-bottom: 1px solid rgba(34, 211, 238, 0.3); font-size: 1.15em; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px 7px; border-bottom: 1px solid rgba(34, 211, 238, 0.15); color: #E0F2FE !important; }
        td:first-child { font-weight: 600; color: #7DD3FC !important; }
        td:last-child { text-align: right; }
        .value-box {
            background: linear-gradient(135deg, rgba(21, 94, 117, 0.95) 0%, rgba(15, 52, 96, 0.95) 100%);
            padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(34, 211, 238, 0.4);
            display: inline-block; color: #67E8F9 !important; font-weight: bold;
        }
        .footer { text-align: center; margin-top: 22px; padding-top: 16px; border-top: 1px solid rgba(34, 211, 238, 0.3); color: #7DD3FC !important; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🐟 AquaCalc Log</h1>
        <p>${now}</p>
    </div>
    <div class="section">
        <h2>${t.export_desired || 'Target Parameters'}</h2>
        <table>
            <tr><td>${t.gh_label}</td><td><span class="value-box">${document.getElementById('editHardness').value} °dGH</span></td></tr>
            <tr><td>${t.kh_label}</td><td><span class="value-box">${document.getElementById('editKH').value} °dKH</span></td></tr>
            <tr><td>${t.volume_label}</td><td><span class="value-box">${document.getElementById('editVolume').value} ${t.liters}</span></td></tr>
            <tr><td>${t.ca_mg_ratio}</td><td><span class="value-box">${document.getElementById('Ca_Mg').value} : 1</span></td></tr>
        </table>
    </div>
    <div class="section">
        <h2>${t.add_dosage}</h2>
        <table>
            <tr><td>${getVal('saltCaName')}</td><td><span class="value-box">${getVal('lblCaValue')}</span></td></tr>
            <tr><td>${getVal('saltMgName')}</td><td><span class="value-box">${getVal('lblMgValue')}</span></td></tr>
            <tr><td>NaHCO₃</td><td><span class="value-box">${getVal('lblNaHCO3Value')}</span></td></tr>
            <tr><td>${getVal('saltKName')}</td><td><span class="value-box">${getVal('Label_K')}</span></td></tr>
        </table>
    </div>
    <div class="footer">
        <p>PlecoHobby © ${new Date().getFullYear()}</p>
        <p>${t.footer_slogan}</p>
    </div>
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquacalc_log_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================================================
// МОДАЛЬНЫЕ ОКНА
// ============================================================================
function setupModal() {
    const modal = document.getElementById('aboutModal');
    const btn = document.getElementById('btnAbout');
    const close = document.querySelector('.close');
    if(btn && modal && close) {
        btn.addEventListener('click', () => modal.style.display = 'block');
        close.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }
}

function setupSupportModal() {
    const modal = document.getElementById('supportModal');
    const btn = document.getElementById('btnSupport');
    if(btn && modal) {
        const close = modal.querySelector('.close');
        btn.addEventListener('click', () => modal.style.display = 'block');
        if(close) {
            close.addEventListener('click', () => modal.style.display = 'none');
        }
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ (ВСЁ В ОДНОМ МЕСТЕ)
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    
    loadSettings();
    loadLanguage();           // ← Загрузка языка
    initLanguageSwitcher();   // ← Инициализация переключателя
    
    const inputs = ['editHardness', 'editKH', 'editVolume', 'Ca_Mg'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', calculate);
    });
    
    const caBox = document.getElementById('CaBox');
    const mgBox = document.getElementById('MgBox');
    const kBox = document.getElementById('KBox');
    
    if(caBox) caBox.addEventListener('change', calculate);
    if(mgBox) mgBox.addEventListener('change', calculate);
    if(kBox) kBox.addEventListener('change', calculate);
    
    const btnExport = document.getElementById('btnExport');
    const btnReset = document.getElementById('btnReset');
    
    if(btnExport) btnExport.addEventListener('click', exportToHtml);
    if(btnReset) btnReset.addEventListener('click', resetSettings);
    
    setupModal();
    setupSupportModal();
    calculate();
});

// ============================================================================
// 🔥 КОПИРОВАНИЕ КОШЕЛЬКОВ В БУФЕР 🔥
// ============================================================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Address copied to clipboard!\n\n' + text);
    }).catch(err => {
        console.error('Copy error: ', err);
        alert('❌ Failed to copy. Try manually.');
    });
}