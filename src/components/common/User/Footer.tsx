import { getSiteName } from "@/helpers/config/siteConfig";

const Footer = ({ ownerName }: { ownerName?: string }) => {
  const year = new Date().getFullYear();
  const name = ownerName || getSiteName();

  return (
    <footer className="py-5">
      <p className="text-warning text-center">
        © {year} all rights reserved by <span>{name}</span>
      </p>
    </footer>
  );
};

export default Footer;
