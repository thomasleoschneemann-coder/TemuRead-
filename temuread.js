let books = [];
fetch('TemuRead_Bibliothek_400.json')
.then(res => res.json())
.then(data => {
    books = data.books;
    renderCategories();
    renderBooks();
});

function renderCategories() {
    const container = document.getElementById('categories');
    const categories = [...new Set(books.map(b => b.category))];
    categories.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category';
        div.textContent = cat;
        div.onclick = () => filterCategory(cat);
        container.appendChild(div);
    });
}

function renderBooks(filtered = books) {
    const grid = document.getElementById('book-grid');
    grid.innerHTML = '';
    filtered.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book-item';
        div.innerHTML = `<img src="${book.coverUrl}" alt="${book.title}"><div>${book.title}</div><div>${book.price==0?'Gratis':'€'+book.price}</div>`;
        div.onclick = () => openReader(book);
        grid.appendChild(div);
    });
}

function filterCategory(cat) { renderBooks(books.filter(b => b.category === cat)); }

function openReader(book) {
    document.getElementById('reader-container').style.display='block';
    const epub = ePub(book.fileUrl);
    const rendition = epub.renderTo("epub-reader",{width:"100%",height:"100%"});
    rendition.display();
}

document.getElementById('close-reader').onclick = () => {
    document.getElementById('reader-container').style.display='none';
    document.getElementById('epub-reader').innerHTML='';
}

function buyBook(book) {
    if(book.price <= 0) return alert('Gratis Buch!');
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{amount: { value: book.price.toString() }}]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Kauf erfolgreich: ' + book.title);
            });
        }
    }).render('#paypal-button-container');
}