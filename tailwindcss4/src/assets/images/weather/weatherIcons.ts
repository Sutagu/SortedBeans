// src/assets/images/weather/weatherIcons.ts
const icons = import.meta.glob('./*.png', { eager: true, import: 'default' }) as Record<string, string>;

export default icons;
