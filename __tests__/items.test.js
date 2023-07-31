import items from '../components/items'
//import structures from '../components/structures'


test('All items have required props - name, image, crafting',()=>{
    for(var i in items){
        expect(items[i].crafting).toBeDefined();
        expect(items[i].name).toBeDefined();
        expect(typeof items[i].name).toBe('string')
        expect(items[i].image).toBeDefined();
    }
})
test('All items have valid crafting recipies',()=>{
    for(var i in items){
        if(typeof items[i].crafting != 'string'){
            expect(items[i].crafting.buildingType).toBeDefined();
            expect(typeof items[i].crafting.buildingType).toBe('string');// note: not checking if that is an actual building type you can visit!
            if(items[i].crafting.buildingType != 'any')
                expect(items[i].crafting.minTier).toBeDefined();
            expect(items[i].crafting.produces).toBeGreaterThan(0)
            expect(items[i].crafting.required).toBeDefined();
            for(var j in items[i].crafting.required){
                expect(items[j]).toBeDefined();
                expect(typeof items[i].crafting.required[j]).toBe('number')
            }

        }
    }
})
