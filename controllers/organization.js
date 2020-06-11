const rootDir = require('../utils/path');
const { request } = require('http');
const { response } = require('express');

exports.getAddRelief = (request, response, next)=>{

    response.render('reliefInfo',{

        pageTitle: 'Add relief'
    });
}

exports.postAddRelief = (request, response, next)=>{

    const name = request.body.name;
    const address = request.body.address;
    const mobileNumber = request.body.mobile_number;
    
    console.log(name, address, mobileNumber);
    response.redirect('/add-relief');
}