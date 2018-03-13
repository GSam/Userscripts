import re
import requests
import xml.etree.ElementTree as ET
import string
import io
import base64
import zipfile
import binascii
from Crypto.Cipher import AES
import hashlib
import StringIO
import sys
import os

EMAIL = sys.argv[1]
print EMAIL
PASSWORD = sys.argv[2]
DOMAIN = 'rakuten'

def SHA256(raw):
    return hashlib.sha256(raw).hexdigest()

def RemoveAESPadding(contents):
    lastchar = binascii.b2a_hex(contents[-1:])
    strlen = int(lastchar, 16)
    padding = strlen
    if(strlen == 1):
        return contents[:-1]
    if(strlen < 16):
        for i in range(strlen):
            testchar = binascii.b2a_hex(contents[-strlen:-(strlen-1)])
            if(testchar != lastchar):
                padding = 0
    if(padding > 0):
        contents = contents[:-padding]
    return contents

baseheaders = {'MobileAPIVersion':'4.0',
               'User-Agent':'User-Agent: Mozilla/5.0 (Linux; U; Android 4.1.1; en-us; Samsung Galaxy S2) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 KoboApp/6.2.13395 KoboPlatform Id/00000000-0000-0000-0000-000000004000 KoboAffiliate/Kobo',}

a = requests.Session()

request = a.post('https://secure.kobobooks.com/90034/auth/%s/Authenticate' % DOMAIN,
                 params={'wscfv':'1.5','wscf':'kepub','wsa':'Kobo',
                         'pwspid':'00000000-0000-0000-0000-000000004000','pwsdid':'3',
                         'pwspt':'Mobile','pwspov':'16','pwsav':'6.2.13395'},
                 data={'RequireSharedToken':'False','AffiliateObject.Name':'Kobo',
                       'EditModel.AuthenticationAction':'Authenticate','IsFTE':'False',
                       'EditModel.Email':EMAIL,'EditModel.Password':PASSWORD})

matcher = re.search('userId=(.*?)&userKey=(.*?)&', request.text)
if matcher is not None:
    userid = matcher.group(1)
    userkey = matcher.group(2)
else:
    matcher = re.search('<input id="InterstitialModel_SUID" name="InterstitialModel.SUID" type="hidden" value="(.*?)"', request.text)
    SUID = matcher.group(1)
    matcher = re.search('<input id="InterstitialModel_SUK" name="InterstitialModel.SUK" type="hidden" value="(.*?)"', request.text)
    SUK = matcher.group(1)
    request = a.post('https://secure.kobobooks.com/90034/auth/%s/AcceptInterstitial' % DOMAIN,
                 params={'wscfv':'2.0','wscf':'kepub','wsa':'kobodesktop','pwspid':'00000000-0000-0000-0000-000000000010','pwsdid':'3','pwspt':'Desktop','pwspov':'6.1.7601','pwsav':'3.15.0'},
                 data={'RequireSharedToken':'False','AffiliateObject.Name':'Kobo','EditModel.AuthenticationAction':'Interstitial','IsFTE':'False',
                       'InterstitialModel.SUID':SUID,'InterstitialModel.SUK':SUK,'InterstitialModel.IsNewUser':'False',
                       'EditModel.PartnerEmailCheckbox.Checked':'false','EditModel.TermsOfUseCheckbox.Checked':'true'})

    matcher = re.search('userId=(.*?)&userKey=(.*?)&', request.text)
    userid = matcher.group(1)
    userkey = matcher.group(2)

print userid
# print userkey

subheaders = {"Host": "mobile.kobobooks.com",'Content-Type':'text/xml','MobileRequestType':'TabRequest'}
subheaders.update(baseheaders)
request = a.post('http://mobile.kobobooks.com/90034/mobileRequest.ashx', """
<?xml version="1.0" encoding="UTF-8"?>
<TabRequest xmlns="http://kobobooks.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://kobobooks.com Requests.xsd">
   <RequestHeader>
      <UserID>%s</UserID>
      <UserKey>%s</UserKey>
   </RequestHeader>
   <RequestBody>
      <TabID>abcdefff-ffff-ffff-ffff-fffffffffffe</TabID>
      <TabType>1</TabType>
      <BrowseTabType>1</BrowseTabType>
      <SortBy>0</SortBy>
      <PageNumber>1</PageNumber>
      <ItemsPerPage>300</ItemsPerPage>
      <MonetizationState>3</MonetizationState>
      <ImageType />
      <EPubPlatform>4</EPubPlatform>
      <Locale>en-NZ</Locale>
   </RequestBody>
</TabRequest>""" % (userid, userkey), headers=subheaders)

# print request.text
matches = re.findall('ContentID="(.*?)"', request.text)

for content in matches:
    subheaders = {"Host": "mobile.kobobooks.com",'Content-Type':'text/xml','MobileRequestType':'KEpubRequest'}
    subheaders.update(baseheaders)
    request = a.post("http://mobile.kobobooks.com/75993/mobileRequest.ashx", data = """<?xml version="1.0" encoding="UTF-8"?>
    <KEpubRequest
        xmlns="http://kobobooks.com"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://kobobooks.com Requests.xsd">
        <RequestHeader>
            <UserID>%s</UserID>
            <UserKey>%s</UserKey>
            </RequestHeader>
        <RequestBody>
            <ContentType>6</ContentType>
            <ContentID>%s</ContentID>
            <EPubPlatform>4</EPubPlatform>
            <NeedUserInfo>false</NeedUserInfo>
            <NeedDownloadURLs>true</NeedDownloadURLs>
            </RequestBody>
        </KEpubRequest>""" % (userid, userkey, content), headers=subheaders)
        
    if True:
        it = ET.iterparse(StringIO.StringIO(request.text.encode('utf-8')))
        for _, el in it:
            el.tag = el.tag.split('}', 1)[1]  # strip all namespaces
        root = it.root
        url = root.find('./ResponseBody/KePub/EpubInfo/Epub/EpubURLList/URL/DownloadURL').text
        request = a.get(url, headers=baseheaders)

        volumekeys = {}
        preuserkey = string.join((a.cookies.get('pwsdid'), a.cookies.get('wsuid')), "")
        uk = SHA256(preuserkey)[32:]
        uk = binascii.a2b_hex(uk)
        enc = AES.new(uk, AES.MODE_ECB)

        for pair in root.findall('./ResponseBody/KePub/EpubInfo/Epub/EpubContentKeys/EpubContentKey'):
            key = base64.decodestring(pair.find('./Key').text)
            filename = pair.find('./ContentPath').text
            volumekeys[filename] = enc.decrypt(key)

        title = root.find('./ResponseBody/KePub/Title').text
        title = title.encode('latin-1').decode('utf-8')

        zippath = io.BytesIO(request.content)
        z = zipfile.ZipFile(zippath, "r")
        # remove some illegal characters
        outname = "%s.epub" % (re.sub('[\\/:"*?<>|]+', "", title))
        if os.path.exists(outname):
            print "SKIPPED:", title
            continue
        zout = zipfile.ZipFile(outname, "w", zipfile.ZIP_DEFLATED)
        for filename in z.namelist():
            #print filename
            # read in and decrypt
            if(filename in volumekeys):
                # do decrypted version
                pagekey = volumekeys[filename]
                penc = AES.new(pagekey, AES.MODE_ECB)
                contents = RemoveAESPadding(penc.decrypt(z.read(filename)))
                # need to fix padding
                zout.writestr(filename, contents)
            else:
                zout.writestr(filename, z.read(filename))
        zout.close()
