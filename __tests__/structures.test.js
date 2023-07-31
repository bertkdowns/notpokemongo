import items from '../components/items'
import structures from '../components/structures'

test('All structures have required props - image,tier,type,displayName,description,collectProduce,convertTo,special',()=>{
    for(var i in structures){
        expect(structures[i].image).toBeDefined();
        expect(structures[i].tier).toBeDefined();
        expect(typeof structures[i].tier).toBe("number");
        expect(structures[i].displayName).toBeDefined();
        expect(structures[i].description).toBeDefined();
        expect(structures[i].collectProduce).toBeDefined();
        expect(typeof structures[i].collectProduce).toBe("function");
        expect(structures[i].convertTo).toBeDefined();
        expect(typeof structures[i].convertTo).toBe("object");
        expect(structures[i].special).toBeDefined();
        expect(typeof structures[i].special).toBe("object");

    }
})
expect.extend({
    toBeValidItem(received) {
      const pass = items[received] != undefined;
      if (pass) {
        return {
          message: () =>
            `expected ${received} not to be a valid item`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `expected ${received} to be a valid item`,
          pass: false,
        };
      }
    },
    toBeValidStructure(received) {
        const pass = structures[received] != undefined;
        if (pass) {
          return {
            message: () =>
              `expected ${received} not to be a valid item`,
            pass: true,
          };
        } else {
          return {
            message: () =>
              `expected ${received} to be a valid item`,
            pass: false,
          };
        }
      },
});

test('test that convertTo values are valid',()=>{
    for(var i in structures){
        for(var j in structures[i].convertTo){
            expect(j).toBeValidStructure();//you have to be able to convert it to an actual thing
            expect(typeof structures[i].convertTo[j]).toBe("object");
            for(var k in structures[i].convertTo[j]){
                // check that a valid list of upgrade item requirements is given
                expect(k).toBeValidItem();
                expect(typeof structures[i].convertTo[j][k]).toBe("number")
            }
        }
    }
})
test('test that any special actions are valid',()=>{
    for(var i in structures){
        for(var j in structures[i].special){
            expect(typeof structures[i].special[j]).toBe("object");
            expect(typeof structures[i].special[j].displayName).toBeDefined();
            expect(typeof structures[i].special[j].description).toBeDefined();
            expect(typeof structures[i].special[j].doAction).toBe("function");
            for(var k in structures[i].special[j].cost){
                // check that a valid cost requirement is given
                expect(k).toBeValidItem();
                expect(typeof structures[i].special[j].cost[k]).toBe("number")
            }
        }
    }
})


test('test that collectProduce gives valid produce (most of the time, rng is involved in this)',()=>{
    for(var i in structures){
        for(var j = 0; j < 10;j++){
            let produce = structures[i].collectProduce()
            expect(typeof produce).toBe("object");
            for(var k in produce){
                // check that a valid list of upgrade item requirements is given
                expect(k).toBeValidItem();
                expect(typeof produce[k]).toBe("number")
            }
        }
    }
})
