import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <Image
        src="/DOSAC.png"
        alt="Department of Social Affairs and Citizenship logo"
        className="mx-auto py-4 w-32 md:w-40"
        width={160}
        height={64}
        priority
      />
    </footer>
  );
}
