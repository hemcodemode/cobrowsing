import urllib2
with open('request.json', 'r') as requestFile:
    data=requestFile.read()
url = 'http://PhantomJScloud.com/api/browser/v2/ak-rz940-4sext-zysep-s5m5d-g506r/'
headers = {'content-type':'application/json'}
req = urllib2.Request(url, data, headers)
response = urllib2.urlopen(req)
results = response.read()
print('\nresponse status code')
print(response.code)
print('\nresponse headers (pay attention to pjsc-* headers)')
print(response.headers)
with open('content.pdf', 'wb') as responseFile:
	responseFile.write(results)