/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//Global Variables
"use strict";
let tempPeople = [];
let currentContact = 0;
let currentIdea = 0;

/***********************************************************************************************/
if (document.deviceready){
    document.addEventListener('deviceready', onDeviceReady);
} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady);
}

window.addEventListener('push', function (ev) {
    let contentDiv = ev.currentTarget.document.querySelector(".content");
    let id = contentDiv.id;
    switch (id) {
    case "contactPage":
        console.log("contact page!");
        document.getElementById("addPersonBtn").addEventListener("touchstart", addPersonSetup);
        document.getElementById("cancelBtn").addEventListener("touchstart", cancelContactSetup);
        
        showContacts();
        break;
    case "giftPage":
        console.log("gift page!");
        document.getElementById("addIdeaBtn").addEventListener("touchstart", addIdeaSetup);
        document.getElementById("cancelIdeaBtn").addEventListener("touchstart", cancelIdeaSetup);
        showIdeas();
        
        break;
    default:
        showContacts();
    }
});

function onDeviceReady(){
    
    
    
    
    
//    localStorage.clear();
//    localStorage.setItem("giftr-smyt0058", JSON.stringify(people));
    if (!localStorage.getItem("giftr-smyt0058")) { //if smyt0058 is not there
        console.log("No contact data: setting key");
        
        localStorage.setItem("giftr-smyt0058", JSON.stringify(tempPeople));
        
    }
//    showContacts();
    console.log("I'm ready!");
    
    document.getElementById("addPersonBtn").addEventListener("touchstart", addPersonSetup);
    document.getElementById("cancelBtn").addEventListener("touchstart", cancelContactSetup);
    
    showContacts();
    
}

function saveContact(){
    console.log("save!");
    
    //create contact object
    let newContact = {
        id: Date.now(),
        name: document.getElementById("name").value,
        dob: document.getElementById("dob").value,
        ideas:[]
    }
    
    //grab array from LS
    tempPeople = JSON.parse(localStorage.getItem("giftr-smyt0058"));
//    console.log(tempPeople);
    
    //add newContact to the array
    tempPeople.push(newContact);
    console.log(tempPeople);
    
    //set array back into LS
    localStorage.setItem("giftr-smyt0058", JSON.stringify(tempPeople));
    
    //set modal value back to empty
    document.getElementById("name").value = "";
    document.getElementById("dob").value = "";
    
//    document.getElementById("saveContactBtn").removeEventListener("touchstart", saveContact);document.getElementById("saveContactBtn").removeEventListener("touchstart", saveContact);
    
    //close modal
    toggleContactModal();
    
    //refresh contact list
    showContacts();
    
}

function editContact(ev){
    
    document.getElementById("saveContactBtn").removeEventListener("touchstart", saveContact);
    document.getElementById("saveContactBtn").addEventListener("touchstart", saveEdit);
    let anchor = ev.currentTarget;
    let name = anchor.textContent;
    
    currentContact = anchor.parentElement.getAttribute("contact-id");
    
    let dobElement = anchor.parentElement.lastElementChild;
    let dob = anchor.id;
    console.log(currentContact);
    console.log(name);
    console.log(dob);
    
    //sets values to empty
    document.getElementById("name").value = "";
    document.getElementById("dob").value = "";
    
    //adds currentContact values to fields for reference
    document.getElementById("name").value = name;
    document.getElementById("dob").value = dob;
    
    
}

function saveEdit(ev){
    console.log(currentContact);
    // get the lisitem that was just clicked
        
        //grab contacts from Ls
        tempPeople = JSON.parse(localStorage.getItem("giftr-smyt0058"));
        
        // matches current id with id in LS
     tempPeople.forEach(function(value){
            if(value.id == currentContact){
                value.name = document.getElementById("name").value;
                value.dob = document.getElementById("dob").value;
            }
        });
    
    //set the array back into LS
    localStorage.setItem("giftr-smyt0058", JSON.stringify(tempPeople));
    
    //remove saveBtn eventlistener
    document.getElementById("saveContactBtn").removeEventListener("touchstart", saveEdit);
    
    //close modal
    toggleContactModal();
    
    //refresh contact list
    showContacts();
}

