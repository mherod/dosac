import Image from "next/image";

/**
 * Footer component that displays the site disclaimer and DOSAC logo
 * @returns A footer element containing the site disclaimer and DOSAC logo
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t flex flex-col items-center justify-center p-4">
      <p className="text-sm text-muted-foreground text-center">
        <b>dosac.uk</b> is a fan project and is not affiliated with the BBC, The
        Thick of It or any of its creators.
      </p>
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
