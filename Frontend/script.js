
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editingId = null;
let hasScrolled = false;

function updateStats() {

   document.querySelector("#totalContacts").textContent =
    `👥 Total Contacts : ${contacts.length}`;

    document.querySelector("#favoriteContacts").textContent =
    `⭐ Favorite Contacts : ${
        contacts.filter(c => c.favorite).length
    }`;

    document.querySelector("#familyContacts").textContent =
    `🏠 Family Contacts : ${
        contacts.filter(c => c.category === "Family").length
    }`;

    document.querySelector("#friendsContacts").textContent =
    `🤝 Friends Contacts : ${
        contacts.filter(c => c.category === "Friends").length
    }`;

    document.querySelector("#workContacts").textContent =
    `💼 Work Contacts : ${
        contacts.filter(c => c.category === "Work").length
    }`;

    document.querySelector("#emergencyContacts").textContent =
    `🚨 Emergency Contacts : ${
        contacts.filter(c => c.category === "Emergency").length
    }`;
    document.querySelector("#othersContacts").textContent =
`📌 Others Contacts : ${
    contacts.filter(c => c.category === "Others").length
}`;    
}
function showMessage(text) {
    const message = document.querySelector("#message");

    message.textContent = text;

    setTimeout(() => {
        message.textContent = "";
    }, 3000);
}
function renderContact(contact){
    const list = document.querySelector("#contactList");
    const li = document.createElement("li");
    li.dataset.name = contact.name.toLowerCase();
    li.dataset.id = contact.id;
    li.innerHTML = `
    <span class="star">${contact.favorite ? "★" : "☆"}</span>
    ${contact.name} - ${contact.phone} - ${contact.email} - ${contact.category}
    <button class="deleteBtn">🗑 Delete</button>
    <button class="editBtn">✏️ Edit</button>
    `;
    list.appendChild(li);

    const star = li.querySelector(".star");

    star.style.color = contact.favorite ? "gold" : "gray";

    star.addEventListener("click", () => {
    contact.favorite = !contact.favorite;
    localStorage.setItem("contacts", JSON.stringify(contacts));
    star.textContent = contact.favorite ? "★" : "☆";
    star.style.color = contact.favorite ? "gold" : "gray";
    updateStats();
    });

    const editBtn = li.querySelector(".editBtn");

    const deleteBtn = li.querySelector(".deleteBtn");

    editBtn.addEventListener("click", () => {
    document.querySelector("#nameInput").value = contact.name;
    document.querySelector("#phoneInput").value = contact.phone;
    document.querySelector("#emailInput").value = contact.email;
    document.querySelector("#categoryInput").value = contact.category;

    editingId = contact.id;

    document.querySelector("#addContactBtn").textContent =
    "Update Contact";
    document.querySelector("#formTitle").textContent =
    "✏️ Update Contact";
    document.querySelector("#contactForm").scrollIntoView({
    behavior: "smooth",
    block: "start"
    });
    });

    deleteBtn.addEventListener("click", () => {
    if (!confirm("Are you sure you want to delete this contact?")) {
        return;
    }

    contacts = contacts.filter(c => c.id !== contact.id);
    localStorage.setItem("contacts", JSON.stringify(contacts));
  
    li.remove();

    updateStats();

    if (contacts.length === 0) {
    const emptyState = document.querySelector("#emptyState");

    emptyState.style.display = "block";

    emptyState.innerHTML = `
        <p>📭 No contacts yet</p>
        <p>Start by adding your first contact.</p>
    `;
    }
    });
}

contacts.forEach(contact => {
    renderContact(contact);
})

updateStats();

if (contacts.length > 0) {
    document.querySelector("#emptyState").style.display = "none";
}

