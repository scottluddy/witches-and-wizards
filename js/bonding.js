// Bonding with your pet: taking care of it earns Bonding Points, which
// count toward the next Level (js/levels.js). So far: a bath in the tub at
// Home, and a cuddle on the big sofa in the Cozy Lounge (Meadows).
// The numbers are in data/bonding.js.

// Is this item a pet? Pets come from the pet shelves, or say "pet": true
// (like the Lakeside Store's beluga). An egg isn't a pet yet.
function isPet(item) {
  const bonding = GAME_DATA.bonding;
  return (item.pet || bonding.pets.indexOf(item.category) !== -1) && bonding.notPets.indexOf(item.id) === -1;
}

// Your pets in these lists of item ids, each pet once.
function petsIn(ids) {
  return ids.map(findItem).filter(function (item, i) {
    return item && ids.indexOf(item.id) === i && isPet(item);
  });
}

// Your pets that are here: carried in your backpack or left at Home.
function petsAtHome() {
  return petsIn(player.backpack.concat(player.stored.home || []));
}

// Minutes until a pet can be cared for this way again (0 = ready now).
// "kind" is "bath" or "cuddle"; "last" remembers when each pet last had one.
function minutesUntilCare(kind, pet) {
  const last = player.lastCare[kind][pet.id];
  if (!last) return 0;
  const wait = GAME_DATA.bonding[kind].everyMinutes * 60000 - (Date.now() - last);
  return wait > 0 ? Math.ceil(wait / 60000) : 0;
}

// The pop-up for one kind of care: a card for each pet, with a button when
// it's ready. "care" has the words and picture for that kind.
function openCare(kind, pets, care, message) {
  const body = openInfoPanel(care.art, care.title, message || (pets.length ? care.ask : care.noPets));
  const row = document.createElement("div");
  row.className = "item-row";
  pets.forEach(function (pet) {
    const wait = minutesUntilCare(kind, pet);
    const card = itemCard(pet, wait ? null : care.button, function () { carePet(kind, pet, care); });
    if (wait) {
      const note = document.createElement("small");
      note.textContent = care.done + wait + " min";
      card.appendChild(note);
    }
    row.appendChild(card);
  });
  body.appendChild(row);
}

function carePet(kind, pet, care) {
  const points = GAME_DATA.bonding[kind].points;
  player.bondingPoints += points;
  player.lastCare[kind][pet.id] = Date.now();
  writeSave(player);
  care.open(care.thanks.replace("PET", pet.name) + " +" + points + " Bonding Point" + (points === 1 ? "" : "s") + "!");
}

// The Bath Tub at Home: wash a pet carried or left at Home.
function openBath(message) {
  const art = document.createElement("img");
  art.src = picture("bath_tub");
  art.alt = "Bath Tub";
  openCare("bath", petsAtHome(), {
    art: art, title: "Bath Tub", button: "🛁 Give a bath", done: "✨ Clean! Dirty again in ",
    ask: "Which pet needs a bath? Taking care of your pet earns Bonding Points.",
    noPets: "You need a pet to give a bath to. Find one on the Campus Store's Pet shelf, at the Trading Post or at the Lakeside Store, then bring it Home.",
    thanks: "🛁 Splish, splash! Your PET is all clean and happy.", open: openBath
  }, message);
}

// The big sofa in the Cozy Lounge: cuddle a pet you brought along.
function openCuddle(message) {
  openCare("cuddle", petsIn(player.backpack), {
    art: "🛋️", title: "Big Sofa", button: "🛋️ Cuddle", done: "😴 Napping. Ready to cuddle again in ",
    ask: "Snuggle up on the sofa with your pet. Spending time together earns Bonding Points.",
    noPets: "Bring a pet in your backpack to cuddle with on the sofa. Pets left at Home have to stay home!",
    thanks: "🛋️ You and your PET snuggle up on the big sofa. So cozy!", open: openCuddle
  }, message);
}
