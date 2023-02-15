// Client facing scripts here
$(() => {

  let itemQuantities = {};
  let cartObject = {};
  // Creates the food item DOM element
  const createFoodElement = function(foodObj) {
    const $food = $(`
    <div id="${foodObj.id}" class="food-item">
      <img src="${foodObj.image_url}" alt="food item" width="200px" height="200px">
      <div class="food-details">
        <p id="food-name">${foodObj.name}</p>
        <p id="food-description">${foodObj.description}</p>
        <p id="price-total"><strong>$${foodObj.price/100}</strong></p>
      </div>
      <div class="quantity-border">
        <button class="subtract">-</button>
        <p class="quantity">0</p>
        <button class="add">+</button>
      </div>
    </div>`);
    return $food;
  }

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

    // response: {foods:..., prototype:...}
    for(const foodDataItem of response.foods) {
      // Sets each item to zero in local database
      itemQuantities[foodDataItem.id] = 0;
      cartObject[foodDataItem.id] = {foodDataItem, quantity: 0};
      const $foodItem = createFoodElement(foodDataItem);
      $foodsList.append($foodItem);
    }

    // console.log("cartObject", cartObject[1].foodDataItem)
    // console.log("cartObject", cartObject[1].description)

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
        $itemPriceTotal.text("$" + ((totalPrice / 100)))
      } else {
        cartObject[foodId].quantity++;
        const $itemQuantity = $cartList.find(`#${foodId}`).find(".itemQuantity");
        const $itemPriceTotal = $cartList.find(`#${foodId}`).find(".price-total");

        $foodQuantity.text(cartObject[foodId].quantity);
        $itemQuantity.text(parseInt($itemQuantity.text()) + 1);
        const totalPrice = cartObject[foodId].foodDataItem.price;
        $itemPriceTotal.text("$" + ((totalPrice / 100) * Number($itemQuantity.text())))
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
        $itemPriceTotal.text("$" + ((totalPrice / 100) * parseInt($itemQuantity.text())))

        // Removes DOM element from cart if number is 0
        if (cartObject[foodId].quantity === 0) {
          $cartList.find(`#${foodId}`).remove();
        }
      } else {
        console.log("Error: Negative quantity number is not possible");
      }
    });
  });
}

$('#order-button').on('click', function (event) {
  console.log("cartObject", cartObject)
});

loadMenuItems()
});
