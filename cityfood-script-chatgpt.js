function hideUnwantedElementsAndCollectFood() {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const collectedFoods = [];
    const nutrientRegex = /(\d+)\D*(\d+)\D*(\d+)\D*(\d+)/; // Regex to match four numeric values

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
                    const nuts = nutsDiv ? nutsDiv.innerText || nutsDiv.textContent : '';

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

    // Group by day and rank food items
    const groupedByDay = collectedFoods.reduce((acc, food) => {
        if (!acc[food.day]) {
            acc[food.day] = [];
        }
        acc[food.day].push(food);
        return acc;
    }, {});

    Object.keys(groupedByDay).forEach(day => {
        const foods = groupedByDay[day];
        
        // Rank food items based on their nutrient values
        foods.sort((a, b) => {
            // Custom sorting function: higher values are ranked higher
            return (b.nuts.kcal - a.nuts.kcal) ||
                   (b.nuts.szh - a.nuts.szh) ||
                   (b.nuts.fh - a.nuts.fh) ||
                   (b.nuts.zs - a.nuts.zs);
        });

        foods.forEach((food, index) => {
            // Rank is 1-based index
            food.ranks = {
                kcal: index + 1,
                szh: index + 1,
                fh: index + 1,
                zs: index + 1
            };
        });
    });

    // Return the collected and ranked food objects
    return collectedFoods;
}

// Run the function after the content is loaded and log the collected food objects
window.addEventListener('load', () => {
    const foodData = hideUnwantedElementsAndCollectFood();
    console.log(foodData); // Log the array of food objects to the console
});
