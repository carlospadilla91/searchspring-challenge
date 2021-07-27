"use strict"

// Searchspring API URL
const apiURL = "https://scmq7n.a.searchspring.io/api/search/search.json"

// Get API data
const getApiData = (searchInput, pageNo) => {
    return new Promise((resolve => {
        fetch(apiURL + '?' + new URLSearchParams({
            q: searchInput,
            resultsFormat: 'native',
            page: pageNo,
            siteId: 'scmq7n'
        }))
            .then(response => response.json())
            .then(data => {
                resolve(data)
                console.log(data)
                createResultsTemplate(data)
            })
            .catch(error => console.error())
    }))
}

const createSearchResultsCards = (formattedObject) => {
    let html = "";
    if (formattedObject.price < formattedObject.msrp) {
        html +=
            `<div class="card" id="result-card" style="width: 18rem;">
                <img src="${formattedObject.image}" class="card-img-top" alt="${formattedObject.name}">
                <div class="card-body">
                    <p class="result-name">${formattedObject.name}</p>
                </div>
                <div class="price-container">
                    <p class="result-msrp">$${formattedObject.msrp}</p>
                    <p class="result-price">$${formattedObject.price}</p>
                </div>
                <div class="add-cart-container">
                    <i class="shopping cart large icon add-cart-btn"></i>
                </div>
            </div>`
    } else {
        html +=
            `<div class="result-card">
            <div class="result-img-container">
                <img src="${formattedObject.image}" class="result-thumbnail" alt="Image for ${formattedObject.name}"/>
            </div>
            <div class="result-name-container">
                <p class="result-name">${formattedObject.name}</p>
            </div>
            <div class="price-and-cart">
                <div class="result-price-container">
                    <p class="no-msrp">$${formattedObject.price}</p>
                </div>
                <div class="add-cart-container">
                    <i class="shopping cart large icon add-cart-btn"></i>
                </div>
            </div>    
        </div>`
    }
    return html;
}


const createResultsTemplate = (data) => {
    let formattedTemplate = [];
    for (let i = 0; i < data.results.length; i++) {
        const resultObject = {
            resultId: i + 1,
            name: data.results[i].title,
            price: data.results[i].price,
            msrp: data.results[i].msrp ?? "data unavailable",
            image: data.results[i].thumbnailImageUrl,
        }

        formattedTemplate.push(resultObject);
    }
    renderResultsSearch(formattedTemplate);
}

const renderResultsSearch = (data) => {
    console.log(data);
    let html = "";
    let main = $('.main');
    if (data.length !== 0) {
        data.forEach(result => {
            html += createSearchResultsCards(result);
        })
        $(".main").css("display", "block");
        $(".no-results").css("display", "none");
        $(".search-results").html(html);
    } else {
        html += `<div>No matching results</div>`;
        $(".search-results").css("display", "none");
    }
    main.scrollIntoView({behavior: "smooth"});
}

// Pagination

const pagination = () => {
    let pageNo = {
        currentPage: data.pagination.currentPage,
        nextPage: data.pagination.nextPage ?? "data unavailable",
        defaultPerPage: data.pagination.defaultPerPage,
        previousPage: data.pagination.previousPage,
    }
    return pageNo;
}

// DOM events

$(document).ready(function () {

    $('.search-btn').click((e) => {
        e.preventDefault();
        let searchInput = $('.search-box').val();
        let searchResults = `<h2 class="search-term">Searched for: <span><em>${searchInput}</em></span></h2>`;
        $('.query-search-display').html(searchResults);
        getApiData(searchInput, 1);

        // // if user presses enter key instead of click
        // $(".search-box").keypress((e) => {
        //     if(e.which == 13){
        //         $('.search-btn').click();
        //     }
        // });
    })
})