function hideUnwantedDivs() {
    // Hide all divs with the class 'banner'
    const banners = document.querySelectorAll('div.banner');
    banners.forEach(banner => {
        banner.style.display = 'none';
    });

    // Select all div elements that might contain a category name
    const categoryContainers = document.querySelectorAll('div');

    categoryContainers.forEach(container => {
        // Find the category-name div within the container
        const categoryNameDiv = container.querySelector('.category-name');

        // If the category-name div exists, check its text content
        if (categoryNameDiv) {
            const categoryText = categoryNameDiv.innerText || categoryNameDiv.textContent;

            // If the category-name does not contain 'Főételek' or 'City-Fitt', hide the container
            if (!categoryText.includes('Főételek') && !categoryText.includes('City-Fitt')) {
                container.style.display = 'none';
            }
        }
    });
}

// Run the function after the content is loaded
window.addEventListener('load', hideUnwantedDivs);
