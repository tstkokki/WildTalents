const locations = ["Head", 
"Left Leg",
"Right Leg",
"Left Arm", "Left Arm",
"Right Arm", "Right Arm",
"Torso", "Torso", "Torso"];


function FormDamageResult(formData) {
    
    console.log(formData);
  
  
    let { shock, killing, width, height } = ExtractWidthAndShockAndKilling();
  
    let shockDmg = width;
    let killingDmg = width;
    let deadly;
    let extras = {Extras: "Any"};

    const person = {
        HitLocations: [
            {Dmg: {Shock: 0, Killing:0}, Name: "Head", Locations: [0]}, //0
            {Dmg: {Shock: 0, Killing:0}, Name: "Torso", Locations: [7,8,9]}, //1
            {Dmg: {Shock: 0, Killing:0}, Name: "Right Arm", Locations: [5,6]}, //2
            {Dmg: {Shock: 0, Killing:0}, Name: "Left Arm", Locations: [3,4]}, //3
            {Dmg: {Shock: 0, Killing:0}, Name: "Right Leg", Locations: [2]}, // 4
            {Dmg: {Shock: 0, Killing:0}, Name: "Left Leg", Locations: [1]} //5
        ],
        ApplyDamage: function(location, type, amount){
            this.HitLocations.forEach(h => {
                if(h.Locations.includes(location)){
                    h.Dmg[type] += amount;
                }
            })
        },
        ApplyDamageByName: function(location, type, amount){
            this.HitLocations.forEach(h => {
                if(h.Name == location){
                    h.Dmg[type] += amount;
                }
            })
        },
        ApplyShockByName: function(location, amount){
            this.ApplyDamageByName(location, "Shock", amount)
        },
        ApplyKillingByName: function(location, amount){
            this.ApplyDamageByName(location, "Killing", amount)
        },
        ApplyShockAndKillingByName(location, amount){
            this.ApplyShockByName(location,amount);
            this.ApplyKillingByName(location, amount);
        },
        Reset: function(){
            this.HitLocations.forEach(h => {
                h.Dmg.Killing = 0;
                h.Dmg.Shock = 0;
            })
        },
        GetDamageReport: function(){
            let report = "";
            this.HitLocations.forEach(h => {
                if(h.Dmg.Shock > 0) report += `${h.Dmg.Shock} points of Shocking to the ${h.Name}<br>`;
                if(h.Dmg.Killing > 0) report += `${h.Dmg.Killing} points of Killing to the ${h.Name}<br>`;
            })
            return report;
        }
    };

    formData.forEach(element => {
        if(element.value != 0){

            switch(element.name){
                case "Area":
                    //-if Area: target and everyone within radius takes 2 Shock to every location. 
                    //Each char in the area rolls dice = Area rating. Each die = 1K to rolled location
                    person.HitLocations.forEach(loc => {
                        person.ApplyShockByName(loc.Name, 2)
                    })
                    break;
                case "Burn":
                    person.HitLocations.forEach(loc => {
                        if(loc.Name != "Head")
                        person.ApplyShockByName(loc.Name, 1)
                    })
                    //if Burn: every hit location except head takes 1 point of Shocking
                    break;
                case "Daze":
                    break;
                case "Electrocuting":
                    let limb = Math.floor(Math.random()*2)+1;
                    if(locations[height] == "Head"){
                        if(shock != -1){
                            person.ApplyShockByName("Torso", shockDmg)
                            person.ApplyDamage(limb, "Shock", shockDmg)
                        }
                        if(killing != -1){
                            person.ApplyKillingByName("Torso", killingDmg)
                            person.ApplyDamage(limb, "Killing", shockDmg)
                        }
                    }
                    
                    // if Electrocuting: If the attack damages the target—it must inflict at least one point of
                    // damage past the target’s defenses—that same damage instantly “travels” to adjacent hit
                    // locations as it goes to ground, without requiring you to make any more rolls.
                    break;
                    
            }
        }
    });
    
    $(".roll-table").append(`<tr> <td>${person.GetDamageReport()}`);
  
  
    
    function ExtractWidthAndShockAndKilling() {
          let roll = $("#dmgInput").val().toUpperCase();
          let indexOfWidth = roll.indexOf("W");
          let width = parseInt(roll.substr(0, indexOfWidth));
          let shock = IndexOfChar(roll, "S") != -1 ? "Shock" : -1;
          let killing = IndexOfChar(roll, "K") != -1 ? "Killing": -1;
          let height = parseInt(roll.substr(roll.indexOf("H")-1,1));
          return { shock, killing, width, height };
    };

  
    function GetDamageLocation(height){
        
        let location = locations[height]
        return location;
    }
    function IndexOfChar(input, char) {
      return input.indexOf(char);
    }
  }
/*
on submit
check width
-if Area: target and everyone within radius takes 2 Shock to every location. 
Each char in the area rolls dice = Area rating. Each die = 1K to rolled location
-if Burn: every hit location except head takes 1 point of Shocking
-if Daze: Suffer width in penalty dice on all dice pools.
-if Deadly +1: Shock => Killing. Killing => Shock and Killing.
-if Deadly +2: Shock => Shock and Killing.
-if Electrocuting: If the attack damages the target—it must inflict at least one point of
damage past the target’s defenses—that same damage instantly “travels” to adjacent hit
locations as it goes to ground, without requiring you to make any more rolls.
-if Engulf: applies to every hit location
-if Go First: amount of Go First to width regarding initiative
-if Penetration: reduce the target's armor rating in width
*/