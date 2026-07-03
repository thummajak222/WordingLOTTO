import urllib.request, ssl, json, sys
ssl._create_default_https_context = ssl._create_unverified_context
urls=[
 'https://thai-lotto-api.vercel.app/api/lotto?limit=30',
 'https://api.allorigins.win/raw?url=https://thai-lotto-api.vercel.app/api/lotto?limit=30',
 'https://raw.githubusercontent.com/rayriffy/thai-lotto-api/master/README.md'
]
for url in urls:
    try:
        req=urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=35) as r:
            data=r.read().decode('utf-8','ignore')
            print('URL', url, 'status', r.status)
            print(data[:2000])
            print('---')
    except Exception as e:
        print('ERR', url, repr(e))
        print('---')
