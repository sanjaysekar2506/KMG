(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow');
            } else {
                $('.fixed-top').removeClass('bg-white shadow');
            }
        } else {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow').css('top', -45);
            } else {
                $('.fixed-top').removeClass('bg-white shadow').css('top', 0);
            }
        }
    });


    // Back to top button
    // $(window).scroll(function () {
    //     if ($(this).scrollTop() > 300) {
    //         $('.back-to-top').fadeIn('slow');
    //     } else {
    //         $('.back-to-top').fadeOut('slow');
    //     }
    // });
    // $('.back-to-top').click(function () {
    //     $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    //     return false;
    // });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });


    // Admin Modal
    const adminIcon = document.querySelector('.admin-icon');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.querySelector('.modal-content .close');
    const loginForm = document.getElementById('adminLoginForm');
    const errorMsg = document.getElementById('error-msg');

    // Show modal on admin icon click
    adminIcon.addEventListener('click', () => {
        adminModal.style.display = 'flex';
    });

    // Close modal on "X" click
    closeModal.addEventListener('click', () => {
        adminModal.style.display = 'none';
    });

    // Close modal on outside click
    window.addEventListener('click', (event) => {
        if (event.target === adminModal) {
            adminModal.style.display = 'none';
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form from submitting

        // Get username and password values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Check credentials
        if (username === 'admin' && password === '12345') {
            // Redirect to adminpage.js
            window.location.href = 'admin.html';
        } else {
            // Show error message
            errorMsg.style.display = 'block';
        }
    });

    const apiUrl = 'https://sbt-api.vercel.app'; // Make sure this is the correct API URL

    // Function to render the products dynamically based on the category selected
    function renderProducts(products) {
        const productsContainer = document.getElementById('productsContainer');
        productsContainer.innerHTML = ''; // Clear previous content
    
        if (products.length === 0) {
            productsContainer.innerHTML = '<p>No products available in this category.</p>';
            return;
        }
    
        products.forEach(product => {
            const productCard = `
                <div class="col-lg-4 col-md-6">
                    <div class="product-item position-relative bg-light overflow-hidden h-100 shadow-sm">
                        <!-- Product Image -->
                        <img class="img-fluid w-100" src="${product.imageUrl}" alt="${product.name}" style="height: 150px; object-fit: cover;">
                        
                        <!-- Product Details -->
                        <div class="text-center p-4">
                            <!-- Product Name -->
                            <h5 class="fw-bold mb-2">${product.name}</h5>
                            
                            <!-- Product Description -->
                            <p class="mb-2 text-muted">${product.description || 'No description available'}</p>
                            
                            <!-- Product Price -->
                            <span class="text-primary fw-bold">Rs. ${product.price}</span>
                        </div>
                        
                        <!-- Add to Cart Button -->
                        <div class="d-flex border-top">
    <small class="w-100 text-center py-2">
        <button class="text-body w-100 btn" data-product-id="${product.id}" style="background-color: brown; color: white;">
            <i class="fa fa-shopping-bag text-white me-2"></i>Add to Cart
        </button>
    </small>
</div>

                    </div>
                </div>
            `;
            productsContainer.innerHTML += productCard;
        });
    
    
       

        // for popup
        // Function to show popup notification
    function showPopup(message) {
        // Create popup element
        const popup = document.createElement('div');
        popup.classList.add('popup-notification');
        popup.textContent = message;

        // Append to body
        document.body.appendChild(popup);

        // Show the popup
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);

        // Hide the popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 500);
        }, 3000);
    }

    // Add event listeners to all "Add to Cart" buttons
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('add-to-cart-btn')) {
            showPopup("This item has been added to the cart!");
        }
    });

        // Add event listener to handle "Add to Cart" click
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                // Implement the logic to add the product to the cart here
                console.log(`Product with ID ${productId} added to cart.`);
            });
        });
    }
   
    // Initialize cart count from localStorage (if it exists)
let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;

// Update the cart count display in the navbar
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount; // Update the cart count
    }
}

