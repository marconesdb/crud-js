const userDataElement = document.getElementById('userData');
const openModalButton = document.getElementById('openModal');
const modal = document.getElementById('modal');
const nameInput = document.getElementById('name');
const addressInput = document.getElementById('address');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const cpfInput = document.getElementById('cpf');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const searchInput = document.getElementById('searchInput');

let users = JSON.parse(localStorage.getItem('users')) || [];

function renderUsers(searchTerm = '') {
    userDataElement.innerHTML = '';
    const filteredUsers = users.filter(user => {
        const fullName = `${user.name} ${user.address} ${user.phone} ${user.email} ${user.cpf}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border px-4 py-2">${user.name}</td>
            <td class="border px-4 py-2">${user.address}</td>
            <td class="border px-4 py-2">${user.phone}</td>
            <td class="border px-4 py-2">${user.email}</td>
            <td class="border px-4 py-2">${user.cpf}</td>
            <td class="border px-4 py-2">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="editUser(${user.id})">Editar</button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="deleteUser(${user.id})">Excluir</button>
            </td>
        `;
        userDataElement.appendChild(row);
    });
}

function editUser(id) {
    const user = users.find(user => user.id === id);
    if (user) {
        nameInput.value = user.name;
        addressInput.value = user.address;
        phoneInput.value = user.phone;
        emailInput.value = user.email;
        cpfInput.value = user.cpf;
        openModal();
        saveButton.dataset.editMode = 'true';
        saveButton.dataset.userId = id;
    }
}

function deleteUser(id) {
    users = users.filter(user => user.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers(searchInput.value);
}

function openModal() {
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
    nameInput.value = '';
    addressInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';
    cpfInput.value = '';
    saveButton.dataset.editMode = 'false';
    saveButton.dataset.userId = '';
}

openModalButton.addEventListener('click', openModal);
cancelButton.addEventListener('click', closeModal);
searchInput.addEventListener('input', () => renderUsers(searchInput.value));

saveButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const address = addressInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const cpf = cpfInput.value.trim();

    if (name && address && phone && email && cpf) {
        const userToSave = {
            id: Date.now(),
            name,
            address,
            phone,
            email,
            cpf
        };

        const isEditMode = saveButton.dataset.editMode === 'true';

        if (isEditMode) {
            const userIndex = users.findIndex(user => user.id === parseInt(saveButton.dataset.userId));
            users[userIndex] = userToSave;
        } else {
            users.push(userToSave);
        }

        localStorage.setItem('users', JSON.stringify(users));
        closeModal();
        renderUsers(searchInput.value);
    }
});

renderUsers();