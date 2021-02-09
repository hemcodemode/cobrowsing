// "use strict";
// var page = require('webpage').create(),
//     system = require('system'),
//     address, output, size;

// if (system.args.length < 3 || system.args.length > 5) {
//     console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] [zoom]');
//     console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
//     console.log('  image (png/jpg output) examples: "1920px" entire page, window width 1920px');
//     console.log('                                   "800px*600px" window, clipped to 800x600');
//     phantom.exit(1);
// } else {
//     address = system.args[1];
//     output = system.args[2];
//     page.viewportSize = { width: 600, height: 600 };
//     if (system.args.length > 3 && system.args[2].substr(-4) === ".pdf") {
//         size = system.args[3].split('*');
//         page.paperSize = size.length === 2 ? { width: size[0], height: size[1], margin: '0px' }
//                                            : { format: system.args[3], orientation: 'portrait', margin: '1cm' };
//     } else if (system.args.length > 3 && system.args[3].substr(-2) === "px") {
//         size = system.args[3].split('*');
//         if (size.length === 2) {
//             pageWidth = parseInt(size[0], 10);
//             pageHeight = parseInt(size[1], 10);
//             page.viewportSize = { width: pageWidth, height: pageHeight };
//             page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };
//         } else {
//             console.log("size:", system.args[3]);
//             pageWidth = parseInt(system.args[3], 10);
//             pageHeight = parseInt(pageWidth * 3/4, 10); // it's as good an assumption as any
//             console.log ("pageHeight:",pageHeight);
//             page.viewportSize = { width: pageWidth, height: pageHeight };
//         }
//     }
//     if (system.args.length > 4) {
//         page.zoomFactor = system.args[4];
//     }
//     page.content = '<html><body><p>dfofmfdof fowef</p></body></html>';
//     page.render(output);
//     // page.open(address, function (status) {
//     //     if (status !== 'success') {
//     //         console.log('Unable to load the address!');
//     //         phantom.exit(1);
//     //     } else {
//     //         var page = page
//     //         var events = page.evaluate(function(){
//     //           document.write('<body>he</body>');
//     //            window.setTimeout(function (page) {
//     //                 page.render(output);
//     //                 phantom.exit();
//     //             }, 200);

//     //         });
            
//     //     }
//     // });
// }





