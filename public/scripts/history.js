// Client facing scripts here
$(() => {
  $.ajax({
    method: 'GET',
    url: '/api/users/order'
  })
  .then((response) => {
    console.log("response", response.orders)
    console.log("response2", response.orderIds[2])
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
      for (const data of orderData) {
        if (currentId === data.order_id) {
          totalCost+= data.price / 100 * data.quantity;
          $currentOrderDetails += `
            <p>Order Id: ${data.order_id}</p>
            <p>Name: ${data.name}</p>
            <p>Price: $${data.price / 100 * data.quantity}</p>
            <p>Quantity: ${data.quantity}</p>
            <p>user_id: ${data.user_id}</p>
            `
          orderStatus = data.order_status;
        }
      }
      let orderStatusOptions = ``;
      if (orderStatus === 'pending') {
        orderStatusOptions= `
        <div class="ready-status">
          <button class="time-option">20</button>
          <button class="time-option">40</button>
          <button class="time-option">60</button>
        </div>
        `
      } else if (orderStatus === 'Not Ready') {
        orderStatusOptions= `
        <div class="ready-status">
          <button>Ready for Pickup</button>
        </div>
        `
      }
      $currentOrder =`<div class="order-item">` + $currentOrderDetails + `<p class="order-status">Order Status: ${orderStatus}</p> <p>Total Cost: $${totalCost}</p>`+ orderStatusOptions + `</div>`;
      $orders.append($currentOrder);
    }

    let $readyStatus = $(".ready-status");

    $(".time-option").on('click', function () {
      const selectedTime = $(this).text();
      $(".time-option").remove();
      $readyStatus.append($(`
          <button>Ready for Pickup</button>
        `));

      $.ajax({
        method: 'POST',
        url: '/order/edit',
        data: {selectedTime : selectedTime}
      })
      .then ((res) => {
        console.log("returned is: ", res);
      })



    });
  });



});
