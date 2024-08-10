function hideUnwantedElementsAndCollectFood() {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const collectedFoods = [];

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
                    collectedFoods.push({
                        element: foodContainer,
                        day: day,
                        nuts: nuts
                    });
                });
            }
        } else {
            // If there's no category-name div, hide the category div as well
            categoryDiv.style.display = 'none';
        }
    });

    // Return the collected food objects
    return collectedFoods;
}

// Run the function after the content is loaded and log the collected food objects
window.addEventListener('load', () => {
    const foodData = hideUnwantedElementsAndCollectFood();
    console.log(foodData); // Log the array of food objects to the console
});
