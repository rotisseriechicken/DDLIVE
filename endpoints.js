window['ENDPOINTS'] = {

//	Internal
   "donors":  			(...arg)=>{ return "ddstats.live/donors.json"},
   "themes":  			(...arg)=>{ return "https://ddlt.dev/themes/all?key="+arg[0]},

//	ddstats-rust
   "ddrust_ver":  		(...arg)=>{ return "raw.githubusercontent.com/lsaa/ddstats-rust/master/version_info.json"},

//	Devil Daggers
   "ddPlayers":  		(...arg)=>{ return "dd.hasmodai.com/dd3/get_active_users.php"},

//	Clubber
   "clubber_users": 	(...arg)=>{ return "https://clubber.up.railway.app/users"},
   "clubber_splits":	(...arg)=>{ return "https://clubber.up.railway.app/bestsplits"},
   "clubber_news":  	(...arg)=>{ return "https://clubber.up.railway.app/dailynews"},

//	Swarmer
   "twitch":  			(...arg)=>{ return "https://swarmer.up.railway.app/streams?gameName=devil%20daggers"},

//	ddstats.com
   "ddstatsDaily":  	(...arg)=>{ return "https://ddstats.com/api/v2/daily"},
   "ddstatsPlayerData": (...arg)=>{ return "https://ddstats.com/api/v2/player?id="+arg[0]},
   "ddstatsGame":  		(...arg)=>{ return "https://ddstats.com/api/v2/game/full?id="+arg[0]},
   "myGames":  			(...arg)=>{ return "https://ddstats.com/api/v2/game/recent?page_size=10&page_num="+arg[0]+"&player_id="+arg[1]},
   "ddstatsRecent":  	(...arg)=>{ return "https://ddstats.com/api/v2/game/recent?page_size=10&page_num="+arg[0]},
   "playergames":  		(...arg)=>{ return "https://ddstats.com/api/v2/game/recent?page_size=10&page_num="+arg[0]+"&player_id="+arg[1]},

//	devildaggers.info
   "verified":  		(...arg)=>{ return "https://devildaggers.info/api/ddlive/players/common-names"},
   "lb_stats":  		(...arg)=>{ return "https://devildaggers.info/api/ddlive/leaderboard-statistics"},
   "top10":    			(...arg)=>{ return "https://devildaggers.info/api/ddlive/leaderboard-statistics?top=10"},
   "top100":   			(...arg)=>{ return "https://devildaggers.info/api/ddlive/leaderboard-statistics?top=100"},
   "top1000":  			(...arg)=>{ return "https://devildaggers.info/api/ddlive/leaderboard-statistics?top=1000"},
   "ddinfoPlayerData":  (...arg)=>{ return "https://devildaggers.info/api/players/"+arg[0]},
   "ddinfoHistory":  	(...arg)=>{ return "https://devildaggers.info/api/players/"+arg[0]+"/history"},
   "playerByRank":  	(...arg)=>{ return "https://devildaggers.info/api/leaderboards/entry/by-rank?rank="+arg[0]},
   "ddinfoById":  		(...arg)=>{ return "https://devildaggers.info/api/leaderboards/entry/by-id?id="+arg[0]},
   "ddcl":  			(...arg)=>{ return "https://devildaggers.info/api/ddlive/custom-leaderboards/"+arg[0]},
   "customLBs":  		(...arg)=>{ return "https://devildaggers.info/api/ddlive/custom-leaderboards"},
   "leaderboard":  		(...arg)=>{ return "https://devildaggers.info/api/leaderboards?rankStart="+arg[0]},
   "byPlayerID":  		(...arg)=>{ return "https://devildaggers.info/api/leaderboards/entry/by-id?id="+arg[0]}, 
   "ddinfoByUsername":  (...arg)=>{ return "https://devildaggers.info/api/leaderboards/entry/by-username?name="+arg[0]},
   //	"":  			()=>{ return ""},

}; document.querySelector('.Subscript').remove();