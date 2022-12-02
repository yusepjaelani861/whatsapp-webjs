const router = express.Router();

const {
    create_qr,
    send_message,
    validate
} = require('../controllers/whatsapp');

router
    .route('/create_qr')
    .get(create_qr);

router
    .route('/send-message')
    .post(send_message);


module.exports = router;