// Function to render the products dynamically based on the category selected
function renderProducts(products) {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = ''; // Clear previous content

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products available in this category.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = `
            <div class="col-lg-3 col-md-6">
                <div class="product-item position-relative bg-light overflow-hidden h-100 shadow-sm">
                    <img class="img-fluid w-100" src="${product.imageUrl}" alt="${product.name}" style="height: 200px; object-fit: cover;">
                    <div class="text-center p-4">
                        <h5 class="fw-bold mb-1">${product.name}</h5>
                        <p class="text-muted mb-1">${product.description ? product.description : 'No description available'}</p>
                        <span class="text-align fw-bold" style="color:#a45430;">Rs.${product.price}</span>
                         <div class="d-flex border-top">
                        <small class="w-100 text-center py-2" >
                            <button class="text-white w-100 btn btn- add-to-cart-btn" data-product-id="${product.id}"  style="background-color:#a45430; margin-bottom:-20px">
                                <i class="fa fa-shopping-bag text-white me-2" ></i>Add to cart
                            </button>
                        </small>
                    </div>
                    </div>
                   
                </div>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });
    

            
    // Add event listener to handle "Add to Cart" click
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');

            // Get the cart from localStorage or initialize it
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Check if the product is already in the cart
            // if (cart.includes(productId)) {
            //     alert('This product is already in your cart!');
            // } else {
            //     // Add the product to the cart
            //     cart.push(productId);
            //     localStorage.setItem('cart', JSON.stringify(cart));

            //     // Increase the cart count and update the navbar
            //     cartCount++;
            //     localStorage.setItem('cartCount', cartCount);
            //     updateCartCount();
            // }
        });
    });
}

// Initialize the cart count display when the page loads
updateCartCount();

// Select the container where products are listed
const productsContainer = document.querySelector("#productsContainer");

// Function to show a popup
function showPopup(message) {
    // Create a popup element
    const popup = document.createElement("div");
    popup.innerText = message;
    popup.className = "cart-popup";

    // Append to body
    document.body.appendChild(popup);

    // Set a timeout to remove the popup after 3 seconds
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

// Add an event listener to the products container
productsContainer.addEventListener("click", (event) => {
    // Check if the clicked element is an "Add to Cart" button
    if (event.target.classList.contains("add-to-cart-btn")) {
        const productId = event.target.getAttribute("data-product-id");

        // Show the popup
        showPopup("This item added to cart, check cart");

        // Additional logic for handling the cart can be added here
        console.log(`Product with ID ${productId} added to cart.`);
    }
});

// CSS for the popup
const style = document.createElement("style");
style.innerHTML = `
    .cart-popup {
        position: fixed;
        bottom: 50px;
        right: 90px;
        background-color:rgb(223, 14, 14);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-size: 18px;
        z-index: 1000;
        animation: fadeInOut 3s ease forwards;
    }

    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(10px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(10px); }
    }

/* Media query for mobile view */
@media (max-width: 768px) {
    .cart-popup {
        top: 20px; /* Position it at the top */
        left: 50%; /* Center horizontally */
        transform: translateX(-50%); /* Adjust for horizontal centering */
        bottom: auto; /* Remove the bottom position */
        right: auto; /* Remove the right position */
    }
}

@keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(10px); }
}
`;
document.head.appendChild(style);


    // ========================================================================



    // Update the cart count display in the navbar
    // function updateCartCount() {
    //     const cartCountElement = document.querySelector('.fa-shopping-bag');
    //     if (cartCountElement) {
    //         cartCountElement.innerHTML = `<small>${cartCount}</small>`; // Display the count inside the icon
    //     }
    // }

    // ================================================================

    




    // Initialize the cart count display when the page loads
    updateCartCount();


    // Function to fetch categories from the server
    function fetchCategories() {
        $.ajax({
            url: `${apiUrl}/addcategories`, // Ensure this endpoint is correct
            method: 'GET',
            success: function (categories) {
                console.log('Categories fetched:', categories); // Log categories
                createCategoryButtons(categories);
                // Initially display all products
                fetchProducts(); // Fetch all products first
            },
            error: function (error) {
                console.error('Failed to fetch categories:', error);
                alert('Failed to load categories');
            }
        });
    }

    // Function to create category buttons dynamically
   function createCategoryButtons(categories) {
        const categoryButtonsContainer = document.getElementById('categoryButtonsContainer');
        categoryButtonsContainer.innerHTML = ''; // Clear existing buttons

        // Add a default "All Products" button to show all products
        const allProductsButton = `
            <li class="nav-item me-2">
                <a class="btn btn-outline border-2 active" href="javascript:void(0);" onclick="filterByCategory('')" style="background-color:#bc7348; color: white;"  >All Products</a>
            </li>
        `;
        categoryButtonsContainer.innerHTML += allProductsButton;

        // Loop through categories and create a button for each category
        categories.forEach(category => {
            const button = `
                <li class="nav-item me-2">
                    <a class="btn btn-outline- border-2" href="javascript:void(0);" onclick="filterByCategory('${category._id}')"  style="background-color:#bc7348; color: white;">${category.name}</a>
                </li>
            `;
            categoryButtonsContainer.innerHTML += button;
        });
    }

    // Function to fetch products based on the selected category (or all if no category)
    function fetchProducts(categoryId = '') {
        let url = `${apiUrl}/products`; // Your endpoint for products

        // If categoryId is provided, add it as a query parameter
        if (categoryId) {
            url += `?category=${categoryId}`;
        }

        $.ajax({
            url: url,
            method: 'GET',
            success: function (products) {
                console.log('Products fetched:', products); // Log products
                renderProducts(products); // Call render function to display the products
            },
            error: function (error) {
                console.error('Failed to fetch products:', error);
                alert('Failed to load products');
            }
        });
    }

    // Function to filter products by category
    window.filterByCategory = function filterByCategory(categoryId) {
        // Remove the 'active' class from all buttons
        document.querySelectorAll('#categoryButtonsContainer .btn').forEach(button => {
            button.classList.remove('active');
        });

        // Add the 'active' class to the clicked button
        const activeButton = document.querySelector(`a[onclick="filterByCategory('${categoryId}')"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Fetch products based on categoryId
        fetchProducts(categoryId);
    }

    // Fetch categories when the page loads
    $(document).ready(function () {
        fetchCategories();
    });


})(jQuery);

// JavaScript for sliding cart functionality
document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const cartIcon = document.querySelector(".fa-shopping-bag");
    const cartSidebar = document.querySelector("#cartSidebar");
    const closeButton = document.querySelector("#closeCart");

    // Open Cart Sidebar
    cartIcon.addEventListener("click", () => {
        cartSidebar.style.transform = "translateX(0)";
        updateCartSidebar(); // Update sidebar details when opening
    });
 
    // Close Cart Sidebar
    closeButton.addEventListener("click", () => {
        cartSidebar.style.transform = "translateX(100%)";
    });

    updateCartCount();
});

// Global cart array to store items
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;

// Function to update the cart sidebar
function updateCartSidebar() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cartTotal');

    // Clear current cart items
    cartItemsContainer.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const cartItem = `
            <div class="cart-item d-flex align-items-center mb-3">
                <img src="${item.image}" alt="${item.name}" class="img-thumbnail me-3" style="width: 70px; height: 70px; object-fit: cover;">
                <div class="cart-item-details">
                    <h5>${item.name}</h5>
                    <p>Price: ₹${item.price}</p>
                    <div class="quantity-controls d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${index}, -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="btn btn-sm btn-danger ms-auto" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItem;
    });

    // Update total
    cartTotalElement.textContent = `₹${total.toFixed(2)}`;

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update the cart count badge
function updateCartCount() {
    const cartCountBadge = document.getElementById('cartCount');
    cartCountBadge.textContent = cartCount;
    localStorage.setItem('cartCount', cartCount);
}

// Function to change item quantity
function changeQuantity(index, delta) {
    if (cart[index]) {
        cart[index].quantity += delta;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1); // Remove item if quantity is 0
        }

        cartCount = cart.reduce((acc, item) => acc + item.quantity, 0); // Update total count
        updateCartCount();
        updateCartSidebar();
    }
}

// Function to remove an item from the cart
function removeFromCart(index) {
    if (cart[index]) {
        cartCount -= cart[index].quantity;
        cart.splice(index, 1);

        updateCartCount();
        updateCartSidebar();
    }
}

// Add event listener for Add to Cart buttons
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
        const productElement = event.target.closest('.product-item');

        if (productElement) {
            const product = {
                name: productElement.querySelector('h5')?.textContent || "Unknown",
                price: parseFloat(productElement.querySelector('.text-align')?.textContent.replace('Rs.', '') || 0),
                image: productElement.querySelector('img')?.src || '',
                quantity: 1
            };

            const existingProductIndex = cart.findIndex(item => item.name === product.name);

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity++;
            } else {
                cart.push(product);
            }

            cartCount++;
            updateCartCount();
            updateCartSidebar();
        }
    }
});


// Initialize the cart count display
updateCartCount();
//for what's app 


document.getElementById('proceedToCheckout').addEventListener('click', () => {
    const phoneNumber = "916380944811"; // Include country code (e.g., 91 for India)
    let message = "Hello, I would like to order the following items:\n\n";

    // Ensure the cart array exists and has valid data
    if (!cart || cart.length === 0) {
        alert("Your cart is empty. Please add items to proceed.");
        return;
    }

    cart.forEach(item => {
        message += `🔹 *${item.name}*\n    Quantity: ${item.quantity}\n    Price: ₹${item.price}\n    Total: ₹${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `*Grand Total: ₹${totalAmount.toFixed(2)}*\n\n`;
    message += "Please confirm the order. Thank you!";

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;

    // Redirect to WhatsApp with the pre-filled message
    window.location.href = whatsappURL;
});



