const ReliefRequest = require('../models/ReliefRequests');

exports.assignTeam = (docList, teamId, callback)=>{

    while(docList.length>0){

        let topDoc = docList.pop();
        topDoc.teamId = teamId;
        topDoc.save()
                .then(result=>{
                    console.log('Added teamId to ',topDoc._doc.name,"'s request");
                    if(docList.length>0)
                        this.assignTeam(docList, updates, callback);
                })
                .catch(err=>{
                    console.log(err);
                });
    }

    return callback();
};