require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// removing .env from github -> git rm --cached .env

const nightmare = require('nightmare')()

const args = process.argv.slice(2)
const url = args[0]
const minPrice = args[1]

priceChecker()


async function priceChecker(){
try {

    const price = await nightmare
                        .goto(url)
                        .wait('#corePrice_feature_div .a-price-whole')
                        .evaluate(() => document.querySelector('.a-price-whole').innerText)
                        .end()

    //console.log("Price->" + price)
    if(price < minPrice){
        await sendEmail(
            'Price is low',
            `The Price on this ${url} has dropped below ${minPrice}`
        )
        
    }
    
} catch (error) {
    await sendEmail('Amazon price checker erroe' , error.message)
    throw error
}

                       
}

function sendEmail(subject , body){
    const email = {
        to: 'seherof875@siberpay.com',
        from : 'seherof875@siberpay.com',
        subject : subject,
        text : body,
        html : body

    }

    return sgMail.send(email)
}