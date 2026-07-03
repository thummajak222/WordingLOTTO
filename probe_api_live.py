import urllib.request, ssl, json
ssl._create_default_https_context = ssl._create_unverified_context
req=urllib.request.Request('https://lotto.api.rayriffy.com/latest', headers={'User-Agent':'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=30) as r:
    data=r.read().decode('utf-8','ignore')
    print(data[:4000])
