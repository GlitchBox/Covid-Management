const rootDir = require('../utils/path');
const ReliefRequest = require('../models/ReliefRequests');
const path = require('path');

const ITEM_PER_PAGE = 2;

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
                    response.redirect('/admin/add-relief');
                })
                .catch(err=>{
                    console.log(err);
                })
}

exports.getReliefRequests = (request, response, next)=>{

    let pageNo = 1;
    if(request.query.page)
        pageNo = parseInt(request.query.page);

    let totalRequests;
    ReliefRequest.find()
                .countDocuments()
                .then(requestCount=>{

                    totalRequests = requestCount;
                    return ReliefRequest.find()
                                        .skip((pageNo-1)*ITEM_PER_PAGE)
                                        .limit(ITEM_PER_PAGE);
                })
                .then(requests=>{

                    response.render(path.join('admin','relief-requests'),{

                        pageTitle: 'Unassigned Requests',
                        path: '/admin/relief-requests',
                        requests: requests,
                        currentPage: pageNo,
                        hasNextPage: pageNo*ITEM_PER_PAGE < totalRequests,
                        hasPrevPage: pageNo>1,
                        nextPage: pageNo+1,
                        prevPage: pageNo-1,
                        lastPage: Math.ceil(totalRequests/ITEM_PER_PAGE),
                        isAuthenticated: true
                    });
                })
};

exports.postDeleteRequest = (request, response, next)=>{

}