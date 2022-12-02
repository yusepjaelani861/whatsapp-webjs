const { Client, LocalAuth } = require("whatsapp-web.js");
const asyncHandler = require("../middleware/async");
const qrcode_terminal = require("qrcode-terminal");
const qrcode = require("qrcode");

const client = new Client({
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  },
  authStrategy: new LocalAuth({
    restartOnAUthFailure: true,
    clientId: "whatsapp-web",
  }),
});
exports.auto = asyncHandler(async () => {
  if (!client.authStrategy) {
      console.log("Client authStrategy not found");
  } else {
    client.on('qr', (qr) => {
        console.log(qr);
        qrcode_terminal.generate(qr, { small: true });
    })
  }

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("message", (msg) => {
    console.log(msg);
    if (msg.body == "ping") {
      msg.reply("pong");
    }
  });

  client.initialize();
});

exports.create_qr = asyncHandler(async (req, res, next) => {
    client.on('qr', (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
            // console.timeLog(url);
            res.send({
                success: true,
                message: 'QR Code Generated',
                data: '<img src="' + url + '">'
            })
        })
        qrcode_terminal.generate(qr, { small: true });
    })

    client.on('ready', () => {
        console.log('Client is ready!');
    })

    client.on('message', msg => {
        if (msg.body == 'ping') {
            msg.reply('pong');
        }
    })

    client.initialize();
})

exports.send_message = asyncHandler(async (req, res, next) => {
    const { number, message } = req.body;

    if (!number.includes("@c.us")) {
        number = number + "@c.us";
    }
    
    client.getChatById(number).then((chat) => {
        chat.sendMessage(message);
    })
    
    res.status(200).json({
        success: true,
        message: "Message Sent",
        data: null,
    });
})
