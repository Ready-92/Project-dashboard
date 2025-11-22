let list = document.querySelectorAll(".navigation li");

function activeLink() {
    list.forEach(item => item.classList.remove("hovered"));
    this.classList.add("hovered");
}

list.forEach(item => item.addEventListener("mouseenter", activeLink));

let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

if (toggle) {
    toggle.onclick = function () {
        navigation.classList.toggle("active");
        main.classList.toggle("active");
    };
}

if (navigation) {
    navigation.addEventListener('mouseleave', () => {
        list.forEach(item => item.classList.remove('hovered'));
    });
}

function generateAutoLogo(name) {
    let cleanName = name.trim().toLowerCase();
    if (!cleanName.includes('.')) cleanName += ".com";
    return `https://logo.clearbit.com/${cleanName}`;
}

const websites = [
    { name: "Google",    logo: generateAutoLogo("google.com"), access: [3.2, 3.6, 4], search: [16.1, 16.4, 16.6], transaction: [0.89, 0.91, 0.93], interaction: [18.5, 18.7, 18.9], chart: null, labels: [] },
    { name: "YouTube",   logo: generateAutoLogo("youtube.com"), access: [3.15, 3.18, 3.22], search: [18.8, 19.0, 19.2], transaction: [0.68, 0.70, 0.72], interaction: [34.6, 34.9, 35.2], chart: null, labels: [] },
    { name: "Facebook",  logo: generateAutoLogo("facebook.com"), access: [2.98, 3.01, 3.04], search: [11.2, 11.3, 11.4], transaction: [0.58, 0.59, 0.61], interaction: [19.8, 20.0, 20.2], chart: null, labels: [] },
    { name: "Instagram", logo: generateAutoLogo("instagram.com"), access: [2.05, 2.08, 2.11], search: [8.9, 9.1, 9.2],    transaction: [0.42, 0.44, 0.46], interaction: [16.8, 17.1, 17.3], chart: null, labels: [] },
    { name: "Tiktok",    logo: generateAutoLogo("tiktok.com"), access: [1.68, 1.72, 1.78], search: [9.8, 10.1, 10.3],  transaction: [0.31, 0.33, 0.35], interaction: [28.7, 29.4, 30.1], chart: null, labels: [] },
    { name: "Github",    logo: generateAutoLogo("github.com"), access: [0.42, 0.44, 0.46], search: [0.38, 0.40, 0.42], transaction: [0.085, 0.089, 0.092], interaction: [0.95, 0.98, 1.01], chart: null, labels: [] },
    { name: "Reddit",    logo: generateAutoLogo("reddit.com"), access: [0.38, 0.40, 0.42], search: [0.44, 0.46, 0.48], transaction: [0.028, 0.030, 0.032], interaction: [1.42, 1.45, 1.48], chart: null, labels: [] }
];

let currentIndex = 0;

class MaxHeap {
    constructor() { this.heap = []; }

    clear() { this.heap = []; }

    insert(website) {
        const currentTraffic = website.access.at(-1);
        const node = { 
            name: website.name, 
            logo: website.logo, 
            traffic: currentTraffic 
        };
        
        this.heap.push(node);
        this.bubbleUp();
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let element = this.heap[index];
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.heap[parentIndex];

            if (parent.traffic >= element.traffic) break;

            this.heap[parentIndex] = element;
            this.heap[index] = parent;
            index = parentIndex;
        }
    }

    peek() { return this.heap[0]; }

    getSortedList() {
        return [...this.heap].sort((a, b) => b.traffic - a.traffic);
    }
}

const trafficHeap = new MaxHeap();

function formatNumber(num) {
    return num.toFixed(2) + " B"; 
}

function updateCardData(index) {
    const site = websites[index];
    if(!site) return;
    document.getElementById('access-card').querySelector('.numbers').textContent = `${site.access.at(-1).toFixed(2)} B`;
    document.getElementById('search-card').querySelector('.numbers').textContent = `${site.search.at(-1).toFixed(1)} B`;
    document.getElementById('transaction-card').querySelector('.numbers').textContent = `${site.transaction.at(-1).toFixed(2)} B`;
    document.getElementById('interaction-card').querySelector('.numbers').textContent = `${site.interaction.at(-1).toFixed(1)} B`;
}

