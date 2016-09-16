//deviance
let responseArray = [];

let getTotalCount = (route) => {
	return mT.getCount(mT.makeBox(route), userParams);
} 

let parseRoutes = (routes) => {
	return Promise.all(routes.map(getTotalCount));
}

parseRoutes(routes).then((data) => {
	responseArray.push(data);
});