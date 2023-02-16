// Client facing scripts here
$(() => {

  let cartObject = {};
  // Creates the food item DOM element
  const createFoodElement = function(foodObj) {
    const $food = $(`
    <div id="${foodObj.id}" class="item-border">
      <img src="${foodObj.image_url}" alt="food item" width="200px" height="200px">
      <div class="food-details">
        <p id="food-name">${foodObj.name}</p>
        <p id="food-description">${foodObj.description}</p>
        <p id="price-total"><strong>$${foodObj.price/100}</strong></p>
      </div>
      <div class="quantity-border">
      </div>
    </div>`);
    return $food;
  }

  const createCartElement = function(cartObj, id) {
    const item = cartObj.foodDataItem;
    const quantity = cartObj.quantity;
    const $cartItem = $(`
    <div id="${id}" class="cart-item">
      <p class="itemQuantity">${quantity}</p>
      <div class="item-details">
        <div class="item-name"><strong>${item.name}</strong></div>
        <div class="item-description">${item.description}</div>
      </div>
      <p class="price-total">$</p>
    </div>`);

    return $cartItem;
  }

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

    // response: {foods:..., prototype:...}
    for(const foodDataItem of response.foods) {
      if (foodDataItem.toggle !== 'on') {
        cartObject[foodDataItem.id] = {foodDataItem, quantity: 0};
        const $foodItem = createFoodElement(foodDataItem);
        $foodsList.append($foodItem);

        // Adds toggle food on/off button to each item on admin homepage
        if (bodyId === "admin") {
          const toggleStatus = foodDataItem.toggle
          const toggleButton = $(`<button class="toggleItem">Toggle ${toggleStatus}</button>`);
          $('#' + foodDataItem.id).find(".quantity-border").append(toggleButton);
        }

      } else if (bodyId === "admin") {
        console.log("foodDataItem", foodDataItem)
        cartObject[foodDataItem.id] = {foodDataItem, quantity: 0};
        const $foodItem = createFoodElement(foodDataItem);
        $foodsList.append($foodItem);

        // Adds toggle food on/off button to each item on admin homepage
        if (bodyId === "admin") {
          const toggleStatus = foodDataItem.toggle
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



    // Increments the displayed quantity and cart item quantity
    $('.add').on('click', function () {
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
        $itemPriceTotal.text("Total Price: $" + (totalPrice / 100).toFixed(2))
      } else {
        cartObject[foodId].quantity++;
        const $itemQuantity = $cartList.find(`#${foodId}`).find(".itemQuantity");
        const $itemPriceTotal = $cartList.find(`#${foodId}`).find(".price-total");

        $foodQuantity.text(cartObject[foodId].quantity);
        $itemQuantity.text(parseInt($itemQuantity.text()) + 1);
        const totalPrice = cartObject[foodId].foodDataItem.price;
        $itemPriceTotal.text("Total Price: $" + ((totalPrice / 100) * Number($itemQuantity.text())).toFixed(2))
      }
    });

    // Decrements the displayed quantity and cart item quantity
    $('.subtract').on('click', function () {
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
        $itemPriceTotal.text("Total Price: $" + ((totalPrice / 100) * parseInt($itemQuantity.text())).toFixed(2))

        // Removes DOM element from cart if number is 0
        if (cartObject[foodId].quantity === 0) {
          $cartList.find(`#${foodId}`).remove();
        }
      } else {
        console.log("Error: Negative quantity number is not possible");
      }
    });

    $('.toggleItem').on('click', function (event) {
      const item = $(this).closest('.item-border')
      const itemId = item.attr('id');

      $.ajax({
        method: 'POST',
        url: `/menu/admin/${itemId}/edit`
      })
      .then ((toggleResult) => {
        console.log("toggle status is::", toggleResult.toggle.toggle)
        if (toggleResult.toggle.toggle === 'off') {
          console.log("it was off")
          $(this).text("Toggle off");
        } else {
          console.log("it was on")
          $(this).text("Toggle on");

        }
      })
    });
  });
}

  loadMenuItems()

  // Order now event
  $('#order-button').on('click', function (event) {
    let flag = false;
    for (const cartItem in cartObject) {
      if (cartObject[cartItem].quantity > 0) {
        flag = true;
        break;
      }
    }
    if (flag) {
      console.log("cartObject", cartObject);
      $.ajax({
        method: 'POST',
        url: '/order',
        data: {cartItems : cartObject}
      })
      .then ((res) => {

        $('#order-btn-display').empty();
        $('.quantity-border').remove();
        $('#order-btn-display').append($(`<p id='order-button'>Your order has been placed!<p>`));

        // Redirects to the orderid page
        // window.location.href = `/order?orderId=${res["orderId"]}`
      })
    } else {
      const emptyCartOrder = "Please enter items for the order";
      $("#orderError").slideUp();
      $("#orderError").text(emptyCartOrder);
      $("#orderError").slideDown();
    }
  });

  $('form').on('submit', function (event) {
    event.preventDefault();

    const queryString = $(this).serialize();
    const inputText = $(this).children("#image").val();
    console.log("queryString", queryString);
    console.log("inputText", inputText)

    inputText.onerror = function() {
      alert('Invalid image');
    }


    $.ajax('/menu/admin/add', { method: 'POST' , data:queryString})
    .then( () => {
      loadMenuItems()
    });
  });

});
