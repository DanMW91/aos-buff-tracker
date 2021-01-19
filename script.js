// UNITS DATABASE
let unitsDatabase = [];

//---ELEMENTS---

//Modal Window
const buffModal = document.querySelector(".buffModal");
const buffModalRadio = document.querySelector(".buffModalRadio");
const overlay = document.querySelector(".overlay");
//Buttons
const nextPhasebtn = document.querySelector(".btnNextPhase");
const btnAddUnit = document.querySelector(".btnAddUnit");
const btnAddBuff = document.querySelector(".btnAddBuff");
const btnSubmitBuff = document.querySelector(".btnSubmitBuff");
const btnDeleteAll = document.querySelector(".deleteAll");
const btnCloseModal = document.querySelector(".btnCloseModal");

// Radio's
const radioBuffChoice = document.querySelectorAll(".buffChoice");
const radioEndPhase = document.querySelectorAll(".endPhase");
let radioUnitChoice;
const radioCustomChoice = document.querySelector(".custom");

//Input Fields

const unitNameInput = document.querySelector(".unitNameInput");
const unitSaveInput = document.querySelector(".unitSaveInput");
const unitBraveryInput = document.querySelector(".unitBraveryInput");

const customBuffInput = document.querySelector(".customBuffChoice");

//Table
const unitStatsTable = document.querySelector(".unitStatsTable");
const tbody = document.querySelector(".tbody");

//--- Phase Bar---

const phases = [
  "hero",
  "movement",
  "shooting",
  "charge",
  "combat",
  "battleshock",
];

// ---FUNCTIONS---

const uniqueUnit = function (unitName) {
  let names = [];

  unitsDatabase.forEach((unit) => {
    names.push(unit.name);
  });

  return names.includes(unitName) ? false : true;
};

const checkFields = function (inputClass, func) {
  const inputs = document.querySelectorAll(`.${inputClass}`);
  let corrInputs = [];
  inputs.forEach((input) => {
    if (input.value === "") {
      corrInputs.push("false");
    }
  });
  corrInputs.includes("false") ? alert("All input fields required!") : func();
};

const addUnit = function () {
  const unitName = unitNameInput.value.split(" ").join("-").toLowerCase();

  if (uniqueUnit(unitName)) {
    const html = `<tr class="row">
  <td class="cell ${unitName}-name">${unitNameInput.value}</td>
  <td class="cell ${unitName}-save">${unitSaveInput.value}+</td>
  <td class="cell ${unitName}-bravery">${unitBraveryInput.value}</td>
  <td class="cell ${unitName}-buffs"></td>
    <td class="cell"</td>
  </tr>`;

    unitsDatabase.push({
      stringName: unitNameInput.value,
      name: unitName,
      save: Number(unitSaveInput.value),
      bravery: Number(unitBraveryInput.value),
      activeBuffs: [],
    });
    tbody.insertAdjacentHTML("beforeend", html);
    unitNameInput.value = "";
    unitSaveInput.value = "";
    unitBraveryInput.value = "";
  } else {
    alert("Enter unique unit!");
  }
};

const addBuff = function (name, buffChoice, endPhase, buffString) {
  buffCell = document.querySelector(`.${name}-buffs`);
  buffCell.insertAdjacentHTML(
    "afterbegin",
    `<div class="active-${name}-${buffChoice}">${buffString} ${
      buffChoice === "save" || buffChoice === "bravery" ? "+1" : ""
    }(${endPhase})</div>`
  );
};

const openModal = function () {
  buffModal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
};
const closeModal = function () {
  buffModal.classList.toggle("hidden");
  buffModalRadio.innerHTML = "";
  customBuffInput.value = "";
  overlay.classList.toggle("hidden");
};

const removeBuff = (unit, removeStat) => {
  unit.activeBuffs.forEach((buff, i) => {
    if (buff.stat === removeStat) unit.activeBuffs.splice(i, 1);
  });
  document.querySelector(`.active-${unit.name}-${removeStat}`).remove();
  checkBuffs();
};

