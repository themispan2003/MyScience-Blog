import Image from "next/image";

export default function Thumbnail({ src, alt = "" }) {
  return (
    <div className="relative w-[180px] h-[120px] overflow-hidden rounded-lg bg-zinc-900">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  );
}
