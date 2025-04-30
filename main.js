 
let myLeads = []
let myOldLeads = []
const inputEl = document.getElementById('input-el')
const inputBtn = document.getElementById('input-btn')
const ulEl = document.getElementById('ul-el')
const deleteBtn = document.getElementById('delete-btn')
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))
const tabBtn = document.getElementById('tab-btn')
const newTabCheckbox = document.getElementById('pref-newtab-checkbox')

// --- Link Preference Handling ---
let openInNewTab = true; // Default value

function loadPreference() {
    const savedPref = localStorage.getItem("prefOpenInNewTab");
    if (savedPref !== null) {
        openInNewTab = JSON.parse(savedPref);
    }
    newTabCheckbox.checked = openInNewTab;
}

function savePreference() {
    openInNewTab = newTabCheckbox.checked;
    localStorage.setItem("prefOpenInNewTab", JSON.stringify(openInNewTab));
    // Re-render lists to apply the change immediately
    render(myLeads);
    // Check if history is currently displayed and re-render it too
    if (historyUlEl.innerHTML !== "") {
        renderHistory();
    }
}

// Load preference on script start
loadPreference();

// Save preference on change
newTabCheckbox.addEventListener('change', savePreference);
// --- End Link Preference Handling ---

tabBtn.addEventListener("click", ()=> {
   //Grab url of current tab with chrome API
   chrome.tabs.query({
      active: true,
      currentWindow: true
   },
      function (tabs) {
         //since only one tab should be acitve and in the current window at once
         //the return variable should only have one entry
         myLeads.push(tabs[0].url)
         localStorage.setItem("myLeads", (JSON.stringify(myLeads)))
         render(myLeads)
      } 
   )   
})

if (leadsFromLocalStorage) {
   myLeads = leadsFromLocalStorage
   render(myLeads)
}

function render(leads) {
   let listItems = ""
   const targetAttribute = openInNewTab ? "target='_blank'" : "";
   for (let i=0; i<leads.length; i++) {
      listItems += `
         <li>
            <a ${targetAttribute} href='${leads[i]}'>
               ${leads[i]}
             </a>
         </li>
      `
   }

   ulEl.innerHTML = listItems
}

deleteBtn.addEventListener("dblclick", ()=> {
   console.log("doubleclicked")
   // Get existing leads
   const currentLeads = JSON.parse(localStorage.getItem("myLeads")) || [];
   // Get existing old leads, initialize if null
   let oldLeads = JSON.parse(localStorage.getItem("myOldLeads")) || [];
   // Append current leads to old leads
   oldLeads = oldLeads.concat(currentLeads);
   // Save combined old leads
   localStorage.setItem("myOldLeads", JSON.stringify(oldLeads));
   // Clear current leads
   localStorage.removeItem("myLeads"); // Use removeItem instead of clear to keep myOldLeads
   myLeads = []
   render(myLeads)
})

inputBtn.addEventListener("click", ()=> {
   myLeads.push(inputEl.value)
    inputEl.value = ""
    localStorage.setItem("myLeads", (JSON.stringify(myLeads)))
   render(myLeads)
} )

const historyBtn = document.getElementById('history-btn');
const historyUlEl = document.getElementById('history-ul-el');

function renderHistory() {
    const oldLeads = JSON.parse(localStorage.getItem("myOldLeads")) || [];
    let listItems = "";
    const targetAttribute = openInNewTab ? "target='_blank'" : "";
    if (oldLeads.length > 0) {
        for (let i = 0; i < oldLeads.length; i++) {
            listItems += `
                <li>
                    <a ${targetAttribute} href='${oldLeads[i]}'>
                        ${oldLeads[i]}
                    </a>
                </li>
            `;
        }
    } else {
        listItems = "<li>No history yet.</li>";
    }
    historyUlEl.innerHTML = listItems;
}

historyBtn.addEventListener("click", renderHistory);