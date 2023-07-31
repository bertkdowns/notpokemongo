// this chooses a random place from the places.
// can be rigged to make low level places pop up more often etc.
// or high level places pop up later in game so people have to walk further to get to them :)
export default placeChooser = ()=>{
    num = Math.random();
    if(num < 0.03)
        return "magicGrove"
    else if(num < 0.06)
        return "ruins"
    else if(num < 0.12)
        return "lake"
    else if(num < 0.2)
        return "river"
    else if(num < 0.45)
        return "plains"
    else if(num < 0.7)
        return "hills"
    else
        return "forest";
}

