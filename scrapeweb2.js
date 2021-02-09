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
            // await page.evaluate(() => {
            // 	var stateOption = document.getElementById('optlist_2');
            // 	console.log('page clicked');
            // 	stateOption.click();
            	
            // });

            //await page.waitForNavigation({timeout: 20000, waitUntil: ['domcontentloaded'	]});
            console.log('navigation done');
            var stateList = await page.evaluate(() => {
            	console.log('eval done');
            	var states = document.querySelectorAll('.cat-item a');
            	var stateLi = [];
            	for(var i=0;i<states.length;i++){
            		stateLi.push({
            			name:states[i].innerText,
            			link:states[i].href
            		})
            	}
            	return stateLi;
            });
            console.log(stateList);
            var AllIds = [];
            var startpage = 1566;

            for(var i=0;i<stateList.length;i++){
            	 console.log('Loading',stateList[i].name);
            	 await page.goto(stateList[i].link);
            	 //await page.waitForNavigation({timeout: 20000, waitUntil: ['domcontentloaded']});
            	 var MLAList = await page.evaluate(() => {
            	 	var stateLi = [];
            	 	try{

            	 		var d = $(".data-list").dataTable().fnGetData();
		            	if(d!=null){
		            		for(var i=0;i<d.length;i++){
			            		var data = d[i][0];
			            		var l = /href="(.+?)">(.+?)</gi.exec(data);
			            		stateLi.push({
			            			name:l[2],
			            			link:l[1]
			            		})
			            	}
		            	}
            	 	}catch(ex){
            	 		console.log(ex);
            	 	}
	            	

	            	return stateLi;
	            });
            	//console.log(MLAList);
            	console.log(MLAList.length);
            	AllIds = AllIds.concat(MLAList);
            	// if(i==1)
            	// 	break;
            }
            console.log(AllIds.length);
            if(startpage==0){
            	await fs.appendFile("AllMlas.txt", "[", function (err) {
			      if (err) throw err;
			      console.log("Save started");   
			    });
            }
            
            for(var i=startpage;i<AllIds.length;i++){
            	 console.log('Loading',AllIds[i].name, i);
            	
            	 await page.goto(AllIds[i].link);
            	 var dataList = await page.evaluate(() => {
            	 	var stateLi = {};
            	 	stateLi.name =  $("header h1").text().trim();
            	 	if($("#about").length!=0){
            	 		stateLi.about =  $("#about").text().trim();
            	 	}else{
            	 		stateLi.about = "";
            	 	}
            	 	stateLi.basicdetails = {};
            	 	if($("#basic_details").length!=0){
            	 		 var td1 = $("#basic_details table td:even");
            	 		 var td2 = $("#basic_details table td:odd");
            	 		 for(var i=0;i<td1.length;i++){
            	 		 	stateLi.basicdetails[td1.eq(i).text().trim()] = td2.eq(i).text().trim();
            	 		 }
            	 		
            	 	}
            	 	stateLi.thumbnail = ""
            	 	if($(".thumbnail").length!=0){
            	 		 stateLi.thumbnail = $(".thumbnail").attr('src');            	 		
            	 	}
            	 	stateLi.contactdetails = {};
            	 	if($("#contact_details").length!=0){
            	 		 var td1 = $("#contact_details table td:even");
            	 		 var td2 = $("#contact_details table td:odd");
            	 		 for(var i=0;i<td1.length;i++){
            	 		 	stateLi.contactdetails[td1.eq(i).text().trim()] = td2.eq(i).text().trim();
            	 		 }
            	 	}
            	 	stateLi.positionheld = {};
            	 	if($("#positions_held").length!=0){
            	 		var td1 = $("#positions_held table td:even");
            	 		 var td2 = $("#positions_held table td:odd");
            	 		 for(var i=0;i<td1.length;i++){
            	 		 	stateLi.positionheld[td1.eq(i).text().trim()] = td2.eq(i).text().trim();
            	 		 }
            	 	}
            	 	
	            	return stateLi;
	            });
            	AllIds[i].data = dataList;
            	// if(i<1753)
            	// 	continue;
            	await fs.appendFile("AllMlas.txt", JSON.stringify(AllIds[i],null,4)+",", function (err) {
			      if (err) throw err;
			      console.log('Saved');   
			    });
            	
            }
            await fs.appendFile("AllMlas.txt", "]", function (err) {
		      if (err) throw err;
		      console.log("Save done");   
		    });


            
            console.log('all done',AllIds.length);
        })();
    } else {
        //res.send('Invalid url: ' + urlToScreenshot);
         callback("");
    }
}

GetImg("https://nocorruption.in/");