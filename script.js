const fetchWebBtn = document.getElementById('fetchWebBtn');
const calculateBtn = document.getElementById('calculateBtn');
const historyGrid = document.getElementById('historyGrid');
const historyCount = document.getElementById('historyCount');
const predictionGrid = document.getElementById('predictionGrid');
const hotNumbersEl = document.getElementById('hotNumbers');
const coldNumbersEl = document.getElementById('coldNumbers');
const oddCountEl = document.getElementById('oddCount');
const evenCountEl = document.getElementById('evenCount');
const totalSumEl = document.getElementById('totalSum');
const evenFill = document.getElementById('evenFill');
const statusText = document.getElementById('statusText');

const STORAGE_KEY = 'lottery-history-2digit';
let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const MAX_HISTORY = 15;

function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function getFrequency() {
  return history.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function getSortedNumbersByCount(counts, limit = 5, highest = true) {
  const sorted = Object.entries(counts)
    .sort((a, b) => highest ? b[1] - a[1] : a[1] - b[1])
    .slice(0, limit)
    .map(([value]) => value);
  return sorted;
}

function calculatePredictions(counts) {
  const items = Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value]) => value);
  const prediction = items.slice(0, 4);

  if (prediction.length < 4) {
    const allNumbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
    const remaining = allNumbers.filter((num) => !prediction.includes(num));
    while (prediction.length < 4 && remaining.length) {
      prediction.push(remaining.shift());
    }
  }
  return prediction;
}

function calculateColdNumbers(counts) {
  const appearedNumbers = Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .filter((item) => item.count > 0)
    .sort((a, b) => a.count - b.count || a.value.localeCompare(b.value));

  const cold = appearedNumbers.slice(0, 5).map((item) => item.value);
  if (cold.length < 5) {
    const allNumbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
    const missing = allNumbers
      .filter((value) => !counts[value])
      .slice(0, 5 - cold.length);
    cold.push(...missing);
  }

  return cold;
}

function updateStats() {
  const oddCount = history.filter((value) => parseInt(value, 10) % 2 === 1).length;
  const evenCount = history.length - oddCount;
  const totalSum = history.reduce((sum, value) => sum + parseInt(value, 10), 0);
  oddCountEl.textContent = oddCount;
  evenCountEl.textContent = evenCount;
  totalSumEl.textContent = totalSum;
  evenFill.style.width = history.length ? `${Math.round((evenCount / history.length) * 100)}%` : '0%';
}

function updateUI() {
  historyGrid.innerHTML = '';
  history.forEach((value, index) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="item-label">งวด ${index + 1}</div>
      <div class="item-value">${value}</div>
    `;
    historyGrid.appendChild(item);
  });

  historyCount.textContent = `${history.length}/${MAX_HISTORY}`;
  updateStats();
  updateAnalysisPanels();
  statusText.textContent = history.length
    ? 'ระบบพร้อมวิเคราะห์ข้อมูลล่าสุดแล้ว' 
    : 'เพิ่มเลขเพื่อติดตามและคำนวณผล';
}

function updateAnalysisPanels() {
  const counts = getFrequency();
  const predictions = calculatePredictions(counts);
  predictionGrid.innerHTML = predictions.map((value) => `<div class="prediction-chip">${value}</div>`).join('');

  const hotNumbers = getSortedNumbersByCount(counts, 5, true);
  hotNumbersEl.innerHTML = hotNumbers.map((value) => `<div class="tag-chip">${value}</div>`).join('');

  const coldNumbers = calculateColdNumbers(counts);
  coldNumbersEl.innerHTML = coldNumbers.map((value) => `<div class="tag-chip">${value}</div>`).join('');
}

const CORS_PROXIES = [
  'https://r.jina.ai/http://',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://thingproxy.freeboard.io/fetch/',
  'https://corsproxy.io/?',
];
const THAIRATH_ARCHIVE_PAGE = 'https://www.thairath.co.th/lottery/archive';

function notify(message) {
  statusText.textContent = message;
}

function buildProxyUrl(proxy, targetUrl) {
  if (proxy === 'https://r.jina.ai/http://') {
    return `${proxy}${targetUrl}`;
  }
  return `${proxy}${encodeURIComponent(targetUrl)}`;
}

function normalizeArchiveText(text) {
  return String(text || '')
    .replace(/\r/g, '\n')
    .replace(/&nbsp;|&#xA0;/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n');
}

function getThaiRathArchiveYearUrls() {
  const thaiYear = new Date().getFullYear() + 543;
  return [
    `${THAIRATH_ARCHIVE_PAGE}/${thaiYear}`,
    `${THAIRATH_ARCHIVE_PAGE}/${thaiYear - 1}`,
  ];
}

function extractBackTwoNumbersFromArchiveText(text) {
  const normalized = normalizeArchiveText(text);
  const matches = [...normalized.matchAll(/เลขท้าย\s*2\s*ตัว\s*(?:[:\-]?\s*)?(\d{2})/gi)].map((match) => match[1].padStart(2, '0'));
  return matches;
}

async function fetchTextThroughProxy(targetUrl) {
  let lastError;
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(buildProxyUrl(proxy, targetUrl), {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`Proxy ${proxy} returned ${response.status}`);
      }
      const text = await response.text();
      if (!text || /access denied|blocked|captcha|forbidden/i.test(text)) {
        throw new Error(`Proxy ${proxy} returned empty or blocked content`);
      }
      return text;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function fetchHistoryFromWeb() {
  try {
    fetchWebBtn.disabled = true;
    calculateBtn.disabled = true;
    notify('กำลังดึงข้อมูลย้อนหลังจากเว็บหวย...');

    const archiveUrls = getThaiRathArchiveYearUrls();
    const collected = [];
    for (let index = 0; index < archiveUrls.length; index += 1) {
      const url = archiveUrls[index];
      notify(`กำลังดึงข้อมูลจากปี ${url.split('/').pop()} ...`);
      const archiveText = await fetchTextThroughProxy(url);
      const pageResults = extractBackTwoNumbersFromArchiveText(archiveText);
      collected.push(...pageResults);
      if (collected.length >= MAX_HISTORY) {
        break;
      }
    }

    if (!collected.length) {
      throw new Error('ไม่พบเลขท้าย 2 ตัวจากหน้า archive ของ ThaiRath');
    }

    history = collected.slice(0, MAX_HISTORY);
    saveHistory();
    updateUI();
    notify(`ดึงข้อมูลสำเร็จ ${history.length} งวด${history.length < MAX_HISTORY ? ' (ไม่ครบ 15 งวด)' : ''}`);
  } catch (error) {
    notify(`ไม่สามารถดึงข้อมูลจากเว็บหวยได้: ${error.message || error}`);
    console.error(error);
  } finally {
    fetchWebBtn.disabled = false;
    calculateBtn.disabled = false;
  }
}


fetchWebBtn.addEventListener('click', () => {
  fetchHistoryFromWeb();
});

calculateBtn.addEventListener('click', () => {
  if (!history.length) {
    notify('กรุณาโหลดเลขย้อนหลังก่อนทำการคำนวณ');
    return;
  }
  updateAnalysisPanels();
  notify('อัปเดตการวิเคราะห์เลขเรียบร้อยแล้ว');
});

updateUI();
