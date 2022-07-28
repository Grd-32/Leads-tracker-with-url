 
let myLeads = []
let myOldLeads = []
const inputEl = document.getElementById('input-el')
const inputBtn = document.getElementById('input-btn')
const ulEl = document.getElementById('ul-el')
const deleteBtn = document.getElementById('delete-btn')
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads")) 
const tabBtn = document.getElementById('tab-btn')

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
   for (let i=0; i<leads.length; i++) {
      listItems += `
         <li>
            <a target='_blank' href='${leads[i]}'>
               ${leads[i]}
             </a>
         </li>
      `
   }

   ulEl.innerHTML = listItems
}

deleteBtn.addEventListener("dblclick", ()=> {
   console.log("doubleclicked")
   localStorage.clear()
   myLeads = []
   render(myLeads)
})

inputBtn.addEventListener("click", ()=> {
   myLeads.push(inputEl.value)
    inputEl.value = ""
    localStorage.setItem("myLeads", (JSON.stringify(myLeads)))
   render(myLeads)
} )