function updateHomeUI() {
    trafficHeap.clear();
    websites.forEach(site => trafficHeap.insert(site));

    const topWeb = trafficHeap.peek();
    if (topWeb) {
        const topName = document.getElementById('top-name');
        const topTraffic = document.getElementById('top-traffic');
        const topLogo = document.getElementById('top-logo');
        
        if(topName) topName.innerText = topWeb.name;
        if(topTraffic) topTraffic.innerText = formatNumber(topWeb.traffic);
        if(topLogo) topLogo.src = topWeb.logo;
    }

    const listView = document.getElementById('list-view');
    if (listView) {
        const sortedList = trafficHeap.getSortedList();
        let html = "";
        
        sortedList.forEach((web, index) => {
            let rankColor = "#ccc";
            if(index === 0) rankColor = "#ffd700"; 
            else if(index === 1) rankColor = "#95a5a6"; 
            else if(index === 2) rankColor = "#cd7f32"; 

            html += `
                <div class="lb-item">
                    <div class="lb-left">
                        <span class="rank-badge" style="color: ${rankColor}">#${index + 1}</span>
                        <img class="tiny-logo" src="${web.logo}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3645/3645245.png'">
                        <b>${web.name}</b>
                    </div>
                    <span class="item-traffic">${formatNumber(web.traffic)}</span>
                </div>`;
        });
        listView.innerHTML = html;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const mainContent = document.getElementById('main-content');
    const homeContent = document.getElementById('home-content');

    websites.forEach(site => {
        site.labels = ["14:50"];
    });

    websites.forEach((site, index) => {
        const canvas = document.getElementById(`trafficChart${index}`);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        const gradients = [
            ctx.createLinearGradient(0, 0, 0, 400),
            ctx.createLinearGradient(0, 0, 0, 400),
            ctx.createLinearGradient(0, 0, 0, 400),
            ctx.createLinearGradient(0, 0, 0, 400)
        ];
        const colors = ['rgba(0, 255, 255,', 'rgba(255, 0, 170,', 'rgba(0, 255, 153,', 'rgba(255, 234, 0,'];
        
        gradients.forEach((g, i) => {
            g.addColorStop(0, colors[i] + ' 0.6)');
            g.addColorStop(1, colors[i] + ' 0)');
        });

        site.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: site.labels,
                datasets: [
                    { label: 'Truy cập', data: site.access, borderColor: '#00ffff', backgroundColor: gradients[0], borderWidth: 3.5, fill: true, tension: 0.45 },
                    { label: 'Tìm kiếm', data: site.search, borderColor: '#ff00aa', backgroundColor: gradients[1], borderWidth: 3.5, fill: true, tension: 0.45 },
                    { label: 'Giao dịch', data: site.transaction, borderColor: '#00ff99', backgroundColor: gradients[2], borderWidth: 3.5, fill: true, tension: 0.45 },
                    { label: 'Tương tác', data: site.interaction, borderColor: '#ffea00', backgroundColor: gradients[3], borderWidth: 3.5, fill: true, tension: 0.45 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: '#808080' } },
                    y: { ticks: { color: '#808080' }, beginAtZero: true }
                }
            }
        });
    });

    window.showChart = function (index) {
        if(homeContent) homeContent.style.display = 'none';
        if(mainContent) mainContent.style.display = 'block';

        document.querySelectorAll('.chart-container').forEach(c => c.classList.remove('active'));
        const targetChart = document.getElementById(`chart${index}`);
        if(targetChart) targetChart.classList.add('active');

        currentIndex = index;
        updateCardData(currentIndex);
    };

    window.showHome = function () {
        if(mainContent) mainContent.style.display = 'none';
        if(homeContent) homeContent.style.display = 'block';
        
        updateHomeUI();
    };

    updateCardData(0);
    updateHomeUI();

    setInterval(() => {
        const time = new Date().toLocaleTimeString('vi-VN', { 
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });

        websites.forEach((site) => {
            const delta = (Math.random() - 0.5) * 0.003;

            const updateMetric = (arr, multiplier) => {
                const last = arr.at(-1);
                let newVal = last + (delta * multiplier);
                return Math.max(0, Number(newVal.toFixed(3)));
            };

            const newAccess = updateMetric(site.access, 1);
            const newSearch = updateMetric(site.search, 8);
            const newTransaction = updateMetric(site.transaction, 2);
            const newInteraction = updateMetric(site.interaction, 4);

            site.access.push(newAccess);
            site.search.push(newSearch);
            site.transaction.push(newTransaction);
            site.interaction.push(newInteraction);

            if (site.access.length > 50) {
                site.access.shift(); site.search.shift();
                site.transaction.shift(); site.interaction.shift();
            }

            const chart = site.chart;
            if (chart) {
                if (chart.data.labels.length >= 10) {
                    chart.data.labels.shift();
                    chart.data.datasets.forEach(ds => ds.data.shift());
                }
                chart.data.labels.push(time);
                chart.data.datasets[0].data.push(newAccess);
                chart.data.datasets[1].data.push(newSearch);
                chart.data.datasets[2].data.push(newTransaction);
                chart.data.datasets[3].data.push(newInteraction);
                chart.update('none'); 
            }
        });

        if (typeof currentIndex !== 'undefined') {
            updateCardData(currentIndex);
        }

        if (homeContent && homeContent.style.display !== 'none') {
            updateHomeUI();
        }

    }, 2000);

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                const q = searchInput.value.trim().toLowerCase();
                if (!q) return;

                const idx = websites.findIndex(s => s.name.toLowerCase().includes(q));

                if (idx !== -1) {
                    showChart(idx); 
                    highlightAndScrollToSite(idx);
                } else {
                    alert("Không tìm thấy website: " + q);
                }
                searchInput.value = '';
            }
        });
    }
});

window.toggleModal = function() {
    const modal = document.getElementById('modal-overlay');
    if(modal) modal.classList.toggle('active');
};

window.handleAddClick = function() {
    const nameInput = document.getElementById('inpName');
    const trafficInput = document.getElementById('inpTraffic');

    const name = nameInput.value;
    const trafficRaw = trafficInput.value;

    if(name === "" || trafficRaw === "") {
        alert("Vui lòng nhập đủ thông tin!");
        return;
    }

    let trafficVal = parseFloat(trafficRaw);
    if (trafficVal > 1000) {
        trafficVal = trafficVal / 1000000000; 
    }

    const newSite = {
        name: name,
        logo: generateAutoLogo(name),
        access: [trafficVal],
        search: [trafficVal * 2],
        transaction: [trafficVal * 0.1],
        interaction: [trafficVal * 5],
        chart: null,
        labels: ["Now"]
    };

    websites.push(newSite);

    nameInput.value = "";
    trafficInput.value = "";
    toggleModal();

    updateHomeUI();
    
    alert(`Đã thêm ${name} vào hệ thống!`);
};

function highlightAndScrollToSite(index) {
    const items = document.querySelectorAll('.navigation li');
    const navIndex = index + 2; 

    items.forEach(el => el.classList.remove('hovered'));

    if (items[navIndex]) {
        const target = items[navIndex];
        target.classList.add('hovered');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}