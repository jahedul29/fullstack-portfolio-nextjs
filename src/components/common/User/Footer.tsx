import { getSiteName } from "@/helpers/config/siteConfig";

const Footer = ({ ownerName }: { ownerName?: string }) => {
  const year = new Date().getFullYear();
  const name = ownerName || getSiteName();

  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
      <p>
        &copy; {year} {name}
      </p>
    </footer>
  );
};

export default Footer;
