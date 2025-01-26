const currentYear = () => {
  return new Date().getFullYear();
};

const Footer = () => {
  return (
    <footer className="text-center bg-sky-200 px-4 flex flex-row justify-between items-center">
      <div className="p-2 text-center text-neutral-700">
        © {currentYear()} Copyright
      </div>
      <a
        className="text-blue-700 text-xl font-bold"
        href="https://chatfusion.chat"
      >
        {" "}
        CHAT FUSION
      </a>
    </footer>
  );
};

export default Footer;
