const BASE_URL = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public';

function loadByPincode(pincode) {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateString = day + '-' + month + '-' + year;
  fetch(BASE_URL + `/calendarByPin?pincode=${pincode}&date=${dateString}`)
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        showCenters(data.centers);
      }
    });
}

const containerEle = document.querySelector('.container');
function showCenters(centers) {
  if (centers.length > 0) {
    centers.forEach((center) =>
      containerEle.appendChild(showCenterMainDetails(center))
    );
  } else {
    const div = document.createElement('div');
    const p = document.createElement('p');
    p.innerText =
      'No centers found at the location pincode specified, please try with different pin.';
    div.appendChild(p);
    containerEle.appendChild(div);
  }
}

function showCenterMainDetails(center) {
  const divCard = document.createElement('div');
  divCard.style.width = '18rem';
  divCard.className = 'card m-1';

  const divBody = document.createElement('div');
  divBody.classList.add('card-body');
  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.innerText = `${center.name}, ${center.block_name}`;
  divBody.appendChild(cardTitle);
  const pEle = document.createElement('p');
  pEle.className = 'card-text';
  pEle.innerText = `${center.address}, open at: ${center.from} and Closed at: ${center.to}`;
  divBody.appendChild(pEle);

  const button = document.createElement('button');
  button.className = ' btn btn-sm btn-primary';
  button.setAttribute('id', 'sessions');
  button.addEventListener('click', () => showSessions(center.sessions));
  const i = document.createElement('i');
  i.className = 'fas fa-chevron-right';
  button.appendChild(i);
  divBody.appendChild(button);
  divCard.appendChild(divBody);
  return divCard;
}

const submitElement = document.querySelector('#submit');
const pincode = document.querySelector('#pincode');
if (pincode) {
  pincode.focus();
}
submitElement.addEventListener('click', (e) => {
  containerEle.innerHTML = '';
  e.preventDefault();
  if (pincode.value != '') {
    loadByPincode(pincode.value);
  }
});

const modalHeaderEle = document.querySelector('.modal-header');
const cardContainerEle = document.querySelector('.card-container');
const sessionCardEle = document.querySelector('.sessions-card');
function showSessions(sessions) {
  modalHeaderEle.classList.toggle('hide');
  cardContainerEle.classList.toggle('hide');
  sessionCardEle.classList.toggle('hide');
  if (sessions) {
    sessions.forEach((session) =>
      sessionCardEle.appendChild(showSession(session))
    );
  }
}

function showSession(session) {
  const divCard = document.createElement('div');
  divCard.style.width = '19rem';
  divCard.className = 'card m-1';

  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header';

  const span1 = document.createElement('span');
  span1.className = 'badge badge-info mr-1';
  cardHeader.appendChild(span1);
  span1.textContent = session.vaccine;

  const span2 = document.createElement('span');
  span2.className = 'badge badge-secondary mr-1';
  span2.textContent = `${session.min_age_limit}+`;
  cardHeader.appendChild(span2);

  const span3 = document.createElement('span');
  span3.className = 'badge badge-dark ';
  span3.textContent = 'Available capacity ';

  const span4 = document.createElement('span');
  span4.className = 'badge badge-light';
  span4.textContent = session.available_capacity;
  span3.appendChild(span4);

  cardHeader.appendChild(span3);
  divCard.appendChild(cardHeader);
  if (session.slots.length > 0) {
    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
    session.slots.forEach((slot) => ul.appendChild(createList(slot)));
    divCard.appendChild(ul);
  }
  return divCard;
}

function createList(slot) {
  const list = document.createElement('li');
  list.className = 'list-group-item';
  list.innerText = `Slot time: ${slot}`;
  return list;
}

const back = document.querySelector('#back');
back.addEventListener('click', () => {
  modalHeaderEle.classList.toggle('hide');
  cardContainerEle.classList.toggle('hide');
  sessionCardEle.classList.toggle('hide');
  while (sessionCardEle.lastChild.id !== 'back') {
    sessionCardEle.removeChild(sessionCardEle.lastChild);
  }
});
