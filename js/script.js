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
                resolve(data);
                console.log(data);
                let pageInfo = pagination(data);
                renderLeftArrowBtn(pageInfo);
                renderRightArrowBtn(pageInfo);
                createResultsTemplate(data);
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
                    <hr>
                </div>
                <div class="price-cart-container">
                    <span class="result-msrp">$${formattedObject.msrp}</span>
                    <span class="result-price">$${formattedObject.price}</span>
                    <a href="#" class="add-to-cart btn btn-success">Add to cart</a>
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
                <hr>
            </div>
            <div class="price-and-cart">
                <div class="price-cart-container">
                    <span class="no-msrp">$${formattedObject.price}</span>
                    <a href="#" class="add-to-cart btn btn-success">Add to cart</a>
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

const pagination = (data) => {
    let pageNo = {
        currentPage: data.pagination.currentPage,
        nextPage: data.pagination.nextPage ?? "data unavailable",
        currentPage: data.pagination.currentPage,
        defaultPerPage: data.pagination.defaultPerPage,
        previousPage: data.pagination.previousPage,
    }
    console.log(pageNo)
    return pageNo;
}

const renderLeftArrowBtn = (pageInfo) => {
    if (pageInfo.previousPage !== 0) {
        $('.left-arrow').val(pageInfo.previousPage);
        $('.left-arrow').css("display", "inline-block");
    } else {
        $('.left-arrow').css("display", "none");
    }
}

const renderRightArrowBtn = (pageInfo) => {
    if (pageInfo.nextPage !== 0) {
        $('.right-arrow').val(pageInfo.nextPage);
        $('.right-arrow').css("display", "inline-block");
    } else {
        $('.right-arrow').css("display", "none");
    }
}

// DOM events

$(document).ready(function () {

    $('.search-btn').click((e) => {
        e.preventDefault();
        let searchInput = $('.search-box').val();
        let searchResults = `<h2 class="search-term">Searched for: <span><em>${searchInput}</em></span></h2>`;
        $('.query-search-display').html(searchResults);
        getApiData(searchInput, 1);
        $('.left-arrow').data('id', searchInput);
        $('.right-arrow').data('id', searchInput);
    })

    $('.left-arrow').click((e) => {
        e.preventDefault();
        let searchInput = $('.left-arrow').data('id');
        let previousPage = $('.left-arrow').val();
        getApiData(searchInput, previousPage);
    })

    $('.right-arrow').click((e) => {
        e.preventDefault();
        let searchInput = $('.right-arrow').data('id');
        let nextPage = $('.right-arrow').val();
        getApiData(searchInput, nextPage);
    })

    $(document).on('click', '.add-to-cart', (e) => {
        console.log('clicked');
        e.preventDefault();
        let cartCount = $('#cart-count').text();
        let updatedCartCount = parseFloat(cartCount) + 1;
        $('#cart-count').text(updatedCartCount);
    })

    $(document).ready(() => {
        $('.navbar-brand').click(() => {
            location.reload(true);
        })
    })

})