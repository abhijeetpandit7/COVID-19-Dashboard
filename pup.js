// const puppeteer = require('puppeteer');
// function headlines(location){
//     if(location!==('favicon.ico') && location!==('sorttable.js')){
//         puppeteer.launch({ headless: true, args: ['--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'] }).then(async browser => {
//             const page = await browser.newPage();
//             //Removes timeout of 30000 ms
//             await page.setDefaultNavigationTimeout(0);
//             await page.setRequestInterception(true);
//             page.on('request', (req) => {
//                 if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
//                     req.abort();
//                 }
//                 else {
//                     req.continue();
//                 }
//             });
//             await page.goto("https://news.google.com/search?for="+location+"%20coronavirus");
//             var rposts = await page.evaluate(() => {
//                 let posts = document.body.querySelectorAll('.xrnccd');       
//                 postItems = [];
//                 for(let i = 0 ; i < 5 ; i++){
//                     let title = ''
//                     // let summary = ''
//                     let source = ''
//                     let time = ''
//                     // let link = ''
//                     try{
//                      title = posts[i].querySelector('h3').innerText;
//                     if (title!=''){
//                          summary = posts[i].querySelector('span').innerText;
//                         //  link = posts[i].querySelector('a').href;
//                          source = posts[i].querySelector('a.wEwyrc.AVN2gc.uQIVzc.Sksgp').innerText
//                          time = posts[i].querySelector('time').innerText;
//                          postItems.push({Title: title, Source: source, Time:time
//                             // ,Summary: summary, Link: link
//                         });
//                     }
//                     }catch(e){
//                     }
//                 }
//                 var items = { 
//                     "posts": postItems
//                 };
//                 return items;
//             });
//             console.log(rposts);
//             await browser.close();
//         }).catch(function(error) {
//             console.error(error);
//         });
//     }
// }

// Not used anymore