const checkBuffs = function () {
  unitsDatabase.forEach((unit) => {
    unit.activeBuffs.forEach((buff, i) => {
      if (buff.end && buff.end === currentPhase) {
        if (buff.stat === "save" || buff.stat === "hero") {
          document.querySelector(
            `.${unit.name.split(" ")[0].toLowerCase()}-${
              unit.activeBuffs[i].stat
            }`
          ).textContent = buff.stat === "save" ? unit.save + "+" : unit.bravery;
        }
        console.log(buff.stat);
        removeBuff(unit, buff.stat);
      }
    });
  });
};

const initialise = function () {
  togglePhase();
  unitNameInput.required = true;
  unitSaveInput.required = true;
  unitBraveryInput.required = true;
};

const togglePhase = function () {
  document.querySelector(`.${currentPhase}`).classList.toggle("activephase");
};

// ---EVENTS---

btnAddUnit.addEventListener("click", function (e) {
  e.preventDefault();
  checkFields("unitInput", addUnit);
});

btnAddBuff.addEventListener("click", function () {
  openModal();
  unitsDatabase.forEach((unit) => {
    const unitClassName = unit.name.split(" ")[0].toLowerCase();

    html = `
    <div>
    <label for="${unitClassName}">${unit.stringName}</label>
    <input type="radio" name="unitChoice" class="${unitClassName} unitChoice modalRadio" value="${unitClassName}">
    </div>`;

    buffModalRadio.insertAdjacentHTML("beforeend", html);
  });
});

btnCloseModal.addEventListener("click", function () {
  closeModal();
});

overlay.addEventListener("click", function () {
  closeModal();
});

nextPhasebtn.addEventListener("click", function (e) {
  e.preventDefault();
  togglePhase();
  let nextPhase;
  phases.forEach((phase, i) => {
    if (phase === currentPhase && phase !== "battleshock") {
      nextPhase = phases[i + 1];
    } else if (currentPhase === "battleshock") nextPhase = "hero";
  });
  currentPhase = nextPhase;

  togglePhase();
  checkBuffs();
});

btnSubmitBuff.addEventListener("click", function (e) {
  e.preventDefault();
  radioUnitChoice = document.querySelectorAll(".unitChoice");
  let unitChoice;
  let buffChoice;
  let endPhase;

  radioUnitChoice.forEach((button) => {
    if (button.checked) unitChoice = button.value.split(" ").join("-");
  });
  console.log(unitChoice);
  radioBuffChoice.forEach((button) => {
    if (button.checked) buffChoice = button.value;
  });
  radioEndPhase.forEach((button) => {
    if (button.checked) endPhase = button.value;
  });
  buffString =
    buffChoice === "save" || buffChoice === "bravery"
      ? buffChoice
      : customBuffInput.value;
  buffChoice = buffChoice
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .join("");
  console.log(buffChoice);

  unitsDatabase.forEach((unit) => {
    if (unit.name === unitChoice) {
      unit.activeBuffs.push({
        stat: `${buffChoice}`,
        end: `${endPhase}`,
      });
    }
  });
  if (
    unitChoice !== undefined &&
    buffChoice !== undefined &&
    endPhase !== undefined
  ) {
    unitsDatabase.forEach((unit) => {
      if (unit.name === unitChoice && buffChoice === "save") {
        document.querySelector(`.${unitChoice}-save`).textContent = `${
          unit.save - 1
        }+`;
      } else if (unit.name === unitChoice && buffChoice === "bravery") {
        document.querySelector(`.${unitChoice}-bravery`).textContent = `${
          unit.bravery + 1
        }`;
      }
    });
    addBuff(unitChoice, buffChoice, endPhase, buffString);
    closeModal();
  } else {
    alert("All input fields required!");
  }
});

customBuffInput.addEventListener("keyup", function () {
  radioCustomChoice.value = customBuffInput.value;
  console.log(radioCustomChoice.value);
});

// Initialise

let currentPhase = phases[0];
initialise();
