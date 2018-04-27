const Crawler = require('crawler')
const { JSDOM } = require('jsdom')
const axios = require('axios')
const fs = require('fs')
const extractData = require('./extract-data')
const bigList = []
const vuokraoviList = []
const apartmentURLList = []


const crawler = new Crawler({
  rateLimit:10000,
  maxConnections:10,
  callback: async (err,res,done)=>{
    if (err) console.log(err)
    else
    {
      const apartmentList = res.$('.list-item-link[href*="/vuokra-asunto/"]').toArray().map(e=>`https://www.vuokraovi.com${e.attribs.href}`)
      // console.log(res.body)
      console.log(apartmentList)
      const list = apartmentList.map(async (apartment)=>{
        try{
          const data = await extractData(apartment)
          console.log(data)
          return {
            ...data,
            url:apartment
          }
        }
        catch (e){
          console.log(`${apartment} timed out`)
          return
        }

        // console.log(data.data)
      })
      const apartmentSpecs = await Promise.all(list)
      bigList.push(...apartmentSpecs)
      fs.writeFile('./apartmentList.json', JSON.stringify(bigList), 'utf-8', function(err) {
        if (err) throw err
        console.log(`${bigList.length} objects written`)
        done()
      })
    }
}
})
// console.log(crawler.queuSize)
// let i = 0
// crawler.on('drain',()=>{
//   if (i === 369) return
// })
for (let i=1;i<=369;i++){
  // console.log(crawler.queueSize)
  crawler.queue(`https://www.vuokraovi.com/vuokra-asunnot?page=${i}&pageType=`)
  // vuokraoviList.push()
}
