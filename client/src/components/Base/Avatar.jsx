import { Avatar as HeroAvatar } from "@heroui/react";

export function Avatar({ src, name, ...props }) {
  const finalSrc = src === "" ? undefined : src;

  return (
    <HeroAvatar 
      src={finalSrc} 
      name={name}
      {...props} />
  );
}