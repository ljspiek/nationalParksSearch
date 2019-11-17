const apiKey = "CWndBJpCm4T9z7p513u3sjnTDJAienL34t1dLuBL";
const searchUrl = "https://developer.nps.gov/api/v1/parks?";


function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${[encodeURIComponent(key)]}=${params[key]}`);
    return queryItems.join('&');
}

function displayNationalParksResults(responseJson, maxResults) {
    let parkInfo = responseJson.data;
    console.log(parkInfo);
    let ul = $('#results-list');
    ul.empty()
    if(parkInfo.length !== 0) {
        for (let i = 0; i < parkInfo.length; i++) {
            $('#results-list').append(`<li class="results-list-items">
            <h3>${parkInfo[i].name}</h3>
            <p class="park-description">${parkInfo[i].description}</p>
            <p class="park-url">Find more information at: <a href ="${parkInfo[i].url}" target = blank>${parkInfo[i].url}</a></p>
        </li>`);
        }
        $('#results').show();
    }
    else {
        $('#error').show();
        $('#results').hide();
    };
   
    
}

function getNationalParks(searchUrl, combinedStateAbbr, maxResults, apiKey) {
    const params = {
        stateCode: combinedStateAbbr,
        limit: maxResults
    }

    const queryString = formatQueryParams(params);
    const url = `${searchUrl}${queryString}&api_key=${apiKey}`;
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayNationalParksResults(responseJson, maxResults))
        .catch(err => {
            $('#js-error-message').replaceWith(`<p id="js-error-message" class="error-message">${err.message}`);
        });
}

function watchForm() {
    $('#js-form').submit(event => {
        event.preventDefault();
        const stateArr = $('#js-search-term').val().split(",");
        console.log(stateArr);
        let combinedStateAbbr = stateArr.join('&stateCode=');
        console.log(combinedStateAbbr);
        const maxResults = $('#js-max-results').val();
        console.log(maxResults);
        getNationalParks(searchUrl, combinedStateAbbr, maxResults, apiKey);
    } );

}

$(watchForm);