//import the webserver module, and create a server
var server = require('webserver').create();
var fs = require('fs');
// start a server on port 8080 and register a request listener
var port = require('system').env.PORT || 8080;
//var page = null; 
server.listen(port, function(request, response) {
    console.log(request.url);
    console.log(request.method);
    if(request.url=="/html2Pdf" && request.method == 'POST'){

        //console.log(JSON.stringify(request.post));
        var params = JSON.parse(JSON.stringify(request.post));
        //console.log(params.html)
        
        //page.content = '<html> <head> <link href="http://localhost:5026/App_Themes/CSS/web_interview/style/bootstrap.min.css" media="all" rel="stylesheet" type="text/css" /> <link href="http://localhost:5026/App_Themes/CSS/MLStackRank/circle.css" media="all" rel="stylesheet" type="text/css" /> <link href="http://localhost:5026/App_Themes/CSS/MLStackRank/MLReport.css" media="all" rel="stylesheet" type="text/css" /> <link href="http://localhost:5026/App_Themes/Fonts/font-awesome.min.css" media="all" rel="stylesheet" type="text/css" /> <style> @media all{ body,html{ -webkit-print-color-adjust: exact; } .emtyFill { position: relative; width: 100%; height: 8px; background-color: #ddd !important; border-radius: 5px; } .essentialFill { position: absolute; width: 20%; height: 100%; background-color: #35b9f1 !important; border-radius: 5px; } .importantFill { position: absolute; width: 20%; height: 100%; background-color: #f27231 !important; ; border-radius: 5px; } .gthFill { position: absolute; width: 20%; height: 100%; background-color: #fdca3b !important; border-radius: 5px; } p { font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif; color: #666; font-size: 14px; margin-bottom: 0px; } .EssentialComp p, .GthComp p, .ImportantComp p{ font-size: 11px;font-weight:bold; } .circleBase { width: 96px; height: 96px; border-radius: 50%; border: 1px solid #fff; background: #cccccc !important; background-image: linear-gradient(18deg, #cccccc 50%, transparent 50%),linear-gradient(-90deg, #307bbb 50%, transparent 50%) !important; } .circleFill { width: 80px; height: 80px; border-radius: 50%; text-align: center; background: #fff !important; margin-left: 7px; margin-top: 7px; line-height: 81px !important; font-size: 1.0em; color: #307bbb; position: absolute; font-weight: bold; } } </style> </head><body id="report_generation"> <div class="container MLReportBody"> <div class="candidateReport row"> <div class="row rep_header"> <div class="col-xs-12"> <div> <img class="companyLogo" src="http://localhost:5026/App_Themes/CSS/web_interview/images/zinghr_logo.png" /> </div> </div> </div> <div class="row pers_info opacity_bg"> <div class="col-xs-6"> <h3 class="candidateName">David Ingram</h3> <a class="candidateEmail" href="mailto:rabdom@gmail.com"><i class="fa fa-envelope" aria-hidden="true"></i> rabdom@gmail.com</a> <div class="candidateMobile"><i class="fa fa-phone" aria-hidden="true"></i> +91-9766453429</div> <div class="candidateAge"><i class="fa fa-user" aria-hidden="true"></i> 25 Years 5 Months</div> </div> <div class="col-xs-6 opacity_bg score_mark"> <h1><i class="fa fa-pie-chart" aria-hidden="true"></i> Candidate Report</h1> <div class="candidateMLScore c100 green p86"> <!--<div class="circleBase"><div class="circleFill">30%</div></div>--> <span>86%</span> <div class="slice"> <div class="bar"> </div><div class="fill"> </div> </div> </div> </div> </div> <div class="row"> <div class="col-xs-12 marginBottom opacity_bg"> <div class="marginBottom"> <h3 class="TextFormat"><i class="fa fa-user-circle-o" aria-hidden="true"></i> Personal Details:</h3> <div class="row"> <div class="col-xs-6"> <span class="header_title">Education Information:</span> <div class="TextFormat"> <div><span class="attr_title"><i class="fa fa-building-o" aria-hidden="true"></i>College Name: </span><span class="clgName">Institute of Technology, Bombay</span></div> <div><span class="attr_title"><i class="fa fa-bookmark-o" aria-hidden="true"></i>Highest Qualification: </span><span class="highestQual"></span></div> <div><span class="attr_title"><i class="fa fa-graduation-cap" aria-hidden="true"></i>No. of Degrees: </span><span class="totalDegrees"></span></div> </div> </div> <div class="col-xs-6"> <span class="header_title">Experience Details:</span> <div class="TextFormat"> <div><span class="attr_title">Total Experience: </span><span class="totalExp">5 years</span></div> <div><span class="attr_title">Previous Company Name: </span><span class="prevCompany">Microsoft</span></div> <div><span class="attr_title">Previous Company Duration: </span><span class="prevCompanyDuration">2 years 4 months</span></div> <div><span class="attr_title">Previous Company Designation: </span><span class="prevCompanyDesig">Software Developer</span></div> <div><span class="attr_title">Total Companies Worked in: </span><span class="totalCompanies">3</span></div> <div style="display:none;"><span class="attr_title">Total Gap: </span><span class="totalGap">5 Months</span></div> </div> </div> </div> </div> </div> </div> <div class="row"> <div class="col-xs-12 marginBottom opacity_bg competencies_wrap"> <h3 class="TextFormat"><i class="fa fa-cubes" aria-hidden="true"></i> Skills:</h3> <div class="header_title" style="margin-top:20px;"> <span class="TextFormat">User Defined Skills:</span><span class="TextFormat" style="float:right"><span class="scoreDetails">Score: <span class="udefskillScore">87%</span></span></span> </div> <div class="skillsBlock"> <span>Essential Skills:</span> <span class="essentialSkillsVal"> <div style="margin-bottom: 12%;"> <div class="circleBase"><div class="circleFill">30%</div></div> <!--<span>80%</span> <div class="slice"> <div class="bar"> </div><div class="fill"> </div> </div>--> </div> </span> <div class="essentialSkillsText">.Net Developer, C#, MVC, JQuery, ASP.net, HTML, AJAX, JavaScript</div> </div> <div class="skillsBlock"> <span>Important Skills:</span> <span class="importantSkillsVal"> <div style="margin-bottom: 12%;" > <div class="circleBase"><div class="circleFill">30%</div></div> <!--<span>80%</span> <div class="slice"> <div class="bar"> </div><div class="fill"> </div> </div>--> </div> </span> <div class="importantSkillsText">Angular JS, WCF, LINQ, EF, Object Oriented Programming, Service Oriented Application</div> </div> <div class="skillsBlock"> <span>Good to have Skills:</span> <span class="gthSkillsVal"> <div style="margin-bottom: 12%;"> <div class="circleBase"><div class="circleFill">30%</div></div> <!--<span>80%</span> <div class="slice"> <div class="bar"> </div><div class="fill"> </div> </div>--> </div> </span> <div class="gthSkillsText">Good Communication Skill, CSS</div> </div> <div class="header_title" style="margin-top:150px;"> <span class="TextFormat">Domain Based Skills:</span><span class="TextFormat" style="float:right"><span class="scoreDetails">Score: <span class="dobskillScore">91%</span></span></span> </div> <div class="skillsBlock" style="display:none"> <span></span><span class="title"><i class="fa fa-sitemap" aria-hidden="true"></i>Managerial Skills:</span> <div class="managerialSkills TextFormat">Team Management, Leadership, and agile development</div> </div> <div class="skillsBlock" style="width:100%"> <span></span><span style="display:none" class="title"><i class="fa fa-cog" aria-hidden="true"></i>Technical Skills:</span> <div class="techSkills TextFormat">Net, C#, PHP, Mobile Development, Python, Machine Learning</div> </div> <div class="skillsBlock" style="display:none"> <span></span><span class="title"><i class="fa fa-users" aria-hidden="true"></i>Marketing Skills:</span> <div class="marketingSkills TextFormat">Digital Marketing, Market, Social Media Marketing</div> </div> <div class="skillsBlock TextFormat" style="display:none"> <div style="font-size:15px"><span>Highest Fitment: </span><span class="strongDomain">Technical</span></div> <div style="font-size:15px;margin-top:10px;margin-bottom:10px"><span>Lowest Fitment: </span><span class="weakDomain">Sales</span></div> </div> </div> </div> <div class="row"> <div class="col-xs-12 marginLeft marginBottom opacity_bg competencies_wrap"> <h3 class="TextFormat"><i class="fa fa-line-chart" aria-hidden="true"></i> Competencies:</h3> <div class="TextFormat marginBottom"> <ul class="pecentile_box2"> <li style="width: 100%;height: 426px;"> <div class="col-md-12 col-xs-12 margin-bottom-10 margin-top-10 CompetencyBlock"> <div class="col-md-12 col-xs-12" style="margin-top:5px"> <p><b>Essential</b></p> <div class="EssentialComp" style="margin-left:-15px;margin-top:2px"> <div class="col-md-6"> <p>Analytical Skills </p> <div class="emtyFill"> <div class="essentialFill"></div> </div> </div> </div> </div> <div class="col-md-12 col-xs-12" style="margin-top:5px"> <p><b>Important</b></p> <div class="ImportantComp" style="margin-left:-15px;margin-top:2px"> <div class="col-md-6"> <p>Analytical Skills </p> <div class="emtyFill"> <div class="importantFill"></div> </div> </div> </div> </div> <div class="col-md-12 col-xs-12" style="margin-top:5px"> <p><b>Good to have</b></p> <div class="GthComp" style="margin-left:-15px;margin-top:2px"> <div class="col-md-6"> <p>Analytical Skills </p> <div class="emtyFill"> <div class="gthFill"></div> </div> </div> </div> </div> </div> </li> </ul> <ul class="pecentile_box"> <li style="display:none"> <h2>Essential Competencies Fulfilled:</h2> <div class="essentialCompFull"> <div class="circleBase"><div class="circleFill">30%</div></div> <!--<span>75%</span> <div class="slice"> <div class="bar"> </div><div class="fill"> </div> </div>--> </div> </li> <li style="display:none"> <h2>Important Competencies Fulfilled:</h2> <div class="importantCompFull"> <div class="circleBase"><div class="circleFill">30%</div></div> <!--<span>25%</span> <div class="slice"> <div class="bar"> </div><div class="fill"> </div> </div>--> </div> </li> <li style="display:none"> <h2>Good to have Competencies Fulfilled:</h2> <div class="goodtohaveCompFull"> <div class="circleBase"><div class="circleFill">30%</div></div> <!--<span>0%</span> <div class="slice"> <div class="bar"> </div><div class="fill"> </div> </div>--> </div> </li> <li> <h2>Highest Fitment:</h2> <span class="highestFitment" style="font-size:12px">Applying Expertise and Technology</span> <h2 style="margin-top:15px">Lowest Fitment:</h2> <span class="lowestFitment" style="font-size:12px">Relating and Networking</span> </li> <li> <h2>JD Resume Similarity:</h2> <div class="jdResumeSimilarity"> <div class="circleBase"><div class="circleFill">30%</div></div> <!--<span>70%</span> <div class="slice"> <div class="bar"> </div><div class="fill"> </div> </div>--> </div> </li> <li> <h2 style="height:28px">Recruiter Candidate Similarity:</h2> <div class="recruiterResumeSimilarity"> <div class="circleBase"><div class="circleFill">30%</div></div> <!--<span>52%</span> <div class="slice"> <div class="bar"> </div><div class="fill"> </div> </div>--> </div> </li> <li> <h2 style="height:28px">Overall Similarity:</h2> <div class="overAllSimilarity"> <div class="circleBase"><div class="circleFill">30%</div></div> <!--<span>61%</span> <div class="slice"> <div class="bar"> </div><div class="fill"> </div> </div>--> </div> </li> </ul> </div> </div> </div> <div class="col-xs-12" style="background-color:#a5a5a5 !important;display:none"> <h3 class="TextFormat">Overall Summary:</h3> <p class="overall-summmary TextFormat">David Ingram is a good match for Software developer profile, has high technical skills and average competencies, with an experience of more than 2 years.</p> </div> </div> </div></body></html>';
        try{
            var htmladdress = (new Date().getTime())+".html";
            fs.write(htmladdress, unescape(params.html), 'w');
            console.log("The file was saved!");
            var page = require('webpage').create();
            //page.viewportSize = { width: 1295,height:1542 };
            page.viewportSize = { width: 705,height:980 };
            // page.paperSize = {
            //   format: 'A4',
            //   orientation: 'portrait'
            //   width: '705px', height: '980px', margin: '0px'
            // };
            //page.paperSize = { width: '705px', height: '980px', margin: '0px' };
            page.paperSize = { width: '1295px', height: '1542px', margin: '0px' };
            //page.zoomFactor = 0.25;
            //page.zoom = 0.25;      
            page.open(htmladdress, function (status) {
                if (status !== 'success') {
                    console.log('Unable to load the address!');
                    //phantom.exit(1);
                } else {
                        var page = this;
                        console.log(page);
                        window.setTimeout(function () {
                        var filename = (new Date().getTime())+".pdf";
                        
                         
                        page.render(filename);
                        try{
                            var pdfStream = fs.open(filename, 'rb'); 
                            var pdfContent = pdfStream.read();              
                            var base64Encoded = btoa(pdfContent);
                            pdfStream.close();
                            response.statusCode = 200;
                            response.headers = {
                                            'Access-Control-Allow-Origin':'*',
                                            'Cache': 'no-cache',
                                            'Content-Type': 'application/base64',
                                            'Connection': 'Keep-Alive',
                                            'Content-Length': base64Encoded.length.toString()
                                            };
                            response.write(base64Encoded);
                            response.close();
                            console.log("file "+filename+" successfully sent to client");
                     
                            }catch(e){
                                        response.statusCode = 200;
                                        response.setHeader('content-type', 'text');
                                        console.log("eroo  "+e);
                                        response.write(e);
                                        response.close();
                            }
                            
                        }, 5000);    
                }
            }); 
        }catch(ex){
            console.log(ex)
        }
        
       //  page.content = unescape(params.html)
       //  var filename = (new Date().getTime())+".pdf";
       //  page.render(filename,function(status){
       //      console.log("done");
       //      page.close();
       //  });        
       //  console.log('created');
       //  console.log('reading');        

       // try {
       //   //response.setHeader('content-type', 'text');
       //   console.log('dsd')
       //      var pdfStream = fs.open(filename, 'rb'); 
       //      var pdfContent = pdfStream.read();              
       //      var base64Encoded = btoa(pdfContent);
       //      pdfStream.close();
       //      response.statusCode = 200;
       //      response.headers = {
       //                      'Access-Control-Allow-Origin':'*',
       //                      'Cache': 'no-cache',
       //                      'Content-Type': 'application/base64',
       //                      'Connection': 'Keep-Alive',
       //                      'Content-Length': base64Encoded.length.toString()
       //                      };
       //      response.write(base64Encoded);
       //      response.close();
            
       //  } catch (e) {
       //      response.statusCode = 200;
       //      response.setHeader('content-type', 'text');
       //      console.log("eroo  "+e);
       //      response.write(e);
       //      response.close();
       //  }
        

    }else if(request.url=="/getPdf"){
        fs.readFile('testfile.pdf', function(err, data) {
            response.writeHead(200, {'Content-Type': 'application/pdf'});
            response.write(data);
           //response.end();
            response.close();
        });        
    }
    else{
         //fileServer.serve(request, response);
        response.statusCode = 200;
        response.setHeader('content-type', 'text/html');
        response.write("invalid request");
        response.close();
    }
});
console.log('server started at:'+port);