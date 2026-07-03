import urllib.request, ssl, re
ssl._create_default_https_context = ssl._create_unverified_context
urls = [
    'https://r.jina.ai/http://https://www.thairath.co.th/lottery/archive',
    'https://r.jina.ai/http://https://www.thairath.co.th/lottery/archive?pages=1',
    'https://r.jina.ai/http://https://www.thairath.co.th/lottery/archive?pages=2',
    'https://r.jina.ai/http://https://www.thairath.co.th/lottery/archive/2569',
    'https://r.jina.ai/http://https://www.thairath.co.th/lottery/archive/2568'
]
for url in urls:
    print('URL:', url)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=40) as r:
            text = r.read().decode('utf-8', 'ignore')
            print('Status:', r.status)
            found = re.findall(r'เลขท้าย\s*2\s*ตัว', text, re.I)
            print('Count เลขท้าย 2 ตัว:', len(found))
            numbers = re.findall(r'เลขท้าย\s*2\s*ตัว\s*(?:[:\-]?\s*)?(\d{2})', text, re.I)
            print('Extracted:', numbers[:15])
            print('Snippet:')
            print(text[:1200])
    except Exception as e:
        print('ERROR:', repr(e))
    print('---\n')