document.querySelector("#contactForm").addEventListener("submit",(e) => {
    e.preventDefault();

    const name = document.querySelector("#nameInput").value.trim();
    const phone = document.querySelector("#phoneInput").value.trim();
    const email = document.querySelector("#emailInput").value.trim();
    const category = document.querySelector("#categoryInput").value;
    
    if(name === ""){
        alert("Name cannot be empty.");
        return;
    }
    if(phone === ""){
        alert("Phone number cannot be empty.");
        return;
    }
    if(category === ""){
    alert("Please select a category.");
    return;
    }
    if(category === "Emergency"){
        if(!/^\d+$/.test(phone)){
            alert("Emergency number should contain only numbers.");
            return;
        }
    }    
        else{
            if(!/^[6-9]\d{9}$/.test(phone)){
                alert("Please enter a valid Indian mobile number. If you're adding emergency numbers like 100, 101, 108, or 112, please select the Emergency category.");
            return;
            }  
        }
    if(email === ""){
        alert("Email cannot be empty.")
        return;
    }

    const duplicateContact = contacts.find(c =>
        c.name.toLowerCase() === name.toLowerCase() &&
        c.phone === phone &&
        c.id !== editingId
    );

    if (duplicateContact) {
        alert("This contact already exists.");
        return;
    }

    if (editingId !== null) {
        const contactIndex = contacts.findIndex(
            c => c.id === editingId
    );

    contacts[contactIndex].name = name;
    contacts[contactIndex].phone = phone;
    contacts[contactIndex].email = email;
    contacts[contactIndex].category = category;

    localStorage.setItem("contacts", JSON.stringify(contacts));

    document.querySelector("#contactList").innerHTML = "";

    contacts.forEach(contact => {
        renderContact(contact);
    });

    updateStats();

    editingId = null;

    document.querySelector("#addContactBtn").textContent =
        "Add Contact";
    document.querySelector("#formTitle").textContent =
    "➕ Add New Contacts"; 

    showMessage("✏️ Contact updated successfully!");

    setTimeout(() => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    }, 100);

    } else {

        const contact = {
            id: Date.now(),
            name: name,
            phone: phone,
            email: email,
            category: category,
            favorite: false
        };

        contacts.push(contact);

        localStorage.setItem("contacts", JSON.stringify(contacts));

        renderContact(contact);

        showMessage("✅ Contact added successfully!");

        window.scrollTo({
        top: 0,
        behavior: "smooth"
        });

    }
    updateStats();

    document.querySelector("#emptyState").style.display = "none";

    document.querySelector("#nameInput").value = "";
    document.querySelector("#phoneInput").value = "";
    document.querySelector("#emailInput").value = "";
    document.querySelector("#categoryInput").value = "";
    });
document.querySelector("#searchInput").addEventListener("input", (e) => {
    const searchText = e.target.value.toLowerCase().trim();

    if (searchText !== "" && !hasScrolled) {
    document.querySelector("#contactList").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    hasScrolled = true;
    }

    const allContacts = document.querySelectorAll("#contactList li");

    let found = false;

    allContacts.forEach(li => {
        const contactName = li.dataset.name;

        if (contactName.includes(searchText)) {
            li.style.display = "";
            found = true;
        } else {
            li.style.display = "none";
        }
    });

    const emptyState = document.querySelector("#emptyState");

    if (!found && searchText !== "") {
        emptyState.style.display = "block";

        emptyState.innerHTML = `
            <p>🔍 No contacts found</p>
            <p>Try another search term.</p>
        `;
    }
    else if (contacts.length === 0) {
        emptyState.style.display = "block";

        emptyState.innerHTML = `
            <p>📭 No contacts yet</p>
            <p>Start by adding your first contact.</p>
        `;
    }
    else {
        emptyState.style.display = "none";
        emptyState.innerHTML = `
            <p>📭 No contacts yet</p>
            <p>Start by adding your first contact.</p>
        `;
    }
    if (searchText === "") {
    hasScrolled = false;
}
});

document.querySelector("#sortContacts").addEventListener("change", (e) => {

    const sortType = e.target.value;

    if (sortType === "az") {
        contacts.sort((a, b) => a.name.localeCompare(b.name));
    }
    else if (sortType === "za") {
        contacts.sort((a, b) => b.name.localeCompare(a.name));
    }
    else if (sortType === "favorites") {
        contacts.sort((a, b) => b.favorite - a.favorite);
    }
    localStorage.setItem("contacts", JSON.stringify(contacts));
    document.querySelector("#contactList").innerHTML = "";
    contacts.forEach(contact => {
        renderContact(contact);
    });
    updateStats();
});