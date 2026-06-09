let mapInitialized = false;
let points = 150;
let map;
let binMarkersGroup;
let animalMarkersGroup;
let binsVisible = true;
let animalsVisible = true;

let cameraStream = null;

// --- Navigation Logic ---
function navigate(pageId, navElement) {
    const activePage = document.querySelector('.page.active');
    const currentActivePage = activePage ? activePage.id : null;

    if (currentActivePage === 'scan-page' && pageId !== 'scan-page') {
        stopCamera();
    }

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    document.getElementById(pageId).classList.add('active');

    if(navElement) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        navElement.classList.add('active');
    }

    if (pageId === 'map-page' && !mapInitialized) {
        initMap();
    }

    if (pageId === 'scan-page') {
        startCamera();
    }
}

async function startCamera() {
    const video = document.getElementById('camera-stream');
    const placeholder = document.getElementById('scanner-placeholder');
    
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        
        if (video) {
            video.srcObject = cameraStream;
            video.style.display = 'block';
        }
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    } catch (err) {
        console.warn('Camera access denied or unavailable:', err);
        if (video) video.style.display = 'none';
        if (placeholder) placeholder.style.display = 'block';
        
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: 'Camera unavailable',
            text: 'Using simulation mode instead.',
            showConfirmButton: false,
            timer: 2500
        });
    }
}

function stopCamera() {
    const video = document.getElementById('camera-stream');
    const placeholder = document.getElementById('scanner-placeholder');
    
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    
    if (video) {
        video.srcObject = null;
        video.style.display = 'none';
    }
    if (placeholder) {
        placeholder.style.display = 'block';
    }
}

// --- Auth Logic ---
function login() {
    const loginBtn = document.getElementById('login-btn');
    const originalText = loginBtn.innerHTML;
    
    // Disable button and show spinner
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    
    setTimeout(() => {
        const usernameInput = document.querySelector('#login-page input[type="text"]').value.trim();
        const displayName = usernameInput ? usernameInput : "User";
        document.getElementById('profile-name').innerText = displayName;
        
        // Re-enable button
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalText;
        
        // Show premium checkmark animation using SweetAlert2
        Swal.fire({
            title: 'Login Successful!',
            html: `<div style="margin-top: 10px;">Welcome back, <b>${displayName}</b>!<br><span style="font-size: 0.9rem; color: #666;">Ready to save the environment?</span></div>`,
            icon: 'success',
            timer: 1800,
            showConfirmButton: false,
            timerProgressBar: true,
            willClose: () => {
                // Start screen exit transition
                const loginPage = document.getElementById('login-page');
                loginPage.classList.add('page-exit');
                
                setTimeout(() => {
                    loginPage.classList.remove('page-exit');
                    finishLogin();
                }, 400); // matches transition duration
            }
        });
    }, 1200); // simulated loading delay for visual satisfaction
}

function skipLogin() {
    const skipBtn = document.querySelector('.btn-skip');
    const originalText = skipBtn.innerHTML;
    
    skipBtn.disabled = true;
    skipBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entering...';
    
    setTimeout(() => {
        document.getElementById('profile-name').innerText = "Guest User";
        skipBtn.disabled = false;
        skipBtn.innerHTML = originalText;
        
        Swal.fire({
            title: 'Welcome Guest!',
            text: 'Continuing as guest...',
            icon: 'info',
            timer: 1200,
            showConfirmButton: false,
            timerProgressBar: true,
            willClose: () => {
                const loginPage = document.getElementById('login-page');
                loginPage.classList.add('page-exit');
                
                setTimeout(() => {
                    loginPage.classList.remove('page-exit');
                    finishLogin();
                }, 400);
            }
        });
    }, 800);
}

function finishLogin() {
    document.getElementById('bottom-nav').classList.remove('hidden-nav');
    navigate('map-page', document.querySelectorAll('.nav-item')[0]);
}

function logout() {
    document.getElementById('bottom-nav').classList.add('hidden-nav');
    navigate('login-page', null);
}

