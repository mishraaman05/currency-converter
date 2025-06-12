const BASE_URL = "https://api.currencyapi.com/v3/latest?apikey=cur_live_JRWdgIfAzAgVtdJXV80shGBqx9EAbZSmeZo8QSS4";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update flag icons
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) {
    img.src = newSrc;
  }
};

// Function to get and display exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Handle same currency (e.g., USD to USD)
  if (fromCurr.value === toCurr.value) {
    msg.innerText = `${amtVal} ${fromCurr.value} = ${amtVal} ${toCurr.value}`;
    return;
  }

  const URL = `${BASE_URL}&base_currency=${fromCurr.value}&currencies=${toCurr.value}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    let rate = data.data[toCurr.value]?.value;

    if (!rate) {
      msg.innerText = `Exchange rate not found for ${fromCurr.value} to ${toCurr.value}.`;
      return;
    }

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Something went wrong. Please try again.";
  }
};

// Button click event
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Run on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
