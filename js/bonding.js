// Bonding with your pet: taking care of it earns Bonding Points, which
// count toward the next Level (js/levels.js). Each animal has its own ways
// to bond (data/bonding.js): a capybara's bath, a cat's cuddle or yarn, an
// owl's falconry or flying, a turtle's swim, a water pet's clean tank.
// The numbers are in data/bonding.js.

// Is this item a pet? Pets come from the pet shelves, or say "pet": true
// (like the Lakeside Store's beluga). An egg isn't a pet yet.
function isPet(item) {
  const bonding = GAME_DATA.bonding;
  return (item.pet || bonding.pets.indexOf(item.category) !== -1) && bonding.notPets.indexOf(item.id) === -1;
}

// Which animal a pet is ("owl", "cat"...), from data/bonding.js.
function animalOf(pet) {
  const animals = GAME_DATA.bonding.animals;
  return Object.keys(animals).find(function (animal) { return animals[animal].indexOf(pet.id) !== -1; });
}

// Only the pets that can do this kind of care (its "animals" in data/bonding.js).
function petsFor(kind, pets) {
  const animals = GAME_DATA.bonding[kind].animals;
  if (!animals) return pets;
  return pets.filter(function (pet) { return animals.indexOf(animalOf(pet)) !== -1; });
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
  if (!player.lastCare[kind]) player.lastCare[kind] = {}; // a new way to bond, not in older saves
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
    const blocked = care.blocked ? care.blocked(pet) : ""; // a reason it can't do this yet
    const card = itemCard(pet, wait || blocked ? null : care.button, function () { carePet(kind, pet, care); });
    if (blocked) {
      const note = document.createElement("small");
      note.textContent = blocked;
      card.appendChild(note);
    } else if (wait) {
      const note = document.createElement("small");
      note.textContent = care.done + wait + " min";
      card.appendChild(note);
    }
    row.appendChild(card);
  });
  body.appendChild(row);
}

function carePet(kind, pet, care) {
  const rules = GAME_DATA.bonding[kind];
  let points = rules.points;
  let thanks = care.thanks.replace("PET", pet.name);
  // A rare surprise, like a turtle run while you're swimming: bonus points.
  if (rules.bonus && Math.random() < luckyChance(rules.bonus.chance)) { // js/luck.js
    points += rules.bonus.points;
    thanks = rules.bonus.emoji + " " + rules.bonus.says.replace("PET", pet.name);
  }
  player.bondingPoints += points;
  player.lastCare[kind][pet.id] = Date.now();
  if (kind === "falconry" && player.falconryDone.indexOf(pet.id) === -1) player.falconryDone.push(pet.id); // now it can fly at Windy Peak
  writeSave(player);
  const said = thanks + " +" + points + " Bonding Point" + (points === 1 ? "" : "s") + "!";
  if (care.after && care.after(pet, said)) return; // something happens next, like the Windy Peak rescue
  care.open(said);
}

// A way to bond whose words are all in data/bonding.js (falconry, yarn,
// swimming, cleaning tanks...): a spot with type "care" and "care": its name.
function openCareSpot(spot, message) {
  const rules = GAME_DATA.bonding[spot.care];
  const pets = rules.from === "home" ? petsAtHome() : petsIn(player.backpack);
  openCare(spot.care, petsFor(spot.care, pets), {
    art: rules.emoji, title: rules.title, button: rules.button, done: rules.done,
    ask: rules.ask, noPets: rules.noPets, thanks: rules.thanks,
    open: function (said) { openCareSpot(spot, said); }
  }, message);
}

// The Bath Tub at Home: wash a pet carried or left at Home.
function openBath(message) {
  const art = document.createElement("img");
  art.src = picture("bath_tub");
  art.alt = "Bath Tub";
  openCare("bath", petsFor("bath", petsAtHome()), {
    art: art, title: "Bath Tub", button: "🛁 Give a bath", done: "✨ Clean! Dirty again in ",
    ask: "Your capybara wants a bath! Taking care of your pet earns Bonding Points.",
    noPets: "Capybaras love baths! Bring a capybara Home (the Lakeside Store has one).",
    thanks: "🛁 Splish, splash! Your PET is all clean and happy.", open: openBath
  }, message);
}

// The Snowy Owl Dropoff on Windy Peak: let your snowy owl out to fly around.
function openOwlDropoff(message) {
  const owls = petsIn(player.backpack).filter(function (pet) {
    return GAME_DATA.bonding.fly.pets.indexOf(pet.id) !== -1;
  });
  openCare("fly", owls, {
    art: "🦉", title: "Snowy Owl Dropoff", button: "🦉 Let it fly", done: "🪶 Resting. Ready to fly again in ",
    ask: "Let your snowy owl stretch its wings over the mountains. Flying together earns Bonding Points.",
    noPets: "This is where snowy owls fly! Bring a Snowy Owl in your backpack (the Campus Store's Pet shelf has one).",
    thanks: "🦉 Your PET swoops and soars over Windy Peak, then flies back to you!", open: openOwlDropoff,
    // Scott, 2026-10-15: an owl flies here only after a falconry lesson,
    // and with a Night Vision Potion it spots a lost little WIT (js/windy.js).
    blocked: function (pet) { return hadFalconry(pet) ? "" : "🦉 " + GAME_DATA.windyRescue.words.needLesson; },
    after: owlFlewOverSlope
  }, message);
}

// The big sofa in the Cozy Lounge: cuddle a pet you brought along.
function openCuddle(message) {
  openCare("cuddle", petsFor("cuddle", petsIn(player.backpack)), {
    art: "🛋️", title: "Big Sofa", button: "🛋️ Cuddle", done: "😴 Napping. Ready to cuddle again in ",
    ask: "Snuggle up on the sofa with your cat. Spending time together earns Bonding Points.",
    noPets: "Cats love a cuddle on the sofa! Bring a cat in your backpack (the Campus Store and the Trading Post have them).",
    thanks: "🛋️ You and your PET snuggle up on the big sofa. So cozy!", open: openCuddle
  }, message);
}
