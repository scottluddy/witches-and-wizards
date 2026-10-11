// Bonding with your pet: taking care of it earns Bonding Points, which
// count toward the next Level (js/levels.js). For now: a bath in the tub at
// Home. The numbers are in data/bonding.js.

// Your pets that are here: carried in your backpack or left at Home.
function petsAtHome() {
  const bonding = GAME_DATA.bonding;
  const ids = player.backpack.concat(player.stored.home || []);
  return ids.map(findItem).filter(function (item, i) {
    return item && ids.indexOf(item.id) === i &&                  // each pet once
      bonding.pets.indexOf(item.category) !== -1 && bonding.notPets.indexOf(item.id) === -1;
  });
}

// Minutes until a pet is dirty enough for another bath (0 = ready now).
function minutesUntilBath(pet) {
  const last = player.lastBath[pet.id];
  if (!last) return 0;
  const wait = GAME_DATA.bonding.bath.everyMinutes * 60000 - (Date.now() - last);
  return wait > 0 ? Math.ceil(wait / 60000) : 0;
}

function openBath(message) {
  const art = document.createElement("img");
  art.src = picture("bath_tub");
  art.alt = "Bath Tub";
  const pets = petsAtHome();
  const body = openInfoPanel(art, "Bath Tub", message || (pets.length
    ? "Which pet needs a bath? Taking care of your pet earns Bonding Points."
    : "You need a pet to give a bath to. Find one on the Campus Store's Pet shelf or at the Trading Post, then bring it Home."));
  const row = document.createElement("div");
  row.className = "item-row";
  pets.forEach(function (pet) {
    const wait = minutesUntilBath(pet);
    const card = itemCard(pet, wait ? null : "🛁 Give a bath", function () { bathPet(pet); });
    if (wait) {
      const note = document.createElement("small");
      note.textContent = "✨ Clean! Dirty again in " + wait + " min";
      card.appendChild(note);
    }
    row.appendChild(card);
  });
  body.appendChild(row);
}

function bathPet(pet) {
  const points = GAME_DATA.bonding.bath.points;
  player.bondingPoints += points;
  player.lastBath[pet.id] = Date.now();
  writeSave(player);
  openBath("🛁 Splish, splash! Your " + pet.name + " is all clean and happy. +" + points +
    " Bonding Point" + (points === 1 ? "" : "s") + "!");
}
