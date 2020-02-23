import {Modal} from './modal.js';

class Shop {
    constructor() {
        this.url = 'http://localhost:3000/api';
        this.modal = new Modal({
            htmlContent: document.querySelector('#edit-modal')
        });
        this.table = document.querySelector('#user-table > tbody');
    }

    apiHeaders() {
        const headers = new Headers();
        headers.append('Authorization', 'authorization-token');
        headers.append('Content-Type', 'application/json');
        return headers;
    }

    async getShopData() {
        const items = await this.getData();
        console.log(items);
        this.clearTableBody();
        this.items = items;
        items.forEach((item) => {
            const row = this.createRow(item);
            this.table.appendChild(row);
        });
    }

    getData = () => fetch(`${this.url}/items`, {headers: this.apiHeaders()})
        .then(response => response.json())
        .then(response => response.items);

    createCell(value) {
        const td = document.createElement('td');
        td.innerText = value;
        return td;
    }

    clearTableBody() {
        this.table.innerHTML = '';
    }

    createRow(item) {
        const tr = document.createElement('tr');
        ['name', 'price', 'count'].forEach(key => {
            tr.appendChild(this.createCell(item[key]));
        });
        tr.appendChild(this.deleteButton(item._id, item._rev));
        tr.appendChild(this.updateButton(item._id));
        return tr;
    }

    updateItem(docId) {
        const item = this.items.find(item => item._id === docId);
        document.querySelector('#name').value = item.name;
        document.querySelector('#price').value = item.price;
        document.querySelector('#count').value = item.count;
        this.modal.open().then(closeType => {
            if(closeType === Modal.ACCEPT) {

            }
        });
    }
    updateButton(id) {
        const button = document.createElement('button');
        button.classList.add('update-button');
        button.innerText = 'Edit';
        button.dataset.docId = id;
        button.addEventListener('click', (event) => {
            this.updateItem(event.target.dataset.docId);
        });
        const cell = document.createElement('td');
        cell.appendChild(button);
        return cell;
    }
    deleteButton(id, rev) {
        const button = document.createElement('button');
        button.classList.add('delete-button');
        button.innerText = 'Delete';
        button.dataset.docId = id;
        button.dataset.docRev = rev;
        button.addEventListener('click', this.removeItemHandler.bind(this));
        const cell = document.createElement('td');
        cell.appendChild(button);
        return cell;
    }

    removeItemHandler(event) {
        const id = event.target.dataset.docId;
        const rev = event.target.dataset.docRev;
        const url = `${this.url}/items/${id}/${rev}`;
        fetch(url, {method: 'DELETE', headers: this.apiHeaders()}).then(() => this.getShopData());
    }

    submitItemData() {
        const url = `${this.url}/items`;
        const headers = this.apiHeaders();
        headers.set('Content-Type', 'form-data/multipart');
        const request = {
            method: 'POST',
            headers,
            body: this.getFormData()
        };
        if (request) {
            fetch(url, request)
                .then(response => response.json())
                .then(() => {
                    this.modal.close(Modal.CANCEL);
                    this.getShopData();
                });
        }
    }

    getFormData() {
        const formData = new FormData();
        ['name', 'price', 'count', 'item-image'].forEach((field) => {
            formData.append(field, document.querySelector(`#${field}`).value);
        });
        return formData;
    }
}

const shop = new Shop();
shop.getShopData();
document.querySelector('#add-item').addEventListener('click', () => {
    shop.modal.open().then(closeType => {
        if(closeType === Modal.ACCEPT) {
            shop.submitItemData();
        }
    });
});
