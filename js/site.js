$().ready(() => {

    $("#dmgForm div.form-group").empty()
    .append(GenerateSlider("LAR", "LAR"))
    .append(GenerateSlider("HAR", "HAR"))
    .append(GenerateSlider("Attacks", "Attacks"))
        .append(GeneratioRadio("Deadly", [{label:"Deadly +1", id:"DeadlyOne"}, {label:"Deadly +2", id:"DeadlyTwo"}]))
        .append(GenerateSlider("Penetration", "Penetration"))
        .append(GenerateSlider("Area", "Area"))
        .append(GenerateSlider("Burn", "Burn"))
        //.append(GenerateSlider("Daze", "Daze"))
        .append(GenerateSlider("Electrocuting", "Electrocuting"))
        .append(GenerateSlider("Engulf", "Engulf"))
        //.append(GenerateSlider("Go First", "GoFirst"));

    $("form#diceRollerForm").on("submit", (e) => {
        e.preventDefault();
        let roll = $("#diceInput").val();
        let indexOfDie = roll.indexOf("d");
        let numberOfDice = parseInt(roll.substr(0, indexOfDie));
        let sizeOfDice = parseInt(roll.substr(indexOfDie+1));
        let rolls = [];
        for(let i = 0; i < numberOfDice; i++){
          let r = Math.floor(Math.random()*sizeOfDice)+1;
          r = r == sizeOfDice 
          ? ` ${Styles.WrapInSuccess(r)}`
          :r == 1 
          ? ` ${Styles.WrapInKilling(r)}`
          :` ${r}`;
          rolls.push(r);
        }
        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let content = `Rolling ${numberOfDice}d${sizeOfDice}...<br>Result: ${rolls.toString()}`
        $(".roll-table").prepend(`<tr> <td>${content}</td><td>${time}</td>`);
        /*
        // Returns a random integer from 1 to 10:
            Math.floor(Math.random() * 10) + 1;*/
        console.log(`rolling ${numberOfDice} dice of size ${sizeOfDice}`);
    });
    $("form#dmgForm").on("submit", (e) => {
        e.preventDefault();
        let formData = $("form#dmgForm").serializeArray();
        
        FormDamageResult(formData);

    })

    $(document).on("change", "input[type='range']", (e)=>{
      $(e.target).siblings("span[data-currentvalue]").html("+"+$(e.target).val())
    })
});

function GenerateSlider(label, id){
    return `<div class="mb-3 form-check form-check-inline align-middle text-light">
    <label class="form-check-label" for="${id}">${label}</label>
    <span data-currentvalue="${id}">0</span><br>
    <input type="range" min="0" max="10" value="0" name="${id}" class="btn btn-outline-light w-sm p-0">
</div>`
}

function GeneratioRadio(name, labelsAndIds){

    let radios = `<div class="form-group mb-3"><legend class="text-light">${name}</legend><div class="form-check form-check-inline text-light">
    <input class="form-check-input" type="radio" name="${name}" value="0" id="${name}None" checked>
    <label class="form-check-label" for="${name}None">
      None
    </label>
  </div>`

    for(let e in labelsAndIds){
       radios += `<div class="form-check form-check-inline text-light">
        <input class="form-check-input" type="radio" value="${parseInt(e)+1}" name="${name}" id="${labelsAndIds[e].id}">
        <label class="form-check-label" for="${labelsAndIds[e].id}">
          ${labelsAndIds[e].label}
        </label>
      </div>`;
    }

    return radios
}
