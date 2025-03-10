document.getElementById("search-btn").addEventListener("click", fetchCountryData);

async function fetchCountryData() {
    const countryName = document.getElementById("country-input").value.trim();
    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const countryData = await response.json();
        displayCountryInfo(countryData[0]);

    } catch (error) {
        document.getElementById("country-info").innerHTML = `<p style="color: red;">${error.message}</p>`;
        document.getElementById("bordering-countries").innerHTML = "";
    }
}

function displayCountryInfo(country) {
    const countryInfo = document.getElementById("country-info");
    countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
    `;

    if (country.borders) {
        fetchBorderingCountries(country.borders);
    } else {
        document.getElementById("bordering-countries").innerHTML = "<p>No bordering countries.</p>";
    }
}

async function fetchBorderingCountries(borderCodes) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`);
        const borderCountries = await response.json();

        let bordersHTML = "<h3>Bordering Countries:</h3>";
        borderCountries.forEach(border => {
            bordersHTML += `
                <p><strong>${border.name.common}</strong></p>
                <img src="${border.flags.png}" alt="Flag of ${border.name.common}">
            `;
        });

        document.getElementById("bordering-countries").innerHTML = bordersHTML;
    } catch (error) {
        document.getElementById("bordering-countries").innerHTML = "<p style='color: red;'>Error loading border countries.</p>";
    }
}

