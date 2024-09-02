import Image from 'next/image';

const images = [
  { src: '/y2kstyle.webp', alt: 'Y2K', text: 'Y2K outfit ideas' },
  { src: '/coachellastyle.webp', alt: 'Coachella', text: 'Coachella outfit ideas' },
  { src: '/oldmoneystyle.webp', alt: 'Old Money', text: 'Old Money outfit ideas' },
];

export default function ImageOverlay() {
  return (
    <div className="relative w-96 h-96 ml-14 md:ml-6">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute w-64 h-64 ${
            index === 0 ? '-left-16 bottom-4 z-10' :
            index === 1 ? 'left-8 top-0 z-20' :
            'left-32 -bottom-8 z-10'
          }`}
        >
          <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" className="rounded-lg drop-shadow-2xl" />
          {(
            <div className="absolute bottom-0 left-0 right-0 bg-stone-900 text-white p-2 rounded-b-lg">
              <span>{image.text}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}