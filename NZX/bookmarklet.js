{
    var table = document.querySelector('.table-to-list.instruments-table > tbody');
    let total_value = 0.0;
    let total_prev_value = 0.0;
    for (var i = 0, row; row = table.rows[i]; i++) {
        let v = '';
        let price = row.querySelector('td[data-title=Price]');
        let change = row.querySelector('td[data-title=Change]');
        let quantity = row.querySelector('td[data-title=Quantity]');
        let oldprice = price.textContent.trim().replace('$', '') - parseFloat(change.textContent.split('/')[0].trim().replace('$', ''));
        let oldquant = parseInt(quantity.textContent.trim()) * oldprice;

        total_prev_value += oldquant;
        total_value += parseFloat(price.textContent.trim().replace('$', '')) * parseInt(quantity.textContent.trim());
    }
    let newrow = table.insertRow(-1);
    let cell = newrow.insertCell(-1);
    cell.setAttribute('class', 'text-center');
    cell.innerHTML = "<strong>Total</strong>";
    cell = newrow.insertCell(-1);
    cell = newrow.insertCell(-1);
    cell = newrow.insertCell(-1);
    cell = newrow.insertCell(-1);
    cell.classList.add('text-right');
    if (total_value - total_prev_value > 0) {
        cell.classList.add('up');
    } else {
        cell.classList.add('down');
    };
    cell.innerHTML = '$' + (total_value - total_prev_value).toFixed(3) + " / " + ((total_value - total_prev_value) * 100 / total_prev_value).toFixed(3) + '%';
    cell = newrow.insertCell(-1);
    cell.setAttribute('class', 'text-right');
    cell.innerHTML = '$' + total_value.toFixed(3);
}
