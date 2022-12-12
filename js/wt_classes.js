const locations = ["Head", 
"Left Leg",
"Right Leg",
"Left Arm", "Left Arm",
"Right Arm", "Right Arm",
"Torso", "Torso", "Torso"];

const Roll = {
    Width: 0,
    ShockWidth: 0,
    KillingWidth: 0
}

const person = {
    HitLocations: [
        {Dmg: {Shock: 0, Killing:0}, Name: "Head", Locations: [0]}, //0
        {Dmg: {Shock: 0, Killing:0}, Name: "Torso", Locations: [7,8,9]}, //1
        {Dmg: {Shock: 0, Killing:0}, Name: "Right Arm", Locations: [5,6]}, //2
        {Dmg: {Shock: 0, Killing:0}, Name: "Left Arm", Locations: [3,4]}, //3
        {Dmg: {Shock: 0, Killing:0}, Name: "Right Leg", Locations: [2]}, // 4
        {Dmg: {Shock: 0, Killing:0}, Name: "Left Leg", Locations: [1]} //5
    ],
    Armor: {
        LAR: 0, HAR:0
    },
    ReduceDamage: function(lar){
        if(lar > 0){

            this.HitLocations.forEach(h => {
                h.Dmg.Shock = h.Dmg.Shock > 0 ? 1 : 0;
                if(h.Dmg.Killing > 0){
                    let remainder = Math.max(h.Dmg.Killing - lar, 0);
                    let reduction = h.Dmg.Killing - remainder;
                    h.Dmg.Killing = remainder;
                    h.Dmg.Shock += reduction;
                }
            });
        }
    },
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

const Extras = {
    Attacks: 0,
    Penetration: 0,
    Area: 0,
    Deadly: 0,
    Engulf: 0,
    Burn: 0,
    Electrocuting: 0,
    InvokeDeadly: function(){
        if(Deadly == 1){
            let bonus = Roll.ShockWidth;
            Roll.ShockWidth = 0 + Roll.KillingWidth;
            Roll.KillingWidth += bonus;
        } 
        if(Deadly == 2){
            let bonus = Roll.ShockWidth;
            Roll.ShockWidth += Roll.KillingWidth;
            Roll.KillingWidth += bonus;
        }
        //if Deadly +1: Shock => Killing. Killing => Shock and Killing.
        //if Deadly +2: Shock => Shock and Killing.
    },
    InvokeArea: function(){
        person.HitLocations.forEach(loc => {
            person.ApplyShockByName(loc.Name, 2)
        });
        //-if Area: target and everyone within radius takes 2 Shock to every location. 
        //Each char in the area rolls dice = Area rating. Each die = 1K to rolled location
    },
    InvokeBurn: function(){
        person.HitLocations.forEach(loc => {
            if(loc.Name != "Head")
            person.ApplyShockByName(loc.Name, 1)
        });
        //if Burn: every hit location except head takes 1 point of Shocking
    },
    InvokeElectrocuting: function(){
        let limb = Math.floor(Math.random()*2)+1;
        if(locations[height] == "Head" || locations[height] == "Right Arm" || locations[height] == "Left Arm"){
            if(shock != -1){
                person.ApplyShockByName("Torso", shockDmg)
                person.ApplyDamage(limb, "Shock", shockDmg)
            }
            if(killing != -1){
                person.ApplyKillingByName("Torso", killingDmg)
                person.ApplyDamage(limb, "Killing", shockDmg)
            }
        }
        if(locations[height] == "Torso"){
            if(shock != -1){
                person.ApplyDamage(limb, "Shock", shockDmg)
            }
            if(killing != -1){
                person.ApplyDamage(limb, "Killing", shockDmg)
            }
        }
        // if Electrocuting: If the attack damages the target—it must inflict at least one point of
        // damage past the target’s defenses—that same damage instantly “travels” to adjacent hit
        // locations as it goes to ground, without requiring you to make any more rolls.
    },
    InvokeEngulf: function(){
        person.HitLocations.forEach(loc => {
            if(shock != -1){
                person.ApplyShockByName(loc.Name, shockDmg)
            }
            if(killing != -1){
                person.ApplyKillingByName(loc.Name, killingDmg)
            }
        })
        //if Engulf: applies to every hit location
    },
    InvokePenetration: function(){
        
        //if Penetration: reduce the target's armor rating in width
    }
}