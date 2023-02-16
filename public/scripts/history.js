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
    console.log("orderIds", orderIds)
    console.log("orderData", orderData)

    // Display the orders to the admin
    for (let i = 0; i < orderIds.length; i++) {
      const currentId = orderIds[i].id;
      let $currentOrderDetails =  ``;
      $orders.append($($currentOrderDetails));
      let totalCost = 0;
      let orderStatus = "";
      let orderId = 0;
      let username = "";
      let created_at = "";
      for (const data of orderData) {
        if (currentId === data.order_id) {
          totalCost+= Number(data.price) / 100 * Number(data.quantity);
          $currentOrderDetails += `
            <p>${data.quantity}&nbsp x &nbsp ${data.foodname}</p>

            `
          orderStatus = data.order_status;
          orderId = data.order_id;
          username = data.username;
          created_at = data.created_at;
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
          <div class="ready-status">
            <div>
              <button class="time-option">Ready for Pickup</button>
            </div>
          </div>
          `
        } else if (orderStatus === 'Ready') {
          orderStatusOptions= `
          <p>Pickup has been confirmed.</p>
          `
        }
        $currentOrder =$(`<div data-order-id="${orderId}" class="order-details">` + `<div class="order-header"><p><strong>Order ID:</strong> ${orderId}</p> <p><strong>Created:</strong> ${created_at} </p> <p><strong>Customer:</strong> ${username}</p></div> <div class="order-items"><p><strong>Order Details:</strong></p>` + $currentOrderDetails + `<p><strong>Total Cost:</strong> $${totalCost.toFixed(2)}</p></div> <div class="order-updates"><p class="order-status">Order Status: ${orderStatus}<p><strong>Estimated Pickup Time:</strong>`+ orderStatusOptions + `</div></div>`);
        $orders.append($currentOrder);
      }

      if (bodyId === "customer") {
        $currentOrder =$(`<div data-order-id="${orderId}" class="order-details">` + `<div class="order-header"><p><strong>Created:</strong> ${created_at} </p></div> <div class="order-items"><p><strong>Order Details:</strong></p>` + $currentOrderDetails + `<p><strong>Total Cost:</strong> $${totalCost.toFixed(2)}</p></div> <div class="order-updates"><p class="order-status">Order Status: ${orderStatus}</p>` + `</div></div>`);
        $orders.append($currentOrder);
      }
    }

    $(".time-option").on('click', function () {
      const selectedTime = $(this).text();

      const orderElement = $(this).closest("[data-order-id]");
      const orderId = orderElement.data("order-id");

      console.log("orderId", orderId)
      $.ajax({
        method: 'POST',
        url: '/order/edit',
        data: { selectedTime, orderId }
      })
      .then ((res) => {

        const timeOption = $(this).closest(".ready-status");
        $(this).parent().find(".time-option").hide()

        console.log("res", res)
        console.log("res.orderData", res.orderData);

        if (res.orderData.order_status === 'Not Ready') {
          $(this).show()
          $(this).text("Ready for Pickup");

          const orderItemStatus = orderElement.find('.order-status');
          orderItemStatus.text("Order Status: " + res.orderData.order_status);
        } else {
          timeOption.append($(`
          <p class="pickup-option">Pickup has been confirmed.</p>
          `));
          const orderItemStatus = orderElement.find('.order-status');
          orderItemStatus.text("Order Status: " + res.orderData.order_status);
        }



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
