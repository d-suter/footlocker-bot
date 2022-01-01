const { HttpProxyAgent, HttpsProxyAgent } = require('hpagent');
const fs = require('fs');
const chalk = require('chalk');
const got = require('got');
const webhookHandler = require('../webhookHandler/webhook');
const { CookieJar } = require('tough-cookie');
const { default: axios } = require('axios');
const xml2js = require('xml2js');
const states = require('us-state-codes');
const Axios = require('axios');
const uuid = require('uuid');
const Datadome = require('./datadome');
const { sub } = require('tough-cookie/lib/version');
const adyenEncrypt = require('./adyen');
const random = require('random');

var webhook = ""; //static discord goes here

var profile = {
    "name": "Shane",
    "size": "",
    "profileGroup": "",
    "billingAddress": {
      "name": "Test name",
      "email": "test@gmail.com",
      "phone": "5555555555",
      "line1": "123 Main",
      "line2": "Apt 3",
      "line3": "",
      "postCode": "48504",
      "city": "Flint",
      "country": "United States",
      "state": "Michigan"
    },
    "shippingAddress": {
      "name": "Shane Combs",
      "email": "test@gmail.com",
      "phone": "5555555555",
      "line1": "123 Main",
      "line2": "Apt 3",
      "line3": "",
      "postCode": "48504",
      "city": "Flint",
      "country": "United States",
      "state": "Michigan"
    },
    "paymentDetails": {
      "nameOnCard": "Shane Combs",
      "cardType": "Visa",
      "cardNumber": "4242424242424242",
      "cardExpMonth": "01",
      "cardExpYear": "2025",
      "cardCvv": "123"
    },
    "sameBillingAndShippingAddress": true,
    "onlyCheckoutOnce": false,
    "matchNameOnCardAndAddress": true
}

var task = {
        "mode": "Inital",
        "monitorInput": "X6898010",
        "profile": "Shane",
        "proxies": "vanilla",
        "errorDelay": "5555",
        "monitorDelay": "5555",
        "sizes": [
          "M"
        ],
        "color": "random",
        "site": {
          "name": "FootLocker",
          "url": "https://www.footlocker.com/"
        },
        "quantity": "1",
        "taskID": "4gzguPuXHS"
}

var proxyList;

var proxyData = null

//<-----------------------------------------Proccess variables-------------------------------------------->

var running = true;
var step = 'csrf';

var testInfo = {}

const xmlParser = new xml2js.Parser();
var cookieJar = new CookieJar();
var cartInfo;
var csrfToken;
var productInfo;
var productID;

//<-----------------------------------------Main function------------------------------------------------->

async function Footlocker(taskDetails, profileData, proxyListData) {
    //task = taskDetails;
    //profile = profileData;
    //proxyList = proxyListData;
    //number = random.int(0, (proxyList.length-1));
    //proxyData = proxyList[number];
    start();
}

const start = async() => {
    while(running) {
        switch(step) {
            case 'csrf': {
                try {
                    csrfToken = await getCSRF();
                } catch (error) {
                    console.log(getTime() + 'Error getting token, retrying...');
                    console.log(chalk.yellowBright("Rotating proxies..."));
                    number = random.int(0, (proxyList.length-1));
                    proxyData = proxyList[number];
                    await sleep(task.errorDelay);
                    break; 
                }
                step = 'monitor'
            }
            case 'monitor': {
                try {
                    await monitor();
                } catch (error) {
                    console.log(getTime() + 'Product not found, retrying...');
                    await sleep(task.errorDelay);
                    break;
                }
                step = 'atc'
            }
            case 'atc': {
                try {
                    await addToCart(productID, csrfToken);
                } catch (error) {
                    console.log(error)
                    console.log(getTime() + 'Error adding to cart, retrying...');
                    await sleep(task.errorDelay);
                    break; 
                }
                step = 'checkout' 
            }
            case 'checkout': {
                try {
                    getCheckout(csrfToken);
                    await lookupLocation(profile, csrfToken);
                } catch (error) {
                    console.log(getTime() + 'Error going to checkout, retrying...');
                    console.log(chalk.yellowBright("Rotating proxies..."));
                    number = random.int(0, (proxyList.length-1));
                    proxyData = proxyList[number];
                    await sleep(task.errorDelay);
                    break;
                }
                step = 'email'
            }
            case 'email': {
                try {
                    await submitEmail(profile, csrfToken);
                } catch (error) {
                    console.log(getTime() + 'Error submitting email, retrying...');
                    console.log(chalk.yellowBright("Rotating proxies..."));
                    number = random.int(0, (proxyList.length-1));
                    proxyData = proxyList[number];
                    await sleep(task.errorDelay);
                    break; 
                }
                step = 'addresses'
            }
            case 'addresses': {
                try {
                    await submitShippingAddress(profile, csrfToken);
                    await submitBillingAddress(profile, csrfToken);
                } catch (error) {
                    console.log(getTime() + 'Error submitting addresses, retrying...');
                    console.log(chalk.yellowBright("Rotating proxies..."));
                    number = random.int(0, (proxyList.length-1));
                    proxyData = proxyList[number];
                    await sleep(task.errorDelay);
                    break; 
                }
                step = 'submit'
            }
            case 'submit': {
                try {
                    await submit(profile, csrfToken);
                } catch (error) {
                    console.log(getTime() + 'Error submitting order, retrying...');
                    await sleep(task.errorDelay);
                    break;
                }
                running = false;
            }
        }
    }
}

