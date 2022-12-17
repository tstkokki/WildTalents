

function FormDamageResult(formData) {
    
    let { shock, killing, width, height } = ExtractWidthAndShockAndKilling();
  
    formData.forEach(element => {
        switch(element.name){
            case "LAR":
                person.Armor.LAR = parseInt(element.value);
                break;
            case "HAR":
                person.Armor.HAR = parseInt(element.value);
                break;
            case "Attacks":
                Extras.Attacks = parseInt(element.value);
                break;
            case "Penetration":
                Extras.Penetration = parseInt(element.value);
                break;
            case "Deadly":
                Extras.Deadly = parseInt(element.value);
                break;
            case "Area":
                Extras.Area = parseInt(element.value);
                break;
            case "Burn":
                Extras.Burn = parseInt(element.value);
                break;
            case "Electrocuting":
                Extras.Electrocuting = parseInt(element.value);
                break;
            case "Engulf":
                Extras.Engulf = parseInt(element.value);
                break;
            default:
                break;
        }
    });

    Roll.Width = width - Math.max(person.Armor.HAR - Extras.Penetration, 0);
    Roll.ShockWidth = shock != -1 ? Roll.Width : 0;
    Roll.KillingWidth = killing != -1 ? Roll.Width : 0;
    Roll.Height = height;
    if(Roll.Width < 2){
        DisplayResult(`Less than 2 width, ${Styles.WrapInSuccess("0 dmg")}`);
        person.Reset();
        return;
    }

    person.ApplyDamage(Roll.Height, "Shock", Roll.ShockWidth+Extras.Attacks);
    person.ApplyDamage(Roll.Height, "Killing", Roll.KillingWidth+Extras.Attacks);

    Extras.InvokeBurn();
    Extras.InvokeElectrocuting();
    Extras.InvokeEngulf();
    Extras.InvokeArea();
    Extras.InvokeDeadly();

    person.ReduceDamage(person.Armor.LAR);

    DisplayResult(person.GetDamageReport())
    person.Reset();
    Extras.Reset();
    
    function DisplayResult(content){
        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        $(".roll-table").prepend(`<tr> <td>${content}</td><td>${time}</td>`);
    }
    
    function ExtractWidthAndShockAndKilling() {
          let roll = $("#dmgInput").val().toUpperCase();
          let indexOfWidth = roll.indexOf("W");
          let width = parseInt(roll.substr(0, indexOfWidth));
          let shock = parseInt(IndexOfChar(roll, "S") != -1 ? "Shock" : -1);
          let killing = parseInt(IndexOfChar(roll, "K") != -1 ? "Killing": -1);
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