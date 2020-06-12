const rootDir = require('../utils/path');
const ReliefRequest = require('../models/ReliefRequests');

exports.getAddRelief = (request, response, next)=>{

    response.render('add-relief',{

        pageTitle: 'Add relief',
        path: 'add-relief',
        isAuthenticated: true
    });
}

exports.postAddRelief = (request, response, next)=>{

    const name = request.body.name;
    const address = request.body.address;
    const mobileNumber = request.body.mobile_number;
    
    // console.log(name, address, mobileNumber);
    const newRequest = new ReliefRequest({

        name: name,
        address: address,
        mobileNumber: mobileNumber
    });
    newRequest.save()
                .then(result=>{
                    console.log('relief request added');
                    response.redirect('/add-relief');
                })
                .catch(err=>{
                    console.log(err);
                })
}   