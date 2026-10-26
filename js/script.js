document.addEventListener("DOMContentLoaded", function () {

    // ELEMEN HTML

    const openInvitationButton = document.querySelector("#open-invitation");
    const navbar = document.querySelector("#navbar");
    const homeSection = document.querySelector("#home");

    const navbarToggle = document.querySelector("#navbar-toggle");
    const navbarMenu = document.querySelector("#navbar-menu");


    // STATUS UNDANGAN

    // Periksa apakah undangan sudah pernah dibuka
    const invitationOpened =
        sessionStorage.getItem("invitationOpened") === "true";

    if (invitationOpened) {

        // Jika sudah dibuka, jangan kunci halaman kembali
        document.body.classList.remove("invitation-locked");

        // Tampilkan navigasi
        if (navbar) {
            navbar.classList.add("navbar_visible");
        }

    } else {

        // Jika belum dibuka, kunci halaman
        document.body.classList.add("invitation-locked");

    }


    // TOMBOL BUKA UNDANGAN

    if (openInvitationButton) {

        openInvitationButton.addEventListener("click", function () {

            // Simpan status undangan sudah dibuka
            sessionStorage.setItem("invitationOpened", "true");

            // Buka kunci halaman
            document.body.classList.remove("invitation-locked");

            // Tampilkan navigasi
            if (navbar) {
                navbar.classList.add("navbar_visible");
            }

            // Gulir menuju Home
            if (homeSection) {
                homeSection.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });

    } else {

        console.error("Tombol Buka Undangan tidak ditemukan!");

    }

    // HAMBURGER MENU

    if (navbarToggle && navbarMenu) {

        // Buka atau tutup menu navigasi
        navbarToggle.addEventListener("click", function () {

            const isOpen = navbarMenu.classList.toggle("menu_open");

            navbarToggle.classList.toggle("active", isOpen);

            navbarToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            navbarToggle.setAttribute(
                "aria-label",
                isOpen ? "Tutup navigasi" : "Buka navigasi"
            );

        });


        // Tutup menu setelah tautan navigasi diklik
        navbarMenu.querySelectorAll(".navbar_link").forEach(function (link) {

            link.addEventListener("click", function () {

                navbarMenu.classList.remove("menu_open");
                navbarToggle.classList.remove("active");

                navbarToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                navbarToggle.setAttribute(
                    "aria-label",
                    "Buka navigasi"
                );

            });

        });

    }


    // COUNTDOWN PERNIKAHAN

    const countdownDays = document.querySelector("#countdown-days");
    const countdownHours = document.querySelector("#countdown-hours");
    const countdownMinutes = document.querySelector("#countdown-minutes");
    const countdownSeconds = document.querySelector("#countdown-seconds");
    const countdownMessage = document.querySelector("#countdown-message");


    // Periksa apakah elemen Countdown tersedia
    if (
        countdownDays &&
        countdownHours &&
        countdownMinutes &&
        countdownSeconds
    ) {

        // Target waktu akad nikah:
        // 10 Desember 2028, pukul 08.00 WIB
        const weddingDate = new Date(
            "2028-12-10T08:00:00+07:00"
        ).getTime();


        // Variabel untuk menyimpan interval Countdown
        let countdownInterval;


        // Fungsi untuk memperbarui hitung mundur
        function updateCountdown() {

            const now = Date.now();
            const timeRemaining = weddingDate - now;


            // Jika waktu pernikahan sudah tiba
            if (timeRemaining <= 0) {

                countdownDays.textContent = "000";
                countdownHours.textContent = "00";
                countdownMinutes.textContent = "00";
                countdownSeconds.textContent = "00";

                if (countdownMessage) {
                    countdownMessage.textContent =
                        "Hari bahagia kami telah tiba!";
                }

                // Hentikan interval jika sudah berjalan
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                }

                return;

            }


            // PERHITUNGAN WAKTU

            // Menghitung jumlah hari
            const days = Math.floor(
                timeRemaining / (1000 * 60 * 60 * 24)
            );

            // Menghitung sisa jam
            const hours = Math.floor(
                (timeRemaining / (1000 * 60 * 60)) % 24
            );

            // Menghitung sisa menit
            const minutes = Math.floor(
                (timeRemaining / (1000 * 60)) % 60
            );

            // Menghitung sisa detik
            const seconds = Math.floor(
                (timeRemaining / 1000) % 60
            );


            // MENAMPILKAN HASIL COUNTDOWN

            countdownDays.textContent =
                String(days).padStart(3, "0");

            countdownHours.textContent =
                String(hours).padStart(2, "0");

            countdownMinutes.textContent =
                String(minutes).padStart(2, "0");

            countdownSeconds.textContent =
                String(seconds).padStart(2, "0");

        }


        // Jalankan Countdown pertama kali
        updateCountdown();


        // Perbarui Countdown setiap satu detik
        countdownInterval = setInterval(updateCountdown, 1000);

    }

    // GALERI FOTO & LIGHTBOX

    const galleryItems = Array.from(
        document.querySelectorAll(".galeri_item")
    );

    const galleryLightbox = document.querySelector("#galeri-lightbox");
    const galleryLightboxImage = document.querySelector("#galeri-lightbox-image");
    const galleryClose = document.querySelector("#galeri-close");
    const galleryPrev = document.querySelector("#galeri-prev");
    const galleryNext = document.querySelector("#galeri-next");
    const galleryCounter = document.querySelector("#galeri-counter");

    if (
        galleryItems.length > 0 &&
        galleryLightbox &&
        galleryLightboxImage &&
        galleryClose &&
        galleryPrev &&
        galleryNext &&
        galleryCounter
    ) {

        let currentGalleryIndex = 0;
        let previousFocus = null;

        // Membuka foto
        function openGallery(index) {

            currentGalleryIndex = index;
            previousFocus = document.activeElement;

            showGalleryImage();

            galleryLightbox.inert = false;
            galleryLightbox.setAttribute("aria-hidden", "false");
            galleryLightbox.classList.add("is_open");

            document.body.style.overflow = "hidden";

            galleryClose.focus();

        }

        // Menampilkan foto yang dipilih
        function showGalleryImage() {

            const item = galleryItems[currentGalleryIndex];
            const thumbnail = item.querySelector("img");

            const fullImage =
                item.getAttribute("data-full") ||
                thumbnail.src;

            galleryLightboxImage.src = fullImage;
            galleryLightboxImage.alt = thumbnail.alt;

            galleryCounter.textContent =
                `${currentGalleryIndex + 1} / ${galleryItems.length}`;

            galleryPrev.hidden = galleryItems.length < 2;
            galleryNext.hidden = galleryItems.length < 2;

        }

        // Menutup lightbox
        function closeGallery() {

            galleryLightbox.classList.remove("is_open");
            galleryLightbox.setAttribute("aria-hidden", "true");
            galleryLightbox.inert = true;

            document.body.style.overflow = "";

            galleryLightboxImage.removeAttribute("src");

            if (previousFocus) {
                previousFocus.focus();
            }

        }

        // Foto berikutnya
        function nextGalleryImage() {

            currentGalleryIndex =
                (currentGalleryIndex + 1) % galleryItems.length;

            showGalleryImage();

        }

        // Foto sebelumnya
        function prevGalleryImage() {

            currentGalleryIndex =
                (currentGalleryIndex - 1 + galleryItems.length) %
                galleryItems.length;

            showGalleryImage();

        }

        // Klik thumbnail untuk membuka foto
        galleryItems.forEach(function (item, index) {

            item.addEventListener("click", function () {
                openGallery(index);
            });

        });

        // Tombol tutup
        galleryClose.addEventListener("click", closeGallery);

        // Tombol navigasi foto
        galleryNext.addEventListener("click", nextGalleryImage);
        galleryPrev.addEventListener("click", prevGalleryImage);

        // Klik area gelap untuk menutup lightbox
        galleryLightbox.addEventListener("click", function (event) {

            if (event.target === galleryLightbox) {
                closeGallery();
            }

        });

        // Keyboard: Escape dan tombol panah
        document.addEventListener("keydown", function (event) {

            if (!galleryLightbox.classList.contains("is_open")) {
                return;
            }

            if (event.key === "Escape") {
                closeGallery();
            }

            if (event.key === "ArrowRight") {
                nextGalleryImage();
            }

            if (event.key === "ArrowLeft") {
                prevGalleryImage();
            }

        });

    }

    // LOVE STORY SCROLL ANIMATION

    const loveStoryItems = document.querySelectorAll(".love_story_item");

    if ("IntersectionObserver" in window) {
        const loveStoryObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        loveStoryItems.forEach(function (item) {
            loveStoryObserver.observe(item);
        });
    } else {
        // Fallback untuk browser yang tidak mendukung IntersectionObserver
        loveStoryItems.forEach(function (item) {
            item.classList.add("show");
        });
    }

    // RSVP & UCAPAN

    const rsvpForm = document.querySelector("#rsvp-form");
    const rsvpAttendance = document.querySelector("#rsvp-attendance");
    const rsvpGuestsGroup = document.querySelector("#rsvp-guests-group");
    const rsvpGuests = document.querySelector("#rsvp-guests");
    const rsvpFormMessage = document.querySelector("#rsvp-form-message");

    const ucapanForm = document.querySelector("#ucapan-form");
    const ucapanList = document.querySelector("#ucapan-list");
    const ucapanEmpty = document.querySelector("#ucapan-empty");
    const ucapanFormMessage = document.querySelector("#ucapan-form-message");

    // Kunci penyimpanan di browser
    const UCAPAN_STORAGE_KEY = "aditSiskaUcapan";

    // 1. PILIHAN JUMLAH TAMU

    function updateRsvpGuests() {
        if (!rsvpAttendance || !rsvpGuestsGroup || !rsvpGuests) {
            return;
        }

        const isAttending = rsvpAttendance.value === "Hadir";

        rsvpGuestsGroup.hidden = !isAttending;
        rsvpGuests.required = isAttending;

        if (!isAttending) {
            rsvpGuests.value = "1";
        }
    }

    if (rsvpAttendance) {
        rsvpAttendance.addEventListener("change", updateRsvpGuests);

        updateRsvpGuests();
    }


    // 2. FORM RSVP

    if (rsvpForm && rsvpFormMessage) {
        rsvpForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nama = document.querySelector("#rsvp-name").value.trim();
            const kehadiran = rsvpAttendance.value;
            const jumlahTamu = rsvpGuests.value;

            if (!nama || !kehadiran) {
                rsvpFormMessage.textContent =
                    "Mohon lengkapi formulir terlebih dahulu.";
                return;
            }

            let pesan = "";

            if (kehadiran === "Hadir") {
                pesan =
                    `Terima kasih, ${nama}. ` +
                    `Konfirmasi kehadiran Anda (${jumlahTamu} orang) ` +
                    `berhasil diproses pada demo ini.`;
            } else if (kehadiran === "Tidak Hadir") {
                pesan =
                    `Terima kasih atas konfirmasi Anda, ${nama}. ` +
                    "Doa dan perhatian Anda sangat berarti bagi kami.";
            } else {
                pesan =
                    `Terima kasih, ${nama}. ` +
                    "Konfirmasi Anda tercatat pada demo ini sebagai masih ragu.";
            }

            rsvpFormMessage.textContent = pesan;

            // Catatan: belum mengirim data ke server.
            // Data RSVP hanya diproses untuk demonstrasi frontend.
        });
    }

    // 3. MEMBACA UCAPAN DARI LOCAL STORAGE

    function getUcapanList() {
        try {
            const data = localStorage.getItem(UCAPAN_STORAGE_KEY);

            if (!data) {
                return [];
            }

            const parsedData = JSON.parse(data);

            return Array.isArray(parsedData) ? parsedData : [];
        } catch (error) {
            console.error("Gagal membaca data ucapan:", error);
            return [];
        }
    }


    // 4. MENAMPILKAN DAFTAR UCAPAN

    function renderUcapan() {
        if (!ucapanList || !ucapanEmpty) {
            return;
        }

        // Hapus ucapan sebelumnya tanpa menghapus elemen kosong
        ucapanList.querySelectorAll(".ucapan_item").forEach(function (item) {
            item.remove();
        });

        const daftarUcapan = getUcapanList();

        ucapanEmpty.hidden = daftarUcapan.length > 0;

        daftarUcapan.slice().reverse().forEach(function (data) {
            const item = document.createElement("article");
            item.className = "ucapan_item";

            const header = document.createElement("div");
            header.className = "ucapan_item_header";

            const avatar = document.createElement("div");
            avatar.className = "ucapan_avatar";
            avatar.setAttribute("aria-hidden", "true");
            avatar.textContent = data.nama.charAt(0).toUpperCase();

            const nama = document.createElement("h4");
            nama.textContent = data.nama;

            const isiUcapan = document.createElement("p");
            isiUcapan.textContent = data.ucapan;

            header.appendChild(avatar);
            header.appendChild(nama);

            item.appendChild(header);
            item.appendChild(isiUcapan);

            ucapanList.appendChild(item);
        });
    }


    // 5. FORM KIRIM UCAPAN

    if (ucapanForm && ucapanFormMessage) {
        ucapanForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const namaInput = document.querySelector("#ucapan-name");
            const ucapanInput = document.querySelector("#ucapan-message");

            const nama = namaInput.value.trim();
            const ucapan = ucapanInput.value.trim();

            if (!nama || !ucapan) {
                ucapanFormMessage.textContent =
                    "Mohon isi nama dan ucapan terlebih dahulu.";
                return;
            }

            const daftarUcapan = getUcapanList();

            daftarUcapan.push({
                nama: nama,
                ucapan: ucapan,
                waktu: new Date().toISOString()
            });

            try {
                localStorage.setItem(
                    UCAPAN_STORAGE_KEY,
                    JSON.stringify(daftarUcapan)
                );

                renderUcapan();

                ucapanForm.reset();

                ucapanFormMessage.textContent =
                    "Terima kasih! Ucapan berhasil disimpan di browser ini.";
            } catch (error) {
                console.error("Gagal menyimpan ucapan:", error);

                ucapanFormMessage.textContent =
                    "Ucapan tidak dapat disimpan. Penyimpanan browser mungkin penuh atau tidak tersedia.";
            }
        });
    }

    // Tampilkan ucapan yang sudah tersimpan saat halaman dibuka
    renderUcapan();


    // WEDDING GIFT - SALIN NOMOR REKENING

    const giftCopyButtons = document.querySelectorAll(".gift_copy_button");

    giftCopyButtons.forEach(function (button) {
        button.addEventListener("click", async function () {
            const targetId = button.getAttribute("data-copy-target");
            const targetElement = document.getElementById(targetId);
            const messageElement = button
                .closest(".gift_card")
                .querySelector(".gift_copy_message");

            if (!targetElement || !messageElement) {
                return;
            }

            const rekening = targetElement.textContent.trim();
            const buttonText = button.querySelector("span");
            const originalText = buttonText.textContent;

            async function copyWithFallback(text) {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                    return;
                }

                const tempInput = document.createElement("textarea");
                tempInput.value = text;
                tempInput.setAttribute("readonly", "");
                tempInput.style.position = "fixed";
                tempInput.style.opacity = "0";

                document.body.appendChild(tempInput);
                tempInput.select();

                const success = document.execCommand("copy");
                tempInput.remove();

                if (!success) {
                    throw new Error("Penyalinan gagal");
                }
            }

            try {
                await copyWithFallback(rekening);

                buttonText.textContent = "Tersalin!";
                messageElement.textContent =
                    "Nomor rekening berhasil disalin.";

                button.querySelector("i").className =
                    "fa-solid fa-check";
            } catch (error) {
                messageElement.textContent =
                    "Gagal menyalin. Silakan salin nomor rekening secara manual.";

                console.error("Gagal menyalin nomor rekening:", error);
            }

            setTimeout(function () {
                buttonText.textContent = originalText;
                button.querySelector("i").className =
                    "fa-regular fa-copy";
            }, 2000);
        });
    });


    // NAVBAR AKTIF SESUAI SECTION

    const navbarLinks = document.querySelectorAll(".navbar_link");

    const sectionIds = [
        "home",
        "mempelai",
        "detail-acara",
        "countdown",
        "galeri-foto",
        "love-story",
        "rsvp-ucapan"
    ];

    const navbarSections = sectionIds
        .map(id => document.getElementById(id))
        .filter(section => section !== null);

    function updateActiveNavbar() {
        const navbar = document.getElementById("navbar");

        if (!navbar || navbarSections.length === 0) return;

        const navbarHeight = navbar.offsetHeight;
        const activationLine = navbarHeight + 100;

        let activeSection = navbarSections[0];

        navbarSections.forEach(section => {
            const rect = section.getBoundingClientRect();

            if (rect.top <= activationLine) {
                activeSection = section;
            }
        });

        navbarLinks.forEach(link => {
            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href === "#" + activeSection.id) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavbar);
    window.addEventListener("resize", updateActiveNavbar);

    updateActiveNavbar();

});