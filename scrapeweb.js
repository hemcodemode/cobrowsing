const puppeteer = require('puppeteer');
var os = require('os');
var fs = require('fs');
const validUrl = require('valid-url');
var path = require('path');
var parseUrl = function(url) {
    url = decodeURIComponent(url)
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = 'http://' + url;
    }

    return url;
};

function GetImg(url,callback,room,ev){
	// console.log(ev);
	var urlToScreenshot = parseUrl(url);

    if (validUrl.isWebUri(urlToScreenshot)) {
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox',
                  '--disable-infobars'],
                  headless:true
            });

            page = await browser.newPage();
            page.on('console', msg => console.log('PAGE LOG:', msg.text()));
            await page.goto(urlToScreenshot);
            await page.evaluate(() => {
            	var stateOption = document.getElementById('optlist_2');
            	console.log('page clicked');
            	stateOption.click();
            	
            });

            await page.waitForNavigation({timeout: 20000, waitUntil: ['domcontentloaded'	]});
            console.log('navigation done');
            var stateList = await page.evaluate(() => {
            	console.log('eval done');
            	var states =  document.getElementById('ddlitem');
            	var opt = states.getElementsByTagName('option');
            	var stateLi = [];
            	for(var i=1;i<opt.length;i++){
            		stateLi.push(opt[i].value);
            	}
            	return stateLi;
            });
            console.log(stateList);
            var AllIds = [];
            var startpage = 35;
            for(var i=startpage;i<stateList.length;i++){
            	AllIds = [];
            	console.log('doing state',i,stateList[i])
            	await page.evaluate(async(stateval) => {
            		//console.log(stateval);
	            	var states =  document.getElementById('ddlitem');
	            	states.value = stateval;
	            	var event = new Event('change');
					states.dispatchEvent(event);
	            },stateList[i]);
	            await page.waitForNavigation({timeout: 20000, waitUntil: ['domcontentloaded'	]});
	            var allDitricts = [];
	            allDitricts = await page.evaluate(async(stateval) => {
	            	var districts =  document.getElementById('DropDownDistrict');
	            	var opt = districts.getElementsByTagName('option');
	            	var districtsLi = [];
	            	for(var i=1;i<opt.length;i++){
	            		districtsLi.push(opt[i].value);
	            	}
	            	return districtsLi;
	            });
	            //console.log('district',allDitricts);
	            for(var j=0;j<allDitricts.length;j++){
	            	await page.evaluate(async(districtval) => {
	            		//console.log(districtval);
		            	var districts =  document.getElementById('DropDownDistrict');
		            	districts.value = districtval;
		            	var event = new Event('change');
						districts.dispatchEvent(event);
	            	},allDitricts[j]);
	            	await page.waitForNavigation({timeout: 20000, waitUntil: ['domcontentloaded'	]});
	            	await page.evaluate(async(districtval) => {
	            		//console.log(districtval);
		            	var search =  document.getElementById('search');
		            	search.click();
	            	},allDitricts[j]);
	            	await page.waitForNavigation({timeout: 20000, waitUntil: ['domcontentloaded']});
	            	var isNext = true;

	            	while(isNext){
	            		var data =  await page.evaluate(async(districtval) => {
		            		var el =  document.querySelectorAll('table a');
		            		var links = []
		            		for(var i=0;i<el.length;i++){
								links.push(el[i].href.split("=")[1]);
		            		}
		            		var isNext = true;
		            		if( document.getElementById('Button1')){
		            			isNext =  document.getElementById('Button1').disabled;
		            		}
		            		
		            		return {links:links,isNext:isNext};
		            	},allDitricts[j])
		            	//console.log(data);
		            	AllIds = AllIds.concat(data.links);
		            	if(data.isNext || data.links.length==0){
		            		//console.log('no next found');
		            		break;
		            	}else{
		            		await page.evaluate(async(districtval) => {
		            			var isNext =  document.getElementById('Button1');
		            			isNext.click();
		            		},allDitricts[j]);
		            		await page.waitForNavigation({timeout: 20000, waitUntil: 'domcontentloaded'});
		            	}
	            	}	
	            	
	            }
	            fs.appendFile("AllIds.txt", AllIds, function (err) {
			      if (err) throw err;
			      console.log('Saved for', i,stateList[i]);   
			    });

	            // if(i==0)
	            // 	break;
	            //await page.waitForNavigation({timeout: 20000, waitUntil: 'networkidle2'});	            
            }

            console.log('all done',AllIds);
        })();
    } else {
        //res.send('Invalid url: ' + urlToScreenshot);
         callback("");
    }
}

GetImg("http://cbseaff.nic.in/cbse_aff/schdir_Report/userview.aspx");