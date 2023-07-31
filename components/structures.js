const getPc = (resources,percentage) =>{
    // gets a percentage of the resource object.
    // allows easy collectProduce functions.
    // step 1: vary percentage by +- 20pc
    var result = {};
    for(var i in resources){
        // if theres a lot of items, e.g 100, and we have a x % (e.g 20%) chance of getting each of them, 
        // chances are we will get ~20% of the items. So we can simulate that rather than tossing a coin on each of them.
        if(resources[i] > 10){
            // get approximately percentage % of the items, +or - 30% of percentage
            result[i] = Math.ceil(resources[i] * (percentage + (percentage*0.6*Math.random()-percentage*0.3)))
        } else{
            result[i] = 0;
            // otherwise if we have e.g 1 or 2 items with a 20% chance of getting each, it's probably best to simulate that directly
            for(var j = 0; j < resources[i];j++){
                if(Math.random() < percentage){
                    result[i]++;
                }
            }
            if(result[i]==0)
                delete result[i] // remove it from the object.
        }
    }
    return result;
}

// this stores an object of all the  places in the world.
// general format is a modal display function display(),a image location image:. 
export default structures = {
    // NATURALLY GENERATED STUFFS!
    forest:{
        image:require("../assets/structures/forest.png"),
        tier:1,
        type:"Natural",
        displayName:"Forest",
        description:"A wooded land, filled with trees and squirrels. Be careful of bears!",
        collectProduce(){return getPc({wood:40,flax:2,clay:1,stone:1,food:1},0.25)},// returns an object of inventory items, e.g ({wood:10})
        convertTo:{outpost:{"wood":100,rope:20,food:20}},
        special:{
            doNothing:{
                displayName:"Put Flax Back",
                description:"Puts flax back into the forest. If you have too much flax, you can put it back. That's it.",
                cost:{"flax":10},
                doAction(){},//do whatever changes the special action does
            }
        },
    },
    plains:{
        image:require("../assets/structures/plains.png"),
        tier:1,
        type:"Natural",
        displayName:"Plains",
        description:"A ...plain... land, but a land ready to be built upon to greatness. ",
        collectProduce(){return getPc({wood:2,flax:10,clay:3,stone:1,food:10,leather:3,livestock:1},0.25)},// returns an object of inventory items, e.g ({wood:10})
        convertTo:{farmstead:{"wood":100,food:20,rope:10,livestock:4,water:10}},
        special:{},
    },
    hills:{
        image:require("../assets/structures/hills.png"),
        tier:1,
        type:"Natural",
        displayName:"Hills",
        description:"A hilly yet versatile expanse",
        collectProduce(){return getPc({wood:2,flax:10,clay:3,stone:1,food:10,leather:3,livestock:1},0.25)},// returns an object of inventory items, e.g ({wood:10})
        convertTo:{farmstead:{"wood":100,food:20,rope:10,livestock:4,water:10}},
        special:{},
    },
    river:{
        image:require("../assets/structures/river.png"),
        tier:1,
        type:"Natural",
        displayName:"River",
        description:"It's a river. You might catch some fish in it, you might use it to power your water mill. Don't get swept away!",
        collectProduce(){return getPc({wood:1,flax:6,clay:6,food:6,sand:6,water:6},0.4)},// returns an object of inventory items, e.g ({wood:10})
        convertTo:{riverOutpost:{"wood":100,rope:10,food:10}},
        special:{},
    },
    lake:{
        image:require("../assets/structures/lake.png"),
        tier:1,
        type:"Natural",
        displayName:"Lake",
        description:"It's got a lot of water in it. What should we use it for?",
        collectProduce(){return getPc({wood:1,flax:5,clay:6,food:4,water:10,sand:4},0.4)},// returns an object of inventory items, e.g ({wood:10})
        convertTo:{fishermanHut:{"wood":100,rope:10,food:10}},
        special:{},
    },
    magicGrove:{
        image:require("../assets/structures/magicgrove.png"),
        tier:1,
        type:"Magical",
        displayName:"Magic Grove",
        description:"Ancient magic powers this place. Perhaps, with study and time, you could learn it's secrets...",
        collectProduce(){return getPc({flax:10,clay:1,food:10},0.4)},// returns an object of inventory items, e.g ({wood:10})
        convertTo:{magicGrove:{"wood":100}},
        special:{},
    },
    ruins:{
        image:require("../assets/structures/ruins.png"),
        tier:1,
        type:"Natural",
        displayName:"Ruins",
        description:"Someone must have lived here, long ago. I wonder what happened to them...",
        collectProduce(){return getPc({stone:10,flax:5,clay:5,copperOre:2},0.4)},
        convertTo:{forest:{"wood":100}},
        special:{},
    },
    // TIER 2 STUFFS
    farmstead:{
        image:require("../assets/structures/farmstead.png"),
        tier:2,
        type:"Agricultural",
        displayName:"Farmstead",
        description:"Get some settlers to work the land, and a lot more can come of it!",
        collectProduce(){return getPc({wood:4,stone:2,food:25,livestock:6},0.25)},
        convertTo:{forest:{"wood":100}},
        special:{},
    },
    fishermanHut:{
        image:require("../assets/structures/fishermanHut.png"),
        tier:1,
        type:"Agricultural",
        displayName:"Fisherman's hut",
        description:"Catch us some fishes!",
        collectProduce(){return getPc({wood:1,flax:5,clay:8,food:10,water:10,sand:5},0.4)},
        convertTo:{forest:{"wood":100}},
        special:{},
    },
    outpost:{
        image:require("../assets/structures/outpost.png"),
        tier:1,
        type:"Forestry",
        displayName:"Outpost",
        description:"Get some people working on cutting and planting trees, and you can get a lot more wood!",
        collectProduce(){return getPc({wood:70,flax:3,clay:1,stone:2,food:1},0.4)},
        convertTo:{forest:{"wood":10}},
        special:{},
    },
    riverOutpost:{
        image:require("../assets/structures/riveroutpost.png"),
        tier:1,
        type:"Natural",
        displayName:"River Outpost",
        description:"Never know what you're gonna find in that river...",
        collectProduce(){return getPc({wood:1,flax:6,clay:6,food:6,sand:6,water:6,goldNugget:1},0.4)},
        convertTo:{forest:{"wood":10}},
        special:{},
    },
}