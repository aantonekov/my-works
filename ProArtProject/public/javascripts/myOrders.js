const tokenCheckInfo = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const tokens = {accessToken: accessToken};
    
    const { data } = await axios.post('/orders/myOrders', tokens);

    if (data.status === 'not user') {
        window.location.href = '/';
        return;
    };
};
tokenCheckInfo();

const ordersData = async () => {
    const { data } = await axios.post('/orders/myOrders/ordersData');
    card(data);
    return data;
};
ordersData();

const card = async (data) => {

    let ordersArr = '';
    data.orders.forEach( (elem) => {

        const orderYear = new Date(elem.createdAt).getFullYear();
        const orderMonth = new Date(elem.createdAt).getMonth();
        const orderDate = new Date(elem.createdAt).getDate();
    
        const orderTime = `${orderYear}-${orderMonth}-${orderDate}`;
    
        const orderLinesHtml = `
            <tr>
                <td>${orderTime}</td>
                <td><a href="/orders/myOrders/${elem.orderId}" class="orderInfoLink" value="${elem.orderId}">${elem.orderId}</a></td>
                <td>${elem.amount.sum}</td>
            </tr> `
    
            ordersArr = `${ordersArr}${orderLinesHtml}`;
    });
    document.querySelector('.tbodyOrders').innerHTML = ordersArr;
};


