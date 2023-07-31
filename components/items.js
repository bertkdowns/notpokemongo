
export default items = {
    wood:{
        name:"Wood",
        crafting:"An important resource for pretty much anything. Collected from Forests, Plains, etc",
        image:require("../assets/items/wood.png"),
    },
    food:{
        name:"Food",
        image:require("../assets/items/food.png"),
        crafting:"Required to fuel your nation. Collected or created at many locations across the world"
    },
    brick:{
        name:"Bricks",
        image:require("../assets/items/brick.png"),
        crafting:{
            required:{clay:5,wood:3},
            buildingType:"Industrial",
            minTier:2,
            produces:20,
            message:"A versatile basic building material. Made from clay, hardened over a wood fire."
        }
    },
    clay:{
        name:"Clay",
        image:require("../assets/items/clay.png"),
        crafting:"Found in many natural locations and various mines. Primarily used to make bricks."
    },
    copperOre:{
        name:"Copper Ore",
        image:require("../assets/items/copperore.png"),
        crafting:"Found in mines. Used to make Copper"
    },
    copper:{
        name:"Copper",
        image:require("../assets/items/copper.png"),
        crafting:{
            required:{copperOre:2,wood:1},
            buildingType:"Industrial",
            minTier:3,
            produces:1,
            message:"The easiest metal to work with and find. Used for construction of many different things"
        }
    },
    flax:{
        name:"Flax",
        image:require("../assets/items/flax.png"),
        crafting:"Abundant in the natural world. Good for ropes, but not much else..."
    },
    rope:{
        name:"Rope",
        image:require("../assets/items/rope.png"),
        crafting:{
            required:{flax:3},
            buildingType:"any",
            minTier:0,
            produces:1,
            message:"Ropes are kinda helpful sometimes. A wise man once said, 'Always carry a rope.'"
        }
    },
    leather:{
        name:"Leather",
        image:require("../assets/items/leather.png"),
        crafting:"Occasionally found naturally from dead animals, but also made from slaughtering Livestock at a farm."
    },
    livestock:{
        name:"Livestock",
        image:require("../assets/items/livestock.png"),
        crafting:"Can be found in the wild, or bred at farms."
    },
    stone:{
        name:"Stone",
        image:require("../assets/items/stone.png"),
        crafting:"You can mine this at quarries, or just try find it lying here and there."
    },
    sand:{
        name:"Sand",
        image:require("../assets/items/sand.png"),
        crafting:"There's plenty of it in deserts, and some in quarries. Good for making glass?"
    },
    water:{
        name:"Water",
        image:require("../assets/items/water.png"),
        crafting:"Kinda handy for building some stuff, and irrigation. Found naturally."
    },
    goldNugget:{
        name:"Gold Nugget",
        image:require("../assets/items/goldnugget.png"),
        crafting:"Sometimes found in rivers"
    },
    goldOre:{
        name:"Gold Ore",
        image:require("../assets/items/goldore.png"),
        crafting:"Found in mines. Can be smelted to make gold"
    },
    gold:{
        name:"Gold",
        image:require("../assets/items/gold.png"),
        crafting:{
            required:{goldNugget:20},
            buildingType:"Industrial",
            minTier:4,
            produces:1,
            message:"A precious metal... "
        }
    },
    ironOre:{
        name:"Iron Ore",
        image:require("../assets/items/ironore.png"),
        crafting:"Found in mines. Used to make Iron"
    },
    iron:{
        name:"Iron",
        image:require("../assets/items/iron.png"),
        crafting:{
            required:{ironOre:2,wood:1},
            buildingType:"Industrial",
            minTier:4,
            produces:1,
            message:"A common metal. Can be made into steel, and used for many other things."
        }
    },
}