function showContacts(){
    console.log("showing contacts!");
    
    
    //<ul class="table-view">
    let contentDiv = document.getElementById("contactPage");
    contentDiv.innerHTML = "";
    
    let ul = document.createElement("ul");
    ul.className = "table-view";
    ul.id = "contact-list"
    
//    <li class="table-view-cell">
//           <span class="name"><a href="#personModal">Bob Smith</a></span> 
//                    
//           <a class="navigate-right pull-right" href="gifts.html">
//               <span class="dob">March 10</span>
//           </a>
//     </li>
    let tempPeople = JSON.parse(localStorage.getItem("giftr-smyt0058"));
    
    //sorts contacts by d.o.b month
    tempPeople.sort(compare);
    
    //populate contact list
    tempPeople.forEach(function(value){
        
        let li = document.createElement("li");
        li.className = "table-view-cell";
        li.setAttribute("contact-id", value.id);
        
        //<span class="pull-right icon icon-trash midline"></span>
        let deleteSpan = document.createElement("span");
        deleteSpan.className = "deleteContact";
        deleteSpan.textContent = "X";
        deleteSpan.id = "deleteContact";
        deleteSpan.addEventListener("touchstart", deleteContact);
        
        let spanName = document.createElement("span");
        spanName.className = "name";
        spanName.id = value.dob;
        spanName.addEventListener("touchstart", editContact);
        
        let aName = document.createElement("a");
        aName.setAttribute("href", "#personModal");
        aName.textContent = value.name;
        
        let aDob = document.createElement("a");
        aDob.setAttribute("href", "gifts.html");
        aDob.className = "navigate-right pull-right";
        aDob.addEventListener("touchstart", contactIdGrab);
        
        let spanDob = document.createElement("span");
        spanDob.className = "dob";
        let momentDate = moment(value.dob).format("MMMM Do");
        spanDob.textContent = momentDate;
        
        //comparing months to find out which one is in the past
        let today = Date.now();
        today = moment(today).format("YYYY-MM-DD");
        console.log(today);
        console.log(value.dob);
        if(value.dob.substring(5) < today.substring(5)){
            li.classList.toggle("passed");
        }
        
        li.appendChild(deleteSpan);
        li.appendChild(spanName);
        spanName.appendChild(aName);
        li.appendChild(aDob);
        aDob.appendChild(spanDob);
        ul.appendChild(li);
        contentDiv.appendChild(ul);
        
    })
    
    
    
}

function deleteContact(ev){
    let target = ev.currentTarget.parentElement;
    let ul = document.getElementById("contact-list");
    currentContact = target.id;
    console.log(currentContact);
    //grab contacts from Ls
        let tempPeople = JSON.parse(localStorage.getItem("giftr-smyt0058"));
        
        let index = -1; //init to -1 = not found
        
         //finds the index of the element that matches the ID
        for (let i = 0, len = tempPeople.lenght; i < len; i++) {
            if(tempPeople[i].id == currentContact) {
                index = i;
                break;
            }
        }
        console.log(index);
        
    //if we found it remove it from the contacts list
    tempPeople.splice(index, 1);
    //sets the updated array into LS
    localStorage.setItem("giftr-smyt0058", JSON.stringify(tempPeople));
    //removes the html
    ul.removeChild(target);
}

//populate gifts page
function contactIdGrab(ev){
    let target = ev.currentTarget.parentElement;
    console.log(target);
    currentContact = target.getAttribute("contact-id");
    
}

function showIdeas(){
    console.log("showing ideas!");
    console.log(currentContact);
    
    tempPeople = JSON.parse(localStorage.getItem("giftr-smyt0058"));
    
    let ul = document.getElementById("gift-list");
    ul.innerHTML = "";
    
    tempPeople.forEach(function (value1, index1) {
        if(value1.id == currentContact){
            document.querySelector(".title").textContent = value1.name;
            document.querySelector("#contactName").textContent = "Gift ideas for " + value1.name;
            value1.ideas.forEach(function (value2, index2){
              
                let li = document.createElement("li");
//                    li.classList += "table-view-cell";
//                    li.classList += " media";
                    li.className = "table-view-cell media";
                    ul.appendChild(li);
                let span = document.createElement("span");
//                    span.classList += "pull-right";
//                    span.classList += " icon";
//                    span.classList += " icon-trash";
//                    span.classList += " midline";
                    span.className = "pull-right icon icon-thrash midline";
                    span.addEventListener("touchstart", deleteIdea);
                    li.appendChild(span);
                let div = document.createElement("div");
                    div.className = "media-body";
                    div.setAttribute("gift-id", value2.id);
                let a = document.createElement("a");
                    a.textContent = value2.idea;
                    a.id = "ideaName";
                    a.addEventListener("touchstart", function(ev){
                        currentIdea = div.getAttribute("gift-id");
                        console.log(currentIdea);
                        editIdea(currentIdea);
                    });
                    div.appendChild(a);
                    li.addEventListener("touchstart", function(){
                        currentIdea = div.getAttribute("gift-id");
                    })
                    li.appendChild(div);
                
                if (value2.where != ""){
                    let p1 = document.createElement("p");
                        p1.textContent = value2.where;
                        p1.id = "ideaLocation";
                        li.appendChild(p1);
                }
                if (value2.url != ""){
                    let p2 = document.createElement("p");
                    let a2 = document.createElement("a");
                        a2.href = value2.url;
                        a2.setAttribute("target", "_blank");//*
                        a2.textContent = value2.url;//*
                        p2.id = "ideaUrl";
                        p2.appendChild(a2);//*
                        li.appendChild(p2);
                }
                if (value2.cost != ""){
                    let p3 = document.createElement("p");
                        p3.textContent = value2.cost;
                        p3.id = "ideaCost";
                        li.appendChild(p3);
                }
                
            });
        }
    });
    
//    let deleteButtons = document.querySelectorAll(".icon-trash");
//    deleteButtons.forEach(function (value){
//        value.addEventListener("click", deleteIdea);
//    })
}

