# THIS IS NO LONGER MAINTAINED. FOR A MAINTAINED VERSION, SEE https://github.com/AlekEagle/bf2api

This is a module that will allow you to connect to the BF2Hub API to read scores, and leaderboard entries, more features will be coming soon.

Current features:
Basic player info,
Player leaderboard positions,
and displays pages of 5 for leaderboards

TODO List:
Awards,
Unlocks,
and Player search

Current Functions:
`getUserLeaderboardInfo(user, userType)`
The `user` parameter is the players IGN (In Game Name) or the player id, The `userType` parameter is what is used to determine if the `user` parameter is a IGN or player id, leave this blank, undefined, or set to `nick` for `nick` AKA: IGN, or set it to `pid` for player id. This function will return an Object Promise.
`getBasicPlayerInfo(user, userType)`
The `user` parameter is the players IGN (In Game Name) or the player id, The `userType` parameter is what is used to determine if the `user` parameter is a IGN or player id, leave this blank, undefined, or set to `nick` for `nick` AKA: IGN, or set it to `pid` for player id. This function will return an Object Promise. Example:

        const bf2api = require('bf2api.js')
        bf2api.getBasicPlayerInfo('AlekEagle').then(info => {
            console.log(info.updatedOn)
            console.log(info.pid)
            console.log(info.nickname)
            console.log(info.score)
            console.log(info.joinedOn)
            console.log(info.wins)
            console.log(info.losses)
            console.log(info.rounds)
            console.log(info.time)
            console.log(info.accuracy)
            console.log(info.kills)
            console.log(info.deaths)
            console.log(info.rank)
        }, (err) => {
            console.error(err) //Will usually return "User Not Found."
        });

`get5LeaderBoardScores(page)`
The `page` parameter is the page of scores you want to see, leave blank for the first page. This function will return an Array Promise.
Returns:

        returnedArray[0]
            .leaderboardLength
            .updatedOn
        returnedArray[1-5]
            .playerPos
            .pid
            .nickname
            .score
            .timePlayed
            .rank
            .country

NOTE: I am sorry if this is confusing, this is my first npm module and I don't exactly have experience making README.md files, this was my attempt.
