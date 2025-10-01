// Global variables
let cart = [];
let cartTotal = 0;

// Navigation function
function navigateTo(page) {
    window.location.href = page;
}

// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Lofi requirement: no authentication; go straight to dashboard
            navigateTo('dashboard.html');
        });
    }

    // Initialize charts if on reports page
    if (window.location.pathname.includes('advanced-reports.html')) {
        initializeCharts();
    }

    // Initialize cart if on new transaction page
    if (window.location.pathname.includes('new-transaction.html')) {
        updateCartDisplay();
    }
});

// Product management functions
function addProduct() {
    const productName = prompt('Masukkan nama produk:');
    const productPrice = prompt('Masukkan harga produk:');
    const productStock = prompt('Masukkan stok produk:');
    
    if (productName && productPrice && productStock) {
        alert(`Produk "${productName}" berhasil ditambahkan!`);
        // In a real app, this would add to database
    }
}

// Cart functionality
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartTotal();
    updateCartDisplay();
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartTotal();
    updateCartDisplay();
}

function updateCartTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartDisplay() {
    const cartTotalElement = document.getElementById('cart-total');
    const cartEmptyElement = document.getElementById('cart-empty');
    const cartItemsElement = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-button');
    
    if (cartTotalElement) {
        cartTotalElement.textContent = cartTotal.toLocaleString('id-ID');
    }
    
    if (cart.length === 0) {
        if (cartEmptyElement) cartEmptyElement.style.display = 'block';
        if (cartItemsElement) cartItemsElement.style.display = 'none';
        if (checkoutButton) checkoutButton.style.display = 'none';
    } else {
        if (cartEmptyElement) cartEmptyElement.style.display = 'none';
        if (cartItemsElement) cartItemsElement.style.display = 'block';
        if (checkoutButton) checkoutButton.style.display = 'block';
        
        if (cartItemsElement) {
            cartItemsElement.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <div style="font-weight: 600;">${item.name}</div>
                        <div style="font-size: 12px; color: #666;">Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #27AE60; font-weight: 600;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        <button onclick="removeFromCart('${item.name}')" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">×</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }
    
    const total = cartTotal;
    const confirmCheckout = confirm(`Total pembayaran: Rp ${total.toLocaleString('id-ID')}\n\nLanjutkan checkout?`);
    
    if (confirmCheckout) {
        // Generate transaction ID
        const transactionId = Math.floor(100000 + Math.random() * 900000);
        
        alert(`Transaksi berhasil!\nID Transaksi: #${transactionId}\nTotal: Rp ${total.toLocaleString('id-ID')}`);
        
        // Clear cart
        cart = [];
        cartTotal = 0;
        updateCartDisplay();
    }
}

// Chart initialization
function initializeCharts() {
    // Sales Chart
    const salesCanvas = document.getElementById('salesChart');
    if (salesCanvas) {
        const ctx = salesCanvas.getContext('2d');
        drawSalesChart(ctx);
    }
    
    // Product Chart
    const productCanvas = document.getElementById('productChart');
    if (productCanvas) {
        const ctx = productCanvas.getContext('2d');
        drawProductChart(ctx);
    }
}

function drawSalesChart(ctx) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Chart data
    const data = [90000, 340000, 200000, 250000, 300000, 340000];
    const labels = ['26/07', '29/07', '30/07', '31/07', '01/08', '02/08'];
    const maxValue = Math.max(...data);
    
    // Chart dimensions
    const margin = 40;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    
    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 6; i++) {
        const y = margin + (chartHeight / 6) * i;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 5; i++) {
        const x = margin + (chartWidth / 5) * i;
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, height - margin);
        ctx.stroke();
    }
    
    // Draw line chart
    ctx.strokeStyle = '#27AE60';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = margin + (chartWidth / 5) * index;
        const y = height - margin - (value / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // Draw data points
        ctx.fillStyle = '#27AE60';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
        const x = margin + (chartWidth / 5) * index;
        ctx.fillText(label, x, height - 10);
    });
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 6; i++) {
        const value = (maxValue / 6) * (6 - i);
        const y = margin + (chartHeight / 6) * i + 4;
        ctx.fillText(`Rp ${(value / 1000).toFixed(0)}k`, margin - 10, y);
    }
}

function drawProductChart(ctx) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Chart data
    const data = [9, 7, 6, 6, 4];
    const labels = ['baju len...', 'baju len...', 'celana p...', 'celana p...', 'pisang c...'];
    const maxValue = Math.max(...data);
    
    // Chart dimensions
    const margin = 40;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    const barWidth = chartWidth / data.length * 0.6;
    
    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
        const y = margin + (chartHeight / 10) * i;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
    }
    
    // Draw bars
    data.forEach((value, index) => {
        const x = margin + (chartWidth / data.length) * index + (chartWidth / data.length - barWidth) / 2;
        const barHeight = (value / maxValue) * chartHeight;
        const y = height - margin - barHeight;
        
        // Draw bar
        ctx.fillStyle = '#007AFF';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw label
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + barWidth / 2, height - 10);
    });
    
    // Y-axis labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 10; i++) {
        const value = (maxValue / 10) * (10 - i);
        const y = margin + (chartHeight / 10) * i + 4;
        ctx.fillText(value.toString(), margin - 10, y);
    }
}

// Transaction history functions
function viewTransaction(transactionId) {
    alert(`Menampilkan detail transaksi #${transactionId}`);
}

function deleteTransaction(transactionId) {
    const confirmDelete = confirm(`Hapus transaksi #${transactionId}?`);
    if (confirmDelete) {
        alert(`Transaksi #${transactionId} berhasil dihapus!`);
        // In a real app, this would remove from database and refresh the list
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Back button functionality
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        navigateTo('dashboard.html');
    }
}

// Add event listeners for back buttons
document.addEventListener('DOMContentLoaded', function() {
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', goBack);
    });
});