//<----------------------------------------Process functions---------------------------------------------->

const getCSRF = async() => {
    console.log(getTime() + 'Generating device CSRF token...');
    const response = await request(task.site.url + 'api/v3/session?timestamp=' + Date.now(), {
        method: 'GET',
        proxy: {
            host: proxyData.ip,
            port: proxyData.port,
            auth: {username: proxyData.user, password: proxyData.pass}
        }
    });
    var returnedToken = JSON.parse(response.body).data.csrfToken;
    console.log(getTime() + 'Successfully generated CSRF device token: ' + returnedToken);
    return returnedToken;
}

const monitor = async() => {
    console.log(getTime() + "Starting monitor...");
    const response = await axios.get(task.site.url + 'product/~/' + task.monitorInput);
    if (response.status === 200) {
        console.log(getTime() + "Product found...");
        console.log(getTime() + "Getting product info...");
        await getProductInfo(task.monitorInput);
        for (var i = 0; i < productInfo.sellableUnits.length; i++) {
            const unit = productInfo.sellableUnits[i];
            if (unit.attributes[0].value[0] === task.sizes[0] && unit.stockLevelStatus[0] === 'inStock') {
                console.log(getTime() + "Product info found...");
                productID = unit.attributes[0].id[0];
                return;
            }
        }
        console.log(getTime() + 'Size out of stock, retrying...');
        sleep(task.monitorDelay);
    }
}

const addToCart = async(productID, token) => {
    console.log(getTime() + 'Adding to Cart...');
    const DDCookie = new Datadome;
    var cookie = await DDCookie.cookieGen()
    cookie = cookie.toString().substring(0, cookie.length - 75);

    const url = task.site.url + 'api/users/carts/current/entries?timestamp=' + Date.now();
    const response = await request(url.toString(), {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'cookie': cookie,
            'dnt': '1',
            'origin': task.site.url,
            'pragma': 'no-cache',
            'referer': task.site.url + 'product/nike-air-force-1-low-mens/24300657.html',
            'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'x-csrf-token': token,
            'x-fl-productid': productID,
            'x-fl-request-id': uuid.v4(),         
        },
        body: JSON.stringify({ 
                'productQuantity': 1, 
                'productId': '' + productID + '',
        }),
    })
    cookieJar.setCookie(response.headers['set-cookie'].toString(), task.site.url);
}

const getCheckout = async(token) => {
    console.log(getTime() + 'Sending to checkout...');
    const response = await request(`${task.site.url}checkout`, {
            method: 'GET',
            'headers': {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'max-age=0',
            'if-none-match': 'W/"34c98-FMJWjxvV8Alij7IplBKgEZpdHEo"',
            'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'x-csrf-token': token,
            }
    })
}

