const rootDir = require('../utils/path');
const ReliefRequest = require('../models/ReliefRequests');
const Team = require('../models/Team');
const path = require('path');
const helperFunctions = require('../utils/helper');

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
    ReliefRequest.find({teamId: {$exists: false}})
                .countDocuments()
                .then(requestCount=>{

                    totalRequests = requestCount;
                    return ReliefRequest.find({teamId: {$exists: false}})
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

exports.postAssignRequest = (request, response, next)=>{

    let requestNo = 0;
    if(!request.body.requestNo){
        
    }
        
    console.log(requestNo);
    const teamName = request.body.teamName;
    let teamId;
    
    //find teamid by using name
    Team.find({teamName: teamName})
        .then(teams=>{
            //first find requestNo number of requests
            teamId = teams[0]._id;
            return ReliefRequest.find({teamId: {$exists: false}})
                                .limit(requestNo);
        })
        .then(requests=>{
            helperFunctions.assignTeam(requests, teamId, ()=>{

                response.redirect('/admin/relief-requests');
            });
        })
        .catch(err=>{
            console.log(err);
        });


                    
};

exports.postDeleteRequest = (request, response, next)=>{

}

exports.getTeams = (request, response, next)=>{

    let pageNo = 1;
    if(request.query.page)
        pageNo = parseInt(request.query.page);
    
    let totalTeams;
    let filter = {};
    if(request.query.division && request.query.division!=='none')
        filter = {...filter, division: request.query.division};
    if(request.query.zilla && request.query.zilla!=='none')
        filter = {...filter, zilla: request.query.zilla};
    if(request.query.division && request.query.upazilla!=='none')
        filter = {...filter, upazilla: request.query.upazilla};

    //team regarding of organization
    Team.find(filter)
        .countDocuments()
        .then(teamNo=>{

            totalTeams = teamNo;
            return Team.find(filter)
                        .skip((pageNo-1)*ITEM_PER_PAGE)
                        .limit(ITEM_PER_PAGE);
        })
        .then(teams=>{

            response.render(path.join('admin', 'teams'), {

                pageTitle: 'Teams',
                path: '/admin/teams',
                teams: teams,
                currentPage: pageNo,
                hasNextPage: pageNo*ITEM_PER_PAGE < totalTeams,
                hasPrevPage: pageNo>1,
                nextPage: pageNo+1,
                prevPage: pageNo-1,
                lastPage: Math.ceil(totalTeams/ITEM_PER_PAGE),
                isAuthenticated: true
            });
        })
        .catch(err=>{
            console.log(err);
        });

}

exports.getAddTeam = (request, response, next)=>{

    let editing = 'false';
    if(request.query.edit)
        editing = request.query.edit;
    response.render(path.join('admin', 'edit-team'), {

        pageTitle: 'Add Team',
        path: '/admin/add-team',
        editing: editing,
        isAuthenticated: true
    });
};

exports.postAddTeam = (request, response, next)=>{

    const teamName = request.body.teamName;
    const logoUrl = request.body.logoUrl;
    const leaderName = request.body.leaderName;
    const division = request.body.division.toUpperCase();
    const zilla = request.body.zilla.toUpperCase();
    const upazilla = request.body.upazilla.toUpperCase();

    const newTeam = new Team({

        teamName: teamName,
        logoUrl: logoUrl,
        leaderName: leaderName,
        division: division,
        zilla: zilla,
        upazilla: upazilla,
        completed: 0,
        processing: 0,
        totalServed: 0
    });
    return newTeam.save()
            .then(result=>{
                console.log('Team added');
                response.redirect('/admin/teams');
            })
            .catch(err=>{
                console.log(err);
            });

};

exports.getTeamDetails = (request, response, next)=>{

}