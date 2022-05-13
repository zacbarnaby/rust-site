
const playersElement = document.getElementById("players");
const mapElement = document.getElementById("map");
const wipedElement = document.getElementById("wiped");
const nameElement = document.getElementById("name");

fetch('http://localhost:2345/api', )
  .then((response) => response.json())
  .then((data) => {
      playersElement.innerHTML = `${data.players}/${data.maxplayers}`;
      mapElement.innerHTML = data.map;
      nameElement.innerHTML = data.name;

      let wipedString = "";

      if(data.wiped.days > 0) {
        wipedString += `${data.wiped.days} days, `;
      }

      if(data.wiped.hours > 0) {
        wipedString += `${data.wiped.hours} hrs, `;
      }

      wipedString += `${data.wiped.minutes} mins ago`;
      wipedElement.innerHTML = wipedString;
  }).catch(() => {
      playersElement.innerHTML = `0/0`;
      mapElement.innerHTML = '-';
      nameElement.innerHTML = 'Offline';
      wipedElement.innerHTML = '-';
    })
