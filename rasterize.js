"use strict";
var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

if (system.args.length < 3 || system.args.length > 5) {
    console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] [zoom]');
    console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
    console.log('  image (png/jpg output) examples: "1920px" entire page, window width 1920px');
    console.log('                                   "800px*600px" window, clipped to 800x600');
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];
    page.viewportSize = { width: 600, height: 600 };
    if (system.args.length > 3 && system.args[2].substr(-4) === ".pdf") {
        size = system.args[3].split('*');
        page.paperSize = size.length === 2 ? { width: size[0], height: size[1], margin: '0px' }
                                           : { format: system.args[3], orientation: 'portrait', margin: '1cm' };
    } else if (system.args.length > 3 && system.args[3].substr(-2) === "px") {
        size = system.args[3].split('*');
        if (size.length === 2) {
            pageWidth = parseInt(size[0], 10);
            pageHeight = parseInt(size[1], 10);
            page.viewportSize = { width: pageWidth, height: pageHeight };
            page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };
        } else {
            console.log("size:", system.args[3]);
            pageWidth = parseInt(system.args[3], 10);
            pageHeight = parseInt(pageWidth * 3/4, 10); // it's as good an assumption as any
            console.log ("pageHeight:",pageHeight);
            page.viewportSize = { width: pageWidth, height: pageHeight };
        }
    }
    if (system.args.length > 4) {
        page.zoomFactor = system.args[4];
    }
    page.content = '<html><body><p>dfofmfdof fowef</p></body></html>';
    page.render(output);
    // page.open(address, function (status) {
    //     if (status !== 'success') {
    //         console.log('Unable to load the address!');
    //         phantom.exit(1);
    //     } else {
    //         var events = page.evaluate(function(){
    //           document.write('<body>he</body>');
    //             window.setTimeout(function () {
    //                 page.render(output);
    //                 phantom.exit();
    //             }, 200);

    //         });
            
    //     }
    // });
}





// import the webserver module, and create a server
// var server = require('webserver').create();

// // start a server on port 8080 and register a request listener
// var port = require('system').env.PORT || 8080;
// server.listen(port, function(request, response) {
// console.log(request);
// var page = new WebPage();
//   page.create(function (ph) {
//       ph.createPage(function (page) {
//           page.set('viewportSize', {width:1440,height:900})

//           //like this
//           page.set('<body>he</body>', html);

//           page.render('testfile.pdf', function() { 
//             //now pdf is written to disk.
//             ph.exit();
//             response.statusCode = 200;
//             response.setHeader('content-type', 'text/html');
//             response.write("testfile.pdf created");
//             response.close();

//           });
//       });
//     });
// });

// console.log('started');