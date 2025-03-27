import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";

export default function Profile() {
  /// is online
  const isOnline = true;

  return (
    <section className="mt-20 flex items-center min-h-16 justify-center py-12 px-5 md:px-20">
      <div>
        <div>
          <Image
            src="https://placehold.co/600x400.png"
            alt="background"
            width={1200}
            height={400}
          />
          <Avatar className="z-50">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className={`rounded-full w-40 h-40 border-3 ${
                isOnline ? "border-green-600" : "border-gray-400"
              }`}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </section>
  );
}