const lookupLocation = async(profileInfo, token) => {
    console.log(getTime() + 'Lookup Location...');
    const response = await request(`${task.site.url}api/satori/location-lookup/?timestamp=${Date.now()}`, {
        method: 'POST',
        'header': {
            'accept': 'application/json',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'origin': task.site.url,
            'referer': task.site.url +'checkout',
            'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'x-csrf-token': token,
            'x-fl-request-id': uuid.v4(),
        },body: JSON.stringify({
            'zipCode': profileInfo.shippingAddress.postCode
        })
    })
    cookieJar.setCookie(response.headers['set-cookie'].toString(), task.site.url);
}

const verifyAddress = async(profileInfo, token) => {
    console.log(getTime() + 'Verifying address...');
    const stateCode = states.getStateCodeByStateName(profileInfo.shippingAddress.state);
    const response = await request(`${task.site.url}api/v3/users/addresses/verification?timestamp=${Date.now()}`, {
        method: 'POST',
        mode: "cors",
        referrer: task.site.url + 'checkout',
        referrerPolicy: "no-referrer-when-downgrade",
        'headers': {
            'accept': 'application/json',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'x-csrf-token': token,
            'x-fl-request-id': uuid.v4(),
        },
        json: {
            'country': {
                'isocode': 'US',
                'name': 'United States'
            },
            'line1': profileInfo.shippingAddress.line1,
            'line2': profileInfo.shippingAddress.line2,
            'postalCode': profileInfo.shippingAddress.postCode,
            'region': {
                'countryIso': 'US',
                'isocode': 'US-' + stateCode,
                'isocodeShort': stateCode,
                'name': profileInfo.shippingAddress.state,
            },
            'town': profileInfo.shippingAddress.city.toUpperCase(),
        }
    }).then((response) => {
        cookieJar.setCookie(response.headers['set-cookie'].toString(), task.site.url);
        submitEmail(profileInfo, token);
        //console.log(response);
    })
}

const submitEmail = async(profileInfo, token) => {
    console.log(getTime() + 'Sending email...');
    const response = await request(`${task.site.url}api/users/carts/current/email/` + profileInfo.shippingAddress.email +`?timestamp=${Date.now()}`, {
        method: 'PUT',
        'headers': {
            'accept': 'application/json',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'origin': task.site.url,
            'referer': task.site.url + 'checkout',
            'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'x-csrf-token': token,
            'x-fl-request-id': uuid.v4(),
        }
    })
    cookieJar.setCookie(response.headers['set-cookie'].toString(), task.site.url);
}

const submitShippingAddress = async(profileInfo, token) => {
    console.log(getTime() + 'Submitting shipping...');
    const stateCode = states.getStateCodeByStateName(profileInfo.shippingAddress.state);
    const nameArray = profileInfo.shippingAddress.name.split(/\s+/);
    const response = await request(`${task.site.url}api/users/carts/current/addresses/shipping?timestamp=${Date.now()}`, {
        method: 'POST',
        'headers': {
            'accept': 'application/json',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'origin': task.site.url,
            'referer': task.site.url + 'checkout',
            'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'x-csrf-token': token,
            'x-fl-request-id': uuid.v4(),
            },
            body: JSON.stringify({
                "shippingAddress": {
                    "LoqateSearch": "",
                    "companyName": "",
                    "country": {
                        "isocode": "US",
                        "name": "United States"
                    },
                    "email": false,
                    "firstName": nameArray[0],
                    "id": null,
                    "isFPO": false,
                    "lastName": nameArray[1],
                    "line1": profileInfo.shippingAddress.line1,
                    "line2": profileInfo.shippingAddress.line2,
                    "phone": profileInfo.shippingAddress.phone,
                    "postalCode": profileInfo.shippingAddress.postCode,
                    "recordType": "S",
                    "region": {
                        "countryIso": "US",
                        "isocode": "US-" + stateCode,
                        "isocodeShort": stateCode,
                        "name": stateCode
                    },
                    "regionFPO": null,
                    "setAsBilling": profileInfo.sameBillingAndShippingAddress,
                    "setAsDefaultBilling": false,
                    "setAsDefaultShipping": false,
                    "shippingAddress": true,
                    "town": profileInfo.shippingAddress.city,
                    "type": "default",
                    "visibleInAddressBook": false
                }
            }),
        })
        cookieJar.setCookie(response.headers['set-cookie'].toString(), task.site.url);
    }

