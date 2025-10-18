// src/assets/images/weather/weatherIcons.ts
const icons = import.meta.glob('./*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

export default icons;
