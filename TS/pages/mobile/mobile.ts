export function redirectIfMobile(): void
{
    const isMobile: boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile)
    {
        window.location.href = '../../../pages/mobile.html';
    }
}
