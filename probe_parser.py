import urllib.request, ssl, re
ssl._create_default_https_context = ssl._create_unverified_context
url='https://r.jina.ai/http://https://www.thairath.co.th/lottery/archive/2569'
req=urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=40) as r:
    text=r.read().decode('utf-8','ignore')

normalized = text.replace('\r','\n').replace('&nbsp;',' ').replace('&#xA0;',' ')
print('text len', len(normalized))
patterns = [
    r'เลขท้าย\s*2\s*ตัว\s*(?:[:\-]?\s*)?(\d{2})',
    r'เลขท้าย\s*2\s*ตัว[\s\S]{0,20}?(\d{2})',
    r'เลขท้าย\s*2\s*ตัว\s*(\d{2})'
]
for pat in patterns:
    matches = re.findall(pat, normalized, re.I)
    print(pat, 'count', len(matches), 'sample', matches[:10])

print('all section markers', normalized.count('เลขท้าย 2 ตัว'))
print(normalized[normalized.find('## เลขท้าย 2 ตัว')-200: normalized.find('## เลขท้าย 2 ตัว')+500])
