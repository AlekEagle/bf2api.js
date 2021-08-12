const request = require('request');

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours = Math.floor(sec_num /3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {hours = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time = hours+':'+minutes+':'+seconds;
    return time;
}

module.exports = {
    /**
     * @arg {String|Number} user This is the user pid or nickname, Indicate what it is in the userType.
     * @arg {String} [userType=nick] Is the user a pid or nickname. Leave null or undefined for nickname mode. Can be: "nick" or "pid".
     * @returns {Promise<Object>} 
     */
    getUserLeaderboardInfo: (user, userType) => {
        if (userType === undefined || userType === null) userType = 'nick'
        return new Promise((resolve, reject) => {
            switch (userType) {
                case 'nick':
                    var requestUrl = {
                        url: `http://bf2web.bf2hub.com/ASP/getleaderboard.aspx?nick=${user}&type=score&id=overall`,
                        headers: {
                            'User-Agent': `BF2Hub-Discord-Bot/${process.version}`
                        }
                    }
                    request(requestUrl, (err, res, body) => {
                        if (!err && res.statusCode === 200 && body.split('\n')[0].split('\t')[0] !== 'E') {
                            body = body.split('\n');
                            var d0 = body[2].split('\t').splice(1)
                            var d1 = body[4].split('\t').splice(1)
                            try {
                                var data = {
                                    leaderboardLength: d0[0],
                                    updatedOn: new Date(parseInt(`${d0[1]}000`)),
                                    playerPos: d1[0],
                                    pid: d1[1],
                                    nickname: d1[2],
                                    score: d1[3],
                                    timePlayed: d1[4].toHHMMSS(),
                                    rank: d1[5],
                                    country: d1[6]
                                }
                                resolve(data);
                            }catch (err) {
                                reject('User Not Found.')
                            }
                        }else {
                            if (body.split('\n')[0].split('\t')[0] === 'E') {
                                reject('User Not Found.')
                            }else {
                                reject(`An unexpected error occured, here is the error:\n${err}`)
                            }
                        }
                    });
                break;
                case 'pid':
                    var requestUrl = {
                        url: `http://bf2web.bf2hub.com/ASP/getleaderboard.aspx?pid=${user}&type=score&id=overall`,
                        headers: {
                            'User-Agent': `BF2Hub-Discord-Bot/${process.version}`
                        }
                    }
                    request(requestUrl, (err, res, body) => {
                        if (!err && res.statusCode === 200 && body.split('\n')[0].split('\t')[0] === 'O') {
                            body = body.split('\n');
                            var d0 = body[1].split('\t').splice(1)
                            var d1 = body[4].split('\t').splice(1)
                            try {
                                var data = {
                                    leaderboardLength: d0[0],
                                    updatedOn: new Date(parseInt(`${d0[1]}000`)),
                                    playerPos: d1[0],
                                    pid: d1[1],
                                    nickname: d1[2],
                                    score: d1[3],
                                    timePlayed: d1[4].toHHMMSS(),
                                    rank: d1[5],
                                    country: d1[6]
                                }
                                resolve(data);
                            }catch (err) {
                                reject('User Not Found.')
                            } 
                        }else {
                            if (body.split('\n')[0].split('\t')[0] === 'E') {
                                reject('User Not Found.')
                            }else {
                                reject(`An unexpected error occured, here is the error:\n${err}`)
                            }
                        }
                    });
                break;
            }
        });
    },
    /**
     * @arg {String|Number} user This is the user pid or nickname, Indicate which one it is in userType.
     * @arg {String} [userType=nick] Is the user a pid or nickname. Leave null or undefined for nickname mode. Can be: "nick" or "pid".
     * @returns {Promise<Object>}
     */
    getBasicPlayerInfo: (user, userType) => {
        if (userType === undefined || userType === null) userType = 'nick';
        return new Promise((resolve, reject) => {
            switch (userType) {
                case 'nick':
                    module.exports.getUserLeaderboardInfo(user, 'nick').then((info) => {
                        var requestUrl = {
                            url: `http://bf2web.bf2hub.com/ASP/getplayerinfo.aspx?pid=${info.pid}&info=per*,cmb*,twsc,cpcp,cacp,dfcp,kila,heal,rviv,rsup,rpar,tgte,dkas,dsab,cdsc,rank,cmsc,kick,kill,deth,suic,ospm,klpm,klpr,dtpr,bksk,wdsk,bbrs,tcdr,ban,dtpm,lbtl,osaa,vrk,tsql,tsqm,tlwf,mvks,vmks,mvn*,vmr*,fkit,fmap,fveh,fwea,wtm-,wkl-,wdt-,wac-,wkd-,vtm-,vkl-,vdt-,vkd-,vkr-,atm-,awn-,alo-,abr-,ktm-,kkl-,kdt-,kkd-`,
                            headers: {
                                'User-Agent': `BF2Hub-Discord-Bot/${process.version}`
                            }
                        }
                        request(requestUrl, (err, res, body) => {
                            if (!err && res.statusCode === 200 && body.split('\n')[0].split('\t')[0] === 'O') {
                                body = body.split('\n');
                                var d0 = body[2].split('\t').splice(1)
                                var d1 = body[4].split('\t').splice(1)
                                var data = {
                                    updatedOn: new Date(parseInt(`${d0[1]}000`)),
                                    pid: d1[0],
                                    nickname: d1[1],
                                    score: d1[2],
                                    joinedOn: new Date(parseInt(`${d1[3]}000`)),
                                    wins: d1[4],
                                    losses: d1[5],
                                    rounds: d1[6],
                                    time: d1[9].toHHMMSS(),
                                    accuracy: Math.round(parseInt(d1[12])*100)/100,
                                    kills: parseInt(d1[13]),
                                    deaths: parseInt(d1[15]),
                                    rank: d1[38]
                                }
                                resolve(data);
                            }else {
                                if (body.split('\n')[0].split('\t')[0] === 'E') {
                                    reject('User Not Found.')
                                }else {
                                    reject(`An unexpected error occured, here is the error:\n${err}`)
                                }
                            }
                        });
                    }, (err) => {
                        reject(err);
                    });
                break;
                case 'pid':
                    var requestUrl = {
                        url: `http://bf2web.bf2hub.com/ASP/getplayerinfo.aspx?pid=${name}&info=per*,cmb*,twsc,cpcp,cacp,dfcp,kila,heal,rviv,rsup,rpar,tgte,dkas,dsab,cdsc,rank,cmsc,kick,kill,deth,suic,ospm,klpm,klpr,dtpr,bksk,wdsk,bbrs,tcdr,ban,dtpm,lbtl,osaa,vrk,tsql,tsqm,tlwf,mvks,vmks,mvn*,vmr*,fkit,fmap,fveh,fwea,wtm-,wkl-,wdt-,wac-,wkd-,vtm-,vkl-,vdt-,vkd-,vkr-,atm-,awn-,alo-,abr-,ktm-,kkl-,kdt-,kkd-`,
                        headers: {
                            'User-Agent': `BF2Hub-Discord-Bot/${process.version}`
                        }
                    }
                    request(requestUrl, (err, res, body) => {
                        if (!err && res.statusCode === 200 && body.split('\n')[0].split('\t')[0] !== 'E') {
                            body = body.split('\n');
                            var d0 = body[2].split('\t').splice(1)
                            var d1 = body[4].split('\t').splice(1)
                            var data = {
                                updatedOn: new Date(parseInt(`${d0[1]}000`)),
                                pid: d1[0],
                                nickname: d1[1],
                                score: d1[2],
                                joinedOn: new Date(parseInt(`${d1[3]}000`)),
                                wins: d1[4],
                                losses: d1[5],
                                rounds: d1[6],
                                time: d1[9].toHHMMSS(),
                                accuracy: Math.round(parseInt(d1[12])*100)/100,
                                kills: parseInt(d1[13]),
                                deaths: parseInt(d1[15]),
                                rank: d1[38]
                            }
                            resolve(data);
                        }else {
                            if (body.split('\n')[0].split('\t')[0] === 'E') {
                                reject('User Not Found.')
                            }else {
                                reject(`An unexpected error occured, here is the error:\n${err}`)
                            }
                        }
                    });
                break;
            }
        })
    },
    /**
     * @arg {Number} [page=1] This is the page number that will be looked at.
     * @returns {Promise<Array>}
     */
    get5LeaderboardScores: (page) => {
        if (page === null || page === undefined) page = 0
        page = (page*5)+1
        return new Promise((resolve, reject) => {
            var requestUrl = {
                url: `http://bf2web.bf2hub.com/ASP/getleaderboard.aspx?type=score&id=overall&after=4&pos=${page}`,
                headers: {
                    'User-Agent': `BF2Hub-Discord-Bot/${process.version}`
                }
            }
            request(requestUrl, (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    body = body.split('\n');
                    var d0 = body[2].split('\t').splice(1)
                    var d1 = body[4].split('\t').splice(1)
                    var d2 = body[5].split('\t').splice(1)
                    var d3 = body[6].split('\t').splice(1)
                    var d4 = body[7].split('\t').splice(1)
                    var d5 = body[8].split('\t').splice(1)
                    data = [
                        {
                            leaderboardLength: d0[0],
                            updatedOn: new Date(parseInt(`${d0[1]}000`))
                        },
                        {
                            playerPos: d1[0],
                            pid: d1[1],
                            nickname: d1[2],
                            score: d1[3],
                            timePlayed: d1[4].toHHMMSS(),
                            rank: d1[5],
                            country: d1[6]
                        },
                        {
                            playerPos: d2[0],
                            pid: d2[1],
                            nickname: d2[2],
                            score: d2[3],
                            timePlayed: d2[4].toHHMMSS(),
                            rank: d2[5],
                            country: d2[6]
                        },
                        {
                            playerPos: d3[0],
                            pid: d3[1],
                            nickname: d3[2],
                            score: d3[3],
                            timePlayed: d3[4].toHHMMSS(),
                            rank: d3[5],
                            country: d3[6]
                        },
                        {
                            playerPos: d4[0],
                            pid: d4[1],
                            nickname: d4[2],
                            score: d4[3],
                            timePlayed: d4[4].toHHMMSS(),
                            rank: d4[5],
                            country: d4[6]
                        },
                        {
                            playerPos: d5[0],
                            pid: d5[1],
                            nickname: d5[2],
                            score: d5[3],
                            timePlayed: d5[4].toHHMMSS(),
                            rank: d5[5],
                            country: d5[6]
                        },
                    ]
                    resolve(data);
                }else {
                    reject(`An unknown error occurred ${err}`)
                }
            });
        });
    }
    
}