const locations = ["Head", 
"Left Leg",
"Right Leg",
"Left Arm", "Left Arm",
"Right Arm", "Right Arm",
"Torso", "Torso", "Torso"];

const Roll = {
    Width: 0,
    ShockWidth: 0,
    KillingWidth: 0,
    Height: 0
}

const Styles = {
    WrapInShock: function(input){
        return `<span class="text-warning fw-bold">${input}</span>`
    },
    WrapInKilling: function(input){
        return `<span class="text-danger fw-bold">${input}</span>`
    },
    WrapInLocation: function(input){
        return `<span class="text-primary fw-bold">${input}</span>`
    },
    WrapInSuccess: function(input){
        return `<span class="text-success fw-bold">${input}</span>`
    }
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
        let report = `${Roll.Width}w ${Roll.ShockWidth > 0?"S":""}${Roll.KillingWidth>0?"K":""} ${Roll.Height}h<br>`;
        this.HitLocations.forEach(h => {
            if(h.Dmg.Shock > 0) report += `${Styles.WrapInShock(h.Dmg.Shock)}</span> points of ${Styles.WrapInShock("Shocking")} to the ${Styles.WrapInLocation(h.Name)}<br>`;
            if(h.Dmg.Killing > 0) report += `${Styles.WrapInKilling(h.Dmg.Killing)} points of ${Styles.WrapInKilling("Killing")} to the ${Styles.WrapInLocation(h.Name)}<br>`;
        })
        if(Extras.Area > 0){
            report += `Roll ${Extras.Area} ${Extras.Area > 1 ? "dice, each result" : "die, the result"} location taking ${Styles.WrapInKilling("1")} point of ${Styles.WrapInKilling("Killing")}`
        }
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
        if(this.Deadly == 1){
            let bonus = Roll.ShockWidth;
            Roll.ShockWidth = 0 + Roll.KillingWidth;
            Roll.KillingWidth += bonus;
        } 
        if(this.Deadly == 2){
            let bonus = Roll.ShockWidth;
            Roll.ShockWidth += Roll.KillingWidth;
            Roll.KillingWidth += bonus;
        }
        //if Deadly +1: Shock => Killing. Killing => Shock and Killing.
        //if Deadly +2: Shock => Shock and Killing.
    },
    InvokeArea: function(){
        if(this.Area > 0){
            person.HitLocations.forEach(loc => {
                person.ApplyShockByName(loc.Name, 2)
            });
        }
        //-if Area: target and everyone within radius takes 2 Shock to every location. 
        //Each char in the area rolls dice = Area rating. Each die = 1K to rolled location
    },
    InvokeBurn: function(){
        if(this.Burn > 0){
            person.HitLocations.forEach(loc => {
                if(loc.Name != "Head")
                person.ApplyShockByName(loc.Name, 1)
            });
        }
        //if Burn: every hit location except head takes 1 point of Shocking
    },
    InvokeElectrocuting: function(){
        if(this.Electrocuting > 0){

            let limb = Math.floor(Math.random()*2)+1;
            if(locations[Roll.Height] == "Head" || locations[Roll.Height] == "Right Arm" || locations[Roll.Height] == "Left Arm"){
                if(Roll.ShockWidth > 0){
                    person.ApplyShockByName("Torso", Roll.ShockWidth)
                    person.ApplyDamage(limb, "Shock", Roll.ShockWidth)
                }
                if(Roll.KillingWidth > 0){
                    person.ApplyKillingByName("Torso", Roll.KillingWidth)
                    person.ApplyDamage(limb, "Killing", Roll.KillingWidth)
                }
            }
            if(locations[Roll.Height] == "Torso"){
                if(Roll.ShockWidth > 0){
                    person.ApplyDamage(limb, "Shock", Roll.ShockWidth)
                }
                if(Roll.KillingWidth > 0){
                    person.ApplyDamage(limb, "Killing", Roll.ShockWidth)
                }
            }
        }
        // if Electrocuting: If the attack damages the target—it must inflict at least one point of
        // damage past the target’s defenses—that same damage instantly “travels” to adjacent hit
        // locations as it goes to ground, without requiring you to make any more rolls.
    },
    InvokeEngulf: function(){
        if(this.Engulf > 0){

            person.HitLocations.forEach(loc => {
                if(Roll.ShockWidth > 0){
                    person.ApplyShockByName(loc.Name, Roll.ShockWidth)
                }
                if(Roll.KillingWidth > 0){
                    person.ApplyKillingByName(loc.Name, Roll.KillingWidth)
                }
            });
        }
        //if Engulf: applies to every hit location
    },
    InvokePenetration: function(){
        
        //if Penetration: reduce the target's armor rating in width
    },
    Reset: function(){
        this.Attacks= 0;
        this.Penetration= 0;
        this.Area= 0;
        this.Deadly= 0;
        this.Engulf= 0;
        this.Burn= 0;
        this.Electrocuting= 0;
    }
}