const submitBillingAddress = async(profileInfo, token) => {
    console.log(getTime() + 'Submitting billing...');
    const stateCode = states.getStateCodeByStateName(profileInfo.shippingAddress.state);
    const nameArray = profileInfo.shippingAddress.name.split(/\s+/);
    const response = await request(`${task.site.url}api/users/carts/current/set-billing?timestamp=${Date.now()}`, {
        method: 'POST',
        'headers': {
            'accept': 'application/json',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'origin': task.site.url,
            'referer': task.site.url + 'checkout',
            'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'x-csrf-token': token,
            'x-fl-request-id': uuid.v4(),
        },
        body: JSON.stringify({
                    "LoqateSearch": "",
                    "companyName": "",
                    "country": {
                        "isocode": "US",
                        "name": "United States"
                    },
                    "email": false,
                    "firstName": nameArray[0],
                    "id": null,
                    "isFPO": false,
                    "lastName": nameArray[1],
                    "line1": profileInfo.shippingAddress.line1,
                    "line2": profileInfo.shippingAddress.line2,
                    "phone": profileInfo.shippingAddress.phone,
                    "postalCode": profileInfo.shippingAddress.postCode,
                    "recordType": "S", //WTF
                    "region": {
                        "countryIso": "US",
                        "isocode": "US-" + stateCode,
                        "isocodeShort": stateCode,
                        "name": stateCode
                    },
                    "regionFPO": null,
                    "setAsBilling": profileInfo.sameBillingAndShippingAddress,
                    "setAsDefaultBilling": false,
                    "setAsDefaultShipping": false,
                    "shippingAddress": true,
                    "town": profileInfo.shippingAddress.city,
                    "type": "default",
                    "visibleInAddressBook": false
        }),
    })
    cookieJar.setCookie(response.headers['set-cookie'].toString(), task.site.url);
}

const submit = async(profileInfo, token) => {
    console.log(getTime() + 'Submitting order...');
    const web = new webhookHandler;
    cartInfo = JSON.parse(await getCartGUID(token));

    const response = await request(`${task.site.url}api/v2/users/orders?timestamp=${Date.now()}`, {
        method: 'POST',
        'headers': {
            'accept': 'application/json',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'origin': task.site.url,
            'referer': task.site.url + 'checkout',
            'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'x-csrf-token': token,
            'x-fl-request-id': uuid.v4(),
            },
        body: JSON.stringify(
                adyenEncryptCard(profileInfo.paymentDetails)
        ),
    }).then ((response) => {
        cookieJar.setCookie(response.headers['set-cookie'].toString(), task.site.url);
        console.log(chalk.greenBright.bold(getTime() + "Checkout!"));
        const data = JSON.stringify(testInfo, null, 2);
        fs.writeFileSync('./cartInfo.json', data, 'utf-8');
        web.sendWebhook('success', productInfo.name[0], task.sizes[0], proxyData.list, profile.name, task.monitorDelay, task.errorDelay, `https://images.footlocker.com/is/image/EBFL2/${task.monitorInput}`, task.site.name, webhook);
    }, (error) => {
        console.log(chalk.red.bold(getTime() + "Declined"));
        const data = JSON.stringify(testInfo, null, 2);
        fs.writeFileSync('./cartInfo.json', data, 'utf-8');
        web.sendWebhook('decline', productInfo.name[0], task.sizes[0], proxyData.list, profile.name, task.monitorDelay, task.errorDelay, `https://images.footlocker.com/is/image/EBFL2/${task.monitorInput}`, task.site.name, webhook);
    })
}

