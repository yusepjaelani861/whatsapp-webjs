const fs = require('fs');
const axios = require('axios');
require('colors')
const errorHandler = (error, req, res, next) => {
    console.log(error);
    if (!error.message) {
        let message_error =
            '=====================' + new Date() + '=====================' +
            ' \r' +
            error.stack +
            ' \r' +
            '=======================================================================================================';

        let message_console =
            '=====================' + new Date() + '=====================' +
            ' \n' +
            error.stack +
            ' \n' +
            '=======================================================================================================';

        let message_telegram = `
Netzone Media Ticketing System Error
Error: URL: ${req.originalUrl} Method: ${req.method}
====${new Date().toDateString()}======
${error.stack}
=======================
        `

        fs.appendFile('error.log',
            message_error, function (err) {
                if (err) throw err;
            })

        axios.post('https://test.mitehost.my.id/api/20ca36496e2da44a9a2cd237548fd5dfea48d624/send', {
            chatId: '-1001847863693',
            body: message_telegram
        });


        console.log(message_console.red);
    }
    console.log(error.name);
    // let error = { ...err };



    if (typeof (error.error) !== 'undefined' && error.error.error_code == 'VALIDATION_ERROR') {
        let error_validation = {};

        error.error.error_data.forEach((element) => {
            error_validation[element.param] = [element.msg];
        });

        error.error.error_data = error_validation


        res.status(error.status ?? 400).json({
            success: error.success ?? false,
            message: error.message ?? 'Server Error',
            data: error.data ?? null,
            error: {
                error_code: error.error?.error_code ?? 'PROCESS_ERROR',
                error_data: error_validation,
            }
        });
    }

    if (error.name == 'SequelizeDatabaseError') {
        res.status(error.status ?? 400).json({
            success: error.success ?? false,
            message: error.message ?? 'Server Error',
            data: error.data ?? null,
            error: {
                error_code: 'DATABASE_ERROR',
                error_data: error.error?.error_data ?? [],
            }
        });
    }


    // if (err.name == 'JsonWebTokenError') {
    //     res.status(error.statusCode || 200).json({
    //         success: false,
    //         error_code: 'UNAUTHORIZED',
    //         message: 'Not Authorized',
    //     });
    // }

    // if (err.name == 'SequelizeValidationError' || err.name == 'SequelizeUniqueConstraintError') {

    //     let validationObject = new Object;

    //     err.errors.forEach(val => {
    //         validationObject[val.path] = val.message
    //     });

    //     res.status(error.statusCode || 200).json({
    //         success: false,
    //         error_code: 'VALIDATION_ERROR',
    //         message: 'Gagal Mengambil Data',
    //         data: validationObject
    //     });
    // }

    res.status(error.status ?? 400).json({
        success: error.success ?? false,
        message: error.message ?? 'Server Error',
        data: error.data ?? null,
        error: {
            error_code: error.error?.error_code ?? 'PROCESS_ERROR',
            error_data: error.error?.error_data ?? [],
        }
    });
}

module.exports = errorHandler;