// --- Map Logic (Lumphini Park) ---
function initMap() {
    map = L.map('map').setView([13.7305, 100.5415], 16);

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Map data © Google'
    }).addTo(map);

    // Create Layer Groups to support toggle control
    binMarkersGroup = L.layerGroup().addTo(map);
    animalMarkersGroup = L.layerGroup().addTo(map);

    // --- Marker Icons ---
    var binIcon = L.divIcon({
        html: '<span class="material-symbols-outlined" style="color: #27ae60; font-size: 28px; text-shadow: 1px 1px 3px rgba(0,0,0,0.3); display: block; text-align: center;">delete</span>',
        className: 'custom-div-icon', iconSize: [28, 28], iconAnchor: [14, 28]
    });

    var animalIcon = L.divIcon({
        html: '<span class="material-symbols-outlined" style="color: #e67e22; font-size: 30px; text-shadow: 1px 1px 3px rgba(0,0,0,0.3); display: block; text-align: center;">pin_drop</span>',
        className: 'custom-div-icon', iconSize: [30, 30], iconAnchor: [15, 30]
    });

    // --- Smart Bins (Placed on solid ground/paths) ---
    L.marker([13.7288, 100.5428], {icon: binIcon}).addTo(binMarkersGroup).bindPopup("<b>Gate 1 Bin</b><br>Near Rama IV Monument<br>Status: 40% Full");
    L.marker([13.7314, 100.5445], {icon: binIcon}).addTo(binMarkersGroup).bindPopup("<b>Gate 2 Bin</b><br>Near Wireless Road<br>Status: 10% Full");
    L.marker([13.7328, 100.5398], {icon: binIcon}).addTo(binMarkersGroup).bindPopup("<b>Gate 3 Bin</b><br>Near Hospital Entrance<br>Status: 80% Full");
    L.marker([13.7300, 100.5450], {icon: binIcon}).addTo(binMarkersGroup).bindPopup("<b>Jogging Path Bin</b><br>East Side<br>Status: 25% Full");

    // --- Animals ---
    var lizardPopup = "<div class='animal-popup'><span class='material-symbols-outlined' style='font-size: 2.5rem; color: #d35400; margin-bottom: 6px; display: inline-block;'>pets</span><h3>Asian Water Monitor</h3><h4 class='thai-name'>ตัวเงินตัวทอง</h4><p><b>Scientific Name:</b> Varanus salvator</p><p><b>Diet:</b> Fish, frogs, birds, and carrion.</p></div>";
    L.marker([13.7302, 100.5412], {icon: animalIcon}).addTo(animalMarkersGroup).bindPopup(lizardPopup);

    var turtlePopup = "<div class='animal-popup'><span class='material-symbols-outlined' style='font-size: 2.5rem; color: #d35400; margin-bottom: 6px; display: inline-block;'>pets</span><h3>Red-eared Slider</h3><h4 class='thai-name'>เต่าแก้มแดง</h4><p><b>Scientific Name:</b> Trachemys scripta elegans</p><p><b>Diet:</b> Aquatic plants, small fish, and insects.</p></div>";
    L.marker([13.7298, 100.5430], {icon: animalIcon}).addTo(animalMarkersGroup).bindPopup(turtlePopup);

    var catPopup = "<div class='animal-popup'><span class='material-symbols-outlined' style='font-size: 2.5rem; color: #d35400; margin-bottom: 6px; display: inline-block;'>pets</span><h3>Stray Cat</h3><h4 class='thai-name'>แมว</h4><p><b>Scientific Name:</b> Felis catus</p><p><b>Diet:</b> Cat food provided by locals, small rodents.</p></div>";
    L.marker([13.7290, 100.5415], {icon: animalIcon}).addTo(animalMarkersGroup).bindPopup(catPopup);

    var birdPopup = "<div class='animal-popup'><span class='material-symbols-outlined' style='font-size: 2.5rem; color: #d35400; margin-bottom: 6px; display: inline-block;'>pets</span><h3>Rock Dove (Pigeon)</h3><h4 class='thai-name'>นกพิราบ</h4><p><b>Scientific Name:</b> Columba livia</p><p><b>Diet:</b> Seeds, fruits, and breadcrumbs.</p></div>";
    L.marker([13.7318, 100.5425], {icon: animalIcon}).addTo(animalMarkersGroup).bindPopup(birdPopup);
    
    setTimeout(() => { map.invalidateSize(); }, 100);
    mapInitialized = true;
}

// Toggle filters visibility
function toggleFilter(type) {
    if (!map) return;
    if (type === 'bins') {
        binsVisible = !binsVisible;
        const btn = document.getElementById('btn-show-bins');
        if (binsVisible) {
            map.addLayer(binMarkersGroup);
            btn.classList.add('active');
        } else {
            map.removeLayer(binMarkersGroup);
            btn.classList.remove('active');
        }
    } else if (type === 'animals') {
        animalsVisible = !animalsVisible;
        const btn = document.getElementById('btn-show-animals');
        if (animalsVisible) {
            map.addLayer(animalMarkersGroup);
            btn.classList.add('active');
        } else {
            map.removeLayer(animalMarkersGroup);
            btn.classList.remove('active');
        }
    }
}

// --- Feature Logic with SweetAlert2 ---
function simulateScan() {
    Swal.fire({
        title: 'Scan Successful!',
        text: 'Bin unlocked. Please insert your trashes.',
        icon: 'success',
        confirmButtonColor: '#27ae60'
    }).then((result) => {
        if (result.isConfirmed) {
            points += 10;
            updatePointsDisplay();
            
            Swal.fire({
                title: '+10 Points!',
                text: 'Thank you for keeping Lumphini Park clean.',
                icon: 'success',
                confirmButtonColor: '#27ae60'
            }).then(() => {
                navigate('redeem-page', document.querySelectorAll('.nav-item')[2]);
            });
        }
    });
}

function redeem(cost, itemName) {
    if (points >= cost) {
        Swal.fire({
            title: 'Confirm Redemption',
            text: `Do you want to spend ${cost} points for ${itemName}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#27ae60',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, redeem it!'
        }).then((result) => {
            if (result.isConfirmed) {
                points -= cost;
                updatePointsDisplay();
                Swal.fire(
                    'Redeemed!',
                    'Check your email for the voucher.',
                    'success'
                );
            }
        });
    } else {
        Swal.fire({
            title: 'Oops!',
            text: "You don't have enough points. Keep recycling!",
            icon: 'error',
            confirmButtonColor: '#27ae60'
        });
    }
}

function updatePointsDisplay() {
    document.getElementById('user-points').innerText = points;
}