//for mail
// Add "Proceed to Checkout" button logic
// Add "Proceed to Checkout" button logic



// document.addEventListener("DOMContentLoaded", () => {
//     const checkoutButton = document.getElementById('proceedToCheckout');
//     const cartCountElement = document.getElementById('cartCount'); // Element showing the cart count
//     const cartItemsContainer = document.getElementById('cartItems'); // Container showing cart items

//     checkoutButton.addEventListener('click', () => {
//         // Clear the cart immediately when "Proceed to Checkout" is clicked
//         clearCart();

//         const emailBody = generateEmailBody();
//         const emailSubject = "Order Summary";
//         const recipientEmail = "sanjaycw24@gmail.com"; // Replace with your email

//         // Create a Gmail compose URL
//         const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

//         // Open Gmail compose window
//         window.open(gmailLink, '_blank');

//         // Show a popup message indicating the email attempt
//         setTimeout(() => {
//             const userConfirmed = confirm("If the Gmail compose window opened, your mail was successfully sent. Click 'OK' to confirm or 'Cancel' if not.");

//             if (userConfirmed) {
//                 alert("Mail not sent. Please try again.");
//             } else {
//                 alert("The mail was successfully sent.");
//             }
//         }, 100); // Adjust timeout as needed to ensure Gmail has opened
//     });

//     function clearCart() {
//         // Reset the cart count
//         const cartCountElement = document.getElementById('cartCount');
//         if (cartCountElement) {
//             cartCountElement.textContent = "0"; // Reset count to 0
//         }

//         // Clear cart items from the UI (Cart slider content removal)
//         const cartItemsContainer = document.querySelector('.cart-items'); 
//         if (cartItemsContainer) {
//             cartItemsContainer.innerHTML = 'cartItems'; // Remove all items from the DOM
//         }

//         const cartTotalElement = document.getElementById('cartTotal');
//         if (cartTotalElement) {
//             cartTotalElement.textContent = '₹0.00'; // Reset total to 0
//         }
        
//         // Remove cart data from local storage (if used to persist cart items)
//         localStorage.removeItem('cartItems'); // Adjust the key if needed
//         localStorage.removeItem('cart');
//         localStorage.removeItem('cartCount');
       
//         console.log("Cart has been permanently cleared.");
//     }
// });

// // Function to generate the email body from the cart
// function generateEmailBody() {
//     let emailBody = "Your Order Summary:\n\n";

//     if (cart.length === 0) {
//         emailBody += "Your cart is empty.\n\n";
//     } else {
//         cart.forEach((item, index) => {
//             emailBody += `${index + 1}. ${item.name}\n   Price: ₹${item.price}\n   Quantity: ${item.quantity}\n\n`;
//         });

//         const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//         emailBody += `Total: ₹${total.toFixed(2)}\n\n`;
//     }

//     emailBody += "Thank you for your order!\n\nRegards,\n[SRI BALAMURUGAN TRADERS]";
//     return emailBody;
// }


// Example HTML (add this to your existing HTML):
/*
<button id="proceedToCheckout" class="btn btn-primary">Proceed to Checkout</button>
*/

