const COHORT = "COHORT_EDWIN";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const NO_PARTY = "<img src='https://static.vecteezy.com/system/resources/previews/023/007/111/non_2x/forbidden-symbol-no-party-no-party-sign-flat-style-vector.jpg'>"
// === State ===

const state = {
    parties: []
};

async function getParties() {
    try {
        const response = await fetch(API_URL);
        const responseObj = await response.json();
        state.parties = responseObj.data;
    } catch (error){
        console.error(error)
    }
}

async function addParty(party) {
    try{
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(party),
        });
        const json = await response.json();

        if(json.error){
            throw new Error(json.error.message)
        }  
    }
    catch (error) {
        console.error(error)
    }

}

async function deleteParty(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
    }
  }

// === Render ===

function renderParties() {
    const partiesList = document.querySelector('#parties')

    if(!state.parties.length) {
        partiesList.innerHTML = `<li>No parties ${NO_PARTY}</li>`;
        return;
    }

    const partiesCards = state.parties.map((party) => {
        const card = document.createElement('li');
        card.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <p>${party.date}</p>
        <p>${party.location}</p>
        <button class="delete-btn" id="${party.id}">Delete</button>
        `;
        
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
        await deleteParty(party.id);
        render();
    })

        return card;
    })

    partiesList.replaceChildren(...partiesCards)

}

async function render() {
    await getParties();
    renderParties();
}

// === Script ===

// Initial render

render();

//Add a party when the form is submited.

const form = document.querySelector('form')
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const partyDate = form.partyDate.value;
    const partyTime = form.partyTime.value;
    const dateTime = new Date(`${partyDate}T${partyTime}`).toISOString();

    const party = {
        name: form.partyName.value,
        description: form.partyDescription.value,
        date: dateTime,
        location: form.partyLocation.value,
    };

    await addParty(party);
    render();
})

