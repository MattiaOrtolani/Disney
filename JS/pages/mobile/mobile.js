export function redirectIfMobile() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        window.location.href = '../../../pages/mobile.html';
    }
}
