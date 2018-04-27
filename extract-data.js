const phantom = require('phantom')
let instance



module.exports = async  function (url){
  if (!instance){
    let inst = await phantom.create(['--load-images=no',])
    instance = inst
    console.log('phantom instance created')
  }

    let page = await instance.createPage();

    // const instance = await phantom.create();
    // await page.on('onResourceRequested', function(requestData) {
    //   console.info('Requesting', requestData.url);
    // });

    const status = await page.open(url);
    const data = await page.evaluate(function(){ return window.digitalData.product[0].productInfo})
    await page.close()
      // console.log(data)
      return (data)
    // const content = await page.property('window.digitalData');
    // console.log(`content: ${content}`);
};
