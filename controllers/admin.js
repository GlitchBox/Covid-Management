const rootDir = require('../utils/path');
const ReliefRequest = require('../models/ReliefRequests');
const Team = require('../models/Team');
const path = require('path');
const helperFunctions = require('../utils/helper');
const Orgs = require('../models/organization');

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
    const division = request.body.division;
    const zilla = request.body.zilla;
    const upazilla = request.body.upazilla;
    const mobileNumber = request.body.mobile_number;
    
    // console.log(name, address, mobileNumber);
    const newRequest = new ReliefRequest({

        orgId: request.org._id,
        name: name,
        division: division.toUpperCase(),
        zilla: zilla.toUpperCase(),
        upazilla: upazilla.toUpperCase(),
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

    // const errorMessage = request.flash('error');
    // if(errorMessage && errorMessage.length>0)
    //     errorMessage = errorMessage[0];
    // else
    //     errorMessage = null;

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
                        teams: request.org.teams,
                        // errorMessage: errorMessage,
                        currentPage: pageNo,
                        hasNextPage: pageNo*ITEM_PER_PAGE < totalRequests,
                        hasPrevPage: pageNo>1,
                        nextPage: pageNo+1,
                        prevPage: pageNo-1,
                        lastPage: Math.ceil(totalRequests/ITEM_PER_PAGE),
                        isAuthenticated: true
                    });
                    
                })
                .catch(err=>{
                    console.log(err);
                });
};

exports.postAssignRequest = (request, response, next)=>{

    let requestNo;
    // if(!request.body.requestNo){

    //     request.flash('error', 'Number of Requests has not been set');
    //     return response.redirect('/admin/relief-requests');
    // }
    requestNo = parseInt(request.body.requestNo);
    // console.log(requestNo);
    if(requestNo===0)
        return response.redirect('/admin/relief-requests');

    const teamId = request.body.teamId;
    let selectedTeam;
    for(team of request.org.teams){

        if(team.teamId.toString()==teamId.toString()){
            selectedTeam = team;
            break;
        }
    }
    // console.log(team);
    const teamDiv = team.division;
    const teamZilla = team.zilla;
    const teamUpazilla = team.upazilla;
    let assignNum; 
    ReliefRequest.find({
                        teamId: {$exists: false},
                        division: teamDiv, 
                        zilla:teamZilla, 
                        upazilla: teamUpazilla
                    })
                .countDocuments()
                .then(numberOfReqs=>{

                    assignNum = Math.min(numberOfReqs, requestNo);
                    console.log(assignNum);
                    return ReliefRequest.find({
                                                teamId: {$exists: false},
                                                division: teamDiv, 
                                                zilla:teamZilla, 
                                                upazilla: teamUpazilla})
                                        .limit(assignNum);
                })
                .then(topRequests=>{


                    helperFunctions.assignTeam(topRequests, teamId, assignNum, ()=>{
                        request.org.processing = request.org.processing + assignNum;
                        return request.org.save();
                    });
                })
                .then(result=>{

                    response.redirect('/admin/relief-requests');
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
    
    let filter = {};
    if(request.query.division && request.query.division!=='none')
        filter = {...filter, division: request.query.division};
    if(request.query.zilla && request.query.zilla!=='none')
        filter = {...filter, zilla: request.query.zilla};
    if(request.query.division && request.query.upazilla!=='none')
        filter = {...filter, upazilla: request.query.upazilla};

    const startIndex = (pageNo-1)*ITEM_PER_PAGE;
    const teams = request.org.teams.filter(team=>{

        let f = {};
        if(filter.division)
            f = {...f, division: team.division}
        if(filter.zilla)
            f = {...f, zilla: team.zilla};
        if(filter.upazilla)
            f = {...f, upazilla: team.upazilla};

        return JSON.stringify(f) === JSON.stringify(filter);
    });
    // console.log(teams);
    response.render(path.join('admin', 'teams'), {

        pageTitle: 'Teams',
        path: '/admin/teams',
        teams: teams.slice(startIndex, startIndex+ITEM_PER_PAGE),
        currentPage: pageNo,
        hasNextPage: pageNo*ITEM_PER_PAGE < teams.length,
        hasPrevPage: pageNo>1,
        nextPage: pageNo+1,
        prevPage: pageNo-1,
        lastPage: Math.ceil(teams.length/ITEM_PER_PAGE),
        isAuthenticated: true
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

    let teamId = 1;
    const logoUrl = request.body.logoUrl;
    const leaderName = request.body.leaderName;
    const division = request.body.division.toUpperCase();
    const zilla = request.body.zilla.toUpperCase();
    const upazilla = request.body.upazilla.toUpperCase();

    return Orgs.findById(request.org._id)
        .select('teams zilla upazilla division')
        .then(org=>{

            if(org.teams.length>0)
                teamId = org.teams[org.teams.length-1].teamId+1;

            const newTeam = {

                teamId: teamId,
                logoUrl: logoUrl,
                leaderName: leaderName,
                division: division,
                zilla: zilla,
                upazilla: upazilla,
                completed: 0,
                processing: 0,
                totalServed: 0
            };
            org.teams.push(newTeam);
            if(org.division.indexOf(division)===-1)
                org.division.push(division);
            if(org.zilla.indexOf(zilla)===-1)
                org.zilla.push(zilla);
            if(org.upazilla.indexOf(upazilla)===-1)
                org.upazilla.push(upazilla);

            org.save()
                .then(result=>{

                    console.log('Team has been added!');
                    response.redirect('/admin/teams');
                });
        })

};

exports.getTeamDetails = (request, response, next)=>{

}