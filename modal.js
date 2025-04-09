function initializeModal() {
  // Array to store cart items
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Function to get card details
  function getCardDetails(card) {
    const title = card.find('.h3-title').text();
    const type = card.find('.dish-info li:first-child b').text();
    const persons = card.find('.dish-info li:last-child b').text();
    const price = card.find('.dist-bottom-row ul li:first-child b').text();
    const image = card.find('.dist-img img').attr('src');
    const rating = card.find('.dish-rating').text().trim();
    const stock = parseInt(card.find('.dish-info li:last-child b').text(), 10);
    const quantity = 1; // Default quantity is 1 when added to cart
    return { title, type, persons, price, image, rating, stock, quantity };
  }

  // Function to map cart items to modal
  function mapCartItemsToModal() {
    const modalBody = $('#cartModalCenter .modal-body');
    modalBody.empty(); // Ensure the modal body is cleared before mapping items

    if (cartItems.length === 0) {
      const emptyCartContent = `
        <div class="empty-cart-content mx-auto d-flex align-items-center justify-content-center"
            style="min-height: 380px;" data-dismiss="modal"
            data-target="#checkoutModalCenter">
            <div class="text-center">
              <p class="" style="font-size: 50px;"><i class="uil uil-shopping-bag"></i></p>
              <p><b>Your cart is empty</b></p>
              <p>Add products while you shop, so they'll be ready for checkout later.</p>
              <div class="">
                <button class="sec-btn">Continue Shopping</button>
              </div>
            </div>
          </div>
      `;
      modalBody.append(emptyCartContent);
      $('.sec-btn[data-target="#checkoutModalCenter"]').prop('disabled', true);
    } else {
      $('.sec-btn[data-target="#checkoutModalCenter"]').prop('disabled', false);
    }

    cartItems.forEach((item, index) => {
      const productCard = `
        <div class="product-card d-flex align-items-start gap-2 mb-5" data-index="${index}">
          <div class="d-flex align-items-center cart-item-image">
            <img src="${item.image}" alt="Product" class="product-img me-2">
          </div>
          <div class="pt-3 flex-grow-1 d-flex flex-column justify-content-between h-full cart-item-content">
            <div>
              <h6 class="mb-3 h5">${item.title}</h6>
              <div class="d-flex align-items-center gap-5">
                <span class="h3 mb-0 text-primary fw-bold">${item.price}</span>
                <div class="dish-rating mb-0">
                  ${item.rating}
                  <i class="uil uil-star"></i>
                </div>
              </div>
              <div>
                <ul>
                  <li class="d-flex gap-2 mb-0">
                    <p class="mb-0">Type:</p>
                    <p class="mb-0 fw-bold">${item.type}</p>
                  </li>
                  <li class="d-flex gap-2">
                    <p class="mb-0">Persons:</p>
                    <p class="mb-0 fw-bold">${item.persons}</p>
                  </li>
                  <li class="d-flex gap-2">
                    <p class="mb-0">Quantity:</p>
                    <p class="mb-0 fw-bold">${item.quantity}</p>
                  </li>
                  <li class="d-flex gap-2">
                    <p class="mb-0">Stock:</p>
                    <p class="mb-0 fw-bold">${item.stock}</p>
                  </li>
                </ul>
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between mt-3 self-content-end flex-grow-1">
              <div class="cart-btn d-flex gap-2">
                <a href="#" class="wishlist-btn"><i class="uil uil-heart"></i></a>
                <a href="javascript:void(0)" class="delete-btn"><i class="uil uil-trash-alt"></i></a>
              </div>
              <ul>
                <li class='btn btn-group'>
                  <button class="increment-btn decrement">
                    <i class="uil uil-minus"></i>
                  </button>
                  <input type="number" class="quantity-input mx-2 text-center" value="${item.quantity}" min="1" style="border: none; outline: none; width: 40px;">
                  <button class="increment-btn increment">
                    <i class="uil uil-plus"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      `;
      modalBody.append(productCard);
    });

    // Add event listener for delete buttons using event delegation
    modalBody.off('click', '.delete-btn').on('click', '.delete-btn', function () {
      const index = $(this).closest('.product-card').data('index');
      const item = cartItems[index];
      cartItems.splice(index, 1);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      mapCartItemsToModal();
      updateCartNumber();
      updateStockInCards(item.title, item.quantity); // Increase stock by the quantity of the deleted item
      showNotification('info', `${item.title} removed from cart`);
    });

    // Add event listener for quantity input changes
    modalBody.off('input', '.quantity-input').on('input', '.quantity-input', function () {
      const index = $(this).closest('.product-card').data('index');
      const newQuantity = parseInt($(this).val(), 10);
      if (isNaN(newQuantity) || newQuantity < 1 || newQuantity > cartItems[index].stock) {
        $(this).val(cartItems[index].quantity);
      } else {
        const difference = newQuantity - cartItems[index].quantity;
        cartItems[index].quantity = newQuantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateStockInCards(cartItems[index].title, -difference);
        mapCartItemsToModal();
      }
    });

    // Add event listener for increment buttons
    modalBody.off('click', '.increment').on('click', '.increment', function () {
      const input = $(this).siblings('.quantity-input');
      const index = $(this).closest('.product-card').data('index');
      let currentQuantity = parseInt(input.val(), 10);
      if (!isNaN(currentQuantity) && currentQuantity < cartItems[index].stock) {
        input.val(currentQuantity + 1);
        cartItems[index].quantity = currentQuantity + 1;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateStockInCards(cartItems[index].title, -1);
        mapCartItemsToModal();
      }
    });

    // Add event listener for decrement buttons
    modalBody.off('click', '.decrement').on('click', '.decrement', function () {
      const input = $(this).siblings('.quantity-input');
      const index = $(this).closest('.product-card').data('index');
      let currentQuantity = parseInt(input.val(), 10);
      if (!isNaN(currentQuantity) && currentQuantity > 1) {
        input.val(currentQuantity - 1);
        cartItems[index].quantity = currentQuantity - 1;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateStockInCards(cartItems[index].title, 1);
        mapCartItemsToModal();
      }
    });
  }

  // Function to update cart number
  function updateCartNumber() {
    const cartNumber = $('.header-cart .cart-number');
    cartNumber.text(cartItems.length);
    if (cartItems.length === 0) {
      cartNumber.hide();
    } else {
      cartNumber.show();
    }
  }

  // Function to update stock in cards
  function updateStockInCards(title, change) {
    const card = $(`.dish-box:contains(${title})`);
    const stockElement = card.find('.dish-info li:last-child b');
    const currentStock = parseInt(stockElement.text(), 10);
    stockElement.text(currentStock + change);
  }

  function showNotification(type, message) {
    const icons = {
      success: 'uil uil-check',
      warning: 'uil uil-exclamation',
      error: 'uil uil-times',
      info: 'uil uil-info'
    };

    const notification = $(`
      <div class="notify-content notify-${type}">
      <div>
        <div class="notification-icon">
            <i class="${icons[type]}"></i>
        </div>
      </div>
      <div>
        <p>${message}</p>
      </div>
    </div>
    `);

    $('.notifications').append(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.fadeOut(300, function () {
        $(this).remove();
      });
    }, 3000);
  }


  // Event listener for dish-add-btn
  $('.dish-add-btn').on('click', function () {
    const card = $(this).closest('.dish-box');
    const stockElement = card.find('.dish-info li:last-child b');
    const stock = parseInt(stockElement.text(), 10);

    if (stock < 1) {
      showNotification('error', 'Out of stock');
      return;
    }

    const details = getCardDetails(card);
    const existingItemIndex = cartItems.findIndex(item => item.title === details.title);

    if (existingItemIndex !== -1) {
      showNotification('warning', 'Item is already in the cart');
      return;
    }

    cartItems.push(details);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    mapCartItemsToModal();
    updateCartNumber();
    updateStockInCards(details.title, -1); // Decrease stock by 1

    showNotification('success', `${details.title} added to cart`);
  });

  // Event listener for "Proceed to Checkout" button in the checkout modal
  $('#checkoutModalCenter .footer-btns .sec-btn:last-child').on('click', function () {
    showNotification('success', 'Your order has been placed successfully!');
    cartItems = []; // Clear the cart items
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update localStorage
    mapCartItemsToModal(); // Refresh the cart modal
    updateCartNumber(); // Update the cart number in the header
  });

  // Initial setup
  mapCartItemsToModal();
  updateCartNumber();
}
