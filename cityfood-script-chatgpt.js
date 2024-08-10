function hideUnwantedDivsAndModifyText() {
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

        if (categoryNameDiv) {
            let categoryText = categoryNameDiv.innerText || categoryNameDiv.textContent;
            
            // Replace 'Főétel' with 'Főételek'
            if (categoryText.includes('Főétel')) {
                categoryNameDiv.innerText = categoryText.replace('Főétel', 'Főételek');
            }
            
            // If the category-name does not contain 'Főételek' or 'City-Fitt', hide the container
            if (!categoryText.includes('Főételek') && !categoryText.includes('City-Fitt')) {
                container.style.display = 'none';
            }
        }
    });
}

// Run the function after the content is loaded
window.addEventListener('load', hideUnwantedDivsAndModifyText);
