// Client facing scripts here
$(() => {

  // Creates the food item DOM elements
  const createFoodElement = function(foodObj) {
    const $food = $(`
    <div id="${foodObj.id}" class="item-border">
      <img src="${foodObj.image_url}" alt="food item" width="200px" height="200px">
      <div class="food-details">
        <p id="food-name">${foodObj.name}</p>
        <p id="food-description">${foodObj.description}</p>
        <p id="price-total"><strong>$${foodObj.price / 100}</strong></p>
      </div>
      <div class="quantity-border">
      </div>
    </div>`);
    return $food;
  };

  // Display food itms in cart
  const createCartElement = function(cartObj, id) {
    const item = cartObj.foodDataItem;
    const quantity = cartObj.quantity;
    const $cartItem = $(`
    <div id="${id}" class="cart-item">
      <span class="itemQuantity">${quantity}</span>
      <div class="item-details">
        <div class="item-name"><strong>${item.name}</strong></div>
        <div class="item-description">${item.description}</div>
      </div>
      <span class="price-total">$</span>
    </div>`);

    return $cartItem;
  };

  // Creates a new order with the cart items
  const orderButtonEvent = () => {
    // Order now event
    $('#order-button').on('click', function(event) {
      let flag = false;
      for (const cartItem in cartObject) {
        if (cartObject[cartItem].quantity > 0) {
          flag = true;
          break;
        }
      }
      if (flag) {
        $.ajax({
          method: 'POST',
          url: '/order',
          data: {cartItems : cartObject}
        })
          .then((res) => {

            $('#order-btn-display').empty();
            $('.quantity-border').remove();
            $('#order-btn-display').append($(`<p id='order-button'>Your order has been placed!<p>`));

          // Redirects to the orderid page
          // window.location.href = `/order?orderId=${res["orderId"]}`
          });
      } else {
        const emptyCartOrder = "Please enter items for the order";
        $("#orderError").slideUp();
        $("#orderError").text(emptyCartOrder);
        $("#orderError").slideDown();
      }
    });
  };

  // Creates a new food item
  const createFoodItem = () => {
    $('form').on('submit', function(event) {
      event.preventDefault();

      const queryString = $(this).serialize();
      const inputText = $(this).children("#image").val();
      inputText.onerror = function() {
        alert('Invalid image');
      };

      $.ajax('/menu/admin/add', { method: 'POST' , data:queryString})
        .then(() => {
          loadMenuItems();
        });
    });
  }

  // Increments the selected food item count
  const incrementItemCount = () => {
    // Increments the displayed quantity and cart item quantity
    $('.add').on('click', function() {
      const foodParentId = $(this).closest('div').parent();
      const foodId = foodParentId.attr('id');
      const $foodQuantity = foodParentId.find(".quantity");

      const $cartList = $('#cartItem');
      // Check if item has been added to cart already

      if (cartObject[foodId].quantity === 0) {
        cartObject[foodId].quantity = 1;

        $foodQuantity.text(cartObject[foodId].quantity);

        // Add item to cart listcartObject[1].foodDataItem
        const $cartFoodItem = createCartElement(cartObject[foodId], foodId);
        $cartList.prepend($cartFoodItem);

        const $itemPriceTotal = $cartList.find(`#${foodId}`).find(".price-total");
        const totalPrice = cartObject[foodId].foodDataItem.price;
        $itemPriceTotal.text("$" + (totalPrice / 100).toFixed(2));
      } else {
        cartObject[foodId].quantity++;
        const $itemQuantity = $cartList.find(`#${foodId}`).find(".itemQuantity");
        const $itemPriceTotal = $cartList.find(`#${foodId}`).find(".price-total");

        $foodQuantity.text(cartObject[foodId].quantity);
        $itemQuantity.text(parseInt($itemQuantity.text()) + 1);
        const totalPrice = cartObject[foodId].foodDataItem.price;
        $itemPriceTotal.text("$" + ((totalPrice / 100) * Number($itemQuantity.text())).toFixed(2));
      }
    });
  }

  // Decrements the selected food item count
  const decrementItemCount = () => {
    // Decrements the displayed quantity and cart item quantity
    $('.subtract').on('click', function() {
      const foodParentId = $(this).closest('div').parent();
      const foodId = foodParentId.attr('id');
      const $foodQuantity = foodParentId.find(".quantity");

      const $cartList = $('#cartItem');
      // Decrements quantity for current item
      if (cartObject[foodId].quantity > 0) {
        cartObject[foodId].quantity--;
        $foodQuantity.text(cartObject[foodId].quantity);

        const $itemQuantity = $cartList.find(`#${foodId}`).find(".itemQuantity");
        $itemQuantity.text(parseInt($itemQuantity.text()) - 1);

        // Decrement price
        const $itemPriceTotal = $cartList.find(`#${foodId}`).find(".price-total");
        const totalPrice = response.foods[foodId - 1].price;
        $itemPriceTotal.text("$" + ((totalPrice / 100) * parseInt($itemQuantity.text())).toFixed(2));

        // Removes DOM element from cart if number is 0
        if (cartObject[foodId].quantity === 0) {
          $cartList.find(`#${foodId}`).remove();
        }
      } else {
        console.log("Error: Negative quantity number is not possible");
      }
    });
  };

  // Toggle food item visibility for users
  const toggleItemVisibility = () => {
    $('.toggleItem').on('click', function(event) {
      const item = $(this).closest('.item-border');
      const itemId = item.attr('id');

      $.ajax({
        method: 'POST',
        url: `/menu/admin/${itemId}/edit`
      })
        .then((toggleResult) => {
          if (toggleResult.toggle.toggle === 'off') {
            $(this).text("Toggle off");
          } else {
            $(this).text("Toggle on");

          }
        });
    });
  };

  let cartObject = {};

  // Adds all the food items to homepage
  const loadMenuItems = function() {
    $.ajax({
      method: 'GET',
      url: '/api/users/food'
    })
      .then((response) => {
        const $foodsList = $('.menu-items');
        $foodsList.empty();

        const bodyId = $("body").attr('id');

        for (const foodDataItem of response.foods) {
          if (foodDataItem.toggle !== 'on') {
            cartObject[foodDataItem.id] = {foodDataItem, quantity: 0};
            const $foodItem = createFoodElement(foodDataItem);
            $foodsList.append($foodItem);

            // Adds toggle food on/off button to each item on admin homepage
            if (bodyId === "admin") {
              const toggleStatus = foodDataItem.toggle;
              const toggleButton = $(`<button class="toggleItem">Toggle ${toggleStatus}</button>`);
              $('#' + foodDataItem.id).find(".quantity-border").append(toggleButton);
            }

          } else if (bodyId === "admin") {
            cartObject[foodDataItem.id] = {foodDataItem, quantity: 0};
            const $foodItem = createFoodElement(foodDataItem);
            $foodsList.append($foodItem);

            // Adds toggle food on/off button to each item on admin homepage
            if (bodyId === "admin") {
              const toggleStatus = foodDataItem.toggle;
              const toggleButton = $(`<button class="toggleItem">Toggle ${toggleStatus}</button>`);
              $('#' + foodDataItem.id).find(".quantity-border").append(toggleButton);
            }
          }

        }

        const toggleFoodButton = $(".quantity-border");

        if (bodyId === "customer") {
          const quantityButton = $(`
      <button class="subtract">-</button>
      <p class="quantity">0</p>
      <button class="add">+</button>
      `);
          toggleFoodButton.append(quantityButton);
        }

        incrementItemCount();
        decrementItemCount();
        toggleItemVisibility();

      });
  };

  loadMenuItems();
  orderButtonEvent();
  createFoodItem();

});
