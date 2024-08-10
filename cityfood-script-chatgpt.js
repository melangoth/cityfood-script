function hideUnwantedElementsAndCollectFood() {
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
        const rankByProperty = (property) => {
            foods.sort((a, b) => b.nuts[property] - a.nuts[property]);
            foods.forEach((food, index) => {
                food.ranks[property] = index + 1;
            });
        };

        rankByProperty('kcal');
        rankByProperty('szh');
        rankByProperty('fh');
        rankByProperty('zs');

        foods.forEach(food => {
            if (food.details) {
                // Update the details text with ranks
                const detailsText = food.details.innerText || food.details.textContent;
                food.details.innerHTML = detailsText.replace(rankRegex, (match) => {
                    const numericValue = parseInt(match, 10);
                    let rank = '';
                    
                    if (numericValue === food.nuts.kcal) {
                        rank = `(${food.ranks.kcal}) `;
                    } else if (numericValue === food.nuts.szh) {
                        rank = `(${food.ranks.szh}) `;
                    } else if (numericValue === food.nuts.fh) {
                        rank = `(${food.ranks.fh}) `;
                    } else if (numericValue === food.nuts.zs) {
                        rank = `(${food.ranks.zs}) `;
                    }
                    
                    return `${rank}${match}`;
                });
            }
        });
    });

    // Return the collected and ranked food objects
    return collectedFoods;
}

// Directly invoke the function
const foodData = hideUnwantedElementsAndCollectFood();
console.log(foodData); // Log the array of food objects to the console
