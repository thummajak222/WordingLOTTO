import urllib.request, ssl, re, json
ssl._create_default_https_context = ssl._create_unverified_context
base='https://r.jina.ai/http://https://www.thairath.co.th/lottery/archive'
req=urllib.request.Request(base, headers={'User-Agent':'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=40) as r:
    data=r.read().decode('utf-8','ignore')
print(data[:20000])
print('---LINKS---')
for m in re.finditer(r'https?://[^\s)\]>"]+', data):
    s=m.group(0)
    if 'thairath.co.th' in s and 'lottery' in s:
        print(s)
print('---PATHS---')
for p in re.findall(r'(?:href=["\'])(/[^"\']+)(?:["\'])', data, re.I):
    if 'lottery' in p or 'check' in p:
        print(p)
