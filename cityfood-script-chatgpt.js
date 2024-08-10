function hideUnwantedElements() {
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
            }
        } else {
            // If there's no category-name div, hide the category div as well
            categoryDiv.style.display = 'none';
        }
    });
}

// Run the function after the content is loaded
window.addEventListener('load', hideUnwantedElements);
