// Client facing scripts here
$(() => {

  const getOrders = () => {
    $.ajax({
      method: 'GET',
      url: '/api/users/order'
    })
    .then((response) => {
      renderOrders(response);
    });
  };
  const bodyId = $("body").attr('id');

  const renderOrders = (response) => {
    const orderIds = response.orderIds;
    const orderData = response.orders;

    $orders = $(".orders");
    $orders.empty();

    // Display the orders to the admin
    for (let i = orderIds.length - 1; i >= 0; i--) {
      const currentId = orderIds[i].order_id;
      let $currentOrderDetails =  ``;
      $orders.append($($currentOrderDetails));
      let totalCost = 0;
      let orderStatus = "";
      let orderId = 0;
      let username = "";
      for (const data of orderData) {
        if (currentId === data.order_id) {
          totalCost+= Number(data.price) / 100 * Number(data.quantity);
          $currentOrderDetails += `
            <p>Item: ${data.foodname}</p>
            <p>Price: $${data.price / 100 * data.quantity}</p>
            <p>Quantity: ${data.quantity}</p>
            `
          orderStatus = data.order_status;
          orderId = data.order_id;
          username = data.username;
        }
      }
      let orderStatusOptions = ``;
      const quantityDeleteButton = $(".quantity-border");
      // console.log("bodyId", bodyId);

      if (bodyId === "admin") {
        if (orderStatus === 'pending') {
          orderStatusOptions= `
          <div class="ready-status">
            <div>
              <button class="time-option">20</button>
              <button class="time-option">40</button>
              <button class="time-option">60</button>
            </div>
          </div>
          `
        } else if (orderStatus === 'Not Ready') {
          orderStatusOptions= `
          <button>Ready for Pickup</button>
          `
        }
        $currentOrder =$(`<div data-order-id="${orderId}">` + `<p>Order id: ${orderId}</p> <p>Customer: ${username}</p>` + $currentOrderDetails + `<p class="order-status">Order Status: ${orderStatus}</p> <p>Total Cost: $${totalCost.toFixed(2)}</p>`+ orderStatusOptions + `</div>`);
        $orders.append($currentOrder);
      }

      if (bodyId === "customer") {
        $currentOrder =$(`<div data-order-id="${orderId}">` + $currentOrderDetails + `<p class="order-status">Order Status: ${orderStatus}</p> <p>Total Cost: $${totalCost.toFixed(2)}</p>` + `</div>`);
        $orders.append($currentOrder);
      }
    }

    $(".time-option").on('click', function () {
      const selectedTime = $(this).text();
      const timeOption = $(this).closest("div");
      timeOption.parent().append($(`
          <button>Ready for Pickup</button>
        `));

      const orderElement = $(this).closest("[data-order-id]");
      const orderId = orderElement.data("order-id");
      timeOption.remove();

      console.log("orderId", orderId)
      $.ajax({
        method: 'POST',
        url: '/order/edit',
        data: { selectedTime, orderId }
      })
      .then ((res) => {
        const orderItemStatus = orderElement.find('.order-status');
        orderItemStatus.text("Order Status: " + res.orderData.order_status);
      })
    });
  };

  getOrders();
  if (bodyId === "customer") {
    setInterval(function(){
      getOrders();
   }, 5000);
  }
});