//<-----------------------------------------Utility functions---------------------------------------------------->
const request = async(url, options={}) => {
    options.cookieJar = cookieJar;
    prettyProxy = convertProxy(proxyData);
    if (prettyProxy) {
        const proxyAgentSettings = {
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: 256,
            maxFreeSockets: 256,
            proxy: prettyProxy
        }
        options.agent = {
            http: new HttpProxyAgent(proxyAgentSettings),
            https: new HttpsProxyAgent(proxyAgentSettings)
        }
    }
    if (!options.hasOwnProperty('headers')) options.headers = {
        'accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        'accept-encoding': 'none',
        'accept-language': "en-US,en;q=0.9,fr;q=0.8",
        'cache-control': 'max-age=0',
        'connection': 'keep-alive',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1'
    };
    options.headers['user-agent'] = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66`;
    if (!options.hasOwnProperty('timeout')) options.timeout = 7000;
    return got(url, options);
}

const getProductInfo = async(sku) => {
    console.log(getTime() + 'Fetching product ID...')
    const response = await request(task.site.url + 'api/products/pdp/' + sku, {
        method: 'GET',
    });
    xmlParser.parseString(response.body, function (err, result) {
        parsedJson = result;
    });
    productInfo = parsedJson.pdp;
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

function getTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var time = "[" + h + ":" + m + ":" + s + "] ";
    return time;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function convertProxy(proxyData) {
    return 'http://' + proxyData.user + ':' + proxyData.pass + '@' + proxyData.ip + ':' + proxyData.port;
}

function adyenEncryptCard(paymentDetails) {
    const adyenKey = "10001|A237060180D24CDEF3E4E27D828BDB6A13E12C6959820770D7F2C1671DD0AEF4729670C20C6C5967C664D18955058B69549FBE8BF3609EF64832D7C033008A818700A9B0458641C5824F5FCBB9FF83D5A83EBDF079E73B81ACA9CA52FDBCAD7CD9D6A337A4511759FA21E34CD166B9BABD512DB7B2293C0FE48B97CAB3DE8F6F1A8E49C08D23A98E986B8A995A8F382220F06338622631435736FA064AEAC5BD223BAF42AF2B66F1FEA34EF3C297F09C10B364B994EA287A5602ACF153D0B4B09A604B987397684D19DBC5E6FE7E4FFE72390D28D6E21CA3391FA3CAADAD80A729FEF4823F6BE9711D4D51BF4DFCB6A3607686B34ACCE18329D415350FD0654D";
    cseInstance = adyenEncrypt.createEncryption(adyenKey, {});
    var timeStamp = new Date();

    const payload = {
        browserInfo: {
          colorDepth: 24,
          javaEnabled: false,
          language: "en-US",
          screenHeight: 1080,
          screenWidth: 2560,
          timeZoneOffset: 300,
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
        },
        cartId: cartInfo.data.cart.cartId, // cart-guid cookie after posting request to `/api/users/carts/current?checkInventory=true&checkPriceVariation=true&timestamp=${Date.now()}`
        deviceId: '1smaio1290samk1s09msma', // put device id here,
        encryptedCardNumber: cseInstance.encrypt({number: paymentDetails.cardNumber, generationtime: timeStamp.toISOString()}),
        encryptedExpiryMonth: cseInstance.encrypt({expiryMonth: paymentDetails.cardExpMonth, generationtime: timeStamp.toISOString()}),
        encryptedExpiryYear: cseInstance.encrypt({expiryYear: paymentDetails.cardExpYear, generationtime: timeStamp.toISOString()}),
        encryptedSecurityCode: cseInstance.encrypt({cvc: paymentDetails.cardCvv, generationtime: timeStamp.toISOString()}),
        paymentMethod: "CREDITCARD",
        preferredLanguage: "en",
        returnUrl: task.site.url + 'adyen/checkout',
        termsAndCondition: false
      };
    return payload;
}

const getCartGUID = async(token) => {
    const response = await request(`${task.site.url}api/v3/session?timestamp=${Date.now()}`, {
        method: 'GET',
        'headers': {
            'accept': 'application/json',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'origin': task.site.url,
            'referer': task.site.url + 'checkout',
            'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'x-csrf-token': token,
            'x-fl-request-id': uuid.v4(),
            },
    })
    return response.body
}

const getCurrentStatus = async() => {
    console.log("Getting current cart status");
    const response = await request(`${task.site.url}/api/users/carts/current?timestamp=${Date.now()}`, {
        method: 'GET',
        'headers': {
            'accept': 'application/json',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'referer': task.site.url + 'cart',
            'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'x-fl-request-id': uuid.v4(),
            },
    })
    console.log(response.body.guid);
    return response
}

Footlocker();
//module.exports = { Footlocker }