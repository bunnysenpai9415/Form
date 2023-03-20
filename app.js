const inpFirstName = document.querySelector(`.first-name`);
const inpLastName = document.querySelector(`.last-name`);
const inpEmail = document.querySelector(`.email`);
const inpAge = document.querySelector(`.age`);
const inpCountry = document.querySelector(`.country`);
const inpCode = document.querySelector(`.code`);
const inpPhone = document.querySelector(`.phone`);
const btnSubmit = document.querySelector(`.btn-submit`);
const listRow = document.querySelector(`.list-row`);
const body = document.body;
const modeSwitch = document.querySelector(`.mode-toggle`);

class App {
  constructor() {
    inpFirstName.focus();
    this.users = [];
    this.isDark = false;
    btnSubmit.addEventListener(`click`, this._submit.bind(this));
    this._loadCountries();
    inpCountry.addEventListener(`change`, this._findCode.bind(this));
    modeSwitch.addEventListener(`click`, this._toggleMode.bind(this));
    this._getLocalStorage();
    listRow.addEventListener('click', this._deleteUser.bind(this));
  }

  async _loadCountries() {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/all`);
      if (!response.ok) throw new Error(`Failed to fetch countries!`);

      const data = await response.json();

      const countries = data.map((country) => [
        country.cca2,
        country.name.common,
      ]);

      countries.forEach((country) => {
        const option = document.createElement(`option`);
        option.value = country[0];
        option.textContent = country[1];

        inpCountry.append(option);
      });
    } catch (err) {
      console.error(err);
    }
  }

  _submit(e) {
    e.preventDefault();

    const obj = {
      firstName: inpFirstName.value,
      lastName: inpLastName.value,
      email: inpEmail.value,
      age: inpAge.value,
      country: inpCountry.value,
      code: inpCode.textContent,
      phone: inpPhone.value,
      id: (Date.now() + '').slice(-10),
    };

    this.users.push(obj);

    this._render(obj);
    this._setLocalStorage(this.users);
    this._clearInput();
  }

  _render(user) {
    const row = document.createElement(`tr`);
    row.classList.add('row-user');
    row.dataset.id = user.id;

    row.innerHTML = `
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.email}</td>
    <td>${user.age}</td>
    <td>${user.country}</td>
    <td> ${user.code}${' '}${user.phone}</td>
    <td><button class="btn btn-primary btn-sm btn-danger btn-delete" id="delete" class="btn btn-primary btn-sm btn-danger">Delete</button></td>
    `;

    listRow.append(row);
    console.log(row);
  }

  async _findCode() {
    try {
      const countryCode = inpCountry.value;

      const response = await fetch(
        `https://restcountries.com/v2/alpha/${countryCode}`
      );

      if (!response.ok) throw new Error(`Failed to fetch country code!`);

      const data = await response.json();

      const callingCode = data.callingCodes[0];
      inpCode.textContent = `+${callingCode}`;
    } catch (err) {
      console.error(err);
    }
  }

  _clearInput() {
    inpFirstName.value = '';
    inpLastName.value = '';
    inpEmail.value = '';
    inpAge.value = '';
    inpCountry.value = '';
    inpCode.textContent = 'Ext';
    inpPhone.value = '';
  }

  _toggleMode() {
    body.classList.toggle(`dark-mode`);
    this.isDark = !this.isDark;
  }

  _setLocalStorage(data) {
    localStorage.setItem(`data`, JSON.stringify(data));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('data'));
    console.log(data);
    if (!data) return;

    this.users = data;
    this.users.forEach((user) => {
      this._render(user);
    });
  }

  _deleteUser(e) {
    if (!e.target.classList.contains('btn-delete')) return;
    const row = e.target.closest('.row-user');
    row.remove();

    const index = this.users.findIndex((user) => {
      user.id === row.dataset.id;
    });
    this.users.splice(index, 1);

    this._setLocalStorage(this.users);
  }
}

const app = new App();
