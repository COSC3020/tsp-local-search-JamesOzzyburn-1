/* Sources:
https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array //easy way to randomize an array
*/

function tsp_ls(distance_matrix) {
    var numberOfCities = distance_matrix.length; //Make number of cities

    if (numberOfCities == 0 || numberOfCities == 1) { //Return 0 if there are no cities or only one city
        return 0; 
    }

    //Make our random route
    var currentRoute = []; //Make our array
    for (var i = 0; i < numberOfCities; i++) { //Add all of the cities to our new array
        currentRoute.push(i);
    }
    //console.log(currentRoute);
    for (var i = 0; i < numberOfCities; i++) { //Randomize it 
        var j = Math.floor(Math.random() * i);
        [currentRoute[i], currentRoute[j]] = [currentRoute[j], currentRoute[i]]; //This actually does the swapping
    }
    //console.log(currentRoute);

    var incumbent = currentRoute; //Make our incumbant
    var incumbentLength = 0; //Make our incumbant length
    for (var i = 0; i < currentRoute.length - 1; i++) { //Calculate the length of our current route
        incumbentLength += distance_matrix[currentRoute[i]][currentRoute[i + 1]];
    }
    incumbentLength += distance_matrix[currentRoute[currentRoute.length - 1]][currentRoute[0]]; //We also have to add the length from the last to the start

    var iteration = 0 //Number of overall iterations to try
    var moreImprovement = 0; //Number of iterations after it doesnt improve to keep trying counter
    var maxIteration = calcFact(numberOfCities);
    //console.log(maxIteration);
    while (iteration < maxIteration) { //Run n! times.
        var improved = false; //This is to help stop

        //Make i and k random then run until they are not the same anymore
        var i = Math.floor(Math.random() * numberOfCities - 1);
        var k = Math.floor(Math.random() * numberOfCities - 1);
        while(k == i) {
            i = Math.floor(Math.random() * numberOfCities - 1);
            k = Math.floor(Math.random() * numberOfCities - 1);
        }

        var newRoute = twoOptSwap(currentRoute, i, k); //Get our new route using twoOptSwap
        var newRouteLength = 0; //Get the length of our new route

        for (var i = 0; i < newRoute.length - 1; i++) { //Calculate the length of our new route
            newRouteLength += distance_matrix[newRoute[i]][newRoute[i + 1]];
        }
        newRouteLength += distance_matrix[newRoute[newRoute.length - 1]][newRoute[0]]; //We also have to add the length from the last to the start

        // If the new route is shorter, update incumbent
        if (newRouteLength < incumbentLength) { //If the new route is shorter we update our incumbant and its length and reset our stopping criteria
            incumbent = newRoute; //Update incumbant
            incumbentLength = newRouteLength; //Update incumbant length
            currentRoute = newRoute; //Update this so we run our new route
            improved = true; //It has improved
            moreImprovement = 0; //Reset our more improvement counter
        }

        //Here is my stopping criteria.
        if (!improved) { 
            moreImprovement++; 
            if(moreImprovement > 101) { //If it hasnt improved, run 100 more times and if it still hasnt improved after that then exit. There really isnt no logic behind 100 I just feel like thats enough chances.
                break;
            }
        }
    }
    return incumbentLength; //Return the length
}

//This just the pseudo code but in js
function twoOptSwap(route, i, k) { 
    var newRoute = route.slice(0, i);
    newRoute.push(...route.slice(i, k + 1).reverse()); 
    newRoute.push(...route.slice(k + 1));
    return newRoute;
}

//Calculate factorial
function calcFact(n) {
    if (n <= 1) {
        return 1;
    }
    else {
        return n * calcFact(n - 1);
    }
}
