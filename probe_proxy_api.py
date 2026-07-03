import urllib.request, ssl
ssl._create_default_https_context = ssl._create_unverified_context
url='https://r.jina.ai/http://https://lotto.api.rayriffy.com/latest'
req=urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=40) as r:
    data=r.read().decode('utf-8','ignore')
    print(r.status)
    print(data[:4000])