function saveIdea(){
//                  <form class="input-group">
//                        <div class="input-row">
//                            <label>Gift idea</label>
//                            <input type="text" id="idea" placeholder="idea"/>
//                        </div>
//                        <div class="input-row">
//                            <label>Store</label>
//                            <input type="text" id="where" placeholder="where to find it"/>
//                        </div>
//                        <div class="input-row">
//                            <label>URL</label>
//                            <input type="url" id="url" placeholder="http://www.example.com/"/>
//                        </div>
//                        <div class="input-row">
//                            <label>Cost</label>
//                            <input type="text" id="cost" placeholder="$14.99"/>
//                        </div>
//                    </form>
    
    let newIdea = {
            id: Date.now(),
            idea: document.getElementById("idea").value, 
            where: document.getElementById("where").value, 
            cost: document.getElementById("cost").value, 
            url: document.getElementById("url").value
        };
    tempPeople = JSON.parse(localStorage.getItem("giftr-smyt0058"));
    console.log(currentContact);
    tempPeople.forEach(function(value){
            if(value.id == currentContact){
                value.ideas.push(newIdea);
            } else {
                console.log("no matching ids!")
            }
        });
    console.log(tempPeople);
    
    localStorage.setItem("giftr-smyt0058", JSON.stringify(tempPeople));
    
    toggleIdeaModal();
    showIdeas();
    
}

function deleteIdea(){
    console.log("deleting!");
    tempPeople = JSON.parse(localStorage.getItem("giftr-smyt0058"));
    tempPeople.forEach(function (contact){
        contact.ideas.forEach(function (idea, index){
            if(currentIdea == idea.id){
                contact.ideas.splice(index, 1);
                localStorage.setItem("giftr-smyt0058", JSON.stringify(tempPeople));
                showIdeas();
            }  
        })
    });
}

function editIdea(current){
    
    
    document.getElementById("saveIdeaBtn").removeEventListener("touchstart", saveIdea);
    document.getElementById("saveIdeaBtn").addEventListener("touchstart", saveEditedIdea);
    
    tempPeople.forEach(function (value1){
        value1.ideas.forEach(function (ideas, index){
            if(ideas.id == current){
                document.getElementById("modalTitle").textContent = "Edit Idea";
                document.getElementById("idea").value = ideas.idea;
                document.getElementById("where").value = ideas.where;
                document.getElementById("url").value = ideas.url;
                document.getElementById("cost").value = ideas.cost;
            }
        })
    })
    toggleIdeaModal();
    
    
}

function saveEditedIdea(){
    
    tempPeople = JSON.parse(localStorage.getItem("giftr-smyt0058"));
    tempPeople.forEach(function (contact){
        contact.ideas.forEach(function (ideas, index){
            if(ideas.id == currentIdea){
                ideas.idea = document.getElementById("idea").value;
                ideas.where = document.getElementById("where").value;
                ideas.cost = document.getElementById("cost").value;
                ideas.url = document.getElementById("url").value;
                localStorage.setItem("giftr-smyt0058", JSON.stringify(tempPeople));
                showIdeas();
            }
        })
    })
    toggleIdeaModal();
}

//closes the modal
function toggleContactModal(){
    let modal = document.querySelector("#personModal");
    modal.classList.toggle("active");
}

function toggleIdeaModal(){
    let modal = document.querySelector("#giftModal")
    modal.classList.toggle("active");
}

//sort by month function
function compare(a,b){
    if(a.dob.substring(5) < b.dob.substring(5)) return -1;
    if(a.dob.substring(5) > b.dob.substring(5)) return 1;
    return 0;
}

function addIdeaSetup(){
    currentIdea = 0;
    document.getElementById("modalTitle").textContent = "Add Idea";
    document.getElementById("idea").value = "";
    document.getElementById("where").value = "";
    document.getElementById("url").value = "";
    document.getElementById("cost").value = "";
    
    document.getElementById("saveIdeaBtn").removeEventListener("touchstart", saveEditedIdea);
    document.getElementById("saveIdeaBtn").addEventListener("touchstart", saveIdea);
    
}

function addPersonSetup(){
    document.getElementById("name").value = "";
    document.getElementById("dob").value = "";
    currentContact = 0;
    let saveContactBtn = document.getElementById("saveContactBtn");
    saveContactBtn.removeEventListener("touchstart", saveEdit);
    saveContactBtn.addEventListener("touchstart", saveContact);
}

function cancelContactSetup(){
    document.getElementById("name").value = "";
    document.getElementById("dob").value = "";
    toggleContactModal();
}

function cancelIdeaSetup(){
    
        document.getElementById("idea").textContent = "";
        document.getElementById("where").textContent = "";
        document.getElementById("url").textContent = "";
        document.getElementById("cost").textContent = "";
        toggleIdeaModal();
}











