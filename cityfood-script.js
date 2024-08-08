// ==UserScript==
// @name         CityFood Script
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Modifies CityFood page content.
// @author       You
// @match        https://rendel.cityfood.hu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cityfood.hu
// @grant        none
// @updateURL    https://raw.githubusercontent.com/melangoth/cityfood-script/master/cityfood-script.js
// @downloadURL  https://raw.githubusercontent.com/melangoth/cityfood-script/master/cityfood-script.js
// ==/UserScript==

(function() {
    'use strict';
    
    function hideUnwantedElementsAndCollectFood() {
console.log('Collecting nuts...');
        
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const collectedFoods = [];
    const nutrientRegex = /(\d+)\D*(\d+)\D*(\d+)\D*(\d+)/; // Regex to match four numeric values
    const rankRegex = /\d+/g; // Regex to match numeric values in the text

    // Hide all divs with the class 'banner'
    const banners = document.querySelectorAll('div.banner');
    banners.forEach(banner => {
        banner.style.display = 'none';
    });

    // Select all div elements with the class 'category'
    const categoryDivs = document.querySelectorAll('div.category');

    categoryDivs.forEach(categoryDiv => {
        // Find the div with the class 'category-name' within the current category div
        const categoryNameDiv = categoryDiv.querySelector('.category-name');

        // Check if the category-name div exists and its innerText
        if (categoryNameDiv) {
            const categoryText = categoryNameDiv.innerText || categoryNameDiv.textContent;

            // Hide the entire category div if it does not contain 'City-Fitt' or 'Főételek'
            // or if it contains 'kis adag'
            if ((!categoryText.includes('City-Fitt') && 
                 !categoryText.includes('Főételek')) ||
                 categoryText.includes('kis adag')) {
                categoryDiv.style.display = 'none';
            } else {
                // If the category div is not hidden, collect food containers
                const foodContainers = categoryDiv.querySelectorAll('.food');
                foodContainers.forEach((foodContainer, index) => {
                    const day = daysOfWeek[index % 7]; // Assuming the index corresponds to the day
                    const nutsDiv = foodContainer.querySelector('.food-top-details');
                    const nuts = nutsDiv ? (nutsDiv.innerText || nutsDiv.textContent) : '';

                    // Extract numeric values from nuts using regex
                    const match = nuts.match(nutrientRegex);
                    const [ , kcal = '', szh = '', fh = '', zs = '' ] = match || [];

                    collectedFoods.push({
                        element: foodContainer,
                        day: day,
                        nuts: {
                            kcal: parseInt(kcal, 10),
                            szh: parseInt(szh, 10),
                            fh: parseInt(fh, 10),
                            zs: parseInt(zs, 10)
                        },
                        details: nutsDiv // Add the details property
                    });
                });
            }
        } else {
            // If there's no category-name div, hide the category div as well
            categoryDiv.style.display = 'none';
        }
    });

    // Group by day
    const groupedByDay = collectedFoods.reduce((acc, food) => {
        if (!acc[food.day]) {
            acc[food.day] = [];
        }
        acc[food.day].push(food);
        return acc;
    }, {});

    // Rank food items within each day based on each nutrient property
    Object.keys(groupedByDay).forEach(day => {
        const foods = groupedByDay[day];

        // Initialize ranks for each food
        foods.forEach(food => {
            food.ranks = {
                kcal: null,
                szh: null,
                fh: null,
                zs: null
            };
        });

        // Function to rank a list of foods based on a property
        const rankByProperty = (property, isAscending) => {
            foods.sort((a, b) => isAscending ? a.nuts[property] - b.nuts[property] : b.nuts[property] - a.nuts[property]);
            foods.forEach((food, index) => {
                food.ranks[property] = index + 1;
            });
        };

        // Rank properties according to their specific criteria
        rankByProperty('kcal', true); // Lower kcal is better
        rankByProperty('szh', true);  // Lower szh is better
        rankByProperty('fh', false);  // Higher fh is better
        rankByProperty('zs', true);   // Lower zs is better

        foods.forEach(food => {
            if (food.details) {
                // Update the details text with ranks, formatting as specified
                const detailsText = food.details.innerText || food.details.textContent;
                food.details.innerHTML = detailsText.replace(rankRegex, (match, offset) => {
                    const numericValue = parseInt(match, 10);
                    const isTop3 = (property) => food.ranks[property] <= 3;
                    const isTop5 = (property) => food.ranks[property] <= 5;
                    const index = Array.from(detailsText.matchAll(rankRegex)).findIndex(m => m[0] === match);

                    let rank = '';
                    let color = '';
                    let isBold = false;

                    switch (index) {
                        case 0:
                            rank = `(${food.ranks.kcal}) `;
                            break;
                        case 1:
                            rank = `(${food.ranks.szh}) `;
                            color = isTop3('szh') ? 'green' : '';
                            isBold = true;
                            break;
                        case 2:
                            rank = `(${food.ranks.fh}) `;
                            color = isTop3('fh') ? 'green' : '';
                            isBold = true;
                            break;
                        case 3:
                            rank = `(${food.ranks.zs}) `;
                            break;
                        default:
                            break;
                    }

                    const formattedRank = isBold ? `<b>${rank}</b>` : rank;
                    const styledRank = color ? `<span style="color: ${color};">${formattedRank}</span>` : formattedRank;

                    return `${styledRank}${match}`;
                });

                // Add a border to food containers based on the ranking criteria
                const szhInTop5 = food.ranks.szh && food.ranks.szh <= 5;
                const fhInTop5 = food.ranks.fh && food.ranks.fh <= 5;

                if (food.ranks.szh <= 3 && food.ranks.fh <= 3) {
                    // Both szh and fh in top 3
                    food.element.style.border = '2px solid green';
                } else if (szhInTop5 && fhInTop5) {
                    // Both szh and fh in top 5, but not both in top 3
                    food.element.style.border = '2px solid blue';
                }
            }
        });
    });

    // Return the collected and ranked food objects
    return collectedFoods;
}

// Directly invoke the function
const foodData = hideUnwantedElementsAndCollectFood();
console.log(foodData); // Log the array of food objects to the console

    })();
