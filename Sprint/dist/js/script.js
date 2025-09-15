function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const setColor = (id, cssVar) => {
        let v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
        if (v.startsWith('rgb')) v = '#' + v.match(/\d+/g).slice(0, 3).map(x => (+x).toString(16).padStart(2, '0')).join('');
        document.getElementById(id).value = v;
    };
    setColor('cor1', '--color-pink');
    setColor('cor2', '--